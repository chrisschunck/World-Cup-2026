/* ---------- Utilidades ---------- */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

function initials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .map(p => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

const FLAGS = {
  'França': '🇫🇷', 'Argentina': '🇦🇷', 'Inglaterra': '🏴', 'Noruega': '🇳🇴',
  'Espanha': '🇪🇸', 'Senegal': '🇸🇳', 'México': '🇲🇽', 'Brasil': '🇧🇷',
  'Alemanha': '🇩🇪', 'Suíça': '🇨🇭', 'Bélgica': '🇧🇪', 'Países Baixos': '🇳🇱',
  'Nova Zelândia': '🇳🇿', 'Estados Unidos': '🇺🇸', 'Marrocos': '🇲🇦', 'Canadá': '🇨🇦',
  'Portugal': '🇵🇹', 'Colômbia': '🇨🇴', 'Costa do Marfim': '🇨🇮', 'Bósnia e Herzegovina': '🇧🇦',
  'Áustria': '🇦🇹', 'Suécia': '🇸🇪', 'Japão': '🇯🇵', 'Egito': '🇪🇬', 'Argélia': '🇩🇿',
  'Irã': '🇮🇷', 'Uruguai': '🇺🇾', 'RD Congo': '🇨🇩', 'Croácia': '🇭🇷',
  'Curaçao': '🇨🇼', 'Equador': '🇪🇨', 'Coreia do Sul': '🇰🇷', 'Austrália': '🇦🇺',
  'Gana': '🇬🇭', 'Tunísia': '🇹🇳', 'Cabo Verde': '🇨🇻', 'Jordânia': '🇯🇴',
  'Uzbequistão': '🇺🇿', 'Paraguai': '🇵🇾', 'Panamá': '🇵🇦', 'Haiti': '🇭🇹',
  'Arábia Saudita': '🇸🇦', 'Catar': '🇶🇦', 'Escócia': '🏴', 'Turquia': '🇹🇷',
  'Tchéquia': '🇨🇿', 'África do Sul': '🇿🇦', 'Iraque': '🇮🇶'
};
function flag(team) { return FLAGS[team] || '🏳️'; }

/* =========================================================
   1. ARTILHARIA — fetch profile.json (Golden Boot real, Goal.com)
   ========================================================= */
let scorersData = [];

async function loadScorers() {
  try {
    const res = await fetch('profile.json');
    if (!res.ok) throw new Error('Falha ao carregar profile.json');
    scorersData = await res.json();
  } catch (err) {
    console.error(err);
    scorersData = [];
  }
  renderScorers();
}

function renderScorers() {
  const term = ($('#scorerSearch')?.value || '').trim().toLowerCase();

  const list = scorersData
    .filter(p => p.jogador.toLowerCase().includes(term) || p.selecao.toLowerCase().includes(term))
    .sort((a, b) => b.gols - a.gols);

  renderPodium(list.slice(0, 3));
  renderScorersTable(list);
}

function renderPodium(top3) {
  const el = $('#scorersPodium');
  if (!el) return;
  if (top3.length < 3) { el.innerHTML = ''; return; }

  const order = [top3[1], top3[0], top3[2]];
  const ranks = [2, 1, 3];

  el.innerHTML = order.map((p, i) => `
    <div class="podium__card podium__card--${ranks[i]}">
      <span class="podium__rank">#${ranks[i]}</span>
      <div class="podium__avatar">
        <img src="${p.foto}" alt="${p.jogador}">
      </div>
      <p class="podium__name">${p.jogador}</p>
      <p class="podium__team">${flag(p.selecao)} ${p.selecao}</p>
      <p class="podium__goals">${p.gols} gols</p>
    </div>
  `).join('');
}

function renderScorersTable(list) {
  const body = $('#scorersBody');
  const empty = $('#scorersEmpty');
  if (!body) return;

  if (list.length === 0) {
    body.innerHTML = '';
    empty?.classList.remove('hidden');
    return;
  }
  empty?.classList.add('hidden');

  body.innerHTML = list.map((p, i) => `
    <tr>
      <td class="rank-cell">${i + 1}</td>
      <td>
        <div class="avatar-cell">
        <div class="score_table">
        <img src="${p.foto}" alt="${p.jogador}">
      </div>
          <span>${p.jogador}</span>
        </div>
      </td>
      <td>${flag(p.selecao)} ${p.selecao}</td>
      <td class="text-center stat-gold">${p.gols}</td>
    </tr>
  `).join('');
}

$('#scorerSearch')?.addEventListener('input', renderScorers);

/* =========================================================
   2. JOGOS — resultados reais da Copa do Mundo 2026
   Fontes: FIFA.com, ESPN, CBS Sports, Yahoo Sports, Goal.com
   ========================================================= */
const matchesData = [
  // Fase de Grupos
  { fase: 'Fase de Grupos', casa: 'México', fora: 'África do Sul', golsCasa: 2, golsFora: 0, data: '11 Jun', local: 'Estádio Azteca, Cidade do México' },
  { fase: 'Fase de Grupos', casa: 'Brasil', fora: 'Marrocos', golsCasa: 1, golsFora: 1, data: '13 Jun', local: 'New York/New Jersey Stadium' },
  { fase: 'Fase de Grupos', casa: 'Argentina', fora: 'Argélia', golsCasa: 3, golsFora: 0, data: '14 Jun', local: 'EUA' },
  { fase: 'Fase de Grupos', casa: 'Espanha', fora: 'Arábia Saudita', golsCasa: 4, golsFora: 0, data: '17 Jun', local: 'EUA' },
  { fase: 'Fase de Grupos', casa: 'Alemanha', fora: 'Curaçao', golsCasa: 7, golsFora: 1, data: '18 Jun', local: 'EUA' },
  { fase: 'Fase de Grupos', casa: 'Brasil', fora: 'Haiti', golsCasa: 3, golsFora: 0, data: '20 Jun', local: 'Philadelphia Stadium' },
  { fase: 'Fase de Grupos', casa: 'Noruega', fora: 'Senegal', golsCasa: 3, golsFora: 2, data: '23 Jun', local: 'New York/New Jersey Stadium' },
  { fase: 'Fase de Grupos', casa: 'Escócia', fora: 'Brasil', golsCasa: 0, golsFora: 3, data: '24 Jun', local: 'Miami Stadium' },

  // Round of 32
  { fase: 'Round of 32', casa: 'Canadá', fora: 'África do Sul', golsCasa: 1, golsFora: 0, data: '28 Jun', local: 'Los Angeles Stadium', pens: null },
  { fase: 'Round of 32', casa: 'Brasil', fora: 'Japão', golsCasa: 2, golsFora: 1, data: '29 Jun', local: 'Houston Stadium' },
  { fase: 'Round of 32', casa: 'Alemanha', fora: 'Paraguai', golsCasa: 1, golsFora: 1, data: '29 Jun', local: 'EUA', pens: '3-4', vencedorPens: 'Paraguai' },
  { fase: 'Round of 32', casa: 'Países Baixos', fora: 'Marrocos', golsCasa: 1, golsFora: 1, data: '29 Jun', local: 'EUA', pens: '2-3', vencedorPens: 'Marrocos' },
  { fase: 'Round of 32', casa: 'França', fora: 'Suécia', golsCasa: 3, golsFora: 0, data: '30 Jun', local: 'New York/New Jersey Stadium' },
  { fase: 'Round of 32', casa: 'México', fora: 'Equador', golsCasa: 2, golsFora: 0, data: '30 Jun', local: 'México' },
  { fase: 'Round of 32', casa: 'Bélgica', fora: 'Senegal', golsCasa: 3, golsFora: 2, data: '01 Jul', local: 'EUA', aet: true },
  { fase: 'Round of 32', casa: 'Espanha', fora: 'Áustria', golsCasa: 3, golsFora: 0, data: '02 Jul', local: 'EUA' },
  { fase: 'Round of 32', casa: 'Argentina', fora: 'Cabo Verde', golsCasa: 3, golsFora: 2, data: '03 Jul', local: 'EUA', aet: true },
  { fase: 'Round of 32', casa: 'Colômbia', fora: 'Gana', golsCasa: 1, golsFora: 0, data: '03 Jul', local: 'EUA' },

  // Round of 16
  { fase: 'Round of 16', casa: 'Marrocos', fora: 'Canadá', golsCasa: 3, golsFora: 0, data: '04 Jul', local: 'EUA' },
  { fase: 'Round of 16', casa: 'Noruega', fora: 'Brasil', golsCasa: 2, golsFora: 1, data: '05 Jul', local: 'New York/New Jersey Stadium' },
  { fase: 'Round of 16', casa: 'Inglaterra', fora: 'México', golsCasa: 3, golsFora: 2, data: '05 Jul', local: 'Estádio Azteca' },
  { fase: 'Round of 16', casa: 'Espanha', fora: 'Portugal', golsCasa: 1, golsFora: 0, data: '06 Jul', local: 'EUA' },
  { fase: 'Round of 16', casa: 'Argentina', fora: 'Egito', golsCasa: 3, golsFora: 2, data: '07 Jul', local: 'EUA' },

  // Quartas de Final
  { fase: 'Quartas de Final', casa: 'França', fora: 'Marrocos', golsCasa: 2, golsFora: 0, data: '09 Jul', local: 'EUA' },
  { fase: 'Quartas de Final', casa: 'Espanha', fora: 'Bélgica', golsCasa: 2, golsFora: 1, data: '10 Jul', local: 'EUA' },
  { fase: 'Quartas de Final', casa: 'Inglaterra', fora: 'Noruega', golsCasa: 2, golsFora: 1, data: '11 Jul', local: 'EUA', aet: true },
  { fase: 'Quartas de Final', casa: 'Argentina', fora: 'Suíça', golsCasa: 3, golsFora: 1, data: '11 Jul', local: 'EUA', aet: true },

  // Semifinal
  { fase: 'Semifinal', casa: 'Espanha', fora: 'França', golsCasa: 2, golsFora: 0, data: '14 Jul', local: 'AT&T Stadium, Arlington' },
  { fase: 'Semifinal', casa: 'Inglaterra', fora: 'Argentina', golsCasa: 1, golsFora: 2, data: '15 Jul', local: 'Mercedes-Benz Stadium, Atlanta' },

  // Disputa de 3º lugar e Final
  { fase: '3º Lugar', casa: 'França', fora: 'Inglaterra', golsCasa: 4, golsFora: 6, data: '18 Jul', local: 'Miami Stadium' },
  { fase: 'Final', casa: 'Espanha', fora: 'Argentina', golsCasa: 1, golsFora: 0, data: '19 Jul', local: 'New York/New Jersey Stadium', aet: true, campeao: true },
];

function renderMatches(phase = 'todos') {
  const grid = $('#matchesGrid');
  if (!grid) return;

  const list = phase === 'todos' ? matchesData : matchesData.filter(m => m.fase === phase);

  grid.innerHTML = list.map(m => {
    let sub = '';
    if (m.vencedorPens) sub = `Pênaltis (${m.pens}) · ${m.vencedorPens} avança`;
    else if (m.aet) sub = 'Após prorrogação';
    const badgeText = m.campeao ? '🏆 Final' : m.fase;

    return `
    <article class="match-card">
      <div class="match-card__top">
        <span>${badgeText}</span>
        <span class="badge badge--done">Encerrado</span>
      </div>
      <div class="match-card__teams">
        <div class="match-team">
          <span class="match-team__flag">${flag(m.casa)}</span>
          <span class="match-team__name">${m.casa}</span>
        </div>
        <div class="match-score">${m.golsCasa} : ${m.golsFora}</div>
        <div class="match-team">
          <span class="match-team__flag">${flag(m.fora)}</span>
          <span class="match-team__name">${m.fora}</span>
        </div>
      </div>
      <div class="match-card__footer">
        <span>📅 ${m.data}/2026${sub ? ' · ' + sub : ''}</span>
        <span>📍 ${m.local}</span>
      </div>
    </article>
  `;
  }).join('');
}

$$('#matchTabs .tab').forEach(tab => {
  tab.addEventListener('click', () => {
    $$('#matchTabs .tab').forEach(t => t.classList.remove('tab--active'));
    tab.classList.add('tab--active');
    renderMatches(tab.dataset.phase);
  });
});

/* =========================================================
   3. ESTÁDIOS — Dados locais em JavaScript
   ========================================================= */

const STADIUMS = [
  { 
    "nome_oficial": "BMO Field",
    "nome_fifa": "Toronto Stadium",
    "cidade": "Toronto",
    "pais": "Canada",
    "capacidade": 45000,
    "link": "https://static2.gensler.com/uploads/image/65575/project_BMO_large_01_1475515240.jpg"
  },
  { 
    "nome_oficial": "BC Place",
    "nome_fifa": "BC Place Vancouver",
    "cidade": "Vancouver",
    "pais": "Canada",
    "capacidade": 54000,
    "link": "https://images.spaicelabs.com/images/flus6j8v/production/37d069f71f67b4591905dfab4aa98bb4c9703e07-2048x1360.jpg?rect=0,143,2048,1075&w=1200&h=630"
  },
  { 
    "nome_oficial": "Estadio Azteca",
    "nome_fifa": "Mexico City Stadium",
    "cidade": "Cidade do Mexico",
    "pais": "Mexico",
    "capacidade": 83000,
    "link": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Vista_a%C3%A9rea_del_Estadio_Azteca_-_2026_-_02.jpg/330px-Vista_a%C3%A9rea_del_Estadio_Azteca_-_2026_-_02.jpg?utm_source=pt.wikipedia.org&utm_campaign=parser&utm_content=thumbnail"
  },
  { 
    "nome_oficial": "Estadio Akron",
    "nome_fifa": "Guadalajara Stadium",
    "cidade": "Guadalajara",
    "pais": "Mexico",
    "capacidade": 48000,
    "link": "https://cdn.assets-casacor.tec.br/file/casacor-images-news/2026/04/estadio-akron-u0zpgeq6.webp"
  },
  { 
    "nome_oficial": "Estadio BBVA",
    "nome_fifa": "Monterrey Stadium",
    "cidade": "Monterrey",
    "pais": "Mexico",
    "capacidade": 53500,
    "link": "https://upload.wikimedia.org/wikipedia/commons/5/57/Mexico_Guadalupe_Monterrey_Estadio_BBVA_Bancomer_fifa_world_cup_2026_6.JPG?utm_source=pt.wikipedia.org&utm_campaign=index&utm_content=original"
  },
  { 
    "nome_oficial": "MetLife Stadium",
    "nome_fifa": "New York New Jersey Stadium",
    "cidade": "East Rutherford",
    "pais": "Estados Unidos",
    "capacidade": 82500,
    "link": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwa6tXGQ-4H-ZdtXHX4G8SKbbI0Eo32TYM_Qn7Ptq1fw&s"
  },
  { 
    "nome_oficial": "AT&T Stadium",
    "nome_fifa": "Dallas Stadium",
    "cidade": "Arlington",
    "pais": "Estados Unidos",
    "capacidade": 94000,
    "link": "https://www.hksinc.com/wp-content/uploads/2009/10/ATT_economic-1.jpg"
  },
  { 
    "nome_oficial": "SoFi Stadium",
    "nome_fifa": "Los Angeles Stadium",
    "cidade": "Inglewood",
    "pais": "Estados Unidos",
    "capacidade": 70000,
    "link": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThTNdIYpIT6Qw7mE7Ql3s_jtkv66U5c2AhIDx0kJqGvh2SRYWo7cWCNk0&s=10"
  },
  { 
    "nome_oficial": "Mercedes-Benz Stadium",
    "nome_fifa": "Atlanta Stadium",
    "cidade": "Atlanta",
    "pais": "Estados Unidos",
    "capacidade": 75000,
    "link": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Mercedes_Benz_Stadium_time_lapse_capture_2017-08-13.jpg/330px-Mercedes_Benz_Stadium_time_lapse_capture_2017-08-13.jpg?utm_source=pt.wikipedia.org&utm_campaign=parser&utm_content=thumbnail"
  },
  { 
    "nome_oficial": "Hard Rock Stadium",
    "nome_fifa": "Miami Stadium",
    "cidade": "Miami",
    "pais": "Estados Unidos",
    "capacidade": 65000,
    "link": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/200127-H-PX819-0092.jpg/330px-200127-H-PX819-0092.jpg?utm_source=pt.wikipedia.org&utm_campaign=parser&utm_content=thumbnail"
  },
  { 
    "nome_oficial": "Gillette Stadium",
    "nome_fifa": "Boston Stadium",
    "cidade": "Foxborough",
    "pais": "Estados Unidos",
    "capacidade": 65000,
    "link": "https://upload.wikimedia.org/wikipedia/commons/d/db/Gillette_Stadium_%28Top_View%29.jpg?utm_source=pt.wikipedia.org&utm_campaign=index&utm_content=original"
  },
  { 
    "nome_oficial": "Levi's Stadium",
    "nome_fifa": "San Francisco Bay Area Stadium",
    "cidade": "Santa Clara",
    "pais": "Estados Unidos",
    "capacidade": 71000,
    "link": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS85M6cAnQoo6APf7-X-3g-_rW_94i7YhkCKtVzH38DvA&s=10"
  },
  { 
    "nome_oficial": "NRG Stadium",
    "nome_fifa": "Houston Stadium",
    "cidade": "Houston",
    "pais": "Estados Unidos",
    "capacidade": 72000,
    "link": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRw9lB-moq8aNqId4oEl0O_iurx_eKNp5zJx_5DFKJCBi5MTBtwlrApUocc&s=10"
  },
  { 
    "nome_oficial": "GEHA Field at Arrowhead Stadium",
    "nome_fifa": "Kansas City Stadium",
    "cidade": "Kansas City",
    "pais": "Estados Unidos",
    "capacidade": 73000,
    "link": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTn_H7AmYYtfcN7my7h47yEiHT2p_eZRHqldjPLSoez8g&s=10"
  },
  { 
    "nome_oficial": "Lincoln Financial Field",
    "nome_fifa": "Philadelphia Stadium",
    "cidade": "Philadelphia",
    "pais": "Estados Unidos",
    "capacidade": 69000,
    "link": "https://upload.wikimedia.org/wikipedia/commons/a/a1/Lincoln_Financial_Field_%28Aerial_view%29.jpg?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original"
  },
  { 
    "nome_oficial": "Lumen Field",
    "nome_fifa": "Seattle Stadium",
    "cidade": "Seattle",
    "pais": "Estados Unidos",
    "capacidade": 69000,
    "link": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZzPaw4Q1CWGalyUZ514DrU6JZZWoymLph_AknkMxMeKg8tNjCgxVjmyVr&s=10"
  }
];

let stadiumsData = [...STADIUMS];

function renderStadiums() {
  const grid = $('#stadiumsGrid');
  const empty = $('#stadiumsEmpty');
  if (!grid) return;

  const term = ($('#stadiumSearch')?.value || '').trim().toLowerCase();

  const list = stadiumsData.filter(s =>
    s.nome_oficial.toLowerCase().includes(term) ||
    s.nome_fifa.toLowerCase().includes(term) ||
    s.cidade.toLowerCase().includes(term) ||
    s.pais.toLowerCase().includes(term)
  );

  if (list.length === 0) {
    grid.innerHTML = '';
    empty?.classList.remove('hidden');
    return;
  }
  empty?.classList.add('hidden');

  const countryFlags = { 'Canada': '🇨🇦', 'Mexico': '🇲🇽', 'Estados Unidos': '🇺🇸' };

  grid.innerHTML = list.map(s => {
    let badgeText = '';
    if (s.nome_oficial === 'MetLife Stadium') badgeText = 'Palco da Grande Final';
    else if (s.nome_oficial === 'Estadio Azteca') badgeText = 'Jogo de Abertura';

    return `
      <article class="stadium-card">
        <div class="stadium__photo">
          <img src="${s.link}" alt="${s.nome_oficial}" onerror="this.style.display='none'">
        </div>
        
        <h4 class="stadium-card__title">
          <a href="${s.link}" target="_blank" rel="noopener noreferrer" style="text-decoration: none; color: inherit;">
            ${s.nome_oficial}
          </a>
        </h4>
        
        <p class="stadium-card__location">
          ${countryFlags[s.pais] || '🏳️'} ${s.cidade}, ${s.pais} <br>
          <small style="opacity: 0.7;">FIFA: ${s.nome_fifa}</small>
        </p>
        
        <p class="stadium-card__capacity">Capacidade: ~${s.capacidade.toLocaleString('pt-BR')} lugares</p>
        <hr>
        <hr>
        <br>
        
        ${badgeText ? `<span class="stadium-card__tag">${badgeText}</span>` : ''}
      </article>
    `;
  }).join('');
}

$('#stadiumSearch')?.addEventListener('input', renderStadiums);

/* =========================================================
   4. TABELA — classificação final real dos 12 grupos
   ========================================================= */
const groupsData = {
  A: [
    { time: 'México', pts: 9, sg: 6, status: 'Campeão do grupo' },
    { time: 'África do Sul', pts: 4, sg: -1, status: 'Vice-campeão' },
    { time: 'Coreia do Sul', pts: 3, sg: -1, status: 'Eliminado' },
    { time: 'Tchéquia', pts: 1, sg: -4, status: 'Eliminado' },
  ],
  B: [
    { time: 'Suíça', pts: 7, sg: 4, status: 'Campeão do grupo' },
    { time: 'Canadá', pts: 4, sg: 5, status: 'Vice-campeão' },
    { time: 'Bósnia e Herzegovina', pts: 4, sg: -1, status: 'Classificado (3º lugar)' },
    { time: 'Catar', pts: 1, sg: -8, status: 'Eliminado' },
  ],
  C: [
    { time: 'Brasil', pts: 7, sg: 6, status: 'Campeão do grupo' },
    { time: 'Marrocos', pts: 7, sg: 3, status: 'Vice-campeão' },
    { time: 'Escócia', pts: 3, sg: -3, status: 'Eliminado' },
    { time: 'Haiti', pts: 0, sg: -6, status: 'Eliminado' },
  ],
  D: [
    { time: 'Estados Unidos', pts: 6, sg: 4, status: 'Campeão do grupo' },
    { time: 'Austrália', pts: 4, sg: 0, status: 'Vice-campeão' },
    { time: 'Paraguai', pts: 4, sg: -2, status: 'Classificado (3º lugar)' },
    { time: 'Turquia', pts: 3, sg: -2, status: 'Eliminado' },
  ],
  E: [
    { time: 'Alemanha', pts: 6, sg: 6, status: 'Campeão do grupo' },
    { time: 'Costa do Marfim', pts: 6, sg: 2, status: 'Vice-campeão' },
    { time: 'Equador', pts: 4, sg: 0, status: 'Classificado (3º lugar)' },
    { time: 'Curaçao', pts: 1, sg: -8, status: 'Eliminado' },
  ],
  F: [
    { time: 'Países Baixos', pts: 7, sg: 6, status: 'Campeão do grupo' },
    { time: 'Japão', pts: 5, sg: 4, status: 'Vice-campeão' },
    { time: 'Suécia', pts: 4, sg: 0, status: 'Classificado (3º lugar)' },
    { time: 'Tunísia', pts: 0, sg: -10, status: 'Eliminado' },
  ],
  G: [
    { time: 'Bélgica', pts: 5, sg: 3, status: 'Campeão do grupo' },
    { time: 'Egito', pts: 5, sg: 2, status: 'Vice-campeão' },
    { time: 'Irã', pts: 3, sg: 0, status: 'Eliminado' },
    { time: 'Nova Zelândia', pts: 1, sg: -5, status: 'Eliminado' },
  ],
  H: [
    { time: 'Espanha', pts: 7, sg: 5, status: 'Campeão do grupo' },
    { time: 'Cabo Verde', pts: 3, sg: 0, status: 'Vice-campeão' },
    { time: 'Uruguai', pts: 2, sg: -1, status: 'Eliminado' },
    { time: 'Arábia Saudita', pts: 1, sg: -4, status: 'Eliminado' },
  ],
  I: [
    { time: 'França', pts: 9, sg: 8, status: 'Campeão do grupo' },
    { time: 'Noruega', pts: 6, sg: 1, status: 'Vice-campeão' },
    { time: 'Senegal', pts: 0, sg: -3, status: 'Eliminado' },
    { time: 'Iraque', pts: 0, sg: -6, status: 'Eliminado' },
  ],
  J: [
    { time: 'Argentina', pts: 9, sg: 7, status: 'Campeão do grupo' },
    { time: 'Áustria', pts: 4, sg: 0, status: 'Vice-campeão' },
    { time: 'Argélia', pts: 4, sg: -2, status: 'Classificado (3º lugar)' },
    { time: 'Jordânia', pts: 0, sg: -5, status: 'Eliminado' },
  ],
  K: [
    { time: 'Colômbia', pts: 6, sg: 3, status: 'Campeão do grupo' },
    { time: 'Portugal', pts: 4, sg: 5, status: 'Vice-campeão' },
    { time: 'RD Congo', pts: 4, sg: 1, status: 'Classificado (3º lugar)' },
    { time: 'Uzbequistão', pts: 0, sg: -7, status: 'Eliminado' },
  ],
  L: [
    { time: 'Inglaterra', pts: 7, sg: 4, status: 'Campeão do grupo' },
    { time: 'Croácia', pts: 6, sg: 0, status: 'Vice-campeão' },
    { time: 'Gana', pts: 4, sg: 0, status: 'Classificado (3º lugar)' },
    { time: 'Panamá', pts: 0, sg: -4, status: 'Eliminado' },
  ],
};

let currentGroup = 'A';

function renderGroupSelect() {
  const el = $('#groupSelect');
  if (!el) return;
  el.innerHTML = Object.keys(groupsData).map(g => `
    <button class="${g === currentGroup ? 'active' : ''}" data-group="${g}">${g}</button>
  `).join('');

  $$('#groupSelect button').forEach(btn => {
    btn.addEventListener('click', () => {
      currentGroup = btn.dataset.group;
      $$('#groupSelect button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderStandings();
    });
  });
}

function renderStandings() {
  const body = $('#standingsBody');
  if (!body) return;

  const teams = [...groupsData[currentGroup]].sort((a, b) => b.pts - a.pts || b.sg - a.sg);

  body.innerHTML = teams.map(t => `
    <tr class="${t.status.includes('lugar') || t.status.includes('campeão') ? 'qualified' : ''}">
      <td>${flag(t.time)} ${t.time}</td>
      <td class="text-center stat-gold">${t.pts}</td>
      <td class="text-center">${t.sg > 0 ? '+' : ''}${t.sg}</td>
      <td class="text-center status-cell">${t.status}</td>
    </tr>
  `).join('');
}

/* =========================================================
   5. NAV — menu mobile, back to top
   ========================================================= */
const navToggle = $('#navToggle');
const nav = $('#nav');

navToggle?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

$$('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
  });
});

const backToTop = $('#backToTop');
window.addEventListener('scroll', () => {
  backToTop?.classList.toggle('visible', window.scrollY > 500);
});
backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* =========================================================
   INIT
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  loadScorers(); 
  renderStadiums(); 
  renderMatches();
  renderGroupSelect();
  renderStandings();
});
