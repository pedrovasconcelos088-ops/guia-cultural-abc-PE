// =========================================================
// script.js — substitui o java.js (funciona nas duas páginas)
// =========================================================

// ---------- Configurações que você pode editar ----------
// Cole aqui o seu token do Mapbox. Enquanto estiver assim, o mapa usa OpenStreetMap.
const MAPBOX_TOKEN = 'pk.eyJ1IjoicGVyZWlyYTA4OCIsImEiOiJjbXZ0Z3NncmIwMmFtMzVuOWJmNmp6OXV4In0.FU2xpr6EY_JdB28p6GSQpQ';

// Fotos reais: preencha com a URL da imagem (ou caminho local, ex.: 'img/kasato.jpg').
// Chave = "Título|Cidade". Use o campo "c" para o crédito da foto.
// Enquanto estiver vazio, o card mostra um quadro neutro "Foto em breve".
const FOTOS = {
    // u = foto | c = crédito (aparece no pop-up) | pos = parte da foto que fica visível no card (ex.: 'center top' mostra o topo)

    // --- MONUMENTOS (index.html) ---
    'Monumento a João Ramalho|Santo André': { u: 'img/joao-ramalho.jpg', c: '' },
    'Monumento ao Trabalhador|Santo André': { u: 'img/trabalhador.jpg', c: '' },
    'Monumento ao Imigrante Italiano|Santo André': { u: 'img/imigrante-italiano-sa.jpg', c: '', pos: 'center top' },
    'Monumento Kasato Maru|São Bernardo do Campo': { u: 'img/kasato-maru.jpg', c: '' },
    'Monumento à Maçonaria|São Bernardo do Campo': { u: 'img/maconaria.jpg', c: '' },
    'Obelisco do Soldado Constitucionalista|São Bernardo do Campo': { u: 'img/obelisco.jpg', pos: 'center 25%',
        c: 'Imagem ilustrativa: Obelisco do Ibirapuera, na capital paulista. O obelisco de São Bernardo fica na Praça Angelo Marin, no bairro Paulicéia.' },
    'Monumento aos Autonomistas|São Caetano do Sul': { u: 'img/autonomistas.jpg', c: '' },
    'Monumento à Mulher|São Caetano do Sul': { u: 'img/mulher.jpg', c: '', pos: 'center 20%' },
    'Praça dos Imigrantes|São Caetano do Sul': { u: 'img/praca-imigrantes.jpg', c: '', pos: 'center 35%' },
    'Monumento aos Migrantes|Diadema': { u: 'img/migrantes.jpg', c: '', pos: 'center top' },

    // --- ESPAÇOS CULTURAIS (rotas-culturais.html) ---
    'Sabina Escola Parque do Conhecimento|Santo André': { u: 'img/sabina.jpeg', c: '' },
    'Teatro Municipal – Maestro Flávio Florence|Santo André': { u: 'img/teatroMunicipal.jpg', c: '' },
    'Sesc Santo André|Santo André': { u: 'img/sescSantoAndre.jpg', c: '' },
    'Pinacoteca de São Bernardo|São Bernardo do Campo': { u: 'img/pinacoteca.jpg', c: '' },
    'Teatro Lauro Gomes|São Bernardo do Campo': { u: 'img/lauroGomes.jpg', c: '' },
    'Parque Chácara Silvestre|São Bernardo do Campo': { u: 'img/ChacaraSilvestre.jpg', c: '' },
    'Cia. Cinematográfica Vera Cruz|São Bernardo do Campo': { u: 'img/VeraCruz.jpg', c: '' },
    'Fundação Pró-Memória|São Caetano do Sul': { u: 'img/Pro-Memoria.jpg', c: '' },
    'Teatro Paulo Machado de Carvalho|São Caetano do Sul': { u: 'img/PauloMachado.webp', c: '' },
    'Fábrica de Cultura de Diadema|Diadema': { u: 'img/fabrica de cultura.jpg', c: '' }
};

