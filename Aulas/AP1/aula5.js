let arrayTreinamento = [
    {
        entrada: [
            [1, 1, 1, 1, 1],
            [1, 0, 0, 0, 1],
            [1, 0, 0, 0, 1],
            [1, 0, 0, 0, 1],
            [1, 0, 0, 0, 1],
            [1, 0, 0, 0, 1],
            [1, 1, 1, 1, 1],
        ],
        saidaEsperada: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    {
        entrada: [
            [0, 0, 1, 0, 0],
            [0, 1, 1, 0, 0],
            [1, 0, 1, 0, 0],
            [0, 0, 1, 0, 0],
            [0, 0, 1, 0, 0],
            [0, 0, 1, 0, 0],
            [1, 1, 1, 1, 1],
        ],
        saidaEsperada: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    {
        entrada: [
            [0, 1, 1, 1, 0],
            [1, 0, 0, 0, 1],
            [0, 0, 0, 0, 1],
            [0, 0, 0, 1, 0],
            [0, 1, 1, 0, 0],
            [1, 0, 0, 0, 0],
            [1, 1, 1, 1, 1],
        ],
        saidaEsperada: [0, 0, 1, 0, 0, 0, 0, 0, 0, 0]
    },
    {
        entrada: [
            [1, 1, 1, 1, 0],
            [0, 0, 0, 0, 1],
            [0, 0, 0, 0, 1],
            [0, 1, 1, 1, 0],
            [0, 0, 0, 0, 1],
            [0, 0, 0, 0, 1],
            [1, 1, 1, 1, 0],
        ],
        saidaEsperada: [0, 0, 0, 1, 0, 0, 0, 0, 0, 0]
    },
    {
        entrada: [
            [0, 0, 0, 1, 0],
            [0, 0, 1, 1, 0],
            [0, 1, 0, 1, 0],
            [1, 0, 0, 1, 0],
            [1, 0, 0, 1, 0],
            [1, 1, 1, 1, 1],
            [0, 0, 0, 1, 0],
        ],
        saidaEsperada: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0]
    },
    {
        entrada: [
            [1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0],
            [1, 0, 0, 0, 0],
            [1, 1, 1, 1, 0],
            [0, 0, 0, 0, 1],
            [0, 0, 0, 0, 1],
            [1, 1, 1, 1, 0],
        ],
        saidaEsperada: [0, 0, 0, 0, 0, 1, 0, 0, 0, 0]
    },
    {
        entrada: [
            [0, 1, 1, 1, 1],
            [1, 0, 0, 0, 0],
            [1, 0, 0, 0, 0],
            [1, 1, 1, 1, 0],
            [1, 0, 0, 0, 1],
            [1, 0, 0, 0, 1],
            [0, 1, 1, 1, 0],
        ],
        saidaEsperada: [0, 0, 0, 0, 0, 0, 1, 0, 0, 0]
    },
    {
        entrada: [
            [1, 1, 1, 1, 1],
            [0, 0, 0, 0, 1],
            [0, 0, 0, 0, 1],
            [0, 0, 0, 1, 0],
            [0, 0, 1, 0, 0],
            [0, 1, 0, 0, 0],
            [0, 1, 0, 0, 0],
        ],
        saidaEsperada: [0, 0, 0, 0, 0, 0, 0, 1, 0, 0]
    },
    {
        entrada: [
            [1, 1, 1, 1, 1],
            [1, 0, 0, 0, 1],
            [1, 0, 0, 0, 1],
            [0, 1, 1, 1, 0],
            [1, 0, 0, 0, 1],
            [1, 0, 0, 0, 1],
            [0, 1, 1, 1, 0],
        ],
        saidaEsperada: [0, 0, 0, 0, 0, 0, 0, 0, 1, 0]
    },
    {
        entrada: [
            [1, 1, 1, 1, 1],
            [1, 0, 0, 0, 1],
            [1, 0, 0, 0, 1],
            [0, 1, 1, 1, 1],
            [0, 0, 0, 0, 1],
            [0, 0, 0, 0, 1],
            [1, 1, 1, 1, 0],
        ],
        saidaEsperada: [0, 0, 0, 0, 0, 0, 0, 0, 0, 1]
    },
];

class RedeNeural {
    constructor(tamanhoEntrada, tamanhoOculto, tamanhoSaida) {
        this.tamanhoEntrada = tamanhoEntrada;
        this.tamanhoOculto = tamanhoOculto;
        this.tamanhoSaida = tamanhoSaida;

        this.pesosEntradaOculto = this.incializaPesos(tamanhoEntrada, tamanhoOculto);
        this.pesosOcultoSaida = this.incializaPesos(tamanhoOculto, tamanhoSaida)
    }

    incializaPesos(linhas, colunas) {
        let pesos = [];
        for (let linha = 0; linha < linhas; linha++) {
            let linhaPesos = [];
            for (let coluna = 0; coluna < colunas; coluna++) {
                linhaPesos.push(Math.random() * 2 - 1);
            }
            pesos.push(linhaPesos);
        }
        return pesos;
    }


    sigmoide(soma) {
        return 1 / (1 + Math.exp(- soma));
    }
    derivadaSigmoid(soma) {
        return soma * (1 - soma);
    }

    propagation(entrada) {
        this.entrada = entrada;
        this.saidaOculta = this.multiplicaMatrix(entrada, this.pesosEntradaOculto).map(this.sigmoide);
        this.saidaFinal = this.multiplicaMatrix(this.saidaOculta, this.pesosOcultoSaida).map(this.sigmoide);

        return this.saidaFinal;
    }

    treinar(entrada, saidaEsperada, taxaAprendizagem) {
        this.propagation(entrada);

        //camada saida
        let erroSaida = saidaEsperada.map((valor, i) => valor - this.saidaFinal[i]);

        let saidaAjustada = erroSaida.map((erro, i) => erro * this.derivadaSigmoid(this.saidaFinal[i]));

        for (let i = 0; i < this.tamanhoOculto; i++) {
            for (let j = 0; j < this.tamanhoSaida; j++) {
                this.pesosOcultoSaida[i][j] += taxaAprendizagem * saidaAjustada[j] * this.saidaOculta[i];
            }
        }
        //camada oculta
        let erroOculta = [];
        for (let i = 0; i < this.tamanhoOculto; i++) {
            erroOculta[i] = 0;
            for (let j = 0; j < this.tamanhoSaida; j++) {
                erroOculta[i] += saidaAjustada[j] * this.pesosOcultoSaida[i][j];
            }
        }

        let ocultoAjustado = erroOculta.map((erro, i) => erro * this.derivadaSigmoid(this.saidaOculta[i]));

        for (let i = 0; i < this.tamanhoEntrada; i++) {
            for (let j = 0; j < this.tamanhoOculto; j++) {
                this.pesosEntradaOculto[i][j] += taxaAprendizagem * ocultoAjustado[j] * entrada[i];
            }
        }

    }

    multiplicaMatrix(vetor, matriz) {
        let resultado = []
        for (let i = 0; i < matriz[0].length; i++) {
            let soma = 0;
            for (let j = 0; j < vetor.length; j++) {
                soma += vetor[j] * matriz[j][i];
            }
            resultado.push(soma);
        }
        return resultado;
    }
}

let redeNeuralInstance = new RedeNeural(35, 200, 10);

for (let index = 0; index < 10000; index++) {
    for (let numero = 0; numero < arrayTreinamento.length; numero++) {
        let entrada = arrayTreinamento[numero].entrada.flat();
        let saidaEsperada = arrayTreinamento[numero].saidaEsperada;
        redeNeuralInstance.treinar(entrada, saidaEsperada, 0.1);
    }

    let numeroParaTestar = [
        [1, 1, 1, 1, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 1, 1, 1, 1],
    ];

    let resultado = redeNeuralInstance.propagation(numeroParaTestar.flat());
    const digitoPrevisto = resultado.indexOf(Math.max(...resultado));
    const maiorPorcentagem = Math.max(...resultado) * 100;

    console.log(`Dígito: ${digitoPrevisto} | Confiança: ${maiorPorcentagem.toFixed(2)}%`);

}
