let currentWord = "";
let currentCategory = "";
let usedWords = [];
let correctAnswers = 0;
let incorrectAnswers = 0;
let hasAnswered = false;
let maxQuestions = 10;
let currentOptions = []; // Opciones de la seña actual

const vocabulary = {
    animales: {
        animales: "Videos/Animales/Animales.mp4",
        araña: "Videos/Animales/Araña.mp4",
        ballena: "Videos/Animales/Ballena.mp4",
        cocodrilo: "Videos/Animales/Cocodrilo.mp4",
        conejo: "Videos/Animales/Conejo.mp4",
        cucaracha: "Videos/Animales/Cucaracha.mp4",
        culebra: "Videos/Animales/Culebra.mp4",
        gorila: "Videos/Animales/Gorila.mp4",
        gusano: "Videos/Animales/Gusano.mp4",
        hipopótamo: "Videos/Animales/Hipopotamo.mp4",
        hormiga: "Videos/Animales/Hormiga.mp4",
        burro: "Videos/Animales/Burro.mp4",
        caballo: "Videos/Animales/Caballo.mp4",
        cabra: "Videos/Animales/Cabra.mp4",
        camello: "Videos/Animales/Camello.mp4",
        cangrejo: "Videos/Animales/Cangrejo.mp4",
        canguro: "Videos/Animales/Canguro.mp4",
        caracol: "Videos/Animales/Caracol.mp4",
        cerdo: "Videos/Animales/Cerdo.mp4",
        elefante: "Videos/Animales/Elefante.mp4",
        gallina: "Videos/Animales/Gallina.mp4",
        gallo: "Videos/Animales/Gallo.mp4",
        gato: "Videos/Animales/Gato.mp4"
    }
};

function selectGameMode(category, numQuestions) {
    maxQuestions = numQuestions;
    startGame(category);
}

function startGame(category) {
    currentCategory = category;
    usedWords = [];
    correctAnswers = 0;
    incorrectAnswers = 0;

    document.getElementById("rules").classList.add("hidden");
    document.getElementById("modeSelection").classList.add("hidden");
    document.getElementById("game").classList.remove("hidden");
    document.getElementById("results").classList.add("hidden");
    document.getElementById("categoryTitle").textContent = `Categoría: ${category}`;
    loadNewWord();
}

function showModeSelection() {
    document.getElementById("rules").classList.add("hidden");
    document.getElementById("modeSelection").classList.remove("hidden");
}

function loadNewWord() {
    const words = Object.keys(vocabulary[currentCategory]);

    if (usedWords.length >= maxQuestions) {
        showResults();
        return;
    }

    // Elige una palabra que no se haya usado
    let randomWord;
    do {
        const randomIndex = Math.floor(Math.random() * words.length);
        randomWord = words[randomIndex];
    } while (usedWords.includes(randomWord));

    currentWord = randomWord;
    usedWords.push(currentWord);
    hasAnswered = false;

    // Crear opciones - incluye la respuesta y tres aleatorias diferentes
    currentOptions = [currentWord];
    while (currentOptions.length < 4) {
        const option = words[Math.floor(Math.random() * words.length)];
        if (!currentOptions.includes(option)) {
            currentOptions.push(option);
        }
    }
    shuffleArray(currentOptions);

    // Mostrar el video de la seña
    const videoPath = vocabulary[currentCategory][currentWord];
    const videoElement = document.getElementById("hintVideo");
    videoElement.src = videoPath;
    videoElement.load();

    // Actualizar opciones de respuesta
    renderOptions();

    // Limpiar feedback previo
    document.getElementById("feedback").textContent = "";
    document.getElementById("feedback").className = "";

    // Actualizar progreso
    updateProgress();
}

function renderOptions() {
    const letters = ["A", "B", "C", "D"];
    const optionsContainer = document.getElementById("optionsContainer");
    optionsContainer.innerHTML = "";
    currentOptions.forEach((option, idx) => {
        const btn = document.createElement("button");
        btn.className = "option-button";
        btn.innerHTML = `<span class="option-letter">${letters[idx]}.</span> <span class="option-text">${capitalize(option)}</span>`;
        btn.onclick = () => checkAnswer(option);
        btn.disabled = hasAnswered;
        optionsContainer.appendChild(btn);
    });
}


// Fisher–Yates shuffle para mezclar el array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function updateProgress() {
    const progress = document.getElementById("progress");
    progress.textContent = `Seña ${usedWords.length} de ${maxQuestions}`;
}

function checkAnswer(selectedOption) {
    if (hasAnswered) return;

    hasAnswered = true;
    const feedback = document.getElementById("feedback");
    const answerNormalized = normalize(currentWord);
    const selectedNormalized = normalize(selectedOption);

    document.querySelectorAll(".option-button").forEach(btn => btn.disabled = true);

    if (selectedNormalized === answerNormalized) {
        correctAnswers++;
        feedback.textContent = "¡Correcto! Muy bien hecho. 🎉";
        feedback.className = "correct";
    } else {
        incorrectAnswers++;
        feedback.textContent = `Incorrecto. La respuesta correcta era: ${capitalize(currentWord)}`;
        feedback.className = "incorrect";
    }

    setTimeout(() => {
        feedback.className = "";
        loadNewWord();
    }, 3500);
}

function showResults() {
    document.getElementById("game").classList.add("hidden");
    document.getElementById("results").classList.remove("hidden");

    const totalQuestions = maxQuestions;
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);

    document.getElementById("correctCount").textContent = correctAnswers;
    document.getElementById("incorrectCount").textContent = incorrectAnswers;
    document.getElementById("totalCount").textContent = totalQuestions;
    document.getElementById("percentage").textContent = percentage;

    const resultMessage = document.getElementById("resultMessage");
    if (percentage === 100) {
        resultMessage.textContent = "¡Perfecto! ¡Excelente trabajo! 🏆";
        resultMessage.style.color = "#2ecc71";
    } else if (percentage >= 70) {
        resultMessage.textContent = "¡Muy bien! Sigue practicando. 👍";
        resultMessage.style.color = "#1abc9c";
    } else if (percentage >= 50) {
        resultMessage.textContent = "Buen intento. Revisa el repaso para mejorar. 📚";
        resultMessage.style.color = "#f39c12";
    } else {
        resultMessage.textContent = "Te recomendamos visitar la sección de Repaso. 💪";
        resultMessage.style.color = "#e74c3c";
    }
}

function restartGame() {
    document.getElementById("results").classList.add("hidden");
    document.getElementById("modeSelection").classList.remove("hidden");
}

function goToRepaso() {
    location.href = 'repaso.html';
}

function goBack() {
    document.getElementById("modeSelection").classList.add("hidden");
    document.getElementById("rules").classList.remove("hidden");
}

function normalize(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
