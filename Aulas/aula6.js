arrayPersonalidaes = [
    'Tom Cruise',
    'Brad Pitt',
    'Angelina Jolie',
    'Scarlett Johansson'
];

const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout

});


console.log("Escolha uma personalidade da lista abaixo e eu irei adivinhar quem é: ");
console.log(arrayPersonalidaes);

rl.question("Seu personagem é mulher? (sim/não) ", (resposta1) => {
    if (resposta1 == "sim") {
        rl.question("A sua personalidade escolhida já interpretou a Viúva Negra? (sim/não) ", (resposta2) => {
            if (resposta2 == "sim") {
                console.log("Sua personalidade é a Scarlett Johansson!");
            } else {
                console.log("Sua personalidade é a Angelina Jolie!");
            }
            rl.close();
        });
    } else {
        rl.question("Sua personalidade evita usar dublês? (sim/não)", (resposta3) => {
            if (resposta3 == "sim") {
                console.log("Sua personalidade é o Tom Cruise");
            } else {
                console.log("Sua personalidade é o Brad Pitt");
            }
            rl.close();
        });
    }
  });