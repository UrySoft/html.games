let secretCode = [];
let currentAttempt = [];
const maxSelection = 4;
const colors = ["red", "green", "blue", "purple"]; // Solo 4 colores posibles
let maxAttempts = 10;
let timer;
let timeLeft = 300; // Aumentar a 5 minutos (300 segundos)
let attemptsHistory = [];
let attemptCounter = 1; // Contador para numerar los intentos

// Generar código secreto
function generateSecretCode() {
    secretCode = [];
    for (let i = 0; i < maxSelection; i++) { 
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        secretCode.push(randomColor);
    }
}

// Mostrar la selección actual del usuario en colores de izquierda a derecha
function updateCurrentAttemptDisplay() {
    const attemptDiv = document.getElementById('current-attempt');
    attemptDiv.innerHTML = ''; 
    const emptySlots = maxSelection - currentAttempt.length;

    currentAttempt.forEach(color => {
        const colorDiv = document.createElement('div');
        colorDiv.classList.add('color-preview');
        colorDiv.style.backgroundColor = color;
        colorDiv.style.width = '40px';
        colorDiv.style.height = '40px';
        colorDiv.style.display = 'inline-block';
        colorDiv.style.marginRight = '10px';
        colorDiv.style.borderRadius = '50%';
        colorDiv.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)'; // Sombreado
        attemptDiv.appendChild(colorDiv);
    });

    for (let i = 0; i < emptySlots; i++) {
        const emptySlot = document.createElement('div');
        emptySlot.classList.add('empty-slot');
        attemptDiv.appendChild(emptySlot);
    }

    if (currentAttempt.length === maxSelection) {
        checkAttempt();
    }
}

// Comprobar intento del jugador automáticamente
function checkAttempt() {
    let correctPosition = 0;
    let correctColor = 0;

    const tempSecret = [...secretCode];
    const tempAttempt = [...currentAttempt];

    for (let i = 0; i < tempAttempt.length; i++) {
        if (tempAttempt[i] === tempSecret[i]) {
            correctPosition++;
            tempSecret[i] = tempAttempt[i] = null;
        }
    }

    for (let i = 0; i < tempAttempt.length; i++) {
        if (tempAttempt[i] && tempSecret.includes(tempAttempt[i])) {
            correctColor++;
            tempSecret[tempSecret.indexOf(tempAttempt[i])] = null;
        }
    }

    const attemptDiv = document.createElement('div');
    attemptDiv.classList.add('attempt');
    attemptDiv.innerHTML = `<strong>Intento #${attemptCounter}</strong>`; // Numerar el intento
    
    currentAttempt.forEach(color => {
        const colorDiv = document.createElement('div');
        colorDiv.style.backgroundColor = color;
        colorDiv.classList.add('color-circle');
        attemptDiv.appendChild(colorDiv);
    });

    const feedbackDiv = document.createElement('div');
    feedbackDiv.classList.add('feedback');

    for (let i = 0; i < correctPosition; i++) {
        const circle = document.createElement('div');
        circle.classList.add('feedback-circle', 'correct-position');
        feedbackDiv.appendChild(circle);
    }
    for (let i = 0; i < correctColor; i++) {
        const circle = document.createElement('div');
        circle.classList.add('feedback-circle', 'correct-color');
        feedbackDiv.appendChild(circle);
    }

    const incorrectPicks = maxSelection - correctPosition - correctColor;
    for (let i = 0; i < incorrectPicks; i++) {
        const circle = document.createElement('div');
        circle.classList.add('feedback-circle', 'incorrect');
        feedbackDiv.appendChild(circle);
    }

    feedbackDiv.style.display = 'grid';
    feedbackDiv.style.gridTemplateColumns = 'repeat(2, 1fr)'; 

    attemptDiv.appendChild(feedbackDiv);
    
    // Insertar el intento más nuevo al inicio de la lista
    const attemptsSection = document.getElementById('attempts');
    attemptsSection.insertBefore(attemptDiv, attemptsSection.firstChild);

    // Incrementar el contador de intentos
    attemptCounter++;

    attemptsHistory.push({ colors: [...currentAttempt], feedback: { correctPosition, correctColor } });

    if (correctPosition === maxSelection) { 
        alert("¡Has ganado!");
        clearInterval(timer);
    } else if (--maxAttempts <= 0 || timeLeft <= 0) {
        showSecretCode();
    }

    currentAttempt = [];
    updateCurrentAttemptDisplay(); 
}

// Mostrar el código secreto utilizando la sección de selección actual
function showSecretCode() {
    const attemptDiv = document.getElementById('current-attempt');
    attemptDiv.innerHTML = ''; 

    secretCode.forEach(color => {
        const colorDiv = document.createElement('div');
        colorDiv.style.backgroundColor = color;
        colorDiv.classList.add('color-preview');
        colorDiv.style.width = '40px';
        colorDiv.style.height = '40px';
        colorDiv.style.display = 'inline-block';
        colorDiv.style.marginRight = '10px';
        colorDiv.style.borderRadius = '50%';
        colorDiv.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        attemptDiv.appendChild(colorDiv);
    });
}

// Abrir el archivo de ayuda en una ventana emergente
function openHelpPopup() {
    window.open('help.html', 'Ayuda', 'width=500,height=600');
}

// Añadir color a la selección del usuario
function addColorToAttempt(color) {
    if (currentAttempt.length < maxSelection) {
        currentAttempt.push(color);
        updateCurrentAttemptDisplay(); 
    } else {
        alert(`Solo puedes seleccionar ${maxSelection} colores.`);
    }
}

// Mostrar el patrón secreto al hacer clic en el botón de revelar patrón
function revealPattern() {
    showSecretCode();
}

// Reiniciar el juego
function restartGame() {
    generateSecretCode();
    maxAttempts = 10;
    timeLeft = 300; // Reiniciar a 5 minutos
    clearInterval(timer);
    startTimer();
    currentAttempt = [];
    attemptsHistory = [];
    document.getElementById('attempts').innerHTML = "";
    document.getElementById('secret-code').innerHTML = ""; 
    updateCurrentAttemptDisplay();
    attemptCounter = 1; // Reiniciar el contador de intentos
}

// Temporizador
function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').textContent = `Tiempo restante: ${Math.floor(timeLeft / 60)}m ${timeLeft % 60}s`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            showSecretCode();
        }
    }, 1000);
}

// Iniciar juego
document.getElementById('restart-game').addEventListener('click', restartGame);
document.getElementById('reveal-pattern').addEventListener('click', revealPattern);
document.getElementById('help-button').addEventListener('click', openHelpPopup);

// Agregar eventos a los botones de selección de colores
document.querySelectorAll('.color').forEach(button => {
    button.addEventListener('click', () => addColorToAttempt(button.getAttribute('data-color')));
});

// Generar código secreto y temporizador al cargar la página
generateSecretCode();
startTimer();
