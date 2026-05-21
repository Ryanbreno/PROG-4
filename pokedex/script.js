var listaPokemon = []

async function carregarPokemons() {

    document.getElementById("grid").innerHTML = "<p class='mensagem'>Carregando pokémons...</p>"
    var resposta = await fetch("https://pokeapi.co/api/v2/pokemon?limit=50")
    var dados = await resposta.json()

    var promessas = dados.results.map(function(p) {
        return fetch(p.url).then(function(r) { return r.json() })
    })

    listaPokemon = await Promise.all(promessas)

    renderizarCards(listaPokemon)
}

function renderizarCards(lista) {

    var grid = document.getElementById("grid")

    if (lista.length === 0) {
        grid.innerHTML = "<p class='mensagem'>Nenhum Pokémon encontrado.</p>"
        return
    }

    grid.innerHTML = ""

    lista.forEach(function(pokemon) {

        var tiposHTML = ""
        pokemon.types.forEach(function(t) {
            var nomeTipo = t.type.name
            tiposHTML += "<span class='tipo " + nomeTipo + "'>" + nomeTipo + "</span>"
        })

        var card = document.createElement("div")
        card.classList.add("card")

        card.innerHTML =
            "<span class='card-numero'>#" + String(pokemon.id).padStart(3, "0") + "</span>" +
            "<img src='" + pokemon.sprites.other["official-artwork"].front_default + "' alt='" + pokemon.name + "' />" +
            "<span class='card-nome'>" + pokemon.name + "</span>" +
            "<div class='tipos'>" + tiposHTML + "</div>"

        grid.appendChild(card)
    })
}

async function buscarPokemon() {

    var texto = document.getElementById("campoBusca").value.trim().toLowerCase()

    if (texto === "") {
        renderizarCards(listaPokemon)
        return
    }

    var encontrado = listaPokemon.filter(function(p) {
        return p.name.includes(texto) || String(p.id) === texto
    })

    if (encontrado.length > 0) {
        renderizarCards(encontrado)
        return
    }

    document.getElementById("grid").innerHTML = "<p class='mensagem'>Buscando...</p>"

    try {
        var resposta = await fetch("https://pokeapi.co/api/v2/pokemon/" + texto)
        var pokemon = await resposta.json()
        renderizarCards([pokemon])
    } catch (erro) {
        document.getElementById("grid").innerHTML = "<p class='mensagem'>Pokémon não encontrado.</p>"
    }
}

function filtrarPorTipo() {

    var tipoEscolhido = document.getElementById("filtroTipo").value

    if (tipoEscolhido === "") {
        renderizarCards(listaPokemon)
        return
    }

    var filtrados = listaPokemon.filter(function(pokemon) {
        return pokemon.types.some(function(t) {
            return t.type.name === tipoEscolhido
        })
    })

    renderizarCards(filtrados)
}

function limpar() {
    document.getElementById("campoBusca").value = ""
    document.getElementById("filtroTipo").value = ""
    renderizarCards(listaPokemon)
}


document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("campoBusca").addEventListener("keydown", function(e) {
        if (e.key === "Enter") {
            buscarPokemon()
        }
    })
})

carregarPokemons()