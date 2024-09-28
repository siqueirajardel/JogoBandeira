let correctCountry;
let options = [];
let score = 0; // Inicializa a pontuação
let timer; // Variável para o temporizador
let timeRemaining; // Variável para o tempo restante
let difficultyLevel = 'medium'; // Nível de dificuldade padrão

document.querySelectorAll('.difficulty-btn').forEach(button => {
    button.onclick = () => {
        difficultyLevel = button.getAttribute('data-level');
        document.getElementById('difficultySelection').style.display = 'none'; // Esconde a seleção
        document.getElementById('startButton').style.display = 'none'; // Esconde o botão de iniciar
        score = 0; // Reinicia a pontuação ao iniciar o jogo
        getRandomCountries(); // Inicia o jogo
    };
});

document.getElementById('startButton').onclick = () => {
    document.getElementById('difficultySelection').style.display = 'block'; // Mostra a seleção de dificuldade
};

function getCountryNameInPortuguese(country) {
    return country.translations && country.translations.por ?
        country.translations.por.common : country.name.common;
}

function getRandomCountries() {
    fetch('https://restcountries.com/v3.1/all')
        .then(response => response.json())
        .then(data => {
            const randomIndex = Math.floor(Math.random() * data.length);
            correctCountry = data[randomIndex];
            options = [correctCountry];

            while (options.length < 4) {
                const randomOption = data[Math.floor(Math.random() * data.length)];
                if (!options.includes(randomOption)) {
                    options.push(randomOption);
                }
            }

            options.sort(() => Math.random() - 0.5);
            displayQuestion();
        })
        .catch(error => console.error('Erro:', error));
}

function displayQuestion() {
    document.getElementById('flagImage').src = correctCountry.flags.png;
    document.getElementById('flagImage').style.display = 'block';
    
    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = '';

    options.forEach(option => {
        const button = document.createElement('button');
        button.innerText = getCountryNameInPortuguese(option);
        button.onclick = () => checkAnswer(option);
        optionsDiv.appendChild(button);
    });

    const duration = difficultyLevel === 'easy' ? 20 : difficultyLevel === 'medium' ? 15 : 10; // Dificuldade ajustada
    startTimer(duration); // Inicia o temporizador com base na dificuldade
}

function startTimer(duration) {
    timeRemaining = duration;
    const timerDisplay = document.getElementById('timer');
    timerDisplay.innerText = `Tempo restante: ${timeRemaining} segundos`;

    timer = setInterval(() => {
        timeRemaining--;
        timerDisplay.innerText = `Tempo restante: ${timeRemaining} segundos`;
        
        if (timeRemaining <= 0) {
            clearInterval(timer);
            const resultDiv = document.getElementById('result');
            resultDiv.innerHTML = `<p>Tempo esgotado! O país correto era: ${getCountryNameInPortuguese(correctCountry)}</p>`;
            document.getElementById('nextButton').style.display = 'block'; // Exibe o botão "Próximo"
            
            // Reinicia o jogo após 3 segundos
            setTimeout(() => {
                resetGame();
                getRandomCountries();
            }, 3000);
        }
    }, 1000);
}

function checkAnswer(selected) {
    clearInterval(timer); // Para o temporizador ao responder

    const resultDiv = document.getElementById('result');
    
    if (selected.name.common === correctCountry.name.common) {
        resultDiv.innerHTML = '<p>Correto!</p>';
        score++; // Incrementa a pontuação
    } else {
        resultDiv.innerHTML = `<p>Incorreto! O país correto era: ${getCountryNameInPortuguese(correctCountry)}</p>`;
    }

    resultDiv.innerHTML += `<p>Pontuação: ${score}</p>`;
    document.getElementById('nextButton').style.display = 'block'; // Exibe o botão "Próximo"
    document.getElementById('endButton').style.display = 'block'; // Exibe o botão "Finalizar Jogo"
}

function resetGame() {
    document.getElementById('result').innerHTML = ''; // Limpa resultados anteriores
    document.getElementById('nextButton').style.display = 'none'; // Esconde o botão "Próximo"
    document.getElementById('endButton').style.display = 'none'; // Esconde o botão "Finalizar Jogo"
    document.getElementById('flagImage').style.display = 'none'; // Esconde a bandeira
    document.getElementById('options').innerHTML = ''; // Limpa as opções
}

document.getElementById('nextButton').onclick = () => {
    resetGame(); // Reseta o jogo antes de pegar uma nova bandeira
    getRandomCountries(); 
};

document.getElementById('endButton').onclick = () => {
    clearInterval(timer); // Para o temporizador, se estiver ativo
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `<p>Jogo finalizado! Sua pontuação final é: ${score}</p>`;
    document.getElementById('nextButton').style.display = 'none'; // Esconde o botão "Próximo"
    document.getElementById('endButton').style.display = 'none'; // Esconde o botão "Finalizar Jogo"

    // Mostra o botão de reiniciar e a seleção de dificuldade
    document.getElementById('difficultySelection').style.display = 'block';
    document.getElementById('startButton').style.display = 'block';
};
