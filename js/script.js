// Banco de dados com os links REAIS do seu Firebase Storage (conforme seu bucket imovies-db9a2)
const movieData = {
    'the-little-mermaid': { 
        url_video: 'https://storage.googleapis.com/imovies-db9a2.firebasestorage.app/videos/A%20Pequena%20Sereia%202023%201080p%20WEB-DL%20DUAL%205.1.mkv',
        trailer: './images/trailer-mermaid.mp4' 
    },
    'bg-65': { 
        url_video: 'https://storage.googleapis.com/imovies-db9a2.firebasestorage.app/videos/65.mp4', 
        trailer: './images/65-trailer.mp4' 
    },
    'the-covenant': { 
        url_video: 'https://storage.googleapis.com/imovies-db9a2.firebasestorage.app/videos/the-covenant.mp4', 
        trailer: './images/covenant-trailer.mp4' 
    },
    'the-black-demon': { 
        url_video: 'https://storage.googleapis.com/imovies-db9a2.firebasestorage.app/videos/black-demon.mp4', 
        trailer: './images/black-demon-trailer.mp4' 
    },
    'the-tank': { 
        url_video: 'https://storage.googleapis.com/imovies-db9a2.firebasestorage.app/videos/the-tank.mp4', 
        trailer: './images/tank-trailer.mp4' 
    },
    'deadpool': { 
        url_video: 'https://storage.googleapis.com/imovies-db9a2.firebasestorage.app/videos/Deadpool%202016%20Bluray%201080p%205.1%20CH%20Dublado%20-%20WWW.THEPIRATEFILMES.COM.mp4', 
        trailer: './images/DEADPOOL-trailer.mp4' 
    }
};

document.addEventListener('DOMContentLoaded', function() {
    // Inicializa o Carrossel do Materialize
    var elems = document.querySelectorAll('.carousel');
    M.Carousel.init(elems);

    // Inicializa o Autocomplete para a busca
    var autoElems = document.querySelectorAll('.autocomplete');
    var dataForAuto = {};
    Object.keys(movieData).forEach(key => {
        dataForAuto[key.replace(/-/g, ' ')] = null;
    });
    M.Autocomplete.init(autoElems, {
        data: dataForAuto,
        onAutocomplete: function(val) {
            runSearch(val);
        }
    });

    // Aplica a cor de classificação inicial
    updateAgeColor();
});

// Função para trocar o fundo e o conteúdo ativo
function changeBg(bg, title) {
    const banner = document.querySelector('.banner');
    const contents = document.querySelectorAll('.content');

    // Altera a imagem de fundo do banner
    banner.style.backgroundImage = `url("./images/movies-20260301T192245Z-1-001/movies/${bg}")`;
    
    // Gerencia qual conteúdo de texto aparece
    contents.forEach(content => {
        content.classList.remove('active');
        if (content.classList.contains(title)) {
            content.classList.add('active');
        }
    });

    // Atualiza a cor da idade para o novo filme selecionado
    updateAgeColor();
}

// Lógica para as cores da Classificação Indicativa
function updateAgeColor() {
    const activeAgeBadge = document.querySelector('.content.active h4 span i');
    
    if (activeAgeBadge) {
        const ageText = activeAgeBadge.innerText.replace('+', '').trim();
        
        // Remove classes anteriores para evitar conflito de cores
        activeAgeBadge.classList.remove('age-L', 'age-10', 'age-12', 'age-14', 'age-16', 'age-18');
        
        // Adiciona a classe correspondente ao CSS (ex: age-12)
        activeAgeBadge.classList.add(`age-${ageText}`);
    }
}

// Injeta o player de vídeo do Firebase (Seguro e sem anúncios)
function startMovie() {
    const modal = document.getElementById('playerModal');
    const activeContent = document.querySelector('.content.active');
    const movieKey = activeContent.classList[1]; 
    const movie = movieData[movieKey];

    if (movie) {
        modal.innerHTML = `
            <div class="back-btn" onclick="closePlayer()">
                <i class="fa fa-arrow-left"></i> Voltar ao Catálogo
            </div>
            <video id="mainPlayer" controls controlsList="nodownload" style="width: 100%; height: 80%;">
                <source src="${movie.url_video}" type="video/mp4">
            </video>
            <i class="fa fa-times close-btn" onclick="closePlayer()"></i>
        `;
        modal.classList.add('active');

        // Força o play com som após a interação do clique
        const player = document.getElementById('mainPlayer');
        player.play().catch(error => {
            console.log("O navegador bloqueou o som automático. O usuário precisa clicar no play.");
        });
    }
}

// Injeta o trailer local
function toggleVideo() {
    const modal = document.getElementById('playerModal');
    const activeContent = document.querySelector('.content.active');
    const movieKey = activeContent.classList[1];
    const movie = movieData[movieKey];

    if (movie) {
        modal.innerHTML = `
            <div class="back-btn" onclick="closePlayer()">
                <i class="fa fa-arrow-left"></i> Voltar
            </div>

            <video src="${movie.trailer}" controls autoplay></video>
            <i class="fa fa-times close-btn" onclick="closePlayer()"></i>
        `;
        modal.classList.add('active');
    }
}

// Fecha o player e limpa o HTML para parar o áudio e bloquear pop-ups
function closePlayer() {
    const modal = document.getElementById('playerModal');
    modal.classList.remove('active');
    modal.innerHTML = ''; 
}

// Função de Busca integrada ao carrossel
function runSearch(selected) {
    const query = selected || document.getElementById('movieSearch').value;
    const key = query.toLowerCase().replace(/ /g, '-');
    
    if (movieData[key]) {
        let bgImg = key === 'the-little-mermaid' ? 'bg-little-mermaid.jpg' : `bg-${key}.jpeg`;
        if (key === 'bg-65') bgImg = 'bg-65.jpeg';
        
        changeBg(bgImg, key);
    }
}