let personaje, enemigos = [], teclas = [], vidas = 3, juegoTerminado = false;
let enemigosDerrotados = 0;
let jefe = null;
let fondoImg, personajeImg, personajeAtaqueImg, enemigoImg, jefeImg;
let enAtaque = false;
let tiempoAtaque = 30; // Duración del GIF de ataque en cuadros

function preload() {
    // Cargar las imágenes y GIFs
    fondoImg = loadImage("assets/11 Free Pixel Art Backgrounds for Games - UnLucky Studio.jpeg");
    personajeImg = loadImage("assets/photo_2024-11-01_13-44-11.gif");
    personajeAtaqueImg = loadImage("assets/photo_2024-11-01_18-32-59.gif"); // GIF de ataque
    enemigoImg = loadImage("assets/photo_2024-11-01_18-43-44.jpg");
    jefeImg = loadImage("assets/photo_2024-11-01_18-43-47.jpg");
}

function setup() {
    createCanvas(800, 400);
    personaje = { x: 50, y: height / 2, size: 40 };
}

function draw() {
    if (juegoTerminado) {
        mostrarGameOver();
        return;
    }

    // Mostrar fondo
    background(220);
    image(fondoImg, 0, 0, width, height);

    // Mostrar personaje
    if (enAtaque && tiempoAtaque > 0) {
        image(personajeAtaqueImg, personaje.x - 20, personaje.y - 20, 60, 60);
        tiempoAtaque--;
    } else {
        image(personajeImg, personaje.x - 20, personaje.y - 20, 60, 60);
        enAtaque = false; // Reset de ataque
    }

    // Mostrar y mover enemigos
    for (let enemigo of enemigos) {
        image(enemigoImg, enemigo.x - 20, enemigo.y - 20, enemigo.size, enemigo.size);
        enemigo.x -= enemigo.velocidad;

        // Colisión con enemigos pequeños
        if (dist(enemigo.x, enemigo.y, personaje.x, personaje.y) < (enemigo.size + personaje.size) / 2) {
            vidas--;
            actualizarVidas();
            if (vidas <= 0) {
                juegoTerminado = true;
            }
            enemigos.splice(enemigos.indexOf(enemigo), 1);
        }
    }

    // Condiciones para mostrar jefe
    if (enemigosDerrotados >= 10 && enemigos.length === 0 && !jefe) {
        jefe = crearEnemigo(true);
        teclas = getRandomTeclas(9);
    }

    // Mostrar jefe si existe
    if (jefe) {
        image(jefeImg, jefe.x - 40, jefe.y - 40, jefe.size, jefe.size);
        jefe.x -= jefe.velocidad;

        // Colisión del jefe con el jugador
        if (dist(jefe.x, jefe.y, personaje.x, personaje.y) < (jefe.size + personaje.size) / 2) {
            vidas = 0;
            actualizarVidas();
            juegoTerminado = true;
        }
    }

    // Generar enemigos pequeños
    if (frameCount % 120 === 0 && !jefe) {
        enemigos.push(crearEnemigo());
        teclas = getRandomTeclas(3);
    }

    // Mostrar teclas necesarias
    if (enemigos.length > 0 || jefe) {
        fill(0);
        textSize(24);
        text("Presiona: " + teclas.join(" "), 300, 50);
    }
}

function keyPressed() {
    if (juegoTerminado || teclas.length === 0) return;

    if (key.toUpperCase() === teclas[0]) {
        teclas.shift();

        if (teclas.length === 0) { // Si todas las teclas fueron presionadas correctamente
            enAtaque = true;
            tiempoAtaque = 30; // Reiniciar duración del ataque

            if (jefe) {
                jefe = null;
                alert("¡FELICIDADES! Has derrotado al jefe.");
                juegoTerminado = true;
            } else if (enemigos.length > 0) {
                enemigos.shift();
                teclas = getRandomTeclas(3);
                enemigosDerrotados++;
            }
        }
    }
}

function crearEnemigo(esJefe = false) {
    return {
        x: width,
        y: personaje.y,
        size: esJefe ? 80 : 30,
        velocidad: esJefe ? 2 : 4
    };
}

function getRandomTeclas(num) {
    const teclasDisponibles = ["A", "S", "D", "W"];
    return Array.from({ length: num }, () => random(teclasDisponibles));
}

function actualizarVidas() {
    document.getElementById("vidas").innerText = vidas;
}

function mostrarGameOver() {
    background(0);
    fill(255, 0, 0);
    textSize(48);
    textAlign(CENTER, CENTER);
    text("GAME OVER", width / 2, height / 2);
}
