/**
 * Bias = 1
 */

let bias = 1;

const FUTEBOL = 0;
const AUTOMOBILISMO = 1;

let arrayTreinamento = [
    //Pele, Futebol
    {
        entrada1: 0,
        entrada2: 0,
        saidaEsperada: 0
    },
    //Zico, Futebol
    {
        entrada1: 0,
        entrada2: 1,
        saidaEsperada: 0
    },
    //Senna, Automobilismo
    {
        entrada1: 1,
        entrada2: 0,
        saidaEsperada: 1
    },
    //Piquet, Automobilismo
    {
        entrada1: 1,
        entrada2: 1,
        saidaEsperada: 1
    },
]
// pesos
let w0 = 0, w1 = 0 , w2 = 0;
let ajustes = 0, repeticoes = 0, sum, resultadoObtido;

//Faz o treinamento da nossa rede
do {
    ajustes = 0;

    for (let index = 0; index < arrayTreinamento.length; index++) {
        const dadosEntrada = arrayTreinamento[index];
        sum = soma(bias, dadosEntrada.entrada1, dadosEntrada.entrada2);
        resultadoObtido = transferencia(sum);

        if(resultadoObtido != dadosEntrada.saidaEsperada) {
            ajuste(bias, dadosEntrada.entrada1, dadosEntrada.entrada2, dadosEntrada.saidaEsperada, resultadoObtido)
            ajustes++;
        }
        
    }
    repeticoes++;


} while(ajustes != 0);

console.log("--------- Rede treinada --------");
console.log("Os pesos finais ficaram w0: "+ w0 +", w1: "+ w1 +" e w2: "+ w2);
console.log("A quantidade de repetições foi: "+ repeticoes);


//Interage com o usuario para verificar as respostas
async function interagirComUsuario() {
    let entrada1User, entrada2User;

    entrada1User = await lerEntrada("Digite a entrada 1: ");
    entrada2User = await lerEntrada("Digite a entrada 2: ");
    let resultadoSoma = soma(bias, entrada1User, entrada2User);
    let resultadoFinal = transferencia(resultadoSoma);

    switch (resultadoFinal) {
        case FUTEBOL:
            console.log("De acordo com as entradas informadas, é de Futebol");
            break;
        case AUTOMOBILISMO:
            console.log("De acordo com as entradas informadas, é de Automobilismo");
            break;
        default:
            break;
    }
}


//Funções do nosso algoritmo
function soma(entrada, entrada1, entrada2){
    return (entrada * w0) + (entrada1 * w1) + (entrada2 * w2);
}

function transferencia(sum){
    if (sum <= 0) {
        return 0;
    }
    return 1;
}

function ajuste(bias, entrada1, entrada2, resultadoDesejado, resultadoObtido){
    w0 = w0 + 1 * (resultadoDesejado - resultadoObtido) * bias;
    w1 = w1 + 1 * (resultadoDesejado - resultadoObtido) * entrada1;
    w2 = w2 + 1 * (resultadoDesejado - resultadoObtido) * entrada2;
}

function lerEntrada(mensagem) {
    process.stdout.write(mensagem);
    let buffer = "";
    const stdin = process.stdin;
    stdin.resume();
    stdin.setEncoding('utf8');
    
    return new Promise((resolve) => {
        stdin.on('data', function(data) {
            buffer += data;
            stdin.pause();
            resolve(buffer.trim());
        });
    });
}

interagirComUsuario();