import inquirer from 'inquirer';

const personagens = [
    { NOME: "Mario", VELOCIDADE: 4, MANOBRABILIDADE: 3, PODER: 3, PONTOS: 0 },
    { NOME: "Luigi", VELOCIDADE: 5, MANOBRABILIDADE: 4, PODER: 2, PONTOS: 0 },
    { NOME: "Peach", VELOCIDADE: 3, MANOBRABILIDADE: 4, PODER: 2, PONTOS: 0 },
    { NOME: "Bowser", VELOCIDADE: 5, MANOBRABILIDADE: 2, PODER: 5, PONTOS: 0 },
    { NOME: "Yoshi", VELOCIDADE: 2, MANOBRABILIDADE: 4, PODER: 3, PONTOS: 0 },
    { NOME: "Donkey Kong", VELOCIDADE: 2, MANOBRABILIDADE: 2, PODER: 5, PONTOS: 0 },
];

async function rollDice() {
    return Math.floor(Math.random() * 6) + 1;
}

async function getRandomBlock() {
    let random = Math.random()
    let result

    switch (true) {
        case random < 0.33:
            result = "RETA";
            break;
        case random < 0.66:
            result = "CURVA";
            break;
        default:
            result = "CONFRONTO";
            break;
    }

    return result;
}

async function logRollResult(characterName, block, diceResult, attribute) {
    console.log(`${characterName} 🎲 rolou um dado de ${block} ${diceResult} + ${attribute} = ${diceResult + attribute}`);
}

async function playRaceEngine(character1, character2) {
    for(let round = 1; round <= 5; round++) {
        console.log(`🏁 Rodada ${round}`);

        // sortear bloco
        let block = await getRandomBlock();
        console.log(`🏁 Bloco: ${block}`);

         // rolar os dados
        let diceResult1 = await rollDice();
        let diceResult2 = await rollDice();

        // teste de habilidade
        let totalTestSkill1 = 0;
        let totalTestSkill2 = 0;

        if(block === "RETA") {
            totalTestSkill1 = character1.VELOCIDADE + diceResult1;
            totalTestSkill2 = character2.VELOCIDADE + diceResult2;

            await logRollResult(character1.NOME, "velocidade", diceResult1, character1.VELOCIDADE);
            await logRollResult(character2.NOME, "velocidade", diceResult2, character2.VELOCIDADE);
        }

        if(block === "CURVA") {
            totalTestSkill1 = character1.MANOBRABILIDADE + diceResult1;
            totalTestSkill2 = character2.MANOBRABILIDADE + diceResult2;

            await logRollResult(character1.NOME, "manobrabilidade", diceResult1, character1.MANOBRABILIDADE);
            await logRollResult(character2.NOME, "manobrabilidade", diceResult2, character2.MANOBRABILIDADE);
        }

        if(block === "CONFRONTO") {
            let powerResult1 = character1.PODER + diceResult1;
            let powerResult2 = character2.PODER + diceResult2;

            console.log(`${character1.NOME} confrontou com ${character2.NOME}! 🥊`);

            await logRollResult(character1.NOME, "poder", diceResult1, character1.PODER);
            await logRollResult(character2.NOME, "poder", diceResult2, character2.PODER);

            if(powerResult1 > powerResult2 && character2.PONTOS > 0) {
                console.log(`${character1.NOME} venceu o confronto! ${character2.NOME} perdeu 1 ponto! 🐢`);
                character2.PONTOS--;
            }
            
            if(powerResult2 > powerResult1 && character1.PONTOS > 0) {
                console.log(`${character2.NOME} venceu o confronto! ${character1.NOME} perdeu 1 ponto! 🐢`);
                character1.PONTOS--;
            }

            console.log(powerResult1 === powerResult2 ? "Empate no confronto!" : "");
        }  

        // verificando o vencedor

        if(totalTestSkill1 > totalTestSkill2) {
            console.log(`${character1.NOME} ganhou 1 ponto!`);
            character1.PONTOS++;
        }
        else if(totalTestSkill1 < totalTestSkill2) {
            console.log(`${character2.NOME} ganhou 1 ponto`);
            character2.PONTOS++;
        }

        console.log("-------------------------------------------------------------\n");
    }
}

async function declareWinner(character1, character2) {
    console.log("Resultado final");
    console.log(`${character1.NOME}: ${character1.PONTOS} ponto(s)`);
    console.log(`${character2.NOME}: ${character2.PONTOS} ponto(s)`);

    if(character1.PONTOS > character2.PONTOS)
        console.log(`\n${character1.NOME} venceu a corrida! Parabéns! 🏆`);
    else if(character2.PONTOS > character1.PONTOS) 
        console.log(`\n${character2.NOME} venceu a corrida! Parabéns! 🏆`);
    else console.log(`\nA corrida terminou em empate!`);
    
    console.log("\nObrigado por jogar! Até a próxima! 👋");
}

async function main() {
    const respostas = await inquirer.prompt([
        {
            type: 'list',
            name: 'player1',
            message: 'Escolha o primeiro personagem:',
            choices: personagens.map(p => p.NOME),
        },
        {
            type: 'list',
            name: 'player2',
            message: 'Escolha o segundo personagem:',
            choices: personagens.map(p => p.NOME),
        }
    ]);

    const player1 = personagens.find(p => p.NOME === respostas.player1);
    const player2 = personagens.find(p => p.NOME === respostas.player2);

    console.log(`\n🏁🚨 Corrida entre ${player1.NOME} e ${player2.NOME} começando ... \n`);

    await playRaceEngine(player1, player2);
    await declareWinner(player1, player2);

    process.exit(0);
}

main();