// Marcos da linha do tempo (página de monumentos)
const LINHA_DO_TEMPO = [
    { ano: 1553, rotulo: '1553', titulo: 'Monumento a João Ramalho', cidade: 'Santo André' },
    { ano: 1877, rotulo: '1877', titulo: 'Praça dos Imigrantes', cidade: 'São Caetano do Sul' },
    { ano: 1908, rotulo: '1908', titulo: 'Monumento Kasato Maru', cidade: 'São Bernardo do Campo' },
    { ano: 1948, rotulo: '1948', titulo: 'Monumento aos Autonomistas', cidade: 'São Caetano do Sul' },
    { ano: 1932, rotulo: '1932', titulo: 'Obelisco do Soldado Constitucionalista', cidade: 'São Bernardo do Campo' },
    { ano: 1959, rotulo: '1959', titulo: 'Monumento aos Migrantes', cidade: 'Diadema' }
];

// Posição dos monumentos no mapa. ATENÇÃO: coordenadas aproximadas (praça/rua) — confira no Google Maps.
const COR_CIDADE = { 'Santo André': '#2F6DA8', 'São Bernardo do Campo': '#B8432F', 'São Caetano do Sul': '#2E7A55', 'Diadema': '#F2B705' };
const MONUMENTOS_MAPA = [
    { nome: 'Monumento a João Ramalho', cidade: 'Santo André', end: 'Praça IV Centenário - Centro', lat: -23.6581, lng: -46.5322 },
    { nome: 'Monumento ao Trabalhador', cidade: 'Santo André', end: 'Praça do Carmo - Centro', lat: -23.6543, lng: -46.5337 },
    { nome: 'Monumento ao Imigrante Italiano', cidade: 'Santo André', end: 'Praça Itália - Vila Assunção', lat: -23.6700, lng: -46.5200 },
    { nome: 'Monumento Kasato Maru', cidade: 'São Bernardo do Campo', end: 'Av. Wallace Simonsen (próx. ao Parque Raphael Lazzuri)', lat: -23.7100, lng: -46.5590 },
    { nome: 'Monumento à Maçonaria', cidade: 'São Bernardo do Campo', end: 'Praça da Maçonaria - Jardim do Mar', lat: -23.6905, lng: -46.5470 },
    { nome: 'Obelisco do Soldado Constitucionalista', cidade: 'São Bernardo do Campo', end: 'Praça Angelo Marin - Paulicéia', lat: -23.7090, lng: -46.5720 },
    { nome: 'Monumento aos Autonomistas', cidade: 'São Caetano do Sul', end: 'Praça dos Autonomistas - Centro', lat: -23.6228, lng: -46.5543 },
    { nome: 'Monumento à Mulher', cidade: 'São Caetano do Sul', end: 'Av. Goiás (próx. ao Espaço Verde Chico Mendes)', lat: -23.6285, lng: -46.5735 },
    { nome: 'Praça dos Imigrantes', cidade: 'São Caetano do Sul', end: 'Av. Presidente Kennedy - Bairro Olímpico', lat: -23.6400, lng: -46.5690 },
    { nome: 'Monumento aos Migrantes', cidade: 'Diadema', end: 'Praça da Moça - Centro', lat: -23.6868, lng: -46.6205 }
];

// ---------- Utilidades ----------
const normalizar = s => (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const FOTO_VAZIA = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="600" height="400" fill="#2B3C48"/>' +
    '<text x="300" y="210" font-family="sans-serif" font-size="26" fill="#9FB0BD" text-anchor="middle">Foto em breve</text></svg>');
const linkComoChegar = endereco => 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(endereco);

function marcarBotao(botao) {
    botao.parentElement.querySelectorAll('.btn').forEach(b => {
        b.classList.remove('btn-warning', 'active');
        b.classList.add('btn-outline-warning');
    });
    botao.classList.remove('btn-outline-warning');
    botao.classList.add('btn-warning', 'active');
}

// =========================================================
// 1. TEMA (o <script> no <head> evita a "piscada"; aqui fica o botão)
// =========================================================
const btnTheme = document.getElementById('btnThemeToggle');
const themeIcon = document.getElementById('themeIcon');
const themeText = document.getElementById('themeText');

let map = null, tileLayerAtual = null, camadaAtual = null, camadaMonumentos = null;
const marcadoresRota = {};

function temaAtual() { return document.documentElement.getAttribute('data-bs-theme') === 'dark' ? 'dark' : 'light'; }

function atualizarBotaoTema() {
    const dark = temaAtual() === 'dark';
    if (themeIcon) themeIcon.className = dark ? 'bi bi-sun-fill' : 'bi bi-moon-stars-fill';
    if (themeText) themeText.innerText = dark ? 'Modo Claro' : 'Modo Escuro';
}

function configurarTiles(dark) {
    if (MAPBOX_TOKEN.startsWith('COLE_')) {
        return ['https://tile.openstreetmap.org/{z}/{x}/{y}.png',
            { attribution: '&copy; OpenStreetMap', maxZoom: 19 }];
    }
    const estilo = dark ? 'dark-v11' : 'streets-v12';
    return [`https://api.mapbox.com/styles/v1/mapbox/${estilo}/tiles/512/{z}/{x}/{y}?access_token=${MAPBOX_TOKEN}`,
        { attribution: '&copy; Mapbox &copy; OpenStreetMap', tileSize: 512, zoomOffset: -1, maxZoom: 19 }];
}

function atualizarEstiloMapa() {
    if (!map) return;
    if (tileLayerAtual) map.removeLayer(tileLayerAtual);
    const [url, opcoes] = configurarTiles(temaAtual() === 'dark');
    tileLayerAtual = L.tileLayer(url, opcoes).addTo(map);
    tileLayerAtual.bringToBack();
}

if (btnTheme) {
    btnTheme.addEventListener('click', () => {
        const novo = temaAtual() === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-bs-theme', novo);
        localStorage.setItem('theme', novo);
        atualizarBotaoTema();
        atualizarEstiloMapa();
    });
}

// =========================================================
// 2. FOTOS (usa a tabela FOTOS; sem foto, mostra quadro neutro)
// =========================================================
// Tenta "img/foto.jpg"; se não achar, tenta "foto.jpg" (mesma pasta da página); por fim o quadro neutro.
function carregarFoto(img, card, url) {
    const tentativas = url.startsWith('data:') ? [url] : [url, url.split('/').pop(), FOTO_VAZIA];
    const tentar = () => {
        const u = tentativas.shift();
        img.onerror = tentativas.length ? tentar : null;
        img.src = u;
        if (card.dataset.imagem !== undefined) card.dataset.imagem = u; // o pop-up usa a mesma imagem
    };
    tentar();
}

function aplicarFotos() {
    document.querySelectorAll('.monument-card, #lista-espacos .card').forEach(card => {
        const titulo = card.dataset.titulo || card.querySelector('.card-title')?.textContent.trim();
        const cidade = card.dataset.cidadeNome || card.querySelector('.badge')?.textContent.trim();
        const foto = FOTOS[`${titulo}|${cidade}`];
        const img = card.querySelector('.card-img-top');
        if (img) {
            carregarFoto(img, card, foto ? foto.u : FOTO_VAZIA);
            img.style.objectPosition = (foto && foto.pos) || '';
        }
        if (card.dataset.imagem !== undefined) {
            card.dataset.credito = foto ? (foto.c || '') : '';
            card.dataset.fotoPos = (foto && foto.pos) || '';
        }
    });
}

// =========================================================
// 3. MONUMENTOS (index.html): filtro + busca + pop-up + linha do tempo
// =========================================================
let filtroCidade = 'todas', termoBusca = '', ultimoFoco = null;

function filtrarMonumentos(cidade, botao) {
    if (botao) marcarBotao(botao);
    filtroCidade = cidade;
    aplicarFiltroMonumentos();
}

