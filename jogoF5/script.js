const mao = document.getElementById('mao'); 
const inputFiltro = document.getElementById('input-filtro'); 
const listaFavoritos = document.getElementById('lista-favoritos'); 
let idBaralho = '';
let cartas = []; 


async function buscarBaralho() {
    try {
        const { deck_id } = await (await fetch('https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')).json();
        idBaralho = deck_id;
        
        const { cards } = await (await fetch(`https://www.deckofcardsapi.com/api/deck/${idBaralho}/draw/?count=10`)).json();
        cartas = cards;
        
        renderizarCartas(cartas); 
    } catch (error) {
        console.error('Erro ao buscar o baralho:', error);
    }
}


function renderizarCartas(listaCartas) {
    mao.innerHTML = ''; 
    const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    listaCartas.forEach(carta => {
        const imgCarta = document.createElement('img'); 
        imgCarta.src = carta.image;
        imgCarta.alt = `${carta.value} de ${carta.suit}`; 
        imgCarta.dataset.informacaoCarta = `${carta.value} de ${carta.suit}`; 
        imgCarta.dataset.naipe = carta.suit.toLowerCase();

        
        if (favoritos.includes(imgCarta.dataset.informacaoCarta)) {
            imgCarta.classList.add('favorite'); 
        }

        imgCarta.onclick = () => {
            alternarFavorito(imgCarta); 
        };

        mao.appendChild(imgCarta); 
    });
}


function alternarFavorito(imgCarta) {
    const informacaoCarta = imgCarta.dataset.informacaoCarta;
    let favoritos = JSON.parse(localStorage.getItem('favoritos')) || []; 
    
    favoritos.includes(informacaoCarta) ? 
        (favoritos = favoritos.filter(fav => fav !== informacaoCarta), imgCarta.classList.remove('favorite')) : 
        (favoritos.push(informacaoCarta), imgCarta.classList.add('favorite'));

    localStorage.setItem('favoritos', JSON.stringify(favoritos)); 
    renderizarFavoritos();
}


function renderizarFavoritos() {
    listaFavoritos.innerHTML = ''; 
    const favoritos = JSON.parse(localStorage.getItem('favoritos')) || []; 
    
    
    favoritos.forEach(fav => {
        const itemFavorito = document.createElement('li'); 
        itemFavorito.textContent = fav; 
        listaFavoritos.appendChild(itemFavorito); 
    });
}


inputFiltro.oninput = () => {
    const valorFiltro = inputFiltro.value.toLowerCase(); 

    const cartasFiltradas = cartas.filter(carta => carta.suit.toLowerCase().includes(valorFiltro)); 
    renderizarCartas(cartasFiltradas); 
};

buscarBaralho(); 
renderizarFavoritos(); 
