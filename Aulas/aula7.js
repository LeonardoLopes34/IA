let arrayJogos = [
    'Dark Souls',
    'Cyberpunk 2077',
    'Red Dead Redemption 2',
    'Stalker 2',
    'Fallout 4',
    'Kingdom Come Deliverance 2',
    'The Withcer 3',
    'The Last of Us'
]
let arrayPerguntas = {
    'inicio': {
      'pergunta': 'Seu jogo é um RPG?',
      'sim': {
        'redireciona': 'RPG',
      },
      'nao': {
        'redireciona': 'apocaliptico',
      }
    },
    'RPG': {
      'pergunta': 'Seu jogo possui uma estética medieval?',
      'sim': {
        'redireciona': 'magia',
      },
      'nao': {
        'resposta': 'Cyberpunk 2077',
      }
    },
    'magia': {
      'pergunta': 'Seu jogo possui magia?',
      'sim': {
        'redireciona': 'fala',
      },
      'nao': {
        'resposta': 'Kingdom Come Deliverance 2',
      }
    },
    'fala': {
      'pergunta': 'Seu personagem principal fala durante o jogo?',
      'sim': {
        'resposta': 'The Witcher 3',
      },
      'nao': {
        'resposta': 'Dark Souls',
      }
    },
    'apocaliptico': {
      'pergunta': 'Seu jogo se passa num mundo pós-apocalíptico?',
      'sim': {
        'redireciona': 'zumbi',
      },
      'nao': {
        'resposta': 'Red Dead Redemption 2',
      }
    },
    'nuclear': {
      'pergunta': 'Seu jogo se passa num mundo destruído por uma guerra nuclear?',
      'sim': {
        'resposta': 'Fallout 4',
      },
      'nao': {
        'resposta': 'Stalker 2',
      }
    },
    'zumbi': {
        'pergunta': 'Seu jogo se passa num mundo dominado por criaturas parecidas com zumbis?',
        'sim': {
            'resposta': 'The Last of Us',
        },
        'nao':{
            'redireciona': 'nuclear'
        }
    }
  };

  console.log("Escolha um jogo da lista abaixo e irei adivinhar qual é:");
  console.log(arrayJogos);
  
  function lerEntrada(mensagem) {
      process.stdout.write(mensagem);
      let buffer = "";
      const stdin = process.stdin;
      stdin.resume();
      stdin.setEncoding('utf8');
      return new Promise((resolve) => {
          stdin.once('data', function (data) {
              stdin.pause();
              resolve(data.trim());
          });
      });
  }
  
  let final = fazPergunta("inicio");
  
  async function fazPergunta(indiceDaPergunta) {
      let pergunta = arrayPerguntas[indiceDaPergunta]["pergunta"];
      let resposta = await lerEntrada(pergunta + " (sim/nao)\n");
  
      if (resposta === "sim") {
          if (arrayPerguntas[indiceDaPergunta]['sim']['redireciona']) {
              await fazPergunta(arrayPerguntas[indiceDaPergunta]['sim']['redireciona']);
          } else if (arrayPerguntas[indiceDaPergunta]['sim']['resposta']) {
              console.log("Você escolheu: " + arrayPerguntas[indiceDaPergunta]['sim']['resposta']);
          }
      } else if (resposta === "nao") {
          if (arrayPerguntas[indiceDaPergunta]['nao']['redireciona']) {
              await fazPergunta(arrayPerguntas[indiceDaPergunta]['nao']['redireciona']);
          } else if (arrayPerguntas[indiceDaPergunta]['nao']['resposta']) {
              console.log("Você escolheu: " + arrayPerguntas[indiceDaPergunta]['nao']['resposta']);
          }
      } else {
          console.log("Por favor, responda com 'sim' ou 'nao'.");
          await fazPergunta(indiceDaPergunta);
      }
  }