function aplicarFiltroMonumentos() {
    const itens = document.querySelectorAll('#lista-monumentos .monumento-item');
    const termo = normalizar(termoBusca.trim());
    let visiveis = 0;

    itens.forEach(item => {
        const card = item.querySelector('.monument-card');
        const texto = normalizar(item.textContent + ' ' + (card?.dataset.periodo || ''));
        const ok = (filtroCidade === 'todas' || item.dataset.cidade === filtroCidade) && (!termo || texto.includes(termo));
        item.classList.toggle('d-none', !ok);
        if (ok) visiveis++;
    });

    const nomes = { todas: 'o Grande ABC', santo_andre: 'Santo André', sbc: 'São Bernardo do Campo', scs: 'São Caetano do Sul', diadema: 'Diadema' };
    const sub = document.getElementById('monumentos-subtitulo');
    if (sub) {
        sub.innerHTML = `Exibindo <strong>${visiveis}</strong> ${visiveis === 1 ? 'monumento histórico' : 'monumentos históricos'} em <strong>${nomes[filtroCidade] || ''}</strong>` +
            (termo ? ` para “<strong>${termoBusca.trim().replace(/</g, '&lt;')}</strong>”.` : '.');
    }
    document.getElementById('sem-resultado')?.classList.toggle('d-none', visiveis > 0);
}

// Contadores dos botões calculados automaticamente
function atualizarContadores() {
    document.querySelectorAll('#filtro-cidade-monumentos .btn').forEach(btn => {
        const chave = (btn.getAttribute('onclick').match(/'(\w+)'/) || [])[1];
        const total = chave === 'todas'
            ? document.querySelectorAll('#lista-monumentos .monumento-item').length
            : document.querySelectorAll(`#lista-monumentos .monumento-item[data-cidade="${chave}"]`).length;
        btn.textContent = btn.textContent.replace(/\s*\(\d+\)\s*$/, '').trim() + ` (${total})`;
    });
}

function criarBusca() {
    const filtros = document.getElementById('filtro-cidade-monumentos');
    if (!filtros) return;
    const busca = document.createElement('div');
    busca.className = 'input-group mx-auto mb-3';
    busca.style.maxWidth = '420px';
    busca.innerHTML = '<span class="input-group-text"><i class="bi bi-search"></i></span>' +
        '<input type="search" id="busca-monumentos" class="form-control" placeholder="Buscar por nome ou período" aria-label="Buscar monumentos">';
    filtros.before(busca);
    busca.querySelector('input').addEventListener('input', e => { termoBusca = e.target.value; aplicarFiltroMonumentos(); });

    const vazio = document.createElement('p');
    vazio.id = 'sem-resultado';
    vazio.className = 'text-center text-secondary py-4 d-none';
    vazio.textContent = 'Nenhum monumento encontrado. Tente outro nome ou limpe a busca.';
    document.getElementById('lista-monumentos').after(vazio);
}

// ----- Pop-up (chamado pelo onclick dos cards, como antes) -----
function abrirPopupMonumento(card) {
    ultimoFoco = card;
    const $ = id => document.getElementById(id);
    $('popupImg').src = card.dataset.imagem;
    $('popupImg').alt = card.dataset.titulo;
    $('popupImg').style.objectPosition = card.dataset.fotoPos || '';
    $('popupCidade').className = 'badge ' + (card.dataset.badgeClass || 'bg-primary');
    $('popupCidade').textContent = card.dataset.cidadeNome;
    $('popupPeriodo').textContent = card.dataset.periodo;
    $('popupTitulo').textContent = card.dataset.titulo;
    $('popupDescricao').textContent = card.dataset.descricao;
    $('popupHistoria').textContent = card.dataset.historia;
    $('popupEndereco').textContent = card.dataset.endereco;

    // Crédito da foto e botão "Como chegar" (criados na primeira abertura)
    let credito = $('popupCredito');
    if (!credito) {
        credito = document.createElement('small');
        credito.id = 'popupCredito';
        credito.className = 'text-muted d-block px-4 pt-2';
        $('popupImg').parentElement.after(credito);
        const rota = document.createElement('a');
        rota.id = 'popupRota';
        rota.target = '_blank'; rota.rel = 'noopener noreferrer';
        rota.className = 'btn btn-outline-secondary btn-sm fw-semibold rounded-pill px-3 ms-auto me-2';
        rota.innerHTML = '<i class="bi bi-signpost-split me-1"></i>Como chegar';
        $('popupMonumento').querySelector('.btn-warning').before(rota);
    }
    credito.textContent = card.dataset.credito || '';
    credito.classList.toggle('d-none', !card.dataset.credito);
    $('popupRota').href = linkComoChegar(card.dataset.endereco);

    $('popupMonumento').classList.add('aberto');
    document.body.style.overflow = 'hidden';
    $('popupMonumento').querySelector('[aria-label="Fechar"]').focus();
}

function fecharPopupMonumento() {
    document.getElementById('popupMonumento').classList.remove('aberto');
    document.body.style.overflow = '';
    if (ultimoFoco) ultimoFoco.focus();
}

function fecharPopupFora(event) {
    if (event.target.id === 'popupMonumento') fecharPopupMonumento();
}

// ----- Cards acessíveis pelo teclado -----
function tornarCardsAcessiveis() {
    document.querySelectorAll('.monument-card').forEach(card => {
        card.tabIndex = 0;
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', 'Abrir história: ' + card.dataset.titulo + ', ' + card.dataset.cidadeNome);
        card.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); abrirPopupMonumento(card); }
        });
    });
}

document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && document.getElementById('popupMonumento')?.classList.contains('aberto')) fecharPopupMonumento();
});

// ----- Linha do tempo -----
function criarLinhaDoTempo() {
    const alvo = document.getElementById('contexto');
    if (!alvo) return;
    const cards = [...document.querySelectorAll('.monument-card')];
    const secao = document.createElement('section');
    secao.id = 'linha-do-tempo';
    secao.className = 'py-5';
    secao.innerHTML = '<div class="container"><div class="text-center mb-4"><h2 class="fw-bold">Linha do tempo dos monumentos</h2>' +
        '<p class="text-secondary">Do século XVI à emancipação de Diadema: clique em um marco para abrir a história.</p></div>' +
        '<ol class="timeline"></ol></div>';
    const lista = secao.querySelector('ol');

    [...LINHA_DO_TEMPO].sort((a, b) => a.ano - b.ano).forEach(m => {
        const card = cards.find(c => c.dataset.titulo === m.titulo && c.dataset.cidadeNome === m.cidade);
        if (!card) return;
        const li = document.createElement('li');
        li.style.setProperty('--cidade', COR_CIDADE[m.cidade]);
        li.innerHTML = '<button type="button" class="timeline-item"><span class="timeline-ano"></span><strong></strong><small></small></button>';
        li.querySelector('.timeline-ano').textContent = m.rotulo;
        li.querySelector('strong').textContent = m.titulo;
        li.querySelector('small').textContent = m.cidade;
        li.querySelector('button').addEventListener('click', e => { ultimoFoco = e.currentTarget; abrirPopupMonumento(card); ultimoFoco = e.currentTarget; });
        lista.appendChild(li);
    });
    alvo.before(secao);
}

// =========================================================
// 4. MAPA E ROTAS (rotas-culturais.html)
// =========================================================
const rotasData = {
    santo_andre: {
        nomeCidade: 'Santo André',
        titulo: '🎭 Rota Cultural Santo André',
        descricao: 'Circuito reunindo a Sabina, o Teatro Municipal no Paço e o Sesc Santo André.',
        pontos: [
            { chave: 'sabina', nome: 'Sabina Escola Parque do Conhecimento', lat: -23.67903, lng: -46.53129, desc: 'R. Juquiá, s/n - Vila Eldizia' },
            { chave: 'flavio florence', nome: 'Teatro Municipal Flávio Florence', lat: -23.6581, lng: -46.5322, desc: 'Praça IV Centenário, 01 - Centro' },
            { chave: 'sesc', nome: 'Sesc Santo André', lat: -23.6508, lng: -46.5428, desc: 'R. Tamarutaca, 302 - Vila Guiomar' }
        ],
        cor: '#2F6DA8'
    },
    sbc: {
        nomeCidade: 'São Bernardo do Campo',
        titulo: '🎬 Rota de Artes e Memória de São Bernardo',
        descricao: 'Passagem pela Pinacoteca, Vera Cruz, Teatro Lauro Gomes e Chácara Silvestre.',
        pontos: [
            { chave: 'pinacoteca', nome: 'Pinacoteca de SBC', lat: -23.6896, lng: -46.5492, desc: 'R. Kara, 135 - Jardim do Mar' },
            { chave: 'vera cruz', nome: 'Cia. Cinematográfica Vera Cruz', lat: -23.6927, lng: -46.5562, desc: 'Av. Lucas Nogueira Garcez, 856 - Centro' },
            { chave: 'lauro gomes', nome: 'Teatro Lauro Gomes', lat: -23.6657, lng: -46.5681, desc: 'R. Helena Jacquey, 171 - Rudge Ramos' },
            { chave: 'chacara silvestre', nome: 'Parque Chácara Silvestre', lat: -23.7083, lng: -46.5619, desc: 'Av. Wallace Simonsen, 1800 - Nova Petrópolis' }
        ],
        cor: '#B8432F'
    },
    scs_diadema: {
        nomeCidade: 'São Caetano do Sul e Diadema',
        titulo: '🎨 Rota São Caetano & Diadema',
        descricao: 'Preservação histórica da imigração e formação artística urbana.',
        pontos: [
            { chave: 'pro-memoria', nome: 'Fundação Pró-Memória (SCS)', lat: -23.6186, lng: -46.5564, desc: 'Av. Dr. Augusto de Toledo, 255 - Santa Paula' },
            { chave: 'paulo machado', nome: 'Teatro Paulo Machado de Carvalho (SCS)', lat: -23.6331, lng: -46.5593, desc: 'Al. Conde de Porto Alegre, 840 - Santa Maria' },
            { chave: 'fabrica de cultura', nome: 'Fábrica de Cultura de Diadema', lat: -23.6872, lng: -46.6231, desc: 'R. Ver. Gustavo Sonnewend Neto, 135 - Centro' }
        ],
        cor: '#C99700'
    }
};

function filtrarCardsPorRota(chave) {
    let visiveis = 0;
    document.querySelectorAll('#lista-espacos .card-item').forEach(card => {
        const ok = card.dataset.rota === chave;
        card.classList.toggle('d-none', !ok);
        if (ok) visiveis++;
    });
    const sub = document.getElementById('espacos-subtitulo');
    if (sub) sub.innerHTML = `Exibindo <strong>${visiveis}</strong> espaços culturais de <strong>${rotasData[chave]?.nomeCidade || ''}</strong>. Clique em um card para vê-lo no mapa.`;
}

function carregarRota(chave, botao) {
    const rota = rotasData[chave];
    if (!rota || !map) return;
    if (botao) marcarBotao(botao);

    filtrarCardsPorRota(chave);
    camadaAtual.clearLayers();
    Object.keys(marcadoresRota).forEach(k => delete marcadoresRota[k]);

    document.getElementById('route-title').innerText = rota.titulo;
    document.getElementById('route-desc').innerText = rota.descricao;
    const lista = document.getElementById('route-steps');
    lista.innerHTML = '';

    const coords = [];
    rota.pontos.forEach((p, i) => {
        coords.push([p.lat, p.lng]);
        const marker = L.marker([p.lat, p.lng]).addTo(camadaAtual);
        marker.bindPopup(`<b>${i + 1}. ${p.nome}</b><br>${p.desc}<br><a href="${linkComoChegar(p.desc)}" target="_blank" rel="noopener noreferrer">Como chegar</a>`);
        marcadoresRota[p.chave] = marker;

        const li = document.createElement('li');
        li.className = 'list-group-item bg-transparent text-body';
        li.innerHTML = `<strong>${p.nome}:</strong> ${p.desc}`;
        lista.appendChild(li);
    });

    const linha = L.polyline(coords, { color: rota.cor, weight: 5, opacity: 0.85, dashArray: '8, 8' }).addTo(camadaAtual);
    map.invalidateSize();
    map.fitBounds(linha.getBounds(), { padding: [40, 40] });
}

