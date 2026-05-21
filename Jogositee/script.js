var pontos = 0
var tempoRestante = 15
var intervaloInimigos
var intervaloTempo

function iniciarJogo() {
    pontos = 0
    tempoRestante = 15
    document.getElementById("pontos").textContent = 0
    document.getElementById("tempo").textContent = 15
    document.getElementById("btnIniciar").disabled = true
    document.getElementById("arena").innerHTML = ""

    intervaloInimigos = setInterval(criarInimigo, 700)
    intervaloTempo = setInterval(contarTempo, 1000)
    setTimeout(encerrarJogo, 15000)
}


function criarInimigo() {
    var arena = document.getElementById("arena")

    var maxX = arena.offsetWidth - 90
    var maxY = arena.offsetHeight - 90
    var posX = Math.random() * maxX
    var posY = Math.random() * maxY

    var inimigo = document.createElement("div")
    inimigo.classList.add("inimigo")
    inimigo.textContent = "🥷🏻"
    inimigo.style.left = posX + "px"
    inimigo.style.top = posY + "px"

    inimigo.addEventListener("click", function() {
        acertou(inimigo)
    })

    arena.appendChild(inimigo)

    setTimeout(function() {
        removerInimigo(inimigo)
    }, 1200)
}


function removerInimigo(inimigo) {
    if (!inimigo.parentElement) return

    inimigo.classList.add("sumindo")

    setTimeout(function() {
        inimigo.remove()
    }, 200)
}

function acertou(inimigo) {
    pontos = pontos + 10
    document.getElementById("pontos").textContent = pontos
    mostrarParticula(inimigo)
    removerInimigo(inimigo)
}


function mostrarParticula(inimigo) {
    var rect = inimigo.getBoundingClientRect()

    var particula = document.createElement("div")
    particula.classList.add("particula")
    particula.textContent = "+10"
    particula.style.left = rect.left + 40 + "px"
    particula.style.top = rect.top + "px"

    document.body.appendChild(particula)

    setTimeout(function() {
        particula.remove()
    }, 700)
}


function contarTempo() {
    tempoRestante = tempoRestante - 1
    document.getElementById("tempo").textContent = tempoRestante
}

function encerrarJogo() {
    clearInterval(intervaloInimigos)
    clearInterval(intervaloTempo)

    document.getElementById("arena").innerHTML = ""
    document.getElementById("pontosFinal").textContent = pontos
    document.getElementById("telafim").classList.add("visivel")
}


function fecharFim() {
    document.getElementById("telafim").classList.remove("visivel")
    document.getElementById("btnIniciar").disabled = false
}


document.addEventListener("mousemove", function(evento) {
    var ponto = document.createElement("div")
    ponto.classList.add("rastro")
    ponto.style.left = evento.clientX + "px"
    ponto.style.top = evento.clientY + "px"

    document.body.appendChild(ponto)

    setTimeout(function() {
        ponto.remove()
    }, 400)
})