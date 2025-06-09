import os
import sys
import pandas as pd
import requests
from operator import itemgetter
from urllib.parse import quote
from langchain_ollama.llms import OllamaLLM
from langchain_ollama import OllamaEmbeddings
from langchain_chroma import Chroma
from langchain_core.documents import Document
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

api_key = os.getenv("RAWG_API_KEY")
if not api_key:
    print("ERRO: A variável de ambiente RAWG_API_KEY não foi encontrada.")
    sys.exit(1)

llm = OllamaLLM(model="llama3")
embeddings = OllamaEmbeddings(model="llama3")


def get_rawg_games(api_key: str, url: str):
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json().get('results', [])
        if not data:
            return None
        return pd.DataFrame(data)
    except requests.exceptions.RequestException as e:
        print(f"Erro ao acessar a API da RAWG: {e}")
        return None

 # persistir a base de conhecimento geral em disco para uso futuro, evitando chamadas repetidas a api e carregamento lentos e pesados
def create_general_knowledge_base_with_persistence():
    persist_directory = "./chroma_db_general"

    # verifica se o diretório de persistência já existe
    if os.path.exists(persist_directory):
        print(f"Carregando base de conhecimento geral da pasta '{persist_directory}'...")
        vector_store = Chroma(
            persist_directory=persist_directory,
            embedding_function=embeddings
        )
        print("-> Base de conhecimento carregada do disco.")
        return vector_store.as_retriever()
    # logica para buscar os dados da api
    all_games_data = []
    for page in range(1, 14): 
        print(f"Buscando página {page}/13 da API...")
        url = f"https://api.rawg.io/api/games?key={api_key}&page_size=40&page={page}"
        df_page = get_rawg_games(api_key, url)
        if df_page is not None:
            all_games_data.append(df_page)
    if not all_games_data:
        print("Aviso: Não foi possível carregar a base de conhecimento geral.")
        return None

    df_general = pd.concat(all_games_data, ignore_index=True)
    df_general = df_general.head(500)  # limita a 500 jogos para evitar sobrecarga
    documents = []
    for _, row in df_general.iterrows():
        page_content = (
            f"Jogo: {row.get('name', 'N/A')}. "
            f"Desenvolvedora: {','.join([d['name'] for d in row.get('developers', [])])}. "
            f"Gêneros: {', '.join([g['name'] for g in row.get('genres', [])])}. "
            f"Plataformas: {', '.join([p['platform']['name'] for p in row.get('platforms', [])])}. "
            f"Lançamento: {row.get('released', 'N/A')}. "
            f"Nota: {row.get('metacritic', 'N/A')}.")
        documents.append(Document(page_content=page_content))
    
    # cria a base de conhecimento usando Chroma e salva no disco
    vector_store = Chroma.from_documents(
        documents=documents,
        embedding=embeddings,
        persist_directory=persist_directory 
    )
    print("-> Base de conhecimento criada e salva no disco.")
    return vector_store.as_retriever()

general_retriever = create_general_knowledge_base_with_persistence()


# prompt para extrair o nome do jogo da pergunta
prompt_extrator = ChatPromptTemplate.from_template(
    "Sua tarefa é extrair o nome de um videogame do texto a seguir. Responda APENAS com o nome do jogo. Se nenhum nome de jogo for mencionado, responda com 'N/A'.\n\nTexto: {question}\nNome do jogo:"
)
chain_extrator = prompt_extrator | llm | StrOutputParser()

# loop de perguntas
print("\nAssistente de Games. Pergunte sobre um jogo específico ou faça uma pergunta geral.")
while True:
    question = input("\nFaça sua pergunta (q para sair): ")
    if question.lower() == 'q':
        break
    game_name = chain_extrator.invoke({"question": question})

    # verifica se o nome do jogo foi extraido corretamente
    if game_name != 'N/A':
        print(f"-> Rota: Pergunta Específica. Buscando por '{game_name}'...")
        query_encoded = quote(game_name)
        specific_game_url = f"https://api.rawg.io/api/games?key={api_key}&search={query_encoded}&page_size=5"
        df_specific = get_rawg_games(api_key, specific_game_url)
        if df_specific is None or df_specific.empty:
            print(f"Desculpe, não encontrei informações sobre o jogo '{game_name}'.")
            continue
        documents = []
        for _, row in df_specific.iterrows():
            page_content = (
            f"Jogo: {row.get('name', 'N/A')}. "
            f"Desenvolvedora: {','.join([d['name'] for d in row.get('developers', [])])}. "
            f"Gêneros: {', '.join([g['name'] for g in row.get('genres', [])])}. "
            f"Lançamento: {row.get('released', 'N/A')}. "
            f"Nota: {row.get('metacritic', 'N/A')}. "
            f"Plataformas: {', '.join([p['platform']['name'] for p in row.get('platforms', [])])}. "
        )
            documents.append(Document(page_content=page_content))
        vector_store = Chroma.from_documents(documents=documents, embedding=embeddings)
        retriever = vector_store.as_retriever()
        print("   -> Base de conhecimento temporária criada.")
    # se não foi possivel extrair o nome do jogo ou se a pergunta é genérica
    else:
        print("-> Rota: Pergunta Genérica. Usando a base de conhecimento geral...")
        if general_retriever is None:
            print("Desculpe, a base de conhecimento geral não está disponível para responder.")
            continue
        retriever = general_retriever

    # prompt para responder a pergunta usando o contexto
    prompt_rag = ChatPromptTemplate.from_template(
        "Você é um assistente de games. Responda à pergunta do usuário usando apenas o contexto fornecido.\n\nContexto:\n{context}\n\nPergunta:\n{question}\n\nResposta:"
    )
    rag_chain = (
        {"context": itemgetter("question") | retriever, "question": itemgetter("question")}
        | prompt_rag
        | llm
        | StrOutputParser()
    )
    response = rag_chain.invoke({"question": question})
    print("\n--- RESPOSTA ---")
    print(response)
    print("----------------")

print("\nPrograma encerrado.")