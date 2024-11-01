let personaje, monstruos = [], teclas, vidas = 3, juegoTerminado = false;
let tiempoMonstruoGrande = 2000;  // Tiempo prolongado antes del jefe final
let monstruoGrande = null;
let combinacionesRestantes = 3; // Combinaciones necesarias para derrotar al jefe

function setup() {
    createCanvas(800, 400);
    personaje = { x: 50, y: height / 2, size: 40 };
    teclas = getRandomTeclas();
}

function draw() {
    if (juegoTerminado) {
        mostrarGameOver();
        return;
    }

    background(220);
    
    // Mostrar personaje
    fill(0, 0, 255);
    ellipse(personaje.x, personaje.y, personaje.size);

    // Mostrar y mover monstruos
    for (let m of monstruos) {
        fill(255, 0, 0);
        ellipse(m.x, m.y, m.size);
        m.x -= m.velocidad;

        // Chequear colisión
        if (dist(m.x, m.y, personaje.x, personaje.y) < (m.size + personaje.size) / 2) {
            vidas--;
            actualizarVidas();
            if (vidas <= 0) {
                juegoTerminado = true;
            }
            monstruos.splice(monstruos.indexOf(m), 1);
        }
    }

    // Condiciones para mostrar monstruo grande
    if (frameCount > tiempoMonstruoGrande && !monstruoGrande) {
        monstruoGrande = crearMonstruo(true);
    }

    // Mostrar monstruo grande si existe
    if (monstruoGrande) {
        fill(150, 0, 0);
        ellipse(monstruoGrande.x, monstruoGrande.y, monstruoGrande.size);
        monstruoGrande.x -= monstruoGrande.velocidad;
        
        if (dist(monstruoGrande.x, monstruoGrande.y, personaje.x, personaje.y) < (monstruoGrande.size + personaje.size) / 2) {
            vidas--;
            actualizarVidas();
            if (vidas <= 0) {
                juegoTerminado = true;
            }
            monstruoGrande = null;
        }
    }

    // Generar monstruos pequeños
    if (frameCount % 120 === 0 && !monstruoGrande) {
        monstruos.push(crearMonstruo());
    }

    // Mostrar teclas necesarias para atacar
    fill(0);
    textSize(24);
    text("Presiona: " + teclas.join(" "), 300, 50);
}

function keyPressed() {
    if (juegoTerminado) return;

    if (key.toUpperCase() === teclas[0]) {
        teclas.shift(); // Remover tecla correcta
        if (teclas.length === 0) { // Si todas las teclas fueron presionadas
            if (monstruoGrande && dist(monstruoGrande.x, monstruoGrande.y, personaje.x, personaje.y) < 100) {
                combinacionesRestantes--;
                if (combinacionesRestantes === 0) {
                    monstruoGrande = null;
                    alert("¡FELICITACIONES! Has ganado.");
                    juegoTerminado = true;
                } else {
                    teclas = getRandomTeclas(); // Obtener nueva combinación para el jefe
                }
            } else if (monstruos.length > 0) {
                monstruos.shift();
            }
            teclas = getRandomTeclas();
        }
    }
}

function crearMonstruo(grande = false) {
    return {
        x: width,
        y: random(100, height - 100),
        size: grande ? 80 : 30,
        velocidad: grande ? 2 : 4
    };
}

function getRandomTeclas() {
    const teclasDisponibles = ["A", "S", "D", "W"];
    return Array.from({ length: 3 }, () => random(teclasDisponibles));
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