// ----- Monumentos como camada opcional do mapa -----
function criarCamadaMonumentos() {
    camadaMonumentos = L.layerGroup();
    MONUMENTOS_MAPA.forEach(m => {
        L.circleMarker([m.lat, m.lng], { radius: 9, color: '#fff', weight: 2, fillColor: COR_CIDADE[m.cidade], fillOpacity: 0.95 })
            .bindPopup(`<b>${m.nome}</b><br>${m.cidade}<br>${m.end}<br><small>Localização aproximada</small><br>` +
                `<a href="index.html#monumentos">Ver na página de monumentos</a> · ` +
                `<a href="${linkComoChegar(m.end + ', ' + m.cidade)}" target="_blank" rel="noopener noreferrer">Como chegar</a>`)
            .addTo(camadaMonumentos);
    });

    const grupo = document.querySelector('#mapa-rotas .btn-group');
    const chave = document.createElement('div');
    chave.className = 'form-check form-switch d-inline-block mt-3 text-start';
    chave.innerHTML = '<input class="form-check-input" type="checkbox" role="switch" id="chkMonumentos">' +
        '<label class="form-check-label" for="chkMonumentos">Mostrar os 10 monumentos históricos (círculos coloridos)</label>';
    grupo.after(document.createElement('br'), chave);
    chave.querySelector('input').addEventListener('change', e => {
        e.target.checked ? camadaMonumentos.addTo(map) : map.removeLayer(camadaMonumentos);
    });
}

// ----- Card ↔ marcador e "Como chegar" nos cards -----
function configurarCardsEspacos() {
    const lista = document.getElementById('lista-espacos');
    if (!lista) return;

    lista.querySelectorAll('.card-item').forEach(item => {
        const card = item.querySelector('.card');
        card.style.cursor = 'pointer';
        card.tabIndex = 0;
        card.setAttribute('role', 'button');
        card.title = 'Ver no mapa';

        const endereco = item.querySelector('.bi-geo-alt')?.parentElement.textContent.trim();
        const cidade = item.querySelector('.badge')?.textContent.trim();
        const site = item.querySelector('a.btn');
        if (endereco && site) {
            const rota = document.createElement('a');
            rota.href = linkComoChegar(`${endereco}, ${cidade}`);
            rota.target = '_blank'; rota.rel = 'noopener noreferrer';
            rota.className = 'btn btn-outline-secondary btn-sm rounded-pill w-100 mb-2';
            rota.innerHTML = '<i class="bi bi-signpost-split me-1"></i>Como chegar';
            site.before(rota);
        }
    });

    const abrirNoMapa = card => {
        const titulo = normalizar(card.querySelector('.card-title').textContent);
        const chave = Object.keys(marcadoresRota).find(k => titulo.includes(k));
        if (!chave || !map) return;
        document.getElementById('mapa-rotas').scrollIntoView({ behavior: 'smooth', block: 'start' });
        map.setView(marcadoresRota[chave].getLatLng(), 15, { animate: true });
        marcadoresRota[chave].openPopup();
    };

    lista.addEventListener('click', e => {
        if (e.target.closest('a')) return;
        const card = e.target.closest('.card-item .card');
        if (card) abrirNoMapa(card);
    });
    lista.addEventListener('keydown', e => {
        if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('.card-item .card')) { e.preventDefault(); abrirNoMapa(e.target); }
    });
}

// =========================================================
// 5. INICIALIZAÇÃO
// =========================================================
window.addEventListener('load', () => {
    // Garante o tema mesmo se o <script> do <head> não tiver sido adicionado
    if (!document.documentElement.dataset.temaAplicado) {
        const salvo = localStorage.getItem('theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        document.documentElement.setAttribute('data-bs-theme', salvo);
    }
    atualizarBotaoTema();
    aplicarFotos();

    // Página de monumentos
    if (document.getElementById('lista-monumentos')) {
        atualizarContadores();
        criarBusca();
        tornarCardsAcessiveis();
        criarLinhaDoTempo();
        aplicarFiltroMonumentos();
    }

    // Página de rotas
    const mapaEl = document.getElementById('map');
    if (mapaEl && typeof L !== 'undefined') {
        map = L.map('map').setView([-23.6650, -46.5500], 12);
        camadaAtual = L.layerGroup().addTo(map);
        atualizarEstiloMapa();
        criarCamadaMonumentos();
        configurarCardsEspacos();
        carregarRota('santo_andre', document.querySelector('#mapa-rotas .btn-group .btn'));
    }
});
