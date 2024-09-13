let idPokemonAtual = null;

function buscarPokemon() {
    const nomeOuId = document.getElementById('nomePokemon').value.trim().toLowerCase();
    if (!nomeOuId) {
        window.alert('Por favor, insira o nome ou ID do Pokémon.');
        return; 
    }
    buscarDadosPokemon(nomeOuId); 
}


function buscarDadosPokemon(nomeOuId) {
    const url = `https://pokeapi.co/api/v2/pokemon/${nomeOuId}`;
    fetch(url)
        .then(resposta => {
            if (!resposta.ok) {
                throw new Error('Pokémon não encontrado');
            }
            return resposta.json();
        })
        .then(dados => {
            idPokemonAtual = dados.id;
            atualizarExibicaoPokemon(dados);
            atualizarBotoesNavegacao();
        })
        .catch(erro => {
            alert('Erro: ' + erro.message);
        });
}

function atualizarExibicaoPokemon(dados) {
    const imagemPokemon = document.getElementById('imagemPokemon');
    imagemPokemon.src = dados.sprites.front_default;
    imagemPokemon.classList.remove('pokeball');  

    document.getElementById('nomePokemonExibicao').innerText = dados.name.toUpperCase();
    document.getElementById('tipoPokemon').innerText = `Tipo: ${dados.types.map(tipo => tipo.type.name).join(', ')}`;
    document.getElementById('pesoPokemon').innerText = `Peso: ${dados.weight / 10} kg`; 
    document.getElementById('alturaPokemon').innerText = `Altura: ${dados.height / 10} m`;

    const tipoPrincipal = dados.types[0].type.name;
    mudarCorContainer(tipoPrincipal);
}


function mudarCorContainer(tipoPokemon) {
    const container = document.querySelector('.container');
    container.className = 'container';
    container.classList.add(`tipo-pokemon-${tipoPokemon}`);
}

function atualizarBotoesNavegacao() {
    const navegacao = document.querySelector('.navigation');
    navegacao.style.display = 'block'; 
    document.getElementById('voltar').disabled = idPokemonAtual === 1;
    document.getElementById('proximo').disabled = false;
}

function navegarPokemon(direcao) {
    buscarDadosPokemon(idPokemonAtual += direcao);
}