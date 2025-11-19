let currentWord = "";
let currentCategory = "";
let usedWords = [];
let correctAnswers = 0;
let incorrectAnswers = 0;
let hasAnswered = false; // Nueva variable para controlar si ya respondió

// Diccionario de palabras con sus rutas de video
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
        hormiga: "Videos/Animales/Hormiga.mp4"
    }
};

function startGame(category) {
    currentCategory = category;
    usedWords = [];
    correctAnswers = 0;
    incorrectAnswers = 0;

    document.getElementById("rules").classList.add("hidden");
    document.getElementById("game").classList.remove("hidden");
    document.getElementById("results").classList.add("hidden");
    document.getElementById("categoryTitle").textContent = `Categoría: ${category}`;
    loadNewWord();
}

function loadNewWord() {
    const words = Object.keys(vocabulary[currentCategory]);

    // Verificar si ya se usaron todas las palabras
    if (usedWords.length >= words.length) {
        showResults();
        return;
    }

    // Obtener una palabra que no se haya usado
    let randomWord;
    do {
        const randomIndex = Math.floor(Math.random() * words.length);
        randomWord = words[randomIndex];
    } while (usedWords.includes(randomWord));

    currentWord = randomWord;
    usedWords.push(currentWord);
    hasAnswered = false; // Resetear el estado de respuesta

    // Scramble the word
    const scrambledWord = currentWord.split("").sort(() => Math.random() - 0.5).join("");
    document.getElementById("scramble").textContent = scrambledWord;

    // Set the hint video
    const videoPath = vocabulary[currentCategory][currentWord];
    document.getElementById("hintVideo").src = videoPath;

    // Clear input and feedback
    document.getElementById("answerInput").value = "";
    document.getElementById("feedback").textContent = "";
    document.getElementById("feedback").className = "";

    // Habilitar el input y el botón
    document.getElementById("answerInput").disabled = false;
    document.querySelector("#game button").disabled = false;

    // Actualizar contador de progreso
    updateProgress();
}

function updateProgress() {
    const words = Object.keys(vocabulary[currentCategory]);
    const progress = document.getElementById("progress");
    progress.textContent = `Palabra ${usedWords.length} de ${words.length}`;
}

function checkAnswer() {
    // Si ya respondió a esta pregunta, no hacer nada
    if (hasAnswered) {
        return;
    }

    const userAnswer = document.getElementById("answerInput").value.trim().toLowerCase();
    const feedback = document.getElementById("feedback");

    // Validar que haya escrito algo
    if (userAnswer === "") {
        feedback.textContent = "Por favor, escribe una respuesta.";
        feedback.className = "warning";
        return;
    }

    hasAnswered = true; // Marcar que ya respondió

    // Deshabilitar el input y el botón después de responder
    document.getElementById("answerInput").disabled = true;
    document.querySelector("#game button").disabled = true;

    if (userAnswer === currentWord) {
        correctAnswers++;
        feedback.textContent = "¡Correcto! Muy bien hecho.";
        feedback.className = "correct";
    } else {
        incorrectAnswers++;
        feedback.textContent = `Incorrecto. La respuesta correcta era: ${currentWord}`;
        feedback.className = "incorrect";
    }

    // Espera un momento antes de cargar la siguiente palabra
    setTimeout(() => {
        feedback.className = "";
        loadNewWord();
    }, 3000); // 3 segundos para que pueda leer la respuesta correcta
}

function showResults() {
    document.getElementById("game").classList.add("hidden");
    document.getElementById("results").classList.remove("hidden");

    const totalQuestions = Object.keys(vocabulary[currentCategory]).length;
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);

    document.getElementById("correctCount").textContent = correctAnswers;
    document.getElementById("incorrectCount").textContent = incorrectAnswers;
    document.getElementById("totalCount").textContent = totalQuestions;
    document.getElementById("percentage").textContent = percentage;

    // Mensaje personalizado según el resultado
    const resultMessage = document.getElementById("resultMessage");
    if (percentage === 100) {
        resultMessage.textContent = "¡Perfecto! ¡Excelente trabajo!";
        resultMessage.style.color = "#2ecc71";
    } else if (percentage >= 70) {
        resultMessage.textContent = "¡Muy bien! Sigue practicando.";
        resultMessage.style.color = "#1abc9c";
    } else if (percentage >= 50) {
        resultMessage.textContent = "Buen intento. Puedes mejorar.";
        resultMessage.style.color = "#f39c12";
    } else {
        resultMessage.textContent = "Sigue practicando. ¡Tú puedes!";
        resultMessage.style.color = "#e74c3c";
    }
}

function restartGame() {
    startGame(currentCategory);
}

function goToRepaso() {
    location.href = 'repaso.html';
}
