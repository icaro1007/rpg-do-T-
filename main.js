let deckJ1 = []; let maoJ1 = [];
let deckJ2 = []; let maoJ2 = [];
let turnoAtivo = 1; 
let jogoIniciado = false;
let faseAbertura = false;      // 🆕 fase de jogada simultânea antes do 1º turno
let aberturaEscolhaJ1 = null;  // 🆕 id da carta que o jogador escolheu pra abertura
let aberturaEscolhaJ2 = null;  // 🆕 id da carta que o oponente escolheu pra abertura
let ultimaCartaOponente = null; 
let ultimaCartaJogador = null;  
let ctrlV = {}; 
let bonusUnidao = {}; // Guarda apenas a parcela variável que cada Unidão copiou dos aliados
let goblinJaAtacouNesteTurno = {}; // Registra se o Goblin já fez o primeiro ataque da rodada
let goblinAtaquesGanhos = {};      // Guarda quais Goblins específicos ganharam o ataque extra
let ultimoIdQueAtacou = null;      // Guarda o ID da última carta que desferiu um ataque
let viajantesJaUsaram = {};        // idUnico -> true: a Passiva do Viajante do Tempo é 1 vez só
let suportePreparado = null; // Guarda o nome da arma engatilhada
let idItemNaMao = null;      // Guarda o ID da carta na mão para destruí-la depois
let modoAtaque = false;      // 🩹 CORREÇÃO: faltava declarar (causava ReferenceError antes do 1º passarTurno)
let danoPreparado = 0;       // 🩹 CORREÇÃO: idem
let modoAtaqueInimigo = false; // 🩹 CORREÇÃO: idem
let danoInimigoPreparado = 0;  // 🩹 CORREÇÃO: idem
let modoRouboGoblin = false;
let idGoblinLadrao = null;
let faseRouboGoblin = 1; // 1 = escolhendo a carta inimiga pra roubar, 2 = escolhendo a carta aliada que recebe o dano
let bloqueioNecro = {}; // Guarda as cartas do Necromante e quantos turnos faltam para liberar
let pocaoVeluxAtiva = {}; // Guarda quais cartas beberam a Velux nesta rodada
let modoTraicao = false;
let idTraidor = null;
let escudoGuerreiro = {}; // Guarda quais Guerreiros estão com o escudo ativo
let modoAlvoBarril = false;
let modoAlvoBarrilInimigo = false;
let idBarrilAtivo = null;
let alvosDoBarril = {}; // Guarda { idDoBarril: idDoAlvo }
let barrilJaImpactou = {}; // Guarda { idDoBarril: true } se já deu o dano de impacto
let lancamentosBarrilGoblinEmCurso = {}; // segura os marcadores até o barril terminar de cair
let pulsosBarrilGoblinPendentes = {}; // lembra o primeiro ataque caso ele aconteça durante o voo
let modoEspecialBarrilGoblin = false; // 📦 Especial do Barril de Goblin acionado ANTES de atacar (escolhe alvo e já ataca+rola)
let modoAlvoBarrilBarbaro = false;
let modoAlvoBarrilBarbaroInimigo = false;
let splashBarbaroAtivo = {}; // objeto por ID (idUnico do Barril) — evita vazar o splash entre 2 Barris de Bárbaro em campo ao mesmo tempo
let barrilBarbaroEmAnimacao = false; // impede outra ação enquanto o Barril ainda está rolando até o alvo
let modoAlvoCavaleiro = false;        // Aguardando o jogador clicar no alvo principal do Cavaleiro das Trevas
let modoAlvoCavaleiroInimigo = false; // Idem, do lado do oponente/bot
let idCavaleiroAtivo = null;          // Guarda o idUnico do Cavaleiro que está atacando
var modoProtecaoBarril = false;
var modoProtecaoBarrilInimigo = false;
var idBarrilProtetor = null;
var cartasProtegidas = {}; // Guarda quem está sendo protegido por qual Barril
let modoBruxoTransformar = false;
let modoBruxoRoubar = false;
let idBruxoAtivo = null;
let modoGeloSimples = false;
let idPocaoAtiva = null; 
let duracaoGelo = {}; // Guarda quem está congelado e por quantas passagens de turno
let passagemAutomaticaGeloPendente = null; // evita um passe atrasado trocar dois turnos de uma vez
let alvosDoBumerangue = {}; // Guarda a lista de quem o bumerangue bateu: { idBume: ['alvo1', 'alvo2'] }
let trajetosVisuaisBumerangue = {}; // pontos percorridos na ida, reutilizados quando o especial manda o bumerangue voltar
let geloBumerskeletonAtivos = {}; // mantém os fragmentos ligados somente ao gelo causado pelo Bumerskeleton
let timersFogoBumerskeleton = {}; // permite renovar o fogo visual sem um temporizador antigo apagá-lo cedo
let modoEspecialBumerskeleton = false; // 🪃 Especial do Bumerskeleton acionado ANTES de atacar
let idBumerskeletonEspecialAtivo = null;
let tabelaDanoBumerangue = [1, 2, 4, 4, 4, 4, 4, 4, 4, 4]; // Escala pela ORDEM do golpe na cadeia: 1º alvo leva 1, 2º leva 2, do 3º em diante 4 cada (teto pra não ficar forte demais)
let cartasCongeladas = {}; // Registra quais cartas estão sob o efeito de gelo do bumerangue
let cavalosDeTroiaAtivos = {}; // idUnico -> passagens de turno restantes até explodir (2 rodadas = 4 passagens, 1 rodada = vez de cada jogador)
let incendiarioCiclo = {}; // idUnico -> fase atual (1=joga pólvora, 2 e 3=queima 1 dano cada, 4=parado, depois volta pra 1)
let incendiarioAlvos = {}; // idUnico -> lista de IDs das cartas inimigas que receberam a pólvora nesse ciclo
let incendiarioFasesVisuais = {}; // acompanha a fase já aplicada para manter pólvora/fogo visíveis mesmo entre turnos
let modoTransformacaoIcaro = false; // aguardando clique na carta que vai virar outra
let idIcaroAtivo = null;
let modoAjusteThiago = false; // aguardando clique na carta que vai ter um atributo ajustado em ±1
let idThiagoAtivo = null;
let fogueiraTicks = { j1: [], j2: [] }; // cada Fogueira ativa guarda quantas passagens de turno faltam pra 2ª cura
let parceriaSeparado = {}; // idSeparado -> idParceiro (carta que "junta" pra atacar com ele)
let modoParceriaSeparado = false; // aguardando clique na carta aliada que vai virar parceira
let idSeparadoParceriaAtivo = null;
let separadaoDividido = {}; // idSeparado -> quantos ataques da dupla ainda faltam (habilidade dado 6)
let modoPrenderNoTempo = false; // aguardando clique na carta inimiga que vai ficar presa no tempo
let idPrenderNoTempoAtivo = null;
let portableDuracao = {}; // idUnico -> passagens de turno restantes até a bateria acabar (2 rodadas = 4 passagens)
let ladraoUsosPorLado = { j1: 0, j2: 0 }; // zera a cada passagem de turno — 1 uso da passiva do Ladrão por turno, por lado
let cemiterio = { j1: [], j2: [] }; // guarda as cartas mortas de cada lado, prontas pra Reviverta trazer de volta
let revivertaPendente = null; // { idItem, ehAliado } enquanto o cemitério está aberto aguardando escolha
let crackerPendente = null; // { idItem, ehAliado } enquanto a tela de roubo do Cracker está aberta aguardando escolha
let buffsAllsforms = {}; // idUnico -> array de { bonus, restam } — restam em passagens de turno (1 rodada = 2 passagens)
let dupliquetionPendente = null; // { idItem, ehAliado } enquanto a tela de escolha da Dupliquetion está aberta
let modoAlvoVenenoMago = false; // aguardando o Mago escolher uma carta do lado oposto
let idMagoVenenoAtivo = null;
let venenosMago = {}; // idEfeito -> { idMago, idAlvo, restam }; um mesmo Mago pode manter vários alvos
let proximoIdVenenoMago = 1;

// 🚨 NOVIDADE: A lista de suportes/poções agora fica no topo do código!
let suportesReais = [
    "besta", "recuperida", "velux", "pocaotraicao", 
    "adiv", "pocaogelo", "escudo_item", "cavalotroia", "fogueira", "vampi7", "portable", "plus_life", "reviverta", "cracker", "allsforms", "dupliquetion", "auvex",
];

function ativarEfeitoVelocidade(idUnico) {
    let carta = document.getElementById("pacote-" + idUnico);
    if (!carta) return;

    carta.classList.add("com-velocidade-extra");

    let efeito = carta.querySelector(":scope > .efeito-velocidade-extra");
    if (!efeito) {
        efeito = document.createElement("span");
        efeito.className = "efeito-velocidade-extra";
        efeito.setAttribute("aria-hidden", "true");

        for (let i = 0; i < 6; i++) {
            let rastro = document.createElement("i");
            rastro.className = "rastro-velocidade rastro-velocidade-" + (i + 1);
            efeito.appendChild(rastro);
        }

        carta.appendChild(efeito);
    }

    // Reinicia o clarão sempre que a carta recebe uma nova carga de velocidade.
    efeito.classList.remove("velocidade-acabou-de-ativar");
    void efeito.offsetWidth;
    efeito.classList.add("velocidade-acabou-de-ativar");
}

function removerEfeitoVelocidade(idUnico) {
    let carta = document.getElementById("pacote-" + idUnico);
    if (!carta) return;

    carta.classList.remove("com-velocidade-extra");
    let efeito = carta.querySelector(":scope > .efeito-velocidade-extra");
    if (efeito) efeito.remove();
}

let origensTransformacaoOrk = {};

function guardarOrigemTransformacaoOrk(nomeCarta, idUnico, pacoteCarta) {
    if (nomeCarta !== "Ork" || !pacoteCarta) return;

    let retangulo = pacoteCarta.getBoundingClientRect();
    let imagem = pacoteCarta.querySelector("img");
    origensTransformacaoOrk[idUnico] = {
        left: retangulo.left,
        top: retangulo.top,
        width: retangulo.width,
        height: retangulo.height,
        imagem: imagem ? imagem.src : "ork.png"
    };
}

function animarTransformacaoOrk(idUnico, goblinsInvocados) {
    let origem = origensTransformacaoOrk[idUnico];
    delete origensTransformacaoOrk[idUnico];
    if (!origem) return;

    let centroX = origem.left + origem.width / 2;
    let centroY = origem.top + origem.height / 2;
    let fantasma = document.createElement("span");
    fantasma.className = "transformacao-ork-origem";
    fantasma.setAttribute("aria-hidden", "true");
    fantasma.style.left = origem.left + "px";
    fantasma.style.top = origem.top + "px";
    fantasma.style.width = origem.width + "px";
    fantasma.style.height = origem.height + "px";

    let imagemOrk = document.createElement("img");
    imagemOrk.className = "imagem-ork-transformando";
    imagemOrk.src = origem.imagem;
    imagemOrk.alt = "";
    fantasma.appendChild(imagemOrk);

    for (let i = 0; i < 8; i++) {
        let particula = document.createElement("i");
        particula.className = "particula-transformacao-ork";
        particula.style.setProperty("--ork-particula-x", ((i % 4) * 24 - 36) + "px");
        particula.style.setProperty("--ork-particula-y", (i < 4 ? -42 - i * 5 : 34 + (i - 4) * 5) + "px");
        particula.style.animationDelay = (i * 0.035) + "s";
        fantasma.appendChild(particula);
    }

    document.body.appendChild(fantasma);

    goblinsInvocados.forEach((goblin, indice) => {
        if (!goblin) return;
        let destino = goblin.getBoundingClientRect();
        let destinoX = destino.left + destino.width / 2;
        let destinoY = destino.top + destino.height / 2;
        goblin.style.setProperty("--ork-origem-x", (centroX - destinoX) + "px");
        goblin.style.setProperty("--ork-origem-y", (centroY - destinoY) + "px");
        goblin.style.setProperty("--ork-atraso", (0.12 + indice * 0.1) + "s");
        goblin.classList.add("goblin-nascido-do-ork");

        setTimeout(() => {
            goblin.classList.remove("goblin-nascido-do-ork");
            goblin.style.removeProperty("--ork-origem-x");
            goblin.style.removeProperty("--ork-origem-y");
            goblin.style.removeProperty("--ork-atraso");
        }, 1450);
    });

    setTimeout(() => {
        if (fantasma.parentNode) fantasma.remove();
    }, 1150);
}

function criarFantasmaAlvoBruxo(pacoteAlvo, tipo) {
    if (!pacoteAlvo) return null;

    let retangulo = pacoteAlvo.getBoundingClientRect();
    let fantasma = pacoteAlvo.cloneNode(true);
    fantasma.removeAttribute("id");
    fantasma.querySelectorAll("[id]").forEach(elemento => elemento.removeAttribute("id"));
    fantasma.querySelectorAll("button").forEach(botao => botao.remove());
    fantasma.querySelectorAll("[onclick]").forEach(elemento => elemento.removeAttribute("onclick"));
    fantasma.classList.add("fantasma-alvo-bruxo", tipo === "roubar" ? "alvo-roubado-bruxo" : "alvo-transmutado-bruxo");
    fantasma.style.left = retangulo.left + "px";
    fantasma.style.top = retangulo.top + "px";
    fantasma.style.width = retangulo.width + "px";
    fantasma.style.height = retangulo.height + "px";
    document.body.appendChild(fantasma);

    setTimeout(() => {
        if (fantasma.parentNode) fantasma.remove();
    }, 1250);

    return {
        left: retangulo.left,
        top: retangulo.top,
        width: retangulo.width,
        height: retangulo.height
    };
}

function animarPocaoBruxo(idBruxo, idAlvo, tipo) {
    let bruxo = document.getElementById("pacote-" + idBruxo);
    let alvo = document.getElementById("pacote-" + idAlvo);
    if (!bruxo || !alvo) return null;

    let retanguloBruxo = bruxo.getBoundingClientRect();
    let retanguloAlvo = alvo.getBoundingClientRect();
    let inicioX = retanguloBruxo.left + retanguloBruxo.width / 2;
    let inicioY = retanguloBruxo.top + retanguloBruxo.height / 2;
    let distanciaX = (retanguloAlvo.left + retanguloAlvo.width / 2) - inicioX;
    let distanciaY = (retanguloAlvo.top + retanguloAlvo.height / 2) - inicioY;
    let origemAlvo = criarFantasmaAlvoBruxo(alvo, tipo);

    let frasco = document.createElement("span");
    frasco.className = "pocao-lancada-bruxo " + (tipo === "roubar" ? "pocao-dominacao-bruxo" : "pocao-polimorfia-bruxo");
    frasco.textContent = "🧪";
    frasco.dataset.simbolo = tipo === "roubar" ? "✦" : "↻";
    frasco.setAttribute("aria-hidden", "true");
    frasco.style.left = inicioX + "px";
    frasco.style.top = inicioY + "px";
    frasco.style.setProperty("--bruxo-pocao-x", distanciaX + "px");
    frasco.style.setProperty("--bruxo-pocao-y", distanciaY + "px");
    frasco.style.setProperty("--bruxo-pocao-meio-x", (distanciaX / 2) + "px");
    frasco.style.setProperty("--bruxo-pocao-meio-y", (distanciaY / 2 - 48) + "px");
    document.body.appendChild(frasco);

    setTimeout(() => {
        if (frasco.parentNode) frasco.remove();
    }, 1150);

    return origemAlvo;
}

function animarBruxoVirandoPocao(idBruxo) {
    let bruxo = document.getElementById("pacote-" + idBruxo);
    if (!bruxo) return;

    let retangulo = bruxo.getBoundingClientRect();
    let imagemOriginal = bruxo.querySelector("img");
    let efeito = document.createElement("span");
    efeito.className = "bruxo-virando-pocao";
    efeito.setAttribute("aria-hidden", "true");
    efeito.style.left = retangulo.left + "px";
    efeito.style.top = retangulo.top + "px";
    efeito.style.width = retangulo.width + "px";
    efeito.style.height = retangulo.height + "px";

    let imagem = document.createElement("img");
    imagem.className = "imagem-bruxo-encolhendo";
    imagem.src = imagemOriginal ? imagemOriginal.src : "bruxo.png";
    imagem.alt = "";
    efeito.appendChild(imagem);

    let pocao = document.createElement("b");
    pocao.className = "pocao-nascendo-do-bruxo";
    pocao.textContent = "🧪";
    efeito.appendChild(pocao);

    for (let i = 0; i < 6; i++) {
        let faisca = document.createElement("i");
        faisca.className = "faisca-transformacao-bruxo";
        faisca.style.setProperty("--bruxo-faisca-x", ((i % 3) * 34 - 34) + "px");
        faisca.style.setProperty("--bruxo-faisca-y", (i < 3 ? -42 - i * 6 : 35 + (i - 3) * 7) + "px");
        efeito.appendChild(faisca);
    }

    document.body.appendChild(efeito);
    setTimeout(() => {
        if (efeito.parentNode) efeito.remove();
    }, 1250);
}

function animarCartaRoubadaBruxo(cartaRoubada, origem) {
    if (!cartaRoubada || !origem) return;

    let destino = cartaRoubada.getBoundingClientRect();
    let origemX = origem.left + origem.width / 2;
    let origemY = origem.top + origem.height / 2;
    let destinoX = destino.left + destino.width / 2;
    let destinoY = destino.top + destino.height / 2;
    cartaRoubada.style.setProperty("--bruxo-roubo-x", (origemX - destinoX) + "px");
    cartaRoubada.style.setProperty("--bruxo-roubo-y", (origemY - destinoY) + "px");
    cartaRoubada.classList.add("carta-roubada-pelo-bruxo");

    setTimeout(() => {
        cartaRoubada.classList.remove("carta-roubada-pelo-bruxo");
        cartaRoubada.style.removeProperty("--bruxo-roubo-x");
        cartaRoubada.style.removeProperty("--bruxo-roubo-y");
    }, 1450);
}

function criarResiduoPolvoraIncendiario(pacote) {
    if (!pacote || pacote.querySelector(".residuo-polvora-incendiario")) return;

    let residuo = document.createElement("span");
    residuo.className = "residuo-polvora-incendiario";
    residuo.setAttribute("aria-hidden", "true");
    for (let i = 0; i < 8; i++) {
        let grao = document.createElement("i");
        grao.style.setProperty("--grao-x", (10 + ((i * 31) % 82)) + "%");
        grao.style.setProperty("--grao-y", (13 + ((i * 47) % 72)) + "%");
        grao.style.setProperty("--grao-tamanho", (2 + (i % 3)) + "px");
        residuo.appendChild(grao);
    }
    pacote.appendChild(residuo);
}

function criarChamasIncendiario(pacote) {
    if (!pacote || pacote.querySelector(".chamas-carta-incendiario")) return;

    let chamas = document.createElement("span");
    chamas.className = "chamas-carta-incendiario";
    chamas.setAttribute("aria-hidden", "true");
    for (let i = 0; i < 4; i++) {
        let chama = document.createElement("b");
        chama.textContent = "🔥";
        chama.style.setProperty("--chama-x", (9 + i * 27) + "%");
        chama.style.setProperty("--chama-atraso", (i * -0.16) + "s");
        chamas.appendChild(chama);
    }
    pacote.appendChild(chamas);
}

function definirVisualIncendiario(pacote, estado) {
    if (!pacote) return;

    if (estado === "fogo") {
        if (pacote.classList.contains("com-polvora-incendiario")) pacote.classList.remove("com-polvora-incendiario");
        if (!pacote.classList.contains("em-chamas-incendiario")) pacote.classList.add("em-chamas-incendiario");
        let residuo = pacote.querySelector(".residuo-polvora-incendiario");
        if (residuo) residuo.remove();
        criarChamasIncendiario(pacote);
        return;
    }

    if (estado === "polvora") {
        if (pacote.classList.contains("em-chamas-incendiario")) pacote.classList.remove("em-chamas-incendiario");
        if (!pacote.classList.contains("com-polvora-incendiario")) pacote.classList.add("com-polvora-incendiario");
        let chamas = pacote.querySelector(".chamas-carta-incendiario");
        if (chamas) chamas.remove();
        criarResiduoPolvoraIncendiario(pacote);
        return;
    }

    if (pacote.classList.contains("com-polvora-incendiario") || pacote.classList.contains("em-chamas-incendiario") || pacote.classList.contains("fogo-pulsando-incendiario")) {
        pacote.classList.remove("com-polvora-incendiario", "em-chamas-incendiario", "fogo-pulsando-incendiario");
    }
    let residuo = pacote.querySelector(".residuo-polvora-incendiario");
    let chamas = pacote.querySelector(".chamas-carta-incendiario");
    if (residuo) residuo.remove();
    if (chamas) chamas.remove();
}

function sincronizarVisuaisIncendiario() {
    let estadosPorAlvo = {};

    Object.keys(incendiarioAlvos).forEach(idIncendiario => {
        let fase = incendiarioFasesVisuais[idIncendiario];
        if (fase === undefined) fase = incendiarioCiclo[idIncendiario];
        let estado = fase === 1 ? "polvora" : ((fase === 2 || fase === 3) ? "fogo" : null);
        if (!estado) return;

        (incendiarioAlvos[idIncendiario] || []).forEach(idPacoteAlvo => {
            if (estado === "fogo" || !estadosPorAlvo[idPacoteAlvo]) estadosPorAlvo[idPacoteAlvo] = estado;
        });
    });

    document.querySelectorAll("#campo-j1 > div[id^='pacote-'], #campo-j2 > div[id^='pacote-']").forEach(pacote => {
        definirVisualIncendiario(pacote, estadosPorAlvo[pacote.id] || null);
    });
}

function animarSalpicoPolvoraIncendiario(idIncendiario, idsPacotesAlvo) {
    let incendiario = document.getElementById("pacote-" + idIncendiario);
    if (!incendiario) return;

    let origem = incendiario.getBoundingClientRect();
    let origemX = origem.left + origem.width / 2;
    let origemY = origem.top + origem.height * 0.42;

    (idsPacotesAlvo || []).forEach((idPacoteAlvo, indiceAlvo) => {
        let alvo = document.getElementById(idPacoteAlvo);
        if (!alvo) return;
        let destino = alvo.getBoundingClientRect();
        let destinoX = destino.left + destino.width / 2;
        let destinoY = destino.top + destino.height * 0.45;

        for (let i = 0; i < 6; i++) {
            let particula = document.createElement("i");
            particula.className = "particula-polvora-incendiario";
            particula.setAttribute("aria-hidden", "true");
            particula.style.left = origemX + "px";
            particula.style.top = origemY + "px";
            particula.style.setProperty("--polvora-x", (destinoX - origemX + ((i % 3) - 1) * 18) + "px");
            particula.style.setProperty("--polvora-y", (destinoY - origemY + (i < 3 ? -13 : 14)) + "px");
            particula.style.setProperty("--polvora-meio-x", ((destinoX - origemX) / 2) + "px");
            particula.style.setProperty("--polvora-meio-y", ((destinoY - origemY) / 2 - 38 - (i % 2) * 12) + "px");
            particula.style.setProperty("--polvora-atraso", (indiceAlvo * 0.07 + i * 0.035) + "s");
            document.body.appendChild(particula);
            setTimeout(() => {
                if (particula.parentNode) particula.remove();
            }, 1350);
        }
    });
}

function animarFogoIncendiario(idPacoteAlvo, primeiroAcendimento) {
    let pacote = document.getElementById(idPacoteAlvo);
    if (!pacote) return;

    pacote.classList.remove("fogo-pulsando-incendiario");
    void pacote.offsetWidth;
    pacote.classList.add("fogo-pulsando-incendiario");
    setTimeout(() => {
        if (pacote.isConnected) pacote.classList.remove("fogo-pulsando-incendiario");
    }, 850);

    let impacto = document.createElement("span");
    impacto.className = "inicio-fogo-incendiario" + (primeiroAcendimento ? " primeira-chama-incendiario" : " chama-continuando-incendiario");
    impacto.setAttribute("aria-hidden", "true");
    for (let i = 0; i < 7; i++) {
        let faisca = document.createElement("i");
        faisca.style.setProperty("--faisca-x", (((i % 4) - 1.5) * 24) + "px");
        faisca.style.setProperty("--faisca-y", (-28 - (i % 3) * 18) + "px");
        faisca.style.setProperty("--faisca-atraso", (i * 0.035) + "s");
        impacto.appendChild(faisca);
    }
    pacote.appendChild(impacto);
    setTimeout(() => {
        if (impacto.parentNode) impacto.remove();
    }, 1050);
}

function obterCentroVisual(elemento) {
    if (!elemento) return null;
    let retangulo = elemento.getBoundingClientRect();
    return {
        x: retangulo.left + retangulo.width / 2,
        y: retangulo.top + retangulo.height * 0.42
    };
}

// 📦 BARRIL DE GOBLINS — o visual usa a própria vida do Barril. Como cada Goblin vale
// 1 de vida e 0,25 de dano periódico, as três bolinhas sempre mostram quantos ainda vivem.
function localizarStatusDentroDaCarta(pacote, idStatus) {
    if (!pacote) return null;
    return Array.from(pacote.querySelectorAll("[id]"))
        .find(elemento => elemento.id === idStatus) || null;
}

function quantidadeGoblinsVivosBarril(idBarril) {
    let pacoteBarril = document.getElementById("pacote-" + idBarril);
    let vida = localizarStatusDentroDaCarta(pacoteBarril, "vida-" + idBarril);
    if (!vida) return 0;

    let valor = parseFloat(vida.innerText);
    if (!Number.isFinite(valor) || valor <= 0) return 0;
    return Math.max(0, Math.min(3, Math.ceil(valor)));
}

// Aplica SOMENTE o ataque periódico dos Goblins. A leitura da vida fica presa ao pacote
// correto, evitando que IDs repetidos, animações ou outro vínculo atinjam uma carta errada.
// O 0,75 mostrado no Barril já é o dano dos três Goblins (3 x 0,25), portanto só a parcela
// acima/abaixo de 0,75 é tratada como buff ou redução — ela não pode ser somada duas vezes.
function aplicarDanoPeriodicoBarrilGoblin(idBarril, idAlvo) {
    let pacoteBarril = document.getElementById("pacote-" + idBarril);
    let pacoteAlvo = document.getElementById("pacote-" + idAlvo);

    if (!pacoteBarril || !pacoteAlvo) {
        removerMarcadorBarrilGoblin(idBarril);
        delete alvosDoBarril[idBarril];
        return null;
    }

    let vidaBarrilEl = localizarStatusDentroDaCarta(pacoteBarril, "vida-" + idBarril);
    let danoBarrilEl = localizarStatusDentroDaCarta(pacoteBarril, "dano-" + idBarril);
    let vidaAlvoEl = localizarStatusDentroDaCarta(pacoteAlvo, "vida-" + idAlvo);
    if (!vidaBarrilEl || !vidaAlvoEl) return null;

    let vidaBarril = parseFloat(vidaBarrilEl.innerText);
    let vidaAlvoAntes = parseFloat(vidaAlvoEl.innerText);
    let danoAtualBarril = danoBarrilEl ? parseFloat(danoBarrilEl.innerText) : 0.75;
    if (!Number.isFinite(vidaBarril) || !Number.isFinite(vidaAlvoAntes) || !Number.isFinite(danoAtualBarril)) return null;

    let goblinsVivos = Math.max(0, Math.min(3, Math.ceil(vidaBarril)));
    let modificadorDeDano = danoAtualBarril - 0.75;
    let danoTotal = Math.max(0, Math.round(((goblinsVivos * 0.25) + modificadorDeDano) * 100) / 100);
    let novaVida = Math.max(0, Math.round((vidaAlvoAntes - danoTotal) * 100) / 100);
    let nomeExibido = pacoteAlvo.querySelector(".nome-carta") ? pacoteAlvo.querySelector(".nome-carta").innerText.trim() : "Carta";

    if (danoTotal > 0) pulsarMarcadoresBarrilGoblin(idBarril);
    vidaAlvoEl.innerText = novaVida;

    // Esta é a única condição em que o ataque dos Goblins pode remover o alvo.
    if (novaVida <= 0) {
        let nomeEfetivo = obterNomeEfetivoCarta(idAlvo, nomeExibido);
        let campoDestino = pacoteAlvo.closest("#campo-j2") ? "campo-j2" : "campo-j1";
        registrarMorte(nomeEfetivo, campoDestino === "campo-j2" ? "j2" : "j1");
        guardarOrigemTransformacaoOrk(nomeEfetivo, idAlvo, pacoteAlvo);
        pacoteAlvo.remove();
        removerMarcadorBarrilGoblin(idBarril);
        delete alvosDoBarril[idBarril];
        ativarPassivasAoMorrer(nomeEfetivo, idAlvo, campoDestino);
        return { danoTotal, novaVida, nomeAlvo: nomeExibido, destruido: true };
    }

    return { danoTotal, novaVida, nomeAlvo: nomeExibido, destruido: false };
}

function localizarMarcadorBarrilGoblin(idBarril) {
    return Array.from(document.querySelectorAll(".marcadores-goblins-barril"))
        .find(marcador => marcador.dataset.barrilId === String(idBarril)) || null;
}

function criarMarcadorBarrilGoblin(idBarril, pacoteAlvo, vivos) {
    let marcador = document.createElement("span");
    marcador.className = "marcadores-goblins-barril";
    marcador.dataset.barrilId = idBarril;
    marcador.dataset.vivos = String(vivos);
    marcador.setAttribute("aria-hidden", "true");

    for (let indice = 0; indice < 3; indice++) {
        let goblin = document.createElement("i");
        goblin.className = "bolinha-goblin-barril" + (indice < vivos ? "" : " goblin-barril-morto");
        marcador.appendChild(goblin);
    }

    pacoteAlvo.appendChild(marcador);
    return marcador;
}

function atualizarMarcadorBarrilGoblin(idBarril, pacoteAlvo, vivos, linha) {
    let marcador = localizarMarcadorBarrilGoblin(idBarril);
    if (marcador && marcador.parentElement !== pacoteAlvo) {
        marcador.remove();
        marcador = null;
    }
    if (!marcador) marcador = criarMarcadorBarrilGoblin(idBarril, pacoteAlvo, vivos);

    marcador.style.setProperty("--linha-barril-goblin", linha || 0);
    let anteriores = parseInt(marcador.dataset.vivos, 10);
    if (!Number.isFinite(anteriores)) anteriores = vivos;
    marcador.dataset.vivos = String(vivos);

    Array.from(marcador.children).forEach((bolinha, indice) => {
        if (indice < vivos) {
            bolinha.classList.remove("goblin-barril-morto", "goblin-barril-sumindo");
            return;
        }

        if (indice < anteriores) {
            bolinha.classList.remove("goblin-barril-pulsando");
            bolinha.classList.add("goblin-barril-sumindo");
            setTimeout(() => {
                if (!bolinha.isConnected || indice < parseInt(marcador.dataset.vivos, 10)) return;
                bolinha.classList.remove("goblin-barril-sumindo");
                bolinha.classList.add("goblin-barril-morto");
            }, 430);
        } else if (!bolinha.classList.contains("goblin-barril-sumindo")) {
            bolinha.classList.add("goblin-barril-morto");
        }
    });
}

function removerMarcadorBarrilGoblin(idBarril) {
    let marcador = localizarMarcadorBarrilGoblin(idBarril);
    if (marcador) marcador.remove();
    delete pulsosBarrilGoblinPendentes[idBarril];
    delete lancamentosBarrilGoblinEmCurso[idBarril];
}

function sincronizarMarcadoresBarrilGoblin() {
    let linhasPorAlvo = {};
    let idsAtivos = new Set();

    Object.keys(alvosDoBarril).forEach(idBarril => {
        idsAtivos.add(String(idBarril));
        let idAlvo = alvosDoBarril[idBarril];
        let pacoteBarril = document.getElementById("pacote-" + idBarril);
        let pacoteAlvo = document.getElementById("pacote-" + idAlvo);

        if (!pacoteBarril || !pacoteAlvo) {
            removerMarcadorBarrilGoblin(idBarril);
            delete alvosDoBarril[idBarril];
            return;
        }

        // Durante o lançamento, as bolinhas só aparecem depois que o Barril pousa.
        if (lancamentosBarrilGoblinEmCurso[idBarril]) return;

        let vivos = quantidadeGoblinsVivosBarril(idBarril);
        if (vivos <= 0) {
            removerMarcadorBarrilGoblin(idBarril);
            return;
        }

        let linha = linhasPorAlvo[idAlvo] || 0;
        linhasPorAlvo[idAlvo] = linha + 1;
        atualizarMarcadorBarrilGoblin(idBarril, pacoteAlvo, vivos, linha);
    });

    document.querySelectorAll(".marcadores-goblins-barril").forEach(marcador => {
        if (!idsAtivos.has(marcador.dataset.barrilId)) marcador.remove();
    });
}

function pulsarMarcadoresBarrilGoblin(idBarril) {
    if (lancamentosBarrilGoblinEmCurso[idBarril]) {
        pulsosBarrilGoblinPendentes[idBarril] = true;
        return;
    }

    sincronizarMarcadoresBarrilGoblin();
    let marcador = localizarMarcadorBarrilGoblin(idBarril);
    if (!marcador) return;

    let vivos = quantidadeGoblinsVivosBarril(idBarril);
    Array.from(marcador.children).slice(0, vivos).forEach((bolinha, indice) => {
        bolinha.classList.remove("goblin-barril-pulsando");
        void bolinha.offsetWidth;
        bolinha.style.setProperty("--atraso-pulso-goblin", (indice * 0.07) + "s");
        bolinha.classList.add("goblin-barril-pulsando");
        setTimeout(() => {
            if (bolinha.isConnected) bolinha.classList.remove("goblin-barril-pulsando");
        }, 720 + indice * 70);
    });
}

function animarLancamentoBarrilGoblin(idBarril, idAlvo) {
    let pacoteBarril = document.getElementById("pacote-" + idBarril);
    let pacoteAlvo = document.getElementById("pacote-" + idAlvo);
    if (!pacoteBarril || !pacoteAlvo) return;

    let origem = obterCentroVisual(pacoteBarril);
    let destino = obterCentroVisual(pacoteAlvo);
    if (!origem || !destino) return;

    lancamentosBarrilGoblinEmCurso[idBarril] = true;
    removerMarcadorBarrilGoblin(idBarril);
    lancamentosBarrilGoblinEmCurso[idBarril] = true;

    let barril = document.createElement("span");
    barril.className = "barril-goblin-lancado";
    barril.setAttribute("aria-hidden", "true");
    barril.style.left = origem.x + "px";
    barril.style.top = origem.y + "px";
    barril.style.setProperty("--barril-goblin-x", (destino.x - origem.x) + "px");
    barril.style.setProperty("--barril-goblin-y", (destino.y - origem.y) + "px");
    barril.style.setProperty("--barril-goblin-meio-x", ((destino.x - origem.x) / 2) + "px");
    barril.style.setProperty("--barril-goblin-meio-y", ((destino.y - origem.y) / 2 - 105) + "px");

    let imagemOriginal = pacoteBarril.querySelector("img");
    if (imagemOriginal) {
        let imagem = document.createElement("img");
        imagem.src = imagemOriginal.src;
        imagem.alt = "";
        barril.appendChild(imagem);
    } else {
        barril.textContent = "🛢️";
    }
    document.body.appendChild(barril);

    setTimeout(() => {
        let alvoAtual = document.getElementById("pacote-" + idAlvo);
        if (alvoAtual) {
            let impacto = document.createElement("span");
            impacto.className = "impacto-barril-goblin";
            impacto.setAttribute("aria-hidden", "true");
            for (let i = 0; i < 6; i++) {
                let poeira = document.createElement("i");
                poeira.style.setProperty("--poeira-barril-x", (((i % 3) - 1) * 30) + "px");
                poeira.style.setProperty("--poeira-barril-y", (-18 - (i % 2) * 22) + "px");
                impacto.appendChild(poeira);
            }
            alvoAtual.appendChild(impacto);
            setTimeout(() => { if (impacto.parentNode) impacto.remove(); }, 680);
        }

        delete lancamentosBarrilGoblinEmCurso[idBarril];
        sincronizarMarcadoresBarrilGoblin();
        if (pulsosBarrilGoblinPendentes[idBarril]) {
            delete pulsosBarrilGoblinPendentes[idBarril];
            setTimeout(() => pulsarMarcadoresBarrilGoblin(idBarril), 70);
        }
    }, 620);

    setTimeout(() => { if (barril.parentNode) barril.remove(); }, 880);
}

function criarVooBumerangue(origem, destino, atraso = 0, retornando = false) {
    if (!origem || !destino) return;

    let bumerangue = document.createElement("span");
    bumerangue.className = "bumerangue-voando" + (retornando ? " bumerangue-retornando" : "");
    bumerangue.textContent = "🪃";
    bumerangue.setAttribute("aria-hidden", "true");
    bumerangue.style.left = origem.x + "px";
    bumerangue.style.top = origem.y + "px";
    bumerangue.style.setProperty("--bume-x", (destino.x - origem.x) + "px");
    bumerangue.style.setProperty("--bume-y", (destino.y - origem.y) + "px");
    bumerangue.style.setProperty("--bume-meio-x", ((destino.x - origem.x) / 2) + "px");
    bumerangue.style.setProperty("--bume-meio-y", ((destino.y - origem.y) / 2 - (retornando ? 34 : 46)) + "px");
    bumerangue.style.setProperty("--bume-atraso", atraso + "s");
    document.body.appendChild(bumerangue);

    setTimeout(() => {
        if (bumerangue.parentNode) bumerangue.remove();
    }, (atraso + 0.9) * 1000);
}

function iniciarTrajetoVisualBumerangue(idBumerskeleton, idPrimeiroAlvo) {
    let bume = document.getElementById("pacote-" + idBumerskeleton);
    let primeiroAlvo = document.getElementById("pacote-" + idPrimeiroAlvo);
    let origem = obterCentroVisual(bume);
    let destino = obterCentroVisual(primeiroAlvo);

    trajetosVisuaisBumerangue[idBumerskeleton] = [];
    if (origem) trajetosVisuaisBumerangue[idBumerskeleton].push(origem);
    if (destino) trajetosVisuaisBumerangue[idBumerskeleton].push(destino);
    criarVooBumerangue(origem, destino, 0, false);

    return destino || origem;
}

function registrarRicocheteVisualBumerangue(idBumerskeleton, origem, pacoteDestino, atraso) {
    let destino = obterCentroVisual(pacoteDestino);
    if (!destino) return origem;

    if (!trajetosVisuaisBumerangue[idBumerskeleton]) trajetosVisuaisBumerangue[idBumerskeleton] = [];
    trajetosVisuaisBumerangue[idBumerskeleton].push(destino);
    criarVooBumerangue(origem, destino, atraso, false);
    return destino;
}

function animarRetornoBumerangue(idBumerskeleton) {
    let pontos = trajetosVisuaisBumerangue[idBumerskeleton] || [];
    if (pontos.length < 2) return;

    let atraso = 0;
    for (let i = pontos.length - 1; i > 0; i--) {
        criarVooBumerangue(pontos[i], pontos[i - 1], atraso, true);
        atraso += 0.34;
    }
}

function ativarFogoVisualBumerskeleton(idAlvo) {
    let pacote = document.getElementById("pacote-" + idAlvo);
    if (!pacote) return;

    pacote.classList.add("fogo-bumerskeleton");
    let chamas = pacote.querySelector(".chamas-bumerskeleton");
    if (!chamas) {
        chamas = document.createElement("span");
        chamas.className = "chamas-bumerskeleton";
        chamas.setAttribute("aria-hidden", "true");
        for (let i = 0; i < 4; i++) {
            let chama = document.createElement("b");
            chama.textContent = "🔥";
            chama.style.setProperty("--fogo-bume-x", (8 + i * 28) + "%");
            chama.style.setProperty("--fogo-bume-atraso", (i * -0.14) + "s");
            chamas.appendChild(chama);
        }
        pacote.appendChild(chamas);
    }

    pacote.classList.remove("impacto-fogo-bumerskeleton");
    void pacote.offsetWidth;
    pacote.classList.add("impacto-fogo-bumerskeleton");

    if (timersFogoBumerskeleton[idAlvo]) clearTimeout(timersFogoBumerskeleton[idAlvo]);
    timersFogoBumerskeleton[idAlvo] = setTimeout(() => {
        let cartaAtual = document.getElementById("pacote-" + idAlvo);
        if (cartaAtual) {
            cartaAtual.classList.remove("fogo-bumerskeleton", "impacto-fogo-bumerskeleton");
            let fogoAtual = cartaAtual.querySelector(".chamas-bumerskeleton");
            if (fogoAtual) fogoAtual.remove();
        }
        delete timersFogoBumerskeleton[idAlvo];
    }, 2300);
}

function criarFragmentosGeloBumerskeleton(pacote) {
    if (!pacote || pacote.querySelector(".fragmentos-gelo-bumerskeleton")) return;

    let fragmentos = document.createElement("span");
    fragmentos.className = "fragmentos-gelo-bumerskeleton";
    fragmentos.setAttribute("aria-hidden", "true");
    for (let i = 0; i < 9; i++) {
        let fragmento = document.createElement("i");
        fragmento.style.setProperty("--gelo-bume-x", (8 + ((i * 29) % 84)) + "%");
        fragmento.style.setProperty("--gelo-bume-y", (10 + ((i * 43) % 78)) + "%");
        fragmento.style.setProperty("--gelo-bume-atraso", (i * -0.17) + "s");
        fragmentos.appendChild(fragmento);
    }
    pacote.appendChild(fragmentos);
}

function ativarGeloVisualBumerskeleton(idAlvo) {
    geloBumerskeletonAtivos[idAlvo] = true;
    let pacote = document.getElementById("pacote-" + idAlvo);
    if (!pacote) return;

    if (!pacote.classList.contains("gelo-bumerskeleton")) pacote.classList.add("gelo-bumerskeleton");
    criarFragmentosGeloBumerskeleton(pacote);

    let impacto = document.createElement("span");
    impacto.className = "impacto-gelo-bumerskeleton";
    impacto.setAttribute("aria-hidden", "true");
    impacto.textContent = "❄";
    pacote.appendChild(impacto);
    setTimeout(() => {
        if (impacto.parentNode) impacto.remove();
    }, 950);
}

function removerGeloVisualBumerskeleton(idAlvo) {
    delete geloBumerskeletonAtivos[idAlvo];
    let pacote = document.getElementById("pacote-" + idAlvo);
    if (!pacote) return;
    pacote.classList.remove("gelo-bumerskeleton");
    let fragmentos = pacote.querySelector(".fragmentos-gelo-bumerskeleton");
    if (fragmentos) fragmentos.remove();
}

function sincronizarVisuaisGeloBumerskeleton() {
    Object.keys(geloBumerskeletonAtivos).forEach(idAlvo => {
        let pacote = document.getElementById("pacote-" + idAlvo);
        if (!duracaoGelo[idAlvo]) {
            removerGeloVisualBumerskeleton(idAlvo);
        } else if (pacote && pacote.classList.contains("congelada")) {
            if (!pacote.classList.contains("gelo-bumerskeleton")) pacote.classList.add("gelo-bumerskeleton");
            criarFragmentosGeloBumerskeleton(pacote);
        }
    });
}

function animarAtaqueAreaCavaleiro(idCavaleiro, pacoteAlvoPrincipal, alvosAtingidos, especialAtivo) {
    let cavaleiro = document.getElementById("pacote-" + idCavaleiro);
    if (!cavaleiro || !pacoteAlvoPrincipal) return;

    let origem = obterCentroVisual(cavaleiro);
    let destino = obterCentroVisual(pacoteAlvoPrincipal);
    if (!origem || !destino) return;

    let arma = document.createElement("span");
    arma.className = especialAtivo ? "arma-cavaleiro arma-grande-cavaleiro" : "arma-cavaleiro arma-pequena-cavaleiro";
    arma.textContent = "🗡️";
    arma.setAttribute("aria-hidden", "true");

    if (especialAtivo) {
        arma.style.left = destino.x + "px";
        arma.style.top = destino.y + "px";
    } else {
        arma.style.left = origem.x + "px";
        arma.style.top = origem.y + "px";
        arma.style.setProperty("--arma-cavaleiro-x", (destino.x - origem.x) + "px");
        arma.style.setProperty("--arma-cavaleiro-y", (destino.y - origem.y) + "px");
        arma.style.setProperty("--arma-cavaleiro-meio-x", ((destino.x - origem.x) / 2) + "px");
        arma.style.setProperty("--arma-cavaleiro-meio-y", ((destino.y - origem.y) / 2 - 36) + "px");
    }
    document.body.appendChild(arma);

    let atrasoImpacto = especialAtivo ? 390 : 330;
    let dadosDosAlvos = (alvosAtingidos || []).map(pacote => {
        let retangulo = pacote.getBoundingClientRect();
        return {
            id: pacote.id,
            left: retangulo.left,
            top: retangulo.top,
            width: retangulo.width,
            height: retangulo.height
        };
    });

    setTimeout(() => {
        dadosDosAlvos.forEach((alvo, indice) => {
            let onda = document.createElement("span");
            onda.className = "onda-area-cavaleiro" + (especialAtivo ? " onda-grande-cavaleiro" : " onda-pequena-cavaleiro");
            onda.setAttribute("aria-hidden", "true");
            onda.style.left = (alvo.left + alvo.width / 2) + "px";
            onda.style.top = (alvo.top + alvo.height / 2) + "px";
            onda.style.width = alvo.width + "px";
            onda.style.height = alvo.height + "px";
            onda.style.setProperty("--onda-cavaleiro-atraso", (indice * 0.06) + "s");
            document.body.appendChild(onda);

            let pacoteAtual = document.getElementById(alvo.id);
            if (pacoteAtual) {
                let classeImpacto = especialAtivo ? "impacto-grande-cavaleiro" : "impacto-pequeno-cavaleiro";
                pacoteAtual.classList.remove(classeImpacto);
                void pacoteAtual.offsetWidth;
                pacoteAtual.classList.add(classeImpacto);
                setTimeout(() => {
                    if (pacoteAtual.isConnected) pacoteAtual.classList.remove(classeImpacto);
                }, 820);
            }

            setTimeout(() => {
                if (onda.parentNode) onda.remove();
            }, 1000 + indice * 60);
        });
    }, atrasoImpacto);

    setTimeout(() => {
        if (arma.parentNode) arma.remove();
    }, especialAtivo ? 1050 : 880);
}

function narrar(mensagem) {
    document.getElementById("painel-narrador").innerText = mensagem;
}

// O Ctrl C/V mantém o próprio nome na tela, mas para as regras do jogo ele assume a
// identidade da carta copiada. Toda passiva que depende do nome deve passar por este helper.
function obterNomeEfetivoCarta(idUnico, nomeExibido) {
    let copia = (typeof ctrlV !== 'undefined' && ctrlV[idUnico]) ? ctrlV[idUnico] : null;
    return (copia && copia.nomeOriginal) ? copia.nomeOriginal : (nomeExibido || "");
}

// 🧬 CTRL C / CTRL V — a gosma se deforma enquanto uma cópia luminosa da última
// carta usada pelo oponente é absorvida. A mecânica acontece normalmente, sem esperar
// a animação, para não atrasar o turno nem o bot.
function animarMetamorfoseCtrl(idCtrl, nomeCopiado, ehAliado) {
    let pacoteCtrl = document.getElementById("pacote-" + idCtrl);
    if (!pacoteCtrl) return;

    // A carta usada fica no campo; não procura na mão para não animar por engano outra
    // cópia do mesmo tipo que o oponente ainda nem jogou.
    let recipientesOpostos = ehAliado ? ["#campo-j2"] : ["#campo-j1"];
    let candidatas = recipientesOpostos.flatMap(seletor => {
        let recipiente = document.querySelector(seletor);
        return recipiente ? Array.from(recipiente.querySelectorAll("div[id^='pacote-']")) : [];
    })
        .filter(pacote => {
            let nome = pacote.querySelector(".nome-carta");
            return nome && nome.innerText.trim() === nomeCopiado;
        });
    let pacoteCopiado = candidatas.length ? candidatas[candidatas.length - 1] : null;
    let rectCtrl = pacoteCtrl.getBoundingClientRect();
    let rectOrigem = pacoteCopiado ? pacoteCopiado.getBoundingClientRect() : rectCtrl;
    let imagemCopiada = pacoteCopiado ? pacoteCopiado.querySelector("img") : null;

    let origemX = rectOrigem.left + rectOrigem.width / 2;
    let origemY = rectOrigem.top + rectOrigem.height / 2;
    let destinoX = rectCtrl.left + rectCtrl.width / 2;
    let destinoY = rectCtrl.top + rectCtrl.height / 2;

    let copia = document.createElement("div");
    copia.className = "copia-metamorfa-ctrl";
    copia.style.setProperty("--ctrl-origem-x", origemX + "px");
    copia.style.setProperty("--ctrl-origem-y", origemY + "px");
    copia.style.setProperty("--ctrl-meio-x", ((origemX + destinoX) / 2) + "px");
    copia.style.setProperty("--ctrl-meio-y", (Math.min(origemY, destinoY) - 48) + "px");
    copia.style.setProperty("--ctrl-destino-x", destinoX + "px");
    copia.style.setProperty("--ctrl-destino-y", destinoY + "px");
    copia.innerHTML = imagemCopiada && imagemCopiada.src
        ? `<img src="${imagemCopiada.src}" alt=""><span>${nomeCopiado}</span>`
        : `<b>🧬</b><span>${nomeCopiado}</span>`;

    let pulso = document.createElement("div");
    pulso.className = "pulso-metamorfo-ctrl";
    pulso.style.left = destinoX + "px";
    pulso.style.top = destinoY + "px";
    pulso.innerHTML = "<i></i><i></i><i></i>";

    document.body.appendChild(copia);
    document.body.appendChild(pulso);
    pacoteCtrl.classList.remove("ctrl-metamorfo-balancando");
    void pacoteCtrl.offsetWidth;
    pacoteCtrl.classList.add("ctrl-metamorfo-balancando");
    if (pacoteCopiado) pacoteCopiado.classList.add("fonte-copia-ctrl");

    setTimeout(() => {
        copia.remove();
        pulso.remove();
        if (pacoteCtrl.isConnected) pacoteCtrl.classList.remove("ctrl-metamorfo-balancando");
        if (pacoteCopiado && pacoteCopiado.isConnected) pacoteCopiado.classList.remove("fonte-copia-ctrl");
    }, 1450);
}

function obterModoCartaAliada() {
    if (modoTraicao) return "executar-traicao";
    if (modoLadrao && turnoAtivo === 1 && faseLadrao === 2) return "roubo-beneficio";
    if (modoLadrao && turnoAtivo === 2 && faseLadrao === 1) return "roubo-prejuizo";
    if (modoAtaqueInimigo) return "ataque-inimigo";
    if (modoCura) return "cura";
    if (modoRouboGoblin) return "roubo-goblin";
    if (modoBruxoTransformar) return "bruxo-transformar";
    if (modoBruxoRoubar) return "bruxo-roubar";
    if (suportePreparado !== null) return "suporte";
    return "ataque-normal";
}

function obterModoCartaInimiga() {
    if (modoTraicao) return "executar-traicao";
    if (modoLadrao && turnoAtivo === 1 && faseLadrao === 1) return "roubo-prejuizo";
    if (modoLadrao && turnoAtivo === 2 && faseLadrao === 2) return "roubo-beneficio";
    if (modoCuraInimigo) return "cura-inimiga";
    if (modoRouboGoblin) return "roubo-goblin";
    if (suportePreparado !== null) return "suporte";
    return "receber-ataque";
}

function removerVenenoDoMago(idEfeitoVeneno) {
    let efeito = venenosMago[idEfeitoVeneno];
    if (!efeito) return;

    let idAlvo = efeito.idAlvo;
    delete venenosMago[idEfeitoVeneno];

    let aindaEstaEnvenenado = Object.values(venenosMago).some(outro => outro.idAlvo === idAlvo);
    if (!aindaEstaEnvenenado) {
        let pacoteAlvo = document.getElementById("pacote-" + idAlvo);
        if (pacoteAlvo) pacoteAlvo.classList.remove("envenenada");
    }
}

function animarGarrafaVeneno(idMago, idAlvo) {
    let mago = document.getElementById("pacote-" + idMago);
    let alvo = document.getElementById("pacote-" + idAlvo);
    if (!mago || !alvo) return;

    let origem = mago.getBoundingClientRect();
    let destino = alvo.getBoundingClientRect();
    let inicioX = origem.left + origem.width / 2;
    let inicioY = origem.top + origem.height / 2;
    let distanciaX = (destino.left + destino.width / 2) - inicioX;
    let distanciaY = (destino.top + destino.height / 2) - inicioY;

    let garrafa = document.createElement("span");
    garrafa.className = "garrafa-veneno-lancada";
    garrafa.textContent = "🧪";
    garrafa.setAttribute("aria-hidden", "true");
    garrafa.style.left = inicioX + "px";
    garrafa.style.top = inicioY + "px";
    garrafa.style.setProperty("--veneno-x", distanciaX + "px");
    garrafa.style.setProperty("--veneno-y", distanciaY + "px");
    garrafa.style.setProperty("--veneno-meio-x", distanciaX / 2 + "px");
    garrafa.style.setProperty("--veneno-meio-y", distanciaY / 2 - 42 + "px");
    document.body.appendChild(garrafa);

    garrafa.addEventListener("animationend", () => garrafa.remove(), { once: true });
    setTimeout(() => {
        if (garrafa.parentNode) garrafa.remove();
    }, 1000);
}

function aplicarAlvoVenenoMago(idPacoteAlvo) {
    let pacoteMago = document.getElementById("pacote-" + idMagoVenenoAtivo);
    let pacoteAlvo = document.getElementById(idPacoteAlvo);

    if (!pacoteMago) {
        modoAlvoVenenoMago = false;
        idMagoVenenoAtivo = null;
        return;
    }
    if (!pacoteAlvo) return;

    let ladoMago = pacoteMago.closest("#campo-j1") ? "j1" : pacoteMago.closest("#campo-j2") ? "j2" : null;
    let ladoAlvo = pacoteAlvo.closest("#campo-j1") ? "j1" : pacoteAlvo.closest("#campo-j2") ? "j2" : null;
    if (!ladoAlvo || ladoMago === ladoAlvo) {
        return narrar("❌ O veneno do Mago precisa atingir uma carta do campo oposto!");
    }

    let idAlvo = idPacoteAlvo.replace("pacote-", "");
    // Cada lançamento recebe seu próprio registro. Se o mesmo Mago escolher novamente
    // a MESMA carta, apenas renova as duas rodadas; em outro alvo, ambos continuam ativos.
    let idEfeitoExistente = Object.keys(venenosMago).find(idEfeito => {
        let efeito = venenosMago[idEfeito];
        return efeito.idMago === idMagoVenenoAtivo && efeito.idAlvo === idAlvo;
    });
    if (idEfeitoExistente) {
        venenosMago[idEfeitoExistente].restam = 4;
    } else {
        let idEfeitoNovo = `veneno-${idMagoVenenoAtivo}-${proximoIdVenenoMago++}`;
        venenosMago[idEfeitoNovo] = { idMago: idMagoVenenoAtivo, idAlvo: idAlvo, restam: 4 };
    }
    pacoteAlvo.classList.add("envenenada");
    animarGarrafaVeneno(idMagoVenenoAtivo, idAlvo);

    let nomeAlvo = pacoteAlvo.querySelector(".nome-carta").innerText.trim();
    modoAlvoVenenoMago = false;
    idMagoVenenoAtivo = null;
    narrar(`☠️ ${nomeAlvo} foi envenenado! Sofrerá 0,5 de dano em cada jogada pelas próximas 2 rodadas.`);
}

// A captura do clique deixa qualquer carta normal, token ou transformação ser alvo do veneno.
document.addEventListener("click", function (evento) {
    if (!modoAlvoVenenoMago) return;
    let imagem = evento.target && evento.target.closest ? evento.target.closest("img") : null;
    let pacote = imagem ? imagem.closest("div[id^='pacote-']") : null;
    if (!pacote || (!pacote.closest("#campo-j1") && !pacote.closest("#campo-j2"))) return;

    evento.preventDefault();
    evento.stopImmediatePropagation();
    aplicarAlvoVenenoMago(pacote.id);
}, true);

function iniciarJogo() {
    deckJ1 = []; maoJ1 = [];
    deckJ2 = []; maoJ2 = [];

    let deckTropaJ1 = []; let deckSuporteJ1 = [];
    let deckTropaJ2 = []; let deckSuporteJ2 = [];

    bancoDeCartas.forEach(carta => {
        for(let i = 0; i < carta.qtd; i++) {
            let instJ1 = { ...carta, idUnico: carta.id + "_" + i };
            let instJ2 = { ...carta, idUnico: carta.id + "_inimigo_" + i };
            
            if (suportesReais.includes(carta.id)) {
                deckSuporteJ1.push(instJ1);
                deckSuporteJ2.push(instJ2);
            } else {
                deckTropaJ1.push(instJ1);
                deckTropaJ2.push(instJ2);
            }
        }
    });

    deckTropaJ1.sort(() => Math.random() - 0.5);
    deckSuporteJ1.sort(() => Math.random() - 0.5);
    deckTropaJ2.sort(() => Math.random() - 0.5);
    deckSuporteJ2.sort(() => Math.random() - 0.5);

    maoJ1.push(deckSuporteJ1.pop());
    for(let i = 0; i < 4; i++) maoJ1.push(deckTropaJ1.pop());
    
    maoJ2.push(deckSuporteJ2.pop());
    for(let i = 0; i < 4; i++) maoJ2.push(deckTropaJ2.pop());

    deckJ1 = [...deckTropaJ1, ...deckSuporteJ1].sort(() => Math.random() - 0.5);
    deckJ2 = [...deckTropaJ2, ...deckSuporteJ2].sort(() => Math.random() - 0.5);

    maoJ1.sort(() => Math.random() - 0.5);
    maoJ2.sort(() => Math.random() - 0.5);

    let divMaoJ1 = document.getElementById("mao-j1");
    divMaoJ1.innerHTML = "<h3>Sua Mão</h3>"; 
    maoJ1.forEach(cartaComprada => {
        divMaoJ1.innerHTML += criarHTMLCarta(cartaComprada, "jogarCarta", "carta-aliada", true);
    });

    let divMaoJ2 = document.getElementById("mao-j2");
    divMaoJ2.innerHTML = "<h3>Mão do Oponente</h3>"; 
    maoJ2.forEach(cartaComprada => {
        divMaoJ2.innerHTML += criarHTMLCarta(cartaComprada, "jogarCartaInimigo", "carta-inimiga-espera", false);
    });

    // 🆕 FASE DE ABERTURA: antes do primeiro turno normal, cada lado escolhe 1 carta
    // (uma TROPA) da própria mão. As duas são reveladas e postas em campo ao mesmo tempo.
    faseAbertura = true;
    aberturaEscolhaJ1 = null;
    aberturaEscolhaJ2 = null;
    document.getElementById("texto-turno").innerText = "Fase de Abertura";
    document.getElementById("painel-narrador").innerText = "⚔️ Escolha 1 TROPA da sua mão pra abrir o jogo. As duas cartas serão reveladas juntas!";
    let btnDado = document.getElementById("btn-rolar-dado");
    if (btnDado) btnDado.style.display = "none";

    if (typeof window.onFaseAberturaPronta === "function") window.onFaseAberturaPronta();
}

// 🆕 Registra a escolha de abertura de um jogador (1 = você, 2 = oponente) e revela
// as duas ao mesmo tempo assim que ambas estiverem prontas.
function escolherCartaAbertura(idDoPacote, jogador) {
    let pacoteCarta = document.getElementById(idDoPacote);
    if (!pacoteCarta) return;

    let idSemPacote = idDoPacote.replace("pacote-", "");
    let idBase = idSemPacote.split("_")[0];
    let infoCarta = bancoDeCartas.find(c => c.id === idBase);
    let ehSuporte = infoCarta && suportesReais.includes(infoCarta.id);
    if (ehSuporte) {
        return narrar("❌ A carta de abertura precisa ser uma TROPA — suportes/poções não podem abrir o jogo.");
    }

    if (jogador === 1) {
        if (aberturaEscolhaJ1 !== null) return narrar("⏳ Você já escolheu! Aguardando o oponente...");
        aberturaEscolhaJ1 = idDoPacote;
        pacoteCarta.classList.add("carta-selecionada-abertura");
        narrar(aberturaEscolhaJ2 === null ? "✅ Você escolheu! Aguardando o oponente escolher a dele..." : "⚔️ Revelando as cartas de abertura!");
    } else {
        if (aberturaEscolhaJ2 !== null) return;
        aberturaEscolhaJ2 = idDoPacote;
        pacoteCarta.classList.add("carta-selecionada-abertura");
        narrar(aberturaEscolhaJ1 === null ? "✅ O oponente escolheu! Aguardando você escolher a sua..." : "⚔️ Revelando as cartas de abertura!");
    }

    tentarRevelarAbertura();
}

function tentarRevelarAbertura() {
    if (aberturaEscolhaJ1 === null || aberturaEscolhaJ2 === null) return;

    let escolhaJ1 = aberturaEscolhaJ1;
    let escolhaJ2 = aberturaEscolhaJ2;
    aberturaEscolhaJ1 = null;
    aberturaEscolhaJ2 = null;
    faseAbertura = false; // libera jogarCarta/jogarCartaInimigo pra fazerem o deploy de verdade

    let c1 = document.getElementById(escolhaJ1);
    let c2 = document.getElementById(escolhaJ2);
    if (c1) c1.classList.remove("carta-selecionada-abertura");
    if (c2) c2.classList.remove("carta-selecionada-abertura");

    narrar("⚔️ Ambas as cartas de abertura foram reveladas!");
    jogarCarta(escolhaJ1);
    jogarCartaInimigo(escolhaJ2);

    let btnDado = document.getElementById("btn-rolar-dado");
    if (btnDado) btnDado.style.display = "";
    document.getElementById("texto-turno").innerText = "Role o dado pra ver quem começa!";
}

function rolarDado() {
    let dadoTela = document.getElementById("dado-tela");
    let textoTurno = document.getElementById("texto-turno");
    let painelNarrador = document.getElementById("painel-narrador");
    
    dadoTela.style.animation = 'none';
    setTimeout(() => dadoTela.style.animation = '', 10);

    if (faseAbertura === true) {
        return narrar("⏳ Escolha sua carta de abertura primeiro!");
    }

    if (!jogoIniciado) {
        let dadoJ1 = Math.floor(Math.random() * 6) + 1;
        let dadoJ2 = Math.floor(Math.random() * 6) + 1;

        if (dadoJ1 > dadoJ2) {
            dadoTela.innerText = `🎲 ${dadoJ1} x ${dadoJ2}`;
            textoTurno.innerText = "Sua Vez!";
            textoTurno.style.color = "#2ecc71"; 
            painelNarrador.innerText = "Você tirou um número maior e começa jogando!";
            turnoAtivo = 1; 
            jogoIniciado = true; 
        } 
        else if (dadoJ2 > dadoJ1) {
            dadoTela.innerText = `🎲 ${dadoJ1} x ${dadoJ2}`;
            textoTurno.innerText = "Vez do Oponente!";
            textoTurno.style.color = "#e74c3c"; 
            painelNarrador.innerText = "O oponente tirou um número maior e começa!";
            turnoAtivo = 2; 
            jogoIniciado = true; 
        }
        else {
            // 🎲 EMPATE — sem isso, o jogo ficava travado esperando alguém rolar de novo
            // sem nenhum aviso na tela.
            dadoTela.innerText = `🎲 ${dadoJ1} x ${dadoJ2}`;
            painelNarrador.innerText = "Empate! Role o dado de novo pra decidir quem começa.";
        }
    } else {
        let resultado = Math.floor(Math.random() * 6) + 1;
        dadoTela.innerText = "🎲 " + resultado;
        painelNarrador.innerText = `O dado rolou um ${resultado}.`;
    }
}

// 🆕 Botão "Passar a Vez" — sempre disponível pra quem estiver com o turno,
// mesmo que ainda tenha ataque possível. Limpa qualquer escolha de alvo pendente
// pra garantir que o próximo turno não comece bugado.
function passarVezManual() {
    if (barrilBarbaroEmAnimacao) return narrar("🪵 Espere o Barril de Bárbaro terminar o impacto!");
    if (faseAbertura === true) return narrar("⏳ Escolha sua carta de abertura primeiro!");
    if (!jogoIniciado) return narrar("⏳ Role o dado de iniciativa primeiro!");
    // 🚨 Sem isso, dava pra clicar em "Passar a Vez" durante o turno do OPONENTE (ex: logo
    // depois de atacar, antes do bot terminar de jogar) e isso passava o turno de novo,
    // devolvendo a vez pra você no meio da jogada do bot e travando ele.
    if (turnoAtivo !== 1) return narrar("⏳ Não é a sua vez!");

    suportePreparado = null;
    modoTraicao = false;
    modoGeloSimples = false;
    modoAlvoVenenoMago = false;
    idMagoVenenoAtivo = null;
    if (typeof modoAlvoBarril !== "undefined") modoAlvoBarril = false;
    if (typeof modoAlvoBarrilBarbaro !== "undefined") modoAlvoBarrilBarbaro = false;
    if (typeof modoAlvoBarrilBarbaroInimigo !== "undefined") modoAlvoBarrilBarbaroInimigo = false;
    if (typeof modoProtecaoBarril !== "undefined") modoProtecaoBarril = false;
    if (typeof modoProtecaoBarrilInimigo !== "undefined") modoProtecaoBarrilInimigo = false;
    if (typeof idBarrilProtetor !== "undefined") idBarrilProtetor = null;
    modoAtaque = false;
    modoAtaqueInimigo = false;

    passarTurno();
}

function passarTurno() {
    // Se alguma ação ou o botão manual encerrou o turno antes do aviso de congelamento,
    // cancela o passe agendado para ele não atingir o jogador seguinte.
    if (passagemAutomaticaGeloPendente !== null) {
        clearTimeout(passagemAutomaticaGeloPendente);
        passagemAutomaticaGeloPendente = null;
    }

    // 1. CHECAGEM DE REATAQUES (Se ativar, sai da função sem passar o turno)
    if (ultimoIdQueAtacou && goblinAtaquesGanhos[ultimoIdQueAtacou] === true) {
        goblinAtaquesGanhos[ultimoIdQueAtacou] = false; 
        ativarEfeitoVelocidade(ultimoIdQueAtacou);
        narrar("🔥 PASSIVA: O Goblin ganhou o direito de atacar mais uma vez nesta rodada!");
        return; 
    }

    if (ultimoIdQueAtacou && pocaoVeluxAtiva[ultimoIdQueAtacou] === true) {
        pocaoVeluxAtiva[ultimoIdQueAtacou] = false; 
        ativarEfeitoVelocidade(ultimoIdQueAtacou);
        narrar("⚡ EFEITO VELUX: Na velocidade da luz! A carta que acabou de atacar tem direito a MAIS UM ATAQUE agora!");
        return; 
    }

    // Chegou aqui depois que todos os ataques extras dessa carta foram usados.
    if (ultimoIdQueAtacou) removerEfeitoVelocidade(ultimoIdQueAtacou);
    
    // 2. RESET DE VARIÁVEIS DA RODADA
    goblinJaAtacouNesteTurno = {};
    
    goblinAtaquesGanhos = {};
    ultimoIdQueAtacou = null;
    ladraoUsosPorLado = { j1: 0, j2: 0 }; // 🩹 NOVO: libera 1 uso da passiva do Ladrão por turno, por lado
    
    // Inverte o turno de 1 para 2 ou de 2 para 1
    turnoAtivo = (turnoAtivo === 1) ? 2 : 1;
    
    modoAtaque = false;
    modoAtaqueInimigo = false;
    danoPreparado = 0;
    danoInimigoPreparado = 0;
    
    modoAlvoBarril = false;
    modoAlvoBarrilInimigo = false;
    idBarrilAtivo = null;
    modoAlvoVenenoMago = false;
    idMagoVenenoAtivo = null;

    // 3. ATUALIZAÇÃO DO TEXTO DA INTERFACE
    let containerTurno = document.getElementById("texto-turno");
    if (containerTurno) {
        if (turnoAtivo === 1) {
            containerTurno.innerText = "Sua Vez!";
            containerTurno.style.color = "#2ecc71"; 
        } else {
            containerTurno.innerText = "Vez do Oponente!";
            containerTurno.style.color = "#e74c3c"; 
        }
    }

    // Narração do início do turno
    if (turnoAtivo === 1) {
        narrar("🔵 Seu turno começou! Planeje bem seus ataques.");
    } else {
        narrar("🔴 Turno do Oponente iniciado! Prepare-se para defender.");
    }

    // 4. --- MALDIÇÃO DO BARRIL DE GOBLINS (Dano por rodada) ---
    if (typeof alvosDoBarril !== 'undefined') {
        Object.keys(alvosDoBarril).forEach(idBarril => {
            let idAlvo = alvosDoBarril[idBarril];
            let resultado = aplicarDanoPeriodicoBarrilGoblin(idBarril, idAlvo);
            if (!resultado) return;

            if (resultado.destruido) {
                narrar(`💀 Os Goblins do Barril causaram ${resultado.danoTotal} de dano e derrotaram [${resultado.nomeAlvo}]!`);
            } else {
                narrar(`⚔️ Os Goblins do Barril atacaram [${resultado.nomeAlvo}] causando ${resultado.danoTotal} de dano no fim do turno! Vida restante: ${resultado.novaVida}.`);
            }
        });
    }

    // 4.1 --- VENENO DO MAGO ---
    // Duas rodadas completas equivalem a quatro passagens de turno. Depois de aplicado,
    // o veneno pertence ao alvo e continua mesmo que o Mago seja derrotado.
    Object.keys(venenosMago).forEach(idEfeitoVeneno => {
        let efeito = venenosMago[idEfeitoVeneno];
        let pacoteAlvo = document.getElementById("pacote-" + efeito.idAlvo);

        if (!pacoteAlvo) {
            removerVenenoDoMago(idEfeitoVeneno);
            return;
        }

        pacoteAlvo.classList.add("envenenada");
        let nomeAlvo = pacoteAlvo.querySelector(".nome-carta").innerText.trim();
        let alvoEhInimigo = pacoteAlvo.closest("#campo-j2") !== null;
        aplicarDanoDireto(pacoteAlvo.id, 0.5, alvoEhInimigo);
        efeito.restam--;

        if (efeito.restam <= 0 || !document.getElementById(pacoteAlvo.id)) {
            removerVenenoDoMago(idEfeitoVeneno);
            narrar(`☠️ ${nomeAlvo} sofreu os últimos 0,5 de dano. O veneno acabou!`);
        } else {
            narrar(`☠️ O veneno causou 0,5 de dano em ${nomeAlvo}! Restam ${efeito.restam} jogadas.`);
        }
    });

    // 5. ⏳ LIMPEZA DE FADIGA DO NECROMANTE (Duração de 1 Rodada = 2 trocas de turno)
    // 🩹 CORREÇÃO: antes tentava adivinhar o lado da carta pelo ID conter "inimigo",
    // mas os tokens do Necromante (ex: "necro_xxxx") nunca têm essa palavra no nome,
    // então os tokens do OPONENTE tinham a fadiga liberada cedo demais (quase na hora).
    // Agora é um contador de verdade: desconta 1 a cada troca de turno, dos dois lados igual.
    if (typeof bloqueioNecro !== 'undefined') {
        for (let idCarta in bloqueioNecro) {
            bloqueioNecro[idCarta]--;
            if (bloqueioNecro[idCarta] <= 0) {
                delete bloqueioNecro[idCarta];
            }
        }
    }

    // 6. ❄️ SISTEMA DE DEGELO — todos os gelos ganharam +1 rodada (= +2 passagens)
    if (typeof duracaoGelo !== 'undefined' && duracaoGelo !== null) {
        Object.keys(duracaoGelo).forEach(idCarta => {
            duracaoGelo[idCarta]--; // Reduz 1 turno do relógio do gelo
            
            // Se o tempo acabou, o gelo derrete
            if (duracaoGelo[idCarta] <= 0) {
                let pacote = document.getElementById("pacote-" + idCarta);
                
                // 🔍 TRADUTOR DE NOME: Transforma o ID feio no Nome Real
                let nomeReal = "Uma carta"; 
                let idBase = idCarta.split('_')[0]; // Corta o "_0" ou "_inimigo_0" e pega só a base
                
                if (typeof bancoDeCartas !== 'undefined') {
                    let cartaInfo = bancoDeCartas.find(c => c.id === idBase);
                    if (cartaInfo) nomeReal = cartaInfo.nome;
                }

                if (pacote) {
                    pacote.classList.remove("congelada");
                    pacote.style.filter = "none"; // 🚨 ADICIONAMOS ISSO AQUI: Remove a cor azul do Bumerskeleton!
                    removerGeloVisualBumerskeleton(idCarta);
                    narrar(`☀️ O gelo derreteu! ${nomeReal} se libertou!`);
                }
                delete duracaoGelo[idCarta]; 
            }
        });
    }

    // 6.5 🐴 CAVALO DE TRÓIA — contagem regressiva até a explosão (1 de dano em TODAS as cartas
    // inimigas, campo e mão), depois a própria carta some do campo.
    if (typeof cavalosDeTroiaAtivos !== 'undefined') {
        Object.keys(cavalosDeTroiaAtivos).forEach(idCarta => {
            cavalosDeTroiaAtivos[idCarta]--;
            if (cavalosDeTroiaAtivos[idCarta] <= 0) {
                let pacoteCavalo = document.getElementById("pacote-" + idCarta);
                if (pacoteCavalo) {
                    let ladoCavalo = pacoteCavalo.closest("#campo-j2") ? "j2" : "j1";
                    let ladoInimigo = (ladoCavalo === "j1") ? "j2" : "j1";
                    narrar("🐴 SURPRESA! O Cavalo de Tróia se abriu e atingiu TODAS as cartas inimigas (campo e mão) com 1 de dano!");
                    aplicarDanoCavaloDeTroia(ladoInimigo, 1);
                    pacoteCavalo.remove();
                }
                delete cavalosDeTroiaAtivos[idCarta];
            }
        });
    }

    // 6.6 🔥 FOGUEIRA — contagem regressiva até a 2ª cura (a última rodada de +1 de vida).
    if (typeof fogueiraTicks !== 'undefined') {
        ["j1", "j2"].forEach(lado => {
            for (let i = fogueiraTicks[lado].length - 1; i >= 0; i--) {
                fogueiraTicks[lado][i]--;
                if (fogueiraTicks[lado][i] <= 0) {
                    narrar(`🔥 A Fogueira do time ${lado === "j1" ? "aliado" : "inimigo"} deu sua última cura: +1 de vida em todas as tropas (campo e mão)!`);
                    curarTodosAliados(lado, 1);
                    fogueiraTicks[lado].splice(i, 1);
                }
            }
        });
    }

    // 6.65 🛸 PORTABLE — contagem regressiva da bateria (2 rodadas = 4 passagens de turno);
    // quando acaba, a bateria acaba de vez e ele some do campo (sem nenhum efeito extra).
    if (typeof portableDuracao !== 'undefined') {
        Object.keys(portableDuracao).forEach(idCarta => {
            portableDuracao[idCarta]--;
            if (portableDuracao[idCarta] <= 0) {
                let pacotePortable = document.getElementById("pacote-" + idCarta);
                if (pacotePortable) {
                    narrar("🛸 A bateria do Portable acabou e ele saiu de campo!");
                    pacotePortable.remove();
                }
                delete portableDuracao[idCarta];
            }
        });
    }

    // 6.66 💥 ALLSFORMS — contagem regressiva dos buffs de +3 dano (1 rodada = 2 passagens de
    // turno); cada buff é revertido individualmente quando o dele acaba (dá pra empilhar vários).
    if (typeof buffsAllsforms !== 'undefined') {
        Object.keys(buffsAllsforms).forEach(idCarta => {
            let lista = buffsAllsforms[idCarta];
            for (let i = lista.length - 1; i >= 0; i--) {
                lista[i].restam--;
                if (lista[i].restam <= 0) {
                    let txtDano = document.getElementById("dano-" + idCarta);
                    if (txtDano) {
                        let danoAtual = parseFloat(txtDano.innerText) || 0;
                        txtDano.innerText = Math.max(0, danoAtual - lista[i].bonus);
                    }
                    lista.splice(i, 1);
                }
            }
            if (lista.length === 0) delete buffsAllsforms[idCarta];
        });
    }

    // 6.7 🔥 INCENDIÁRIO — avança o ciclo de cada um em campo (1=jogou pólvora, 2/3=queima,
    // 4=parado, e no "5º turno" volta pra 1 e joga pólvora de novo, sozinho, sem precisar
    // de nenhum clique em Atacar).
    if (typeof incendiarioCiclo !== 'undefined') {
        Object.keys(incendiarioCiclo).forEach(idInc => {
            let faseAtual = incendiarioCiclo[idInc];
            let proximaFase = faseAtual >= 4 ? 1 : faseAtual + 1;
            executarFaseIncendiario(idInc, proximaFase);
            if (typeof incendiarioCiclo[idInc] !== 'undefined') incendiarioCiclo[idInc] = proximaFase;
        });
    }

    // 7. ATUALIZAÇÃO VISUAL DAS UNIÕES
    if (typeof atualizarTodosUnidoes === "function") {
        atualizarTodosUnidoes();
    }

    // 🚨 8. VERIFICADOR DE APAGÃO POR GELO AUTOMÁTICO
    // Executa logo após o turno mudar para verificar se o jogador atual está travado
    if (typeof verificarBloqueioTotalGelo === "function") {
        if (turnoAtivo === 1) {
            verificarBloqueioTotalGelo("j1");
        } else {
            verificarBloqueioTotalGelo("j2");
        }
    }
}

function verificarBloqueioTotalGelo(idJogador) {
    let campo = document.getElementById("campo-" + idJogador);
    if (!campo) return false;

    // Só a ARENA importa. Antes a mão entrava na conta, então uma poção ou suporte não
    // congelado escondia o bloqueio mesmo sem existir atacante disponível em campo.
    let cartasNaArena = Array.from(campo.querySelectorAll("div[id^='pacote-']"));
    let todasCongeladas = cartasNaArena.length > 0 && cartasNaArena.every(pacote => pacote.classList.contains("congelada"));

    if (todasCongeladas) {
        let quem = idJogador === "j1" ? "Você está" : "O Oponente está";
        let turnoEsperado = idJogador === "j1" ? 1 : 2;
        
        narrar(`🥶 ${quem} com todas as cartas da arena congeladas e sem ataque possível! Passando o turno...`);
        
        // Espera 1,5 segundo para o aviso ser lido. Depois confirma que ainda é o mesmo
        // turno e que nenhuma carta descongelou ou entrou na arena nesse intervalo.
        passagemAutomaticaGeloPendente = setTimeout(() => {
            passagemAutomaticaGeloPendente = null;
            let campoAtual = document.getElementById("campo-" + idJogador);
            let cartasAtuais = campoAtual ? Array.from(campoAtual.querySelectorAll("div[id^='pacote-']")) : [];
            let continuaSemAtaque = cartasAtuais.length > 0 && cartasAtuais.every(pacote => pacote.classList.contains("congelada"));

            if (turnoAtivo === turnoEsperado && continuaSemAtaque) passarTurno();
        }, 1500);
        
        return true;
    }
    return false;
}

function invocarToken(idBaseCarta, idCampo) {
    let cartaBase = bancoDeCartas.find(c => c.id === idBaseCarta);
    if (!cartaBase) return;
    
    let idUnico = idBaseCarta + "-" + Math.floor(Math.random() * 10000);
    let novaCarta = { ...cartaBase, idUnico: idUnico };
    
    let ehAliado = idCampo === "campo-j1";
    let html = criarHTMLCarta(novaCarta, ehAliado ? "jogarCarta" : "jogarCartaInimigo", ehAliado ? "carta-aliada" : "carta-inimiga", ehAliado);
    
    let tempDiv = document.createElement("div");
    tempDiv.innerHTML = html.trim();
    let pacoteNovo = tempDiv.firstChild;
    
    document.getElementById(idCampo).appendChild(pacoteNovo);

    let img = pacoteNovo.querySelector("img");
    img.removeAttribute("onclick");
    
    img.onclick = function() {
        let idDoPacote = "pacote-" + idUnico;
        let idSemPacote = idUnico;
        
        if (modoLadrao === true && turnoAtivo === 1 && faseLadrao === 1 && !ehAliado) aplicarRouboPrejuizo(idDoPacote);
        else if (modoLadrao === true && turnoAtivo === 1 && faseLadrao === 2 && ehAliado) aplicarRouboBeneficio(idDoPacote);
        else if (modoLadrao === true && turnoAtivo === 2 && faseLadrao === 1 && ehAliado) aplicarRouboPrejuizo(idDoPacote);
        else if (modoLadrao === true && turnoAtivo === 2 && faseLadrao === 2 && !ehAliado) aplicarRouboBeneficio(idDoPacote);
        // 🩹 CORREÇÃO: faltava aqui também (token invocado) — clicar no lado/fase errada
        // durante o roubo do Ladrão vazava pra ataque/etc. em vez de avisar.
        else if (modoLadrao === true) narrar("❌ Alvo inválido para o Ladrão! Clique na carta certa pra continuar o roubo.");
        else if (modoAlvoBarril === true && !ehAliado) aplicarAlvoBarril(idDoPacote);
        else if ((modoAlvoBarrilBarbaro === true || modoAlvoBarrilBarbaroInimigo === true)) aplicarAlvoBarrilBarbaro(idDoPacote);
        else if (typeof modoEspecialBarrilGoblin !== 'undefined' && modoEspecialBarrilGoblin === true) aplicarAlvoBarril(idDoPacote, true);
        else if (typeof modoEspecialBumerskeleton !== 'undefined' && modoEspecialBumerskeleton === true) aplicarEspecialBumerskeletonAntesDeAtacar(idDoPacote);
        else if (modoCura === true && ehAliado) aplicarCuraAliada(idDoPacote);
        else if (modoCuraInimigo === true && !ehAliado) aplicarCuraInimiga(idDoPacote);
        else if (modoAtaqueInimigo === true && ehAliado) aplicarDanoInimigo(idDoPacote);
        else if (modoRouboGoblin === true) aplicarRouboDanoGoblin(idDoPacote);
        // ⚔️ CAVALEIRO DAS TREVAS — tokens invocados também podem ser alvos da área.
        else if (modoAlvoCavaleiro === true && !ehAliado) aplicarAlvoCavaleiro(idDoPacote);
        else if (modoAlvoCavaleiroInimigo === true && ehAliado) aplicarAlvoCavaleiroInimigo(idDoPacote);
        // 🧪 2º PRIORIDADE: BRUXO (TRANSFORMAR 4)
        else if (typeof modoBruxoTransformar !== 'undefined' && modoBruxoTransformar === true) {
            let pacoteAlvo = document.getElementById(idDoPacote);
            pacoteAlvo.remove(); 
            gerarPocaoAleatoria("mao-j1"); 
            modoBruxoTransformar = false;
            idBruxoAtivo = null;
            narrar("✨ ZAP! A carta inimiga virou pó e o Bruxo criou uma Poção para você!");
            return; 
        }

        // 🔮 3º PRIORIDADE: BRUXO (ROUBAR 6)
        else if (typeof modoBruxoRoubar !== 'undefined' && modoBruxoRoubar === true) {
            let idAlvo = idDoPacote.replace("pacote-", "");
            converterCartaRoubada(idAlvo, true); // 🩹 rouba e garante que fica 100% sua (classe + ataque)
            
            let pacoteBruxo = document.getElementById("pacote-" + idBruxoAtivo);
            if (pacoteBruxo) pacoteBruxo.remove(); // Bruxo some
            
            gerarPocaoAleatoria("mao-j1"); // Bruxo vira poção na sua mão
            modoBruxoRoubar = false;
            idBruxoAtivo = null;
            narrar("Dominação Mental! Carta roubada e o Bruxo recuou como Poção!");
            return;
        }
        else if (modoProtecaoBarril === true) {
            if (idSemPacote === idBarrilProtetor) {
                narrar("❌ O Barril não pode proteger a si mesmo! Escolha outra carta.");
            } else {
                cartasProtegidas[idSemPacote] = idBarrilProtetor;
                ativarVisualProtecaoBarril(idSemPacote, idBarrilProtetor);
                narrar(`🛡️ Vínculo criado! O Barril agora dará a vida para proteger esta carta!`);
            }
            modoProtecaoBarril = false; idBarrilProtetor = null;
        }
        else if (modoProtecaoBarrilInimigo === true) {
            if (idSemPacoteLocal === idBarrilProtetor) {
                narrar("❌ O Barril não pode proteger a si mesmo! Escolha outra carta.");
            } else {
                cartasProtegidas[idSemPacoteLocal] = idBarrilProtetor;
                ativarVisualProtecaoBarril(idSemPacoteLocal, idBarrilProtetor);
                narrar(`🛡️ Vínculo criado! O Barril inimigo agora protegerá esta carta!`);
            }
            modoProtecaoBarrilInimigo = false; idBarrilProtetor = null;
        }
        else if (suportePreparado !== null) {
            if (ehAliado && !idItemNaMao.includes("inimigo")) equiparSuporte(idSemPacote);
            else if (!ehAliado && idItemNaMao.includes("inimigo")) equiparSuporte(idSemPacote);
            else narrar("Ação inválida para este suporte!");
        }
        else if (ehAliado) iniciarAtaque(novaCarta.nome, idUnico);
        else receberAtaque("vida-" + idSemPacote, idDoPacote);
    };
    
    let divAcoes = pacoteNovo.querySelector("div[id^='acoes-']");
    if (divAcoes) divAcoes.style.display = "block";

    atualizarTodosUnidoes();
    return pacoteNovo;
}
function invocarTokenPeloNomeSemHabilidade(nomeCarta, idCampo) {
    let cartaBase = bancoDeCartas.find(c => c.nome === nomeCarta);
    if (!cartaBase) return;
    
    let idUnico = cartaBase.id + "-token-" + Math.floor(Math.random() * 10000);
    let novaCarta = { ...cartaBase, idUnico: idUnico };
    
    let ehAliado = idCampo === "campo-j1";
    let html = criarHTMLCarta(novaCarta, ehAliado ? "jogarCarta" : "jogarCartaInimigo", ehAliado ? "carta-aliada" : "carta-inimiga", ehAliado);
    
    let tempDiv = document.createElement("div");
    tempDiv.innerHTML = html.trim();
    let pacoteNovo = tempDiv.firstChild;
    
    document.getElementById(idCampo).appendChild(pacoteNovo);

    let img = pacoteNovo.querySelector("img") || pacoteNovo.querySelector(".imagem-carta");
    if (img) {
        img.removeAttribute("onclick");
        img.onclick = function() {
            let idDoPacote = "pacote-" + idUnico;
            let idSemPacote = idUnico;

            // ❄️ POÇÃO DE GELO (ALVO SIMPLES) — faltava nos tokens
            if (typeof modoGeloSimples !== 'undefined' && modoGeloSimples === true) {
                let pacoteAlvo = document.getElementById(idDoPacote);
                let pacotePocao = document.getElementById("pacote-" + idPocaoAtiva);
                let quemJogouGelo = pacotePocao && pacotePocao.parentElement ? pacotePocao.parentElement.id : "";
                let alvoEhJ1 = pacoteAlvo.closest("#campo-j1") !== null || pacoteAlvo.closest("#mao-j1") !== null;
                let alvoEhJ2 = pacoteAlvo.closest("#campo-j2") !== null || pacoteAlvo.closest("#mao-j2") !== null;
                if ((quemJogouGelo.includes("j1") && alvoEhJ1) || (quemJogouGelo.includes("j2") && alvoEhJ2)) {
                    return narrar("❌ Alvo inválido! A Poção de Gelo só pode ser usada em cartas do OPONENTE.");
                }
                pacoteAlvo.classList.add("congelada");
                duracaoGelo[idSemPacote] = 3; // Gelo Simples: duração menor que os efeitos em área
                if (pacotePocao) pacotePocao.remove();
                modoGeloSimples = false;
                idPocaoAtiva = null;
                narrar("❄️ Alvo atingido e congelado pelo Gelo Simples!");
                return;
            }

            // 🛡️ ADICIONADO: Interceção para criar vínculo no Token Aliado
            if (typeof modoProtecaoBarril !== 'undefined' && modoProtecaoBarril && ehAliado) {
                let protegerASiMesmo = (idSemPacote === idBarrilProtetor);
                if (!protegerASiMesmo) {
                    cartasProtegidas[idSemPacote] = idBarrilProtetor;
                    ativarVisualProtecaoBarril(idSemPacote, idBarrilProtetor);
                }
                modoProtecaoBarril = false; idBarrilProtetor = null;
                return narrar(protegerASiMesmo ? "❌ O Barril não pode proteger a si mesmo! Escolha outra carta." : `🛡️ Vínculo criado! O Barril agora dará a vida para proteger este token!`);
            }
            // 🛡️ ADICIONADO: Interceção para criar vínculo no Token Inimigo
            else if (typeof modoProtecaoBarrilInimigo !== 'undefined' && modoProtecaoBarrilInimigo && !ehAliado) {
                let protegerASiMesmo = (idSemPacote === idBarrilProtetor);
                if (!protegerASiMesmo) {
                    cartasProtegidas[idSemPacote] = idBarrilProtetor;
                    ativarVisualProtecaoBarril(idSemPacote, idBarrilProtetor);
                }
                modoProtecaoBarrilInimigo = false; idBarrilProtetor = null;
                return narrar(protegerASiMesmo ? "❌ O Barril não pode proteger a si mesmo! Escolha outra carta." : `🛡️ Vínculo criado! O Barril inimigo agora protegerá este token!`);
            }
            else if (typeof modoTraicao !== 'undefined' && modoTraicao) { executarTraicao(idDoPacote); return; }
            // 💰 LADRÃO — faltava nos tokens (mesma lógica dos dois lados normais)
            else if (typeof modoLadrao !== 'undefined' && modoLadrao === true && ehAliado && turnoAtivo === 1 && faseLadrao === 2) aplicarRouboBeneficio(idDoPacote);
            else if (typeof modoLadrao !== 'undefined' && modoLadrao === true && ehAliado && turnoAtivo === 2 && faseLadrao === 1) aplicarRouboPrejuizo(idDoPacote);
            else if (typeof modoLadrao !== 'undefined' && modoLadrao === true && !ehAliado && turnoAtivo === 1 && faseLadrao === 1) aplicarRouboPrejuizo(idDoPacote);
            else if (typeof modoLadrao !== 'undefined' && modoLadrao === true && !ehAliado && turnoAtivo === 2 && faseLadrao === 2) aplicarRouboBeneficio(idDoPacote);
            // 🩹 CORREÇÃO: mesma trava dos outros três lugares — clicar no alvo errado durante
            // o roubo do Ladrão vazava pra outra ação em vez de avisar.
            else if (typeof modoLadrao !== 'undefined' && modoLadrao === true) narrar("❌ Alvo inválido para o Ladrão! Clique na carta certa pra continuar o roubo.");
            else if (typeof modoAtaqueInimigo !== 'undefined' && modoAtaqueInimigo && ehAliado) aplicarDanoInimigo(idDoPacote);
            else if (typeof modoCura !== 'undefined' && modoCura && ehAliado) aplicarCuraAliada(idDoPacote);
            else if (typeof modoCuraInimigo !== 'undefined' && modoCuraInimigo && !ehAliado) aplicarCuraInimiga(idDoPacote);
            // 🩸 ROUBO DE DANO DO GOBLIN — faltava nos tokens
            else if (typeof modoRouboGoblin !== 'undefined' && modoRouboGoblin === true) aplicarRouboDanoGoblin(idDoPacote);
            else if (typeof modoAlvoBarril !== 'undefined' && modoAlvoBarril && !ehAliado) aplicarAlvoBarril(idDoPacote);
            else if (typeof modoAlvoBarrilBarbaro !== 'undefined' && (modoAlvoBarrilBarbaro || modoAlvoBarrilBarbaroInimigo)) aplicarAlvoBarrilBarbaro(idDoPacote);
            else if (typeof modoEspecialBarrilGoblin !== 'undefined' && modoEspecialBarrilGoblin === true) aplicarAlvoBarril(idDoPacote, true);
            else if (typeof modoEspecialBumerskeleton !== 'undefined' && modoEspecialBumerskeleton === true) aplicarEspecialBumerskeletonAntesDeAtacar(idDoPacote);
            // ⚔️ CAVALEIRO DAS TREVAS — faltava nos tokens (as duas direções)
            else if (typeof modoAlvoCavaleiro !== 'undefined' && modoAlvoCavaleiro === true && !ehAliado) aplicarAlvoCavaleiro(idDoPacote);
            else if (typeof modoAlvoCavaleiroInimigo !== 'undefined' && modoAlvoCavaleiroInimigo === true && ehAliado) aplicarAlvoCavaleiroInimigo(idDoPacote);
            // 🎨 ÍCARO / ⚖️ THIAGO / 👥 SEPARADO / ⏳ VIAJANTE DO TEMPO — faltavam nos tokens
            else if (typeof modoTransformacaoIcaro !== 'undefined' && modoTransformacaoIcaro === true) aplicarTransformacaoIcaro(idDoPacote);
            else if (typeof modoAjusteThiago !== 'undefined' && modoAjusteThiago === true) aplicarAjusteThiago(idDoPacote);
            else if (typeof modoParceriaSeparado !== 'undefined' && modoParceriaSeparado === true) aplicarParceriaSeparado(idDoPacote);
            else if (typeof modoPrenderNoTempo !== 'undefined' && modoPrenderNoTempo === true) aplicarPrenderNoTempo(idDoPacote);
            else if (typeof suportePreparado !== 'undefined' && suportePreparado !== null) equiparSuporte(idSemPacote);
            else if (ehAliado) iniciarAtaque(novaCarta.nome, idSemPacote);
            else receberAtaque("vida-" + idSemPacote, idDoPacote);
        };
    }
    
    let divAcoes = pacoteNovo.querySelector("div[id^='acoes-']");
    if (divAcoes) {
        divAcoes.style.display = "block";
        let btnEspecial = divAcoes.querySelector("button[onclick*='usarHabilidade']");
        if (btnEspecial) btnEspecial.remove(); 
    }

    pacoteNovo.querySelector(".nome-carta").innerText += " (S/Hab)";

    if (typeof atualizarTodosUnidoes === "function") atualizarTodosUnidoes();
    return pacoteNovo;
}

// 🩹 CORREÇÃO: depois do Bruxo roubar uma carta, ela só era MOVIDA de lado (appendChild),
// mas continuava com a classe CSS e o botão "Atacar" do dono ORIGINAL — por isso não dava
// pra atacar com ela depois. Esta função reconstrói a cartinha do zero (preservando vida
// e dano atuais) já com a classe, o botão de ataque e o clique de batalha do NOVO dono.
function converterCartaRoubada(idUnico, novoDonoEhJ1) {
    let pacoteAtual = document.getElementById("pacote-" + idUnico);
    if (!pacoteAtual) return;

    let nome = pacoteAtual.querySelector(".nome-carta").innerText.trim();
    let imgSrc = pacoteAtual.querySelector("img").getAttribute("src");
    let vidaEl = document.getElementById("vida-" + idUnico);
    let danoEl = document.getElementById("dano-" + idUnico);
    let vidaAtual = vidaEl ? vidaEl.innerText : "0";
    let danoAtual = danoEl ? danoEl.innerText : "0";
    let estavaCongelada = pacoteAtual.classList.contains("congelada");

    let cartaObj = { nome: nome, idUnico: idUnico, img: imgSrc, vida: vidaAtual, dano: danoAtual };
    let classeCss = novoDonoEhJ1 ? "carta-aliada" : "carta-inimiga";
    let funcaoJogar = novoDonoEhJ1 ? "jogarCarta" : "jogarCartaInimigo";
    let html = criarHTMLCarta(cartaObj, funcaoJogar, classeCss, novoDonoEhJ1);

    let temp = document.createElement("div");
    temp.innerHTML = html.trim();
    let novoElemento = temp.firstElementChild;

    let campoDestino = document.getElementById(novoDonoEhJ1 ? "campo-j1" : "campo-j2");
    campoDestino.appendChild(novoElemento);
    pacoteAtual.remove();

    if (estavaCongelada) novoElemento.classList.add("congelada");

    // Faz a carta "entrar em modo de batalha" de verdade (ataque, traição, etc já funcionando)
    if (novoDonoEhJ1) jogarCarta("pacote-" + idUnico);
    else jogarCartaInimigo("pacote-" + idUnico);

    return novoElemento;
}

// 🔥 Cura TODAS as tropas de um lado — campo e mão — ignorando suportes/poções.
// Mesmo padrão de filtro usado na explosão do Cavalo de Tróia.
function curarTodosAliados(lado, quantidade) {
    let campoAliado = document.getElementById("campo-" + lado);
    if (campoAliado) {
        let cartasCampo = Array.from(campoAliado.querySelectorAll("div[id^='pacote-']"));
        cartasCampo.forEach(pacote => {
            // Cura = dano negativo, reaproveitando aplicarDanoDireto (já bloqueia o Cavalo de Tróia).
            aplicarDanoDireto(pacote.id, -quantidade, lado === "j2");
        });
    }

    let maoAliada = document.getElementById("mao-" + lado);
    if (maoAliada) {
        let cartasMao = Array.from(maoAliada.querySelectorAll("div[id^='pacote-']"));
        cartasMao.forEach(pacote => {
            let idPuro = pacote.id.replace("pacote-", "");

            let infoCarta = bancoDeCartas
                .filter(c => idPuro === c.id || idPuro.startsWith(c.id + "_") || idPuro.startsWith(c.id + "-"))
                .sort((a, b) => b.id.length - a.id.length)[0];
            let ehSuporte = infoCarta && suportesReais.includes(infoCarta.id);
            if (ehSuporte) return;

            let txtVida = document.getElementById("vida-" + idPuro);
            if (!txtVida) return;
            txtVida.innerText = parseFloat(txtVida.innerText) + quantidade;
        });
    }
}

// 🔥 FOGUEIRA — cura 1 de vida em todas as tropas aliadas (campo + mão) na hora, e agenda
// mais 1 cura igual depois de 1 rodada completa (2 curas no total, 1 por rodada, 2 rodadas).
function usarFogueira(idItem, lado) {
    let pacoteItem = document.getElementById("pacote-" + idItem);
    if (!pacoteItem) return;
    pacoteItem.remove();

    curarTodosAliados(lado, 1);
    fogueiraTicks[lado].push(2); // 2 passagens de turno = 1 rodada completa até a 2ª cura

    narrar("🔥 A Fogueira acendeu! Todas as tropas do time (campo e mão) curaram 1 de vida — e vão curar mais 1 daqui a 1 rodada!");
    if (typeof atualizarTodosUnidoes === "function") atualizarTodosUnidoes();
}

function jogarCarta(idDoPacote, somentePrepararCampo = false) {
    if (typeof idDoPacote !== "string") return;
    if (faseAbertura === true) return escolherCartaAbertura(idDoPacote, 1);

    let pacoteCarta = document.getElementById(idDoPacote);
    if (!pacoteCarta) return; 

    let idSemPacote = idDoPacote.replace("pacote-", "");
    let estaNaMao = pacoteCarta.parentElement && pacoteCarta.parentElement.id.includes("mao");
    
    let nomeDaCartaHtml = pacoteCarta.querySelector(".nome-carta").innerText.trim(); 
    let textoBusca = nomeDaCartaHtml.toLowerCase();

    // 🚨 ROTA 1: ITENS E POÇÕES
    
    if (textoBusca.includes("Poção de Gelo") || textoBusca.includes("gelo")) {
    return usarHabilidade("Poção de Gelo", idSemPacote, null);
}
    if (textoBusca.includes("besta")) return ativarSuporte("Besta", idSemPacote);
    if (textoBusca.includes("auvex")) return ativarSuporte("Auvex", idSemPacote);
    if (textoBusca.includes("velux") || textoBusca.includes("veluz")) return ativarSuporte("Velux", idSemPacote);
    if (textoBusca.includes("adiv")) return ativarSuporte("Adiv", idSemPacote);
    if (textoBusca.includes("recuperida")) return ativarSuporte("Recuperida", idSemPacote);
    if (textoBusca.includes("plus life")) return ativarSuporte("PlusLife", idSemPacote);
    if (textoBusca.includes("reviverta")) return usarReviverta(idSemPacote, true);
    if (textoBusca.includes("cracker")) return usarCracker(idSemPacote, true);
    if (textoBusca.includes("allsforms")) return usarAllsforms(idSemPacote, true);
    if (textoBusca.includes("dupliquetion")) return usarDupliquetion(idSemPacote, true);
    if (textoBusca.includes("traição") || textoBusca.includes("traicao")) return ativarSuporte("Traicao", idSemPacote);
    if (textoBusca.includes("escudo")) return ativarSuporte("Escudo", idSemPacote);
    if (textoBusca.includes("fogueira")) return usarFogueira(idSemPacote, "j1");

    // 🚨 ROTA 2: CRIATURAS NORMAIS
    if (estaNaMao) {

        if (pacoteCarta.classList.contains("congelada")) {
            narrar("❄️ Esta carta está congelada na sua mão e não pode ir para o campo!");
            return;
        }

        if (bloqueioNecro[idSemPacote] && bloqueioNecro[idSemPacote] > 0) return narrar("⏳ FADIGA! Esta carta precisa descansar.");
        
        document.getElementById("campo-j1").appendChild(pacoteCarta);
        narrar("Você invocou uma criatura no campo!");

        if (nomeDaCartaHtml === 'Cavalo de Tróia') {
            cavalosDeTroiaAtivos[idSemPacote] = 4; // 2 rodadas = 4 passagens de turno
            narrar("🐴 O Cavalo de Tróia foi posicionado! Em 2 rodadas ele vai se abrir, causando 1 de dano em TODAS as cartas inimigas (campo e mão)!");
        }

        if (nomeDaCartaHtml === 'Separado' || nomeDaCartaHtml === 'Separadois') {
            let outrosAliados = Array.from(document.getElementById("campo-j1").getElementsByClassName("carta-aliada")).filter(p => p.id !== "pacote-" + idSemPacote);
            if (outrosAliados.length > 0) {
                modoParceriaSeparado = true;
                idSeparadoParceriaAtivo = idSemPacote;
                narrar(`👥 ${nomeDaCartaHtml} entrou em campo! Clique em outra carta sua pra ela virar parceira (vão atacar juntas o mesmo alvo).`);
            } else {
                narrar(`👥 ${nomeDaCartaHtml} entrou em campo, mas não tem nenhuma outra carta sua pra ser parceira ainda — vai atacar sozinho por enquanto.`);
            }
        }

        if (nomeDaCartaHtml === 'Incendiário') {
            narrar("🔥 Incendiário entrou em campo! Use o botão \"Jogar Pólvora\" quando houver um alvo na arena.");
        }

        if (nomeDaCartaHtml === 'Portable') {
            portableDuracao[idSemPacote] = 4; // 2 rodadas = 4 passagens de turno
            narrar("🛸 Portable entrou em campo! Por 2 rodadas, ele ataca junto de qualquer carta sua que atacar. Depois a bateria acaba e ele some.");
        }
    }

    let cartaBase = bancoDeCartas.find(c => c.nome === nomeDaCartaHtml);
    if (!somentePrepararCampo && cartaBase) ultimaCartaJogador = cartaBase;

    let imagem = pacoteCarta.querySelector("img");
    imagem.removeAttribute("onclick"); 
    
imagem.onclick = function() {
        
    // 🧪 2º PRIORIDADE: BRUXO (TRANSFORMAR 4)
        if (typeof modoBruxoTransformar !== 'undefined' && modoBruxoTransformar === true) {
            let pacoteAlvo = document.getElementById(idDoPacote);
            
            // 🚀 DEDUZ O DONO DO BRUXO ATIVO PARA DAR A POÇÃO NA MÃO CERTA
            let oBruxoEAliado = document.getElementById("pacote-" + idBruxoAtivo).closest("#campo-j1") !== null;
            let maoDoDonoDoBruxo = oBruxoEAliado ? "mao-j1" : "mao-j2";

            animarPocaoBruxo(idBruxoAtivo, idDoPacote.replace("pacote-", ""), "transformar");
            pacoteAlvo.remove(); // Remove a carta inimiga do campo
            
            // Cria a poção na mão de quem usou o Bruxo (tamanho correto)
            gerarPocaoAleatoria(maoDoDonoDoBruxo); 
            
            modoBruxoTransformar = false;
            idBruxoAtivo = null;
            narrar("✨ ZAP! A carta inimiga virou pó e o Bruxo destilou uma poção pequena na sua mão!");
            return; 
        }

        // 🔮 3º PRIORIDADE: BRUXO (ROUBAR 6)
        if (typeof modoBruxoRoubar !== 'undefined' && modoBruxoRoubar === true) {
            let pacoteAlvo = document.getElementById(idDoPacote);
            let pacoteBruxo = document.getElementById("pacote-" + idBruxoAtivo);

            if (!pacoteBruxo) {
                narrar("Erro: Não encontrei o Bruxo na arena!");
                modoBruxoRoubar = false;
                return;
            }

            // 🚀 DEDUZ O DONO DO BRUXO ATIVO PARA O ROUBO E TRANSFORMAÇÃO
            let oBruxoEAliado = pacoteBruxo.closest("#campo-j1") !== null;
            let campoDoDonoDoBruxo = oBruxoEAliado ? document.getElementById("campo-j1") : document.getElementById("campo-j2");
            let maoDoDonoDoBruxo = oBruxoEAliado ? "mao-j1" : "mao-j2";

            // 1. ROUBA A CARTA: reconstrói no campo de quem usou o Bruxo, já 100% do novo dono
            let origemRouboBruxo = animarPocaoBruxo(idBruxoAtivo, idDoPacote.replace("pacote-", ""), "roubar");
            let cartaRoubadaBruxo = converterCartaRoubada(idDoPacote.replace("pacote-", ""), oBruxoEAliado);
            animarCartaRoubadaBruxo(cartaRoubadaBruxo, origemRouboBruxo);
            
            // 2. O BRUXO VIRA POÇÃO: Remove o Bruxo do campo
            animarBruxoVirandoPocao(idBruxoAtivo);
            pacoteBruxo.remove(); 
            
            // 3. Cria a poção na mão de quem usou o Bruxo (tamanho correto)
            gerarPocaoAleatoria(maoDoDonoDoBruxo);

            modoBruxoRoubar = false;
            idBruxoAtivo = null;
            narrar("🔮 Dominação Mental! Carta roubada, e o Bruxo recuou como poção pequena na sua mão!");
            return;
        }
    // 🛡️ 1º PRIORIDADE: VÍNCULO DO BARRIL ALIADO
        if (typeof modoProtecaoBarril !== 'undefined' && modoProtecaoBarril === true) {
            if (idSemPacote === idBarrilProtetor) {
                narrar("❌ O Barril não pode proteger a si mesmo! Escolha outra carta.");
            } else {
                cartasProtegidas[idSemPacote] = idBarrilProtetor; // idSemPacote já está sem o "pacote-"
                ativarVisualProtecaoBarril(idSemPacote, idBarrilProtetor);
                narrar("🛡️ Vínculo criado! O Barril agora dará a vida para proteger esta carta!");
            }
            modoProtecaoBarril = false; 
            idBarrilProtetor = null;
            return;
        }
            // ❄️ POÇÃO DE GELO (ALVO SIMPLES - SEU LADO CLICANDO)
        if (typeof modoGeloSimples !== 'undefined' && modoGeloSimples === true) {
            let pacoteAlvo = document.getElementById(idDoPacote);
            let pacotePocao = document.getElementById("pacote-" + idPocaoAtiva);
            let quemJogouGelo = pacotePocao && pacotePocao.parentElement ? pacotePocao.parentElement.id : "";
            let alvoEhJ1 = pacoteAlvo.closest("#campo-j1") !== null || pacoteAlvo.closest("#mao-j1") !== null;
            let alvoEhJ2 = pacoteAlvo.closest("#campo-j2") !== null || pacoteAlvo.closest("#mao-j2") !== null;

            if ((quemJogouGelo.includes("j1") && alvoEhJ1) || (quemJogouGelo.includes("j2") && alvoEhJ2)) {
                return narrar("❌ Alvo inválido! A Poção de Gelo só pode ser usada em cartas do OPONENTE.");
            }

            pacoteAlvo.classList.add("congelada");

            let idAlvo = idDoPacote.replace("pacote-", "");
            duracaoGelo[idAlvo] = 3; // Gelo Simples: duração menor que os efeitos em área

            if (pacotePocao) pacotePocao.remove();

            modoGeloSimples = false;
            idPocaoAtiva = null;
            narrar("❄️ Alvo atingido e congelado pelo Gelo Simples!");
            return;
        }
        else if (modoTraicao === true) executarTraicao(idDoPacote);
        else if (modoLadrao === true && turnoAtivo === 1 && faseLadrao === 2) aplicarRouboBeneficio(idDoPacote);
        else if (modoLadrao === true && turnoAtivo === 2 && faseLadrao === 1) aplicarRouboPrejuizo(idDoPacote);
        // 🩹 CORREÇÃO: clicar no lado/fase errada durante o roubo do Ladrão "vazava" pra ação
        // padrão (ex: atacar) em vez de avisar — o roubo continuava ativo escondido, e várias
        // vezes seguidas parecia que a passiva tinha "travado". Agora só avisa e mantém o roubo.
        else if (modoLadrao === true) narrar("❌ Alvo inválido para o Ladrão! Clique na carta certa pra continuar o roubo.");
        else if (modoAtaqueInimigo === true) aplicarDanoInimigo(idDoPacote);
        else if (modoAlvoBarrilBarbaro === true || modoAlvoBarrilBarbaroInimigo === true) aplicarAlvoBarrilBarbaro(idDoPacote);
        else if (modoCura === true) aplicarCuraAliada(idDoPacote);
        else if (modoRouboGoblin === true) aplicarRouboDanoGoblin(idDoPacote);
        else if (modoAlvoBarril === true) aplicarAlvoBarril(idDoPacote);
        else if (typeof modoEspecialBarrilGoblin !== 'undefined' && modoEspecialBarrilGoblin === true) aplicarAlvoBarril(idDoPacote, true);
        else if (typeof modoEspecialBumerskeleton !== 'undefined' && modoEspecialBumerskeleton === true) aplicarEspecialBumerskeletonAntesDeAtacar(idDoPacote);
        else if (modoAlvoCavaleiroInimigo === true) aplicarAlvoCavaleiroInimigo(idDoPacote);
        else if (modoTransformacaoIcaro === true) aplicarTransformacaoIcaro(idDoPacote);
        else if (modoAjusteThiago === true) aplicarAjusteThiago(idDoPacote);
        else if (modoParceriaSeparado === true) aplicarParceriaSeparado(idDoPacote);
        else if (modoPrenderNoTempo === true) aplicarPrenderNoTempo(idDoPacote);
        else if (suportePreparado !== null) { 
            equiparSuporte(idSemPacote);
        } else {
            iniciarAtaque(nomeDaCartaHtml, idSemPacote);
        }
    };
    imagem.style.cursor = "pointer";

    let divAcoes = pacoteCarta.querySelector("div[id^='acoes-']");
    if (divAcoes) divAcoes.style.display = "block"; 
   
    if (!somentePrepararCampo) {
        let cartaParaPassiva = { nome: nomeDaCartaHtml, passivaAtivada: false };
        if (typeof verificarPassivaNecromante === "function") verificarPassivaNecromante(cartaParaPassiva, true);
    }

    atualizarTodosUnidoes();
}

function jogarCartaInimigo(idDoPacote, somentePrepararCampo = false) {
    if (typeof idDoPacote !== "string") return;
    if (faseAbertura === true) return escolherCartaAbertura(idDoPacote, 2);

    let pacoteCarta = document.getElementById(idDoPacote);
    if (!pacoteCarta) return;

    let idSemPacote = idDoPacote.replace("pacote-", "");
    let estaNaMao = pacoteCarta.parentElement && pacoteCarta.parentElement.id.includes("mao");
    
    let nomeDaCartaHtml = pacoteCarta.querySelector(".nome-carta").innerText.trim();
    let textoBusca = nomeDaCartaHtml.toLowerCase();

    // 🚨 ROTA 1: ITENS E POÇÕES
    if (textoBusca.includes("gelo") || textoBusca.includes("Poção de Gelo")) {
    return usarHabilidade("Poção de Gelo", idSemPacote, null); // Ativa o poder direto da mão!
}
    if (textoBusca.includes("besta")) return ativarSuporte("Besta", idSemPacote);
    if (textoBusca.includes("auvex")) return ativarSuporte("Auvex", idSemPacote);
    if (textoBusca.includes("velux") || textoBusca.includes("veluz")) return ativarSuporte("Velux", idSemPacote);
    if (textoBusca.includes("adiv")) return ativarSuporte("Adiv", idSemPacote);
    if (textoBusca.includes("recuperida")) return ativarSuporte("Recuperida", idSemPacote);
    if (textoBusca.includes("plus life")) return ativarSuporte("PlusLife", idSemPacote);
    if (textoBusca.includes("reviverta")) return usarReviverta(idSemPacote, false);
    if (textoBusca.includes("cracker")) return usarCracker(idSemPacote, false);
    if (textoBusca.includes("allsforms")) return usarAllsforms(idSemPacote, false);
    if (textoBusca.includes("dupliquetion")) return usarDupliquetion(idSemPacote, false);
    if (textoBusca.includes("traição") || textoBusca.includes("traicao")) return ativarSuporte("Traicao", idSemPacote);
    if (textoBusca.includes("escudo")) return ativarSuporte("Escudo", idSemPacote);
    if (textoBusca.includes("fogueira")) return usarFogueira(idSemPacote, "j2");

    // 🚨 ROTA 2: CRIATURAS INIMIGAS
    if (estaNaMao) {

        if (pacoteCarta.classList.contains("congelada")) {
            narrar("❄️ Esta carta está congelada na mão do oponente e não pode ser invocada!");
            return;
        }
        if (bloqueioNecro[idSemPacote] && bloqueioNecro[idSemPacote] > 0) return narrar("⏳ FADIGA! A carta precisa descansar.");

        document.getElementById("campo-j2").appendChild(pacoteCarta);
        narrar("O Oponente invocou uma criatura no campo!");

        if (nomeDaCartaHtml === 'Cavalo de Tróia') {
            cavalosDeTroiaAtivos[idSemPacote] = 4; // 2 rodadas = 4 passagens de turno
            narrar("🐴 O Cavalo de Tróia inimigo foi posicionado! Em 2 rodadas ele vai se abrir, causando 1 de dano em TODAS as suas cartas (campo e mão)!");
        }

        if (nomeDaCartaHtml === 'Separado' || nomeDaCartaHtml === 'Separadois') {
            let outrosAliados = Array.from(document.getElementById("campo-j2").getElementsByClassName("carta-inimiga")).filter(p => p.id !== "pacote-" + idSemPacote);
            if (outrosAliados.length > 0) {
                modoParceriaSeparado = true;
                idSeparadoParceriaAtivo = idSemPacote;
                narrar(`👥 ${nomeDaCartaHtml} inimigo entrou em campo! O Oponente vai escolher outra carta dele pra ser parceira.`);
            } else {
                narrar(`👥 ${nomeDaCartaHtml} inimigo entrou em campo, mas ainda não tem outra carta pra ser parceira.`);
            }
        }

        if (nomeDaCartaHtml === 'Incendiário') {
            narrar("🔥 Incendiário inimigo entrou em campo! Ele vai jogar a pólvora quando houver um alvo na arena.");
        }

        if (nomeDaCartaHtml === 'Portable') {
            portableDuracao[idSemPacote] = 4; // 2 rodadas = 4 passagens de turno
            narrar("🛸 Portable inimigo entrou em campo! Por 2 rodadas, ele ataca junto de qualquer carta do time dele que atacar. Depois a bateria acaba e ele some.");
        }
    }
    
    pacoteCarta.className = "carta-inimiga";

    let cartaBase = bancoDeCartas.find(c => c.nome === nomeDaCartaHtml);
    if (!somentePrepararCampo && cartaBase) ultimaCartaOponente = cartaBase;

    let imagem = pacoteCarta.querySelector("img");
    imagem.removeAttribute("onclick");
    
    imagem.onclick = function() {
        let idSemPacoteLocal = idDoPacote.replace("pacote-", "");

        // ❄️ POÇÃO DE GELO (ALVO SIMPLES - SEU LADO CLICANDO NO INIMIGO)
        if (typeof modoGeloSimples !== 'undefined' && modoGeloSimples === true) {
            let pacoteAlvo = document.getElementById(idDoPacote);
            let pacotePocao = document.getElementById("pacote-" + idPocaoAtiva);
            let quemJogouGelo = pacotePocao && pacotePocao.parentElement ? pacotePocao.parentElement.id : "";
            let alvoEhJ1 = pacoteAlvo.closest("#campo-j1") !== null || pacoteAlvo.closest("#mao-j1") !== null;
            let alvoEhJ2 = pacoteAlvo.closest("#campo-j2") !== null || pacoteAlvo.closest("#mao-j2") !== null;

            if ((quemJogouGelo.includes("j1") && alvoEhJ1) || (quemJogouGelo.includes("j2") && alvoEhJ2)) {
                return narrar("❌ Alvo inválido! A Poção de Gelo só pode ser usada em cartas do OPONENTE.");
            }

            pacoteAlvo.classList.add("congelada");

            let idAlvo = idDoPacote.replace("pacote-", "");
            duracaoGelo[idAlvo] = 3; // Gelo Simples: duração menor que os efeitos em área

            if (pacotePocao) pacotePocao.remove();

            modoGeloSimples = false;
            idPocaoAtiva = null;
            narrar("❄️ Inimigo atingido e congelado pelo Gelo Simples!");
            return;
        }
        if (modoTraicao === true) { executarTraicao(idDoPacote); return; }
        else if (modoLadrao === true && turnoAtivo === 1 && faseLadrao === 1) aplicarRouboPrejuizo(idDoPacote);
        else if (modoLadrao === true && turnoAtivo === 2 && faseLadrao === 2) aplicarRouboBeneficio(idDoPacote);
        // 🩹 CORREÇÃO: mesmo problema do outro lado — clicar no alvo errado durante o roubo
        // vazava pra outra ação em vez de avisar, deixando o roubo pendurado escondido.
        else if (modoLadrao === true) narrar("❌ Alvo inválido para o Ladrão! Clique na carta certa pra continuar o roubo.");
        else if (modoCuraInimigo === true) aplicarCuraInimiga(idDoPacote);
        else if (modoAlvoBarrilBarbaro === true || modoAlvoBarrilBarbaroInimigo === true) aplicarAlvoBarrilBarbaro(idDoPacote);
        else if (modoRouboGoblin === true) aplicarRouboDanoGoblin(idDoPacote); 
        else if (modoAlvoBarril === true) aplicarAlvoBarril(idDoPacote);
        else if (typeof modoEspecialBarrilGoblin !== 'undefined' && modoEspecialBarrilGoblin === true) aplicarAlvoBarril(idDoPacote, true);
        else if (typeof modoEspecialBumerskeleton !== 'undefined' && modoEspecialBumerskeleton === true) aplicarEspecialBumerskeletonAntesDeAtacar(idDoPacote);
        else if (modoAlvoCavaleiro === true) aplicarAlvoCavaleiro(idDoPacote);
        else if (modoTransformacaoIcaro === true) aplicarTransformacaoIcaro(idDoPacote);
        else if (modoAjusteThiago === true) aplicarAjusteThiago(idDoPacote);
        else if (modoParceriaSeparado === true) aplicarParceriaSeparado(idDoPacote);
        else if (modoPrenderNoTempo === true) aplicarPrenderNoTempo(idDoPacote);
        // 🧪 BRUXO (TRANSFORMAR 4)
        else if (typeof modoBruxoTransformar !== 'undefined' && modoBruxoTransformar === true) {
            let pacoteAlvo = document.getElementById(idDoPacote);
            let oBruxoEAliado = document.getElementById("pacote-" + idBruxoAtivo).closest("#campo-j1") !== null;
            let maoDoDonoDoBruxo = oBruxoEAliado ? "mao-j1" : "mao-j2";

            animarPocaoBruxo(idBruxoAtivo, idDoPacote.replace("pacote-", ""), "transformar");
            pacoteAlvo.remove(); 
            gerarPocaoAleatoria(maoDoDonoDoBruxo); 
            
            modoBruxoTransformar = false;
            idBruxoAtivo = null;
            narrar("✨ ZAP! A carta inimiga virou pó e destilou uma poção pequena na sua mão!");
            return; 
        }

        // 🔮 BRUXO (ROUBAR 6)
        else if (typeof modoBruxoRoubar !== 'undefined' && modoBruxoRoubar === true) {
            let pacoteAlvo = document.getElementById(idDoPacote);
            let pacoteBruxo = document.getElementById("pacote-" + idBruxoAtivo);

            if (!pacoteBruxo) return narrar("Erro: O Bruxo evaporou antes da hora!");

            let oBruxoEAliado = pacoteBruxo.closest("#campo-j1") !== null;
            let campoDoDonoDoBruxo = oBruxoEAliado ? document.getElementById("campo-j1") : document.getElementById("campo-j2");
            let maoDoDonoDoBruxo = oBruxoEAliado ? "mao-j1" : "mao-j2";

            let origemRouboBruxo = animarPocaoBruxo(idBruxoAtivo, idDoPacote.replace("pacote-", ""), "roubar");
            let cartaRoubadaBruxo = converterCartaRoubada(idDoPacote.replace("pacote-", ""), oBruxoEAliado); // rouba a carta, já 100% do novo dono
            animarCartaRoubadaBruxo(cartaRoubadaBruxo, origemRouboBruxo);
            animarBruxoVirandoPocao(idBruxoAtivo);
            pacoteBruxo.remove(); // Some com o bruxo
            gerarPocaoAleatoria(maoDoDonoDoBruxo); // Manda poção pra mão de quem roubou

            modoBruxoRoubar = false;
            idBruxoAtivo = null;
            narrar("🔮 Dominação Mental! Carta roubada, e o Bruxo recuou como poção!");
            return;
        }
        else if (typeof modoProtecaoBarrilInimigo !== 'undefined' && modoProtecaoBarrilInimigo === true) {
        let protegerASiMesmo = (idSemPacote === idBarrilProtetor);
        if (!protegerASiMesmo) {
            cartasProtegidas[idSemPacote] = idBarrilProtetor;
            ativarVisualProtecaoBarril(idSemPacote, idBarrilProtetor);
        }
        modoProtecaoBarrilInimigo = false; 
        idBarrilProtetor = null;
        return narrar(protegerASiMesmo ? "❌ O Barril não pode proteger a si mesmo! Escolha outra carta." : `🛡️ Vínculo criado! O Barril inimigo agora protegerá esta carta!`);
    } 
        else if (suportePreparado !== null) {
            equiparSuporte(idSemPacoteLocal);
        } else {
            receberAtaque("vida-" + idSemPacoteLocal, idDoPacote);
        }
    };
    
    let divAcoes = pacoteCarta.querySelector("div[id^='acoes-']");
    if (divAcoes) divAcoes.style.display = "block";
   
    if (!somentePrepararCampo) {
        let cartaParaPassiva = { nome: nomeDaCartaHtml, passivaAtivada: false };
        if (typeof verificarPassivaNecromante === "function") verificarPassivaNecromante(cartaParaPassiva, false);
    }

    atualizarTodosUnidoes();
}

function criarHTMLCarta(carta, funcaoJogar, classeCss, ehAliado) {
    // 🩹 CORREÇÃO: os dois botões apareciam em QUALQUER Curandeiro, dos dois lados — deixando
    // curar o time errado sem querer. Agora só aparece o botão do lado certo da carta.
    let btnCura = (carta.nome === 'Curandeiro' && ehAliado) ? `<button onclick="iniciarCura('${carta.idUnico}')" style="background-color: green; color: white; width: 100%; margin-bottom: 2px; cursor: pointer;">Curar 💚</button>` : '';
    let btnCuraInimigo = (carta.nome === 'Curandeiro' && !ehAliado) ? `<button onclick="iniciarCuraInimigo('${carta.idUnico}')" style="background-color: green; color: white; width: 100%; margin-bottom: 2px; cursor: pointer;">Curar Oponente 💚</button>` : '';
    let btnEspecial = (carta.nome === 'Poção de Gelo' ||carta.nome === 'Bruxo' || carta.nome === 'Necromante' || carta.nome === 'Ork' || carta.nome === 'Curandeiro' || carta.nome === 'Ctrl C' || carta.nome === 'Ctrl V' || carta.nome === 'Cavaleiro das Trevas' || carta.nome === 'Goblin' || carta.nome === 'Trio de Goblin' || carta.nome === 'Barril de Goblin' || carta.nome === 'Guerreiro' || carta.nome === 'Barril de Bárbaro' || carta.nome === 'Barril'|| carta.nome === 'Bumerskeleton' || carta.nome === 'Mensageiro' || carta.nome === 'Criador' || carta.nome === 'Separado' || carta.nome === 'Separadois' || carta.nome === 'Viajante do Tempo' || carta.nome === 'Incendiário' || carta.nome === 'Mago') ? `<button onclick="usarHabilidade('${carta.nome}', '${carta.idUnico}', this)" style="background-color: purple; color: white; width: 100%; margin-bottom: 2px; cursor: pointer;">Especial 🔮</button>` : '';
    let btnLadrao = (carta.nome === 'Ladrão') ? `<button onclick="usarPassivaLadrao('${carta.idUnico}', this)" style="background-color: #f1c40f; color: black; font-weight: bold; width: 100%; margin-bottom: 2px; cursor: pointer;">Passiva 💰</button>` : '';
    let btnCtrlC = (carta.nome === 'Ctrl C' || carta.nome === 'Ctrl V') ? `<button onclick="usarPassivaCtrlC('${carta.idUnico}', this)" style="background-color: #34495e; color: white; font-weight: bold; width: 100%; margin-bottom: 2px; cursor: pointer;">Passiva 📋</button>` : '';
    // 👥 Sempre disponível (não é uso único) — deixa trocar a parceira quantas vezes quiser.
    let btnTrocarParceiro = (carta.nome === 'Separado' || carta.nome === 'Separadois') ? `<button onclick="trocarParceiroSeparado('${carta.idUnico}', ${ehAliado})" style="background-color: #16a085; color: white; width: 100%; margin-bottom: 2px; cursor: pointer;">Trocar Parceiro 👥</button>` : '';
    // ⏳ Sempre visível — a função interna já recusa se essa carta já tiver usado a Passiva.
    let btnViajarNoTempo = (carta.nome === 'Viajante do Tempo') ? `<button onclick="usarPassivaViajante('${carta.idUnico}', this)" style="background-color: #8e44ad; color: white; width: 100%; margin-bottom: 2px; cursor: pointer;">Viajar no Tempo ⏳</button>` : '';

    // 🔥 O Incendiário não tem o botão normal de Atacar — no lugar dele entra o botão
    // "Jogar Pólvora", que só acende o ciclo quando houver alvo na arena inimiga.
    let btnAtacarAliado = (carta.nome === 'Incendiário')
        ? `<button class="btn-polvora-incendiario" onclick="iniciarAtaqueIncendiario('${carta.idUnico}', false)" style="padding: 5px; background-color: #b34700; color: white; width: 100%; margin-bottom: 2px; cursor: pointer;">Jogar Pólvora 🔥</button>`
        : `<button onclick="iniciarAtaque('${carta.nome}', '${carta.idUnico}')" style="padding: 5px; width: 100%; margin-bottom: 2px; cursor: pointer;">Atacar ⚔️</button>`;
    let btnAtacarInimigo = (carta.nome === 'Incendiário')
        ? `<button class="btn-polvora-incendiario" onclick="iniciarAtaqueIncendiario('${carta.idUnico}', true)" style="padding: 5px; background-color: #b34700; color: white; width: 100%; margin-bottom: 2px; cursor: pointer;">Jogar Pólvora 🔥</button>`
        : `<button onclick="inimigoAtacar('${carta.idUnico}')" style="padding: 5px; background-color: darkred; color: white; width: 100%; margin-bottom: 2px; cursor: pointer;">Atacar ⚔️</button>`;

    let botoes = ehAliado ? `
        ${btnCtrlC}
        ${btnCura}
        ${btnAtacarAliado}
        ${btnEspecial}
        ${btnLadrao}
        ${btnTrocarParceiro}
        ${btnViajarNoTempo}
    ` : `
        ${btnCtrlC}
        ${btnCuraInimigo}
        ${btnAtacarInimigo}
        ${btnEspecial}
        ${btnLadrao}
        ${btnTrocarParceiro}
        ${btnViajarNoTempo}
    `;

    return `
        <div id="pacote-${carta.idUnico}" class="${classeCss}">
            <span class="nome-carta">${carta.nome}</span>
            <img src="${carta.img}" alt="${carta.nome}" onclick="${funcaoJogar}('pacote-${carta.idUnico}')">
            
            <div class="status-container">
                <span class="status-vida">❤️ <span id="vida-${carta.idUnico}">${carta.vida}</span></span>
                <span class="status-ataque">⚔️ <span id="dano-${carta.idUnico}">${carta.dano}</span></span>
            </div>

            <div id="acoes-${carta.idUnico}" style="display: none; margin-top: 10px; width: 100%;">${botoes}</div>
        </div>
    `;
}

function iniciarAtaque(nomeCarta, idUnico) {
    if (barrilBarbaroEmAnimacao) return narrar("🪵 O Barril de Bárbaro ainda está rolando!");
    nomeCarta = obterNomeEfetivoCarta(idUnico, nomeCarta);
    modoAlvoBarril = false; // 🚀 Cancela qualquer mira do barril se clicar noutro ataque

    // ❄️ TRAVA DE ATAQUE (SEU LADO)
    let pacoteCarta = document.getElementById("pacote-" + idUnico);
    if (pacoteCarta && pacoteCarta.classList.contains("congelada")) {
        narrar("❄️ Esta carta está congelada e não pode atacar nesta rodada!");
        return; // Cancela a execução do ataque
    }

    // 👥 SEPARADO/SEPARADOIS — se já tem parceira viva, não ataca pelo próprio botão:
    // só ataca "puxado" junto quando a PARCEIRA atacar. EXCEÇÃO: durante a habilidade do
    // dado 6 (ataque dividido), ele pode atacar sozinho normalmente por essa vez.
    if ((nomeCarta === 'Separado' || nomeCarta === 'Separadois') && typeof parceriaSeparado !== 'undefined') {
        let emModoDividido = typeof separadaoDividido !== 'undefined' && separadaoDividido[idUnico] > 0;
        let idParceira = parceriaSeparado[idUnico];
        let pacoteParceira = idParceira ? document.getElementById("pacote-" + idParceira) : null;
        if (pacoteParceira && !emModoDividido) {
            let nomeParceira = pacoteParceira.querySelector(".nome-carta").innerText.trim();
            return narrar(`👥 ${nomeCarta} está juntado com ${nomeParceira}! Ataque com ${nomeParceira} pra elas atacarem juntas.`);
        }
    }

    if (suportePreparado !== null) {
        equiparSuporte(idUnico);
        return; 
    }

    // 🩹 CORREÇÃO: se uma Traição está em andamento, o clique no botão Atacar
    // deve escolher a VÍTIMA (parceira do traidor), não disparar um ataque normal!
    if (modoTraicao === true) {
        executarTraicao("pacote-" + idUnico);
        return;
    }

    if (turnoAtivo !== 1) return narrar("Ainda não é o seu turno de atacar!");

    let cartaAtacante = bancoDeCartas.find(c => c.nome === nomeCarta);
    if (cartaAtacante) ultimaCartaJogador = cartaAtacante;
    
    let campoInimigo = document.getElementById("campo-j2");
    let inimigosNoCampo = Array.from(campoInimigo.getElementsByClassName("carta-inimiga"));
    if (inimigosNoCampo.length === 0) return narrar("Não há inimigos no campo para atacar!");

    let danoBase = parseFloat(document.getElementById("dano-" + idUnico).innerText);
    let vidaAtual = parseFloat(document.getElementById("vida-" + idUnico).innerText);
    danoPreparado = danoBase;
    ultimoIdQueAtacou = idUnico;

    // 🪵 BARRIL DE BÁRBAROS (Preparar Impacto)
    if (nomeCarta === 'Barril de Bárbaro') {
        modoAlvoBarrilBarbaro = true;
        idBarrilAtivo = idUnico;
        return narrar("🪵 Barril de Bárbaros ativado! Clique em uma carta inimiga para causar 3 de dano de impacto!");
    }
    // 📦 ATIVAÇÃO DO BARRIL (SEU LADO)
    if (nomeCarta.includes('Barril de Goblin')) {
        modoAlvoBarril = true; 
        idBarrilAtivo = idUnico;
        return narrar("📦 Você ativou o Barril! Clique na carta do OPONENTE que vai receber os goblins!");
    }

    if (nomeCarta === 'Trio de Goblin') {
        if (vidaAtual >= 5) { danoPreparado = 2; narrar("⚔️ O Trio de Goblin está completo e ataca com 2 de dano!"); } 
        else if (vidaAtual >= 3) { danoPreparado = 1; narrar("⚔️ Um goblin caiu! Os dois restantes atacam com 1 de dano."); } 
        else { danoPreparado = 1; }
    }

    // 👊 TRIO DE BÁRBAROS — cada Bárbaro representa 3 pontos de vida.
    // O dano diminui conforme cada integrante do trio cai: 3 → 2 → 1.
    if (nomeCarta === 'Trio de Bárbaros') {
        if (vidaAtual >= 7) {
            danoPreparado = 3;
            narrar("⚔️ O Trio de Bárbaros está completo e ataca com 3 de dano!");
        } else if (vidaAtual >= 4) {
            danoPreparado = 2;
            narrar("⚔️ Um Bárbaro caiu! Os dois restantes atacam com 2 de dano.");
        } else {
            danoPreparado = 1;
            narrar("⚔️ Restou apenas um Bárbaro, que ataca com 1 de dano.");
        }
    }

    let ageComoGoblin = (nomeCarta === 'Goblin') || (nomeCarta === 'Trio de Goblin' && vidaAtual <= 2);
    if (ageComoGoblin) {
        let nomeTexto = (nomeCarta === 'Trio de Goblin') ? 'Último Goblin do Trio' : 'Goblin';
        if (!goblinJaAtacouNesteTurno[idUnico]) {
            goblinJaAtacouNesteTurno[idUnico] = true;
            let dado = Math.floor(Math.random() * 6) + 1;
            document.getElementById("dado-tela").innerText = "🎲 " + dado;
            if (dado === 2) {
                // 🤖 Se for o bot jogando, pula o pop-up (ele travaria esperando clique humano)
                // e sempre escolhe o 2º caminho: 2 de dano agora + 1 ataque extra de graça.
                let ehDecisaoDoBot = (typeof window !== "undefined" && window.__rpgBotJogando === true);
                let escolha = ehDecisaoDoBot ? false : confirm(`🎲 PASSIVA DO ${nomeTexto.toUpperCase()}! Você tirou 2 no dado!\n\n[ OK ] = Dar ${danoBase * 2} de dano de uma só vez neste alvo.\n[ CANCELAR ] = Dar apenas ${danoBase} de dano agora e ganhar um Ataque Extra livre.`);
                // 🩹 CORREÇÃO: os dois caminhos tinham o dano fixo em 4 e 2, ignorando o dano
                // ATUAL do Goblin (que muda com Besta/Auvex/Allsforms etc.). Agora usa danoBase.
                if (escolha) { danoPreparado = danoBase * 2; goblinAtaquesGanhos[idUnico] = false; narrar(`🎲 O ${nomeTexto} concentrou força! Causará ${danoPreparado} de dano num golpe único e passará a vez!`); } 
                else {
                    goblinAtaquesGanhos[idUnico] = true;
                    danoPreparado = danoBase;
                    ativarEfeitoVelocidade(idUnico);
                    narrar(`🎲 O ${nomeTexto} ativou a agilidade! Dará ${danoPreparado} de dano agora e terá direito a mais um ataque!`);
                }
            } else { goblinAtaquesGanhos[idUnico] = false; narrar(`🎲 O ${nomeTexto} tirou ${dado}. Apenas um ataque normal de ${danoPreparado} de dano.`); }
        }
    }

    if (nomeCarta === 'Arqueiro') {
        let dado = Math.floor(Math.random() * 6) + 1;
        document.getElementById("dado-tela").innerText = "🎲 " + dado;
        if (dado >= 1 && dado <= 3) { danoPreparado += 1; narrar(`🎯 Arqueiro tirou ${dado}. Dano +1 (Total: ${danoPreparado})!`); } 
        else if (dado >= 4 && dado <= 6) { danoPreparado += 3; narrar(`🎯 Arqueiro atirador de elite (${dado})! Dano +3 (Total: ${danoPreparado})!`); }
    }

    if (nomeCarta === 'Mensageiro' && typeof mensageirosEmArea !== 'undefined' && mensageirosEmArea[idUnico]) {
        narrar(`🌪️ O Mensageiro disparou em ÁREA! Causando 2 de dano a TODOS os inimigos!`);
        inimigosNoCampo.forEach(pacoteInimigo => aplicarDanoAtaqueArea(pacoteInimigo.id, 2, false));
        passarTurno();
        if (typeof atualizarTodosUnidoes === "function") atualizarTodosUnidoes();
        return; // Retorna para não continuar e pedir clique do mouse
    }

    if (nomeCarta === 'Cavaleiro das Trevas') {
        modoAlvoCavaleiro = true;
        idCavaleiroAtivo = idUnico;
        narrar("⚔️ Clique na carta inimiga que será o ALVO PRINCIPAL do Cavaleiro das Trevas (os vizinhos dela também serão atingidos)!");
        return;
    }
    
    modoAtaque = true; 
    narrar(`Você preparou um ataque de ${danoPreparado} de dano! Clique no inimigo que deseja acertar.`);
}

function receberAtaque(idVidaAlvo, idPacoteAlvo) {
    if (modoAtaque === true) {
        let pacoteAlvo = document.getElementById(idPacoteAlvo);
        let nomeAlvoExibido = pacoteAlvo.querySelector(".nome-carta").innerText;
        let idPuro = idPacoteAlvo.replace("pacote-", "");
        let nomeAlvo = obterNomeEfetivoCarta(idPuro, nomeAlvoExibido);

        // 🐴 CAVALO DE TRÓIA: não tem vida, não pode ser atacado.
        if (nomeAlvo.trim() === 'Cavalo de Tróia') {
            return narrar("🐴 O Cavalo de Tróia não pode ser atacado! Escolha outra carta.");
        }

        // 🦇 VAMPI7: só pode ser atacado quando estiver com 3 ou mais de vida.
        if (nomeAlvo.trim() === 'Vampi7') {
            let vidaVampi7 = parseFloat(document.getElementById(idVidaAlvo).innerText) || 0;
            if (vidaVampi7 < 3) {
                return narrar("🦇 O Vampi7 só pode ser atacado com 3 ou mais de vida! Escolha outra carta.");
            }
        }

        // 🛡️ VERIFICAÇÃO DO BARRIL GUARDA-COSTAS (Alvo Único)
        let idDoBarrilQueProtege = cartasProtegidas[idPuro];
        if (idDoBarrilQueProtege === idPuro) delete cartasProtegidas[idPuro]; // 🩹 segurança: desfaz qualquer auto-proteção travada
        let atacanteIgnoraEscudo = (ultimaCartaJogador && ultimaCartaJogador.nome === "Cavaleiro das Trevas");

        if (idDoBarrilQueProtege && !atacanteIgnoraEscudo) {
            let barrilAindaExiste = document.getElementById("pacote-" + idDoBarrilQueProtege);
            if (barrilAindaExiste) {
                return narrar("🛡️ BLOQUEADO! Esta carta está sob a proteção de um Barril! Você DEVE destruir o Barril protetor primeiro!");
            } else {
                delete cartasProtegidas[idPuro]; // Barril já morreu, quebra o vínculo.
            }
        }

        // 🛡️ BLOQUEIO DO GUERREIRO
        if (escudoGuerreiro[idPuro] && Number(danoPreparado) > 0) {
            narrar(`🛡️ BLANG! O escudo da carta inimiga bloqueou o ataque e QUEBROU!`);
            delete escudoGuerreiro[idPuro];
            quebrarVisualEscudo(idPuro);
            modoAtaque = false; 
            danoPreparado = 0; 
            passarTurno(); 
            return; 
        }

        let textoVida = document.getElementById(idVidaAlvo);
        // 🩹 CORREÇÃO: era parseInt, que truncava vida fracionária (ex: 0.75 virava 0) — o jogo
        // tem cartas com valores quebrados (Barril de Goblin, fogo do Bumerskeleton -0.25...),
        // e isso fazia o cálculo do dano sair errado ao atacar essas cartas.
        // 🩹 CORREÇÃO: nunca deixa a vida mostrar número negativo — trava em 0.
        let vidaAtual = Math.max(0, parseFloat(textoVida.innerText) - danoPreparado);
        textoVida.innerText = vidaAtual;
        
        try {
            if (ultimaCartaJogador && ultimaCartaJogador.nome === "Bumerskeleton") {
                if (typeof executarChainBumerangue === "function") {
                    executarChainBumerangue(ultimoIdQueAtacou, idPuro, "campo-j2");
                } else {
                    narrar("⚠️ A função do ricochete não foi encontrada!");
                }
            }
        } catch (e) {
            console.error("Erro ao ativar bumerangue: ", e);
        }

        if (vidaAtual <= 0) {
            let nomeExibido = pacoteAlvo.querySelector(".nome-carta").innerText;
            let nomeDestaCarta = obterNomeEfetivoCarta(idPuro, nomeExibido);
            if (nomeDestaCarta !== nomeExibido) {
                narrar(`O ${nomeExibido} foi destruído, ativando a passiva copiada de ${nomeDestaCarta}!`);
            }

            narrar("BUM! O alvo inimigo foi DESTRUÍDO!");
            registrarMorte(nomeDestaCarta, "j2");
            guardarOrigemTransformacaoOrk(nomeDestaCarta, idPuro, pacoteAlvo);
            pacoteAlvo.remove();

            ativarPassivasAoMorrer(
                nomeDestaCarta,
                idPuro,
                "campo-j2",
                undefined,
                "O Barril inimigo quebrou!"
            );
        } else {
            narrar("Pow! O alvo tomou " + danoPreparado + " de dano!");
        }
        
        // 👥 SEPARADO/SEPARADOIS — se a carta que atacou for a PARCEIRA de um Separado, o
        // Separado é arrastado junto e também acerta o MESMO alvo (é o ataque da parceira
        // que "puxa" o Separado — o Separado sozinho não ataca pelo próprio botão).
        // Não arrasta durante a habilidade do dado 6 (ataque dividido), onde cada uma ataca
        // um alvo diferente por conta própria.
        let idSeparadoAtivoDividido = obterSeparadaoDivididoAtivo(ultimoIdQueAtacou);
        let idSeparadoPuxado = idSeparadoAtivoDividido ? null : encontrarSeparadoParceiroDe(ultimoIdQueAtacou);
        if (idSeparadoPuxado) {
            let pacoteSeparado = document.getElementById("pacote-" + idSeparadoPuxado);
            let pacoteAlvoAindaExiste = document.getElementById(idPacoteAlvo);
            if (pacoteSeparado && pacoteAlvoAindaExiste) {
                let danoSeparado = parseFloat(document.getElementById("dano-" + idSeparadoPuxado).innerText) || 0;
                let nomeSeparado = pacoteSeparado.querySelector(".nome-carta").innerText.trim();
                narrar(`👥 ${nomeSeparado} atacou junto com a parceira, causando ${danoSeparado} de dano no mesmo alvo!`);
                aplicarDanoAtaqueArea(idPacoteAlvo, danoSeparado, false);
            }
        }

        // 🦇 VAMPI7 — ataca junto de qualquer carta do mesmo time que atacar.
        dispararVampi7JuntoDoAtaque(ultimoIdQueAtacou, idPacoteAlvo);
        // 🛸 PORTABLE — ataca junto enquanto a bateria durar.
        dispararPortableJuntoDoAtaque(ultimoIdQueAtacou, idPacoteAlvo);

        modoAtaque = false; 
        danoPreparado = 0; 

        // 👥 Se este ataque fazia parte da habilidade dividida do Separado, só passa a vez
        // quando as DUAS cartas já tiverem atacado (uma pode atacar, esperar, e a outra
        // ataca em seguida, ainda no mesmo turno).
        if (idSeparadoAtivoDividido) {
            separadaoDividido[idSeparadoAtivoDividido]--;
            if (separadaoDividido[idSeparadoAtivoDividido] > 0) {
                narrar("👥 Falta a outra carta da dupla atacar ainda! Clique em Atacar nela e escolha outro alvo.");
            } else {
                delete separadaoDividido[idSeparadoAtivoDividido];
                passarTurno();
            }
        } else {
            passarTurno();
        }
    } else {
        narrar("Você precisa clicar no botão 'Atacar' primeiro!");
    }

    if (typeof atualizarTodosUnidoes === "function") atualizarTodosUnidoes();
}

function inimigoAtacar(idUnico) {
    if (barrilBarbaroEmAnimacao) return;
    modoAlvoBarril = false;        // 🚀 Desbloqueia o ataque normal do oponente
    modoAlvoBarrilInimigo = false;

    // ❄️ TRAVA DE ATAQUE (LADO DO INIMIGO)
    let pacoteCarta = document.getElementById("pacote-" + idUnico);
    if (pacoteCarta && pacoteCarta.classList.contains("congelada")) {
        narrar("❄️ O oponente tentou atacar, mas a carta está CONGELADA!");
        return; // Cancela o ataque do oponente
    }

    if (suportePreparado !== null) {
        equiparSuporte(idUnico);
        return;
    }

    // 🩹 CORREÇÃO: idem para o botão Atacar do lado do oponente
    if (modoTraicao === true) {
        executarTraicao("pacote-" + idUnico);
        return;
    }

    if (turnoAtivo !== 2) return narrar("Ainda não é o turno do Oponente atacar!");
    let pacoteInimigo = document.getElementById("pacote-" + idUnico);
    let nomeCartaExibida = pacoteInimigo.querySelector(".nome-carta").innerText;
    let nomeCartaInimiga = obterNomeEfetivoCarta(idUnico, nomeCartaExibida);
    let cartaAtacanteInimigo = bancoDeCartas.find(c => c.nome === nomeCartaInimiga);
    if (cartaAtacanteInimigo) ultimaCartaOponente = cartaAtacanteInimigo;

    // 👥 SEPARADO/SEPARADOIS (inimigo) — mesma trava: só ataca puxado pela parceira, exceto
    // durante a habilidade do dado 6 (ataque dividido).
    if ((nomeCartaInimiga === 'Separado' || nomeCartaInimiga === 'Separadois') && typeof parceriaSeparado !== 'undefined') {
        let emModoDividido = typeof separadaoDividido !== 'undefined' && separadaoDividido[idUnico] > 0;
        let idParceira = parceriaSeparado[idUnico];
        let pacoteParceira = idParceira ? document.getElementById("pacote-" + idParceira) : null;
        if (pacoteParceira && !emModoDividido) {
            let nomeParceira = pacoteParceira.querySelector(".nome-carta").innerText.trim();
            return narrar(`👥 O ${nomeCartaInimiga} do oponente está juntado com ${nomeParceira}! Só ataca junto quando ela atacar.`);
        }
    }

    let campoAliado = document.getElementById("campo-j1");
    let aliadosNoCampo = Array.from(campoAliado.getElementsByClassName("carta-aliada"));
    if (aliadosNoCampo.length === 0) return narrar("Você não tem cartas no campo para o oponente atacar!");

    let danoLido = parseFloat(document.getElementById("dano-" + idUnico).innerText);
    let vidaAtual = parseFloat(document.getElementById("vida-" + idUnico).innerText);
    danoInimigoPreparado = danoLido;
    ultimoIdQueAtacou = idUnico;

    // 🪵 BARRIL DE BÁRBAROS (Ataque de Impacto do Oponente)
    if (nomeCartaInimiga.includes('Barril de Bárbaro')) {
        modoAlvoBarrilBarbaroInimigo = true;
        idBarrilAtivo = idUnico;
        narrar("🪵 O Oponente preparou o impacto do Barril de Bárbaros! Clique na SUA carta que receberá 3 de dano.");
        if (aliadosNoCampo.length === 1) {
            aplicarAlvoBarrilBarbaro(aliadosNoCampo[0].id);
        }
        return;
    }
    // 📦 ATIVAÇÃO DO BARRIL (LADO DO INIMIGO)
    if (nomeCartaInimiga.includes('Barril de Goblin')) {
        modoAlvoBarril = true; 
        idBarrilAtivo = idUnico;
        return narrar("📦 O Oponente ativou o Barril! Clique na SUA carta que vai receber os goblins!");
    }

    if (nomeCartaInimiga === 'Trio de Goblin') {
        if (vidaAtual >= 5) { danoInimigoPreparado = 2; narrar("⚔️ O Trio de Goblin inimigo ataca com 2 de dano!"); } 
        else if (vidaAtual >= 3) { danoInimigoPreparado = 1; narrar("⚔️ Um goblin inimigo caiu! Os dois restantes atacam com 1 de dano."); } 
        else { danoInimigoPreparado = 1; }
    }

    // 👊 Mesma regressão para o Trio de Bárbaros controlado pelo oponente/bot.
    if (nomeCartaInimiga === 'Trio de Bárbaros') {
        if (vidaAtual >= 7) {
            danoInimigoPreparado = 3;
            narrar("⚔️ O Trio de Bárbaros inimigo está completo e ataca com 3 de dano!");
        } else if (vidaAtual >= 4) {
            danoInimigoPreparado = 2;
            narrar("⚔️ Um Bárbaro inimigo caiu! Os dois restantes atacam com 2 de dano.");
        } else {
            danoInimigoPreparado = 1;
            narrar("⚔️ Restou um Bárbaro inimigo, que ataca com 1 de dano.");
        }
    }

    let ageComoGoblin = (nomeCartaInimiga === 'Goblin') || (nomeCartaInimiga === 'Trio de Goblin' && vidaAtual <= 2);
    if (ageComoGoblin) {
        let nomeTexto = (nomeCartaInimiga === 'Trio de Goblin') ? 'Último Goblin do Trio inimigo' : 'Goblin inimigo';
        if (!goblinJaAtacouNesteTurno[idUnico]) {
            goblinJaAtacouNesteTurno[idUnico] = true;
            let dado = Math.floor(Math.random() * 6) + 1;
            document.getElementById("dado-tela").innerText = "🎲 " + dado;
            if (dado === 2) {
                let qtdAliados = aliadosNoCampo.length;
                // 🩹 CORREÇÃO: mesmo problema do lado do jogador — dano fixo em 4 e 2, ignorando
                // o dano ATUAL do Goblin (que muda com Besta/Auvex/Allsforms etc.).
                if (qtdAliados === 1) { danoInimigoPreparado = danoLido * 2; goblinAtaquesGanhos[idUnico] = false; narrar(`🎲 O ${nomeTexto} tirou 2 e concentrou ${danoInimigoPreparado} de dano brutal!`); } 
                else {
                    goblinAtaquesGanhos[idUnico] = true;
                    danoInimigoPreparado = danoLido;
                    ativarEfeitoVelocidade(idUnico);
                    narrar(`🎲 O ${nomeTexto} tirou 2! Atacará com ${danoInimigoPreparado} de dano e fará mais um ataque!`);
                }
            } else { goblinAtaquesGanhos[idUnico] = false; narrar(`🎲 O ${nomeTexto} tirou ${dado}. Ataque normal.`); }
        }
    }

    if (nomeCartaInimiga === 'Arqueiro') {
        let dado = Math.floor(Math.random() * 6) + 1;
        document.getElementById("dado-tela").innerText = "🎲 " + dado;
        if (dado >= 1 && dado <= 3) { danoInimigoPreparado += 1; } 
        else if (dado >= 4 && dado <= 6) { danoInimigoPreparado += 3; }
    }
    
    if (nomeCartaInimiga === 'Mensageiro' && typeof mensageirosEmArea !== 'undefined' && mensageirosEmArea[idUnico]) {
        narrar(`🌪️ O Mensageiro Inimigo disparou em ÁREA! Causando 2 de dano a TODAS as suas cartas!`);
        aliadosNoCampo.forEach(pacoteAliado => aplicarDanoAtaqueArea(pacoteAliado.id, 2, true));
        passarTurno();
        if (typeof atualizarTodosUnidoes === "function") atualizarTodosUnidoes();
        return;
    }

    if (nomeCartaInimiga === 'Cavaleiro das Trevas') {
        modoAlvoCavaleiroInimigo = true;
        idCavaleiroAtivo = idUnico;
        narrar("⚔️ O Oponente mirou o Cavaleiro das Trevas! Clique na SUA carta que será o ALVO PRINCIPAL (os vizinhos dela também serão atingidos)!");
        return;
    }
    
    modoAtaqueInimigo = true; 
    if (aliadosNoCampo.length === 1) aplicarDanoInimigo(aliadosNoCampo[0].id);
    else narrar(`O Oponente preparou um ataque de ${danoInimigoPreparado} de dano! Clique na SUA carta que vai receber o ataque.`);
}

function aplicarDanoInimigo(idPacoteAlvo) {
    let pacoteAlvo = document.getElementById(idPacoteAlvo);
    let idPuro = idPacoteAlvo.replace("pacote-", "");
    let nomeAlvoExibido = pacoteAlvo.querySelector(".nome-carta").innerText;
    let nomeAlvo = obterNomeEfetivoCarta(idPuro, nomeAlvoExibido);

    // 🐴 CAVALO DE TRÓIA: não tem vida, não pode ser atacado.
    if (nomeAlvo.trim() === 'Cavalo de Tróia') {
        return narrar("🐴 O Cavalo de Tróia inimigo não pode ser atacado! Escolha outra carta.");
    }

    // 🦇 VAMPI7: só pode ser atacado quando estiver com 3 ou mais de vida.
    if (nomeAlvo.trim() === 'Vampi7') {
        let idVidaVampi7 = idPacoteAlvo.replace("pacote-", "vida-");
        let vidaVampi7 = parseFloat(document.getElementById(idVidaVampi7).innerText) || 0;
        if (vidaVampi7 < 3) {
            return narrar("🦇 O Vampi7 inimigo só pode ser atacado com 3 ou mais de vida! Escolha outra carta.");
        }
    }

    // 🛡️ VERIFICAÇÃO DO BARRIL GUARDA-COSTAS
    let idDoBarrilQueProtege = cartasProtegidas[idPuro];
        if (idDoBarrilQueProtege === idPuro) delete cartasProtegidas[idPuro]; // 🩹 segurança: desfaz qualquer auto-proteção travada
    let atacanteIgnoraEscudo = (ultimaCartaOponente && ultimaCartaOponente.nome === "Cavaleiro das Trevas");

    if (idDoBarrilQueProtege && !atacanteIgnoraEscudo) {
        let barrilAindaExiste = document.getElementById("pacote-" + idDoBarrilQueProtege);
        if (barrilAindaExiste) {
            return narrar("🛡️ SEU ESCUDO AGIU! Esta carta está sob proteção. O Oponente DEVE atacar o seu Barril protetor primeiro!");
        } else {
            delete cartasProtegidas[idPuro];
        }
    }

    // 🛡️ BLOQUEIO DO GUERREIRO
    if (escudoGuerreiro[idPuro] && Number(danoInimigoPreparado) > 0) {
        narrar(`🛡️ BLANG! Sua carta defendeu o ataque inimigo, mas o escudo QUEBROU!`);
        delete escudoGuerreiro[idPuro];
        quebrarVisualEscudo(idPuro);
        modoAtaqueInimigo = false; 
        danoInimigoPreparado = 0;
        passarTurno(); 
        return; 
    }

    let idVida = idPacoteAlvo.replace("pacote-", "vida-");
    let textoVida = document.getElementById(idVida);
    // 🩹 CORREÇÃO: nunca deixa a vida mostrar número negativo — trava em 0.
    let vidaAtual = Math.max(0, parseFloat(textoVida.innerText) - danoInimigoPreparado);
    textoVida.innerText = vidaAtual;

    // 🪃 COLOQUE ESTE BLOCO AQUI: Ricochete do Bumerskeleton do Inimigo
    try {
        if (ultimaCartaOponente && ultimaCartaOponente.nome === "Bumerskeleton") {
            if (typeof executarChainBumerangue === "function") {
                executarChainBumerangue(ultimoIdQueAtacou, idPuro, "campo-j1");
            }
        }
    } catch (e) {
        console.error("Erro ao ativar bumerangue oponente: ", e);
    }

    if (vidaAtual <= 0) {
        let nomeExibido = pacoteAlvo.querySelector(".nome-carta").innerText;
        let nomeDestaCarta = obterNomeEfetivoCarta(idPuro, nomeExibido);
        if (nomeDestaCarta !== nomeExibido) {
            narrar(`Seu ${nomeExibido} foi destruído, ativando a passiva copiada de ${nomeDestaCarta}!`);
        }

        narrar("Sua carta foi DESTRUÍDA pelo oponente!");
        registrarMorte(nomeDestaCarta, "j1");
        guardarOrigemTransformacaoOrk(nomeDestaCarta, idPuro, pacoteAlvo);
        pacoteAlvo.remove();

        ativarPassivasAoMorrer(
            nomeDestaCarta,
            idPuro,
            "campo-j1",
            undefined,
            "Seu Barril quebrou!"
        );
    } else {
        narrar(`Sua carta sofreu ${danoInimigoPreparado} de dano!`);
    }

    // 👥 SEPARADO/SEPARADOIS (inimigo) — quem atacou é a parceira, o Separado é arrastado
    // junto (exceto durante a habilidade dividida do dado 6).
    let idSeparadoAtivoDivididoInimigo = obterSeparadaoDivididoAtivo(ultimoIdQueAtacou);
    let idSeparadoPuxadoInimigo = idSeparadoAtivoDivididoInimigo ? null : encontrarSeparadoParceiroDe(ultimoIdQueAtacou);
    if (idSeparadoPuxadoInimigo) {
        let pacoteSeparado = document.getElementById("pacote-" + idSeparadoPuxadoInimigo);
        let pacoteAlvoAindaExiste = document.getElementById(idPacoteAlvo);
        if (pacoteSeparado && pacoteAlvoAindaExiste) {
            let danoSeparado = parseFloat(document.getElementById("dano-" + idSeparadoPuxadoInimigo).innerText) || 0;
            let nomeSeparado = pacoteSeparado.querySelector(".nome-carta").innerText.trim();
            narrar(`👥 ${nomeSeparado} do oponente atacou junto com a parceira, causando ${danoSeparado} de dano no mesmo alvo!`);
            aplicarDanoAtaqueArea(idPacoteAlvo, danoSeparado, true);
        }
    }

    // 🦇 VAMPI7 — ataca junto de qualquer carta do mesmo time que atacar.
    dispararVampi7JuntoDoAtaque(ultimoIdQueAtacou, idPacoteAlvo);
    // 🛸 PORTABLE — ataca junto enquanto a bateria durar.
    dispararPortableJuntoDoAtaque(ultimoIdQueAtacou, idPacoteAlvo);

    modoAtaqueInimigo = false; 
    danoInimigoPreparado = 0;

    if (idSeparadoAtivoDivididoInimigo) {
        separadaoDividido[idSeparadoAtivoDivididoInimigo]--;
        if (separadaoDividido[idSeparadoAtivoDivididoInimigo] > 0) {
            narrar("👥 Falta a outra carta da dupla inimiga atacar ainda!");
        } else {
            delete separadaoDividido[idSeparadoAtivoDivididoInimigo];
            passarTurno();
        }
    } else {
        passarTurno();
    }

    if (typeof atualizarTodosUnidoes === "function") atualizarTodosUnidoes();
}

function atualizarTodosUnidoes() {
    let campoJ1 = document.getElementById("campo-j1");
    let campoJ2 = document.getElementById("campo-j2");
    if (campoJ1) atualizarUnidoesNoCampo(campoJ1);
    if (campoJ2) atualizarUnidoesNoCampo(campoJ2);
}

function atualizarUnidoesNoCampo(campoHTML) {
    let todasAsCartas = Array.from(campoHTML.querySelectorAll("div[id^='pacote-']"));

    // 🩹 CORREÇÃO: o Ctrl C/V que copia a passiva do Unidão NUNCA muda o nome exibido na
    // tela (continua "Ctrl C"/"Ctrl V") — a identidade copiada fica só no objeto ctrlV[idUnico].
    // A checagem antiga só olhava o nome exibido (e ainda procurava por "Ctrl V (Unidão)", uma
    // string que não é usada em lugar nenhum do jogo), então o Ctrl C nunca recebia o bônus do
    // Unidão mesmo depois de copiar a passiva dele. Agora também conta quem copiou "Unidão".
    let ehUnidao = function (pacote) {
        let idUnico = pacote.id.replace("pacote-", "");
        let nome = pacote.querySelector(".nome-carta").innerText;
        return obterNomeEfetivoCarta(idUnico, nome) === "Unidão";
    };

    let unidoes = todasAsCartas.filter(ehUnidao);
    let outrasCartas = todasAsCartas.filter(pacote => !ehUnidao(pacote));

    // 1. Acha o MAIOR dano entre as outras cartas
    let maiorDano = 0;
    outrasCartas.forEach(pacote => {
        let idUnico = pacote.id.replace("pacote-", "");
        let spanDano = document.getElementById("dano-" + idUnico);
        if (spanDano) {
            // 🩹 CORREÇÃO: era parseInt, que truncava dano fracionário (ex: 2.5 virava 2) —
            // o jogo tem várias cartas com dano quebrado (Curandeiro +0.5, Bumerskeleton -0.25...)
            let dano = parseFloat(spanDano.innerText) || 0;
            if (dano > maiorDano) maiorDano = dano;
        }
    });

    // 2. Atualiza somente a parcela variável da Passiva do Unidão.
    // O valor mostrado na tela também pode conter melhorias permanentes (Auvex, Besta,
    // bônus do Curandeiro, Ctrl C/V etc.). A versão antiga sempre fazia `1 + maiorDano`
    // e apagava essas melhorias. Agora removemos o bônus variável anterior, preservamos
    // o dano próprio já modificado e somamos o novo maior dano aliado.
    unidoes.forEach(pacote => {
        let idUnico = pacote.id.replace("pacote-", "");
        let spanDano = document.getElementById("dano-" + idUnico);
        
        if (spanDano) {
            let danoAtual = parseFloat(spanDano.innerText) || 0;
            let bonusVariavelAnterior = bonusUnidao[idUnico] || 0;
            let danoProprioModificado = Math.max(0, danoAtual - bonusVariavelAnterior);
            let novoDano = danoProprioModificado + maiorDano;
            spanDano.innerText = novoDano;

            if (novoDano !== danoAtual) {
                mostrarEfeitoAtaque(idUnico);
            }
            bonusUnidao[idUnico] = maiorDano;
        }
    });
}
// 🛡️ Versão de aplicarDanoDireto usada especificamente por ATAQUES EM ÁREA
// (Cavaleiro das Trevas, Mensageiro em Modo Área, impacto do Barril). Ao contrário de
// aplicarDanoDireto (usada por poções e habilidades, que sempre ignoram o escudo), esta
// função CHECA o escudo do Guerreiro pra cada alvo individualmente: se aquele alvo
// específico estiver escudado, o golpe dele é anulado e o escudo quebra — mas os OUTROS
// alvos da mesma área continuam recebendo dano normalmente.
// 🦇 VAMPI7 — sempre que QUALQUER carta do mesmo dono ataca, todo Vampi7 desse time
// ataca junto no MESMO alvo (sem precisar de parceira fixa, ao contrário do Separado) e
// ganha 1 de vida por ter atacado, mesmo que o dano dela ainda seja 0.
function dispararVampi7JuntoDoAtaque(idAtacante, idPacoteAlvo) {
    let pacoteAtacante = document.getElementById("pacote-" + idAtacante);
    if (!pacoteAtacante) return;

    let campoDoAtacanteId = pacoteAtacante.closest("#campo-j1") ? "campo-j1" : "campo-j2";
    let classeMesmoTime = (campoDoAtacanteId === "campo-j1") ? "carta-aliada" : "carta-inimiga";
    let campoDoAtacante = document.getElementById(campoDoAtacanteId);
    if (!campoDoAtacante) return;

    let ehAtaqueDoLadoInimigo = (campoDoAtacanteId === "campo-j2"); // mesma convenção de aplicarDanoAtaqueArea

    let vampiros = Array.from(campoDoAtacante.getElementsByClassName(classeMesmoTime)).filter(pacote => {
        let nomeEl = pacote.querySelector(".nome-carta");
        let idP = pacote.id.replace("pacote-", "");
        return nomeEl && obterNomeEfetivoCarta(idP, nomeEl.innerText.trim()) === "Vampi7" && pacote.id !== "pacote-" + idAtacante;
    });
    if (vampiros.length === 0) return;

    vampiros.forEach(pacoteVampi => {
        let idVampi = pacoteVampi.id.replace("pacote-", "");
        let alvoAindaExiste = !!document.getElementById(idPacoteAlvo);

        let txtDanoVampi = document.getElementById("dano-" + idVampi);
        let danoVampi = txtDanoVampi ? parseFloat(txtDanoVampi.innerText) || 0 : 0;
        if (danoVampi > 0 && alvoAindaExiste) {
            aplicarDanoAtaqueArea(idPacoteAlvo, danoVampi, ehAtaqueDoLadoInimigo);
        }

        // 🦇 A cura acontece SEMPRE que ela ataca junto, mesmo se o alvo já tiver morrido
        // com o golpe principal antes dela — "ao atacar" não depende do alvo sobreviver.
        let txtVidaVampi = document.getElementById("vida-" + idVampi);
        if (txtVidaVampi) {
            txtVidaVampi.innerText = (parseFloat(txtVidaVampi.innerText) || 0) + 1;
            if (typeof mostrarEfeitoVida === "function") mostrarEfeitoVida(idVampi, "ganhou");
        }

        narrar(`🦇 Vampi7 atacou junto${(danoVampi > 0 && alvoAindaExiste) ? ` (${danoVampi} de dano no mesmo alvo)` : ""} e recuperou 1 de vida!`);
    });
}

// 🛸 PORTABLE — enquanto a bateria durar (2 rodadas = 4 passagens de turno, contadas em
// portableDuracao), sempre que QUALQUER carta do mesmo dono ataca, todo Portable desse time
// ataca junto no MESMO alvo — igual ao Vampi7, mas com prazo de validade em vez de ser permanente.
function dispararPortableJuntoDoAtaque(idAtacante, idPacoteAlvo) {
    let pacoteAtacante = document.getElementById("pacote-" + idAtacante);
    if (!pacoteAtacante) return;

    let campoDoAtacanteId = pacoteAtacante.closest("#campo-j1") ? "campo-j1" : "campo-j2";
    let classeMesmoTime = (campoDoAtacanteId === "campo-j1") ? "carta-aliada" : "carta-inimiga";
    let campoDoAtacante = document.getElementById(campoDoAtacanteId);
    if (!campoDoAtacante) return;

    let ehAtaqueDoLadoInimigo = (campoDoAtacanteId === "campo-j2");

    let portables = Array.from(campoDoAtacante.getElementsByClassName(classeMesmoTime)).filter(pacote => {
        let nomeEl = pacote.querySelector(".nome-carta");
        let idP = pacote.id.replace("pacote-", "");
        return nomeEl && obterNomeEfetivoCarta(idP, nomeEl.innerText.trim()) === "Portable" && pacote.id !== "pacote-" + idAtacante && portableDuracao[idP] > 0;
    });
    if (portables.length === 0) return;

    portables.forEach(pacotePortable => {
        let idPortable = pacotePortable.id.replace("pacote-", "");
        let alvoAindaExiste = !!document.getElementById(idPacoteAlvo);

        let txtDanoPortable = document.getElementById("dano-" + idPortable);
        let danoPortable = txtDanoPortable ? parseFloat(txtDanoPortable.innerText) || 0 : 0;
        if (danoPortable > 0 && alvoAindaExiste) {
            aplicarDanoAtaqueArea(idPacoteAlvo, danoPortable, ehAtaqueDoLadoInimigo);
        }

        narrar(`🛸 Portable atacou junto${(danoPortable > 0 && alvoAindaExiste) ? ` (${danoPortable} de dano no mesmo alvo)` : ""}!`);
    });
}

// 💀 CEMITÉRIO — registra uma carta morta (nome de exibição + lado) pra Reviverta poder
// trazer ela de volta depois. Só entra no cemitério quem tem uma entrada correspondente no
// bancoDeCartas (formas especiais sem carta própria, tipo Ícaro/Thiago do Criador, ficam de fora).
function registrarMorte(nomeCarta, lado) {
    if (!nomeCarta || (lado !== "j1" && lado !== "j2")) return;
    let base = bancoDeCartas.find(c => c.nome === nomeCarta);
    if (!base) return;
    cemiterio[lado].push({ id: base.id, nome: base.nome, img: base.img, vida: base.vida, dano: base.dano });
}

// Centraliza as passivas que acontecem quando uma carta MORRE. Antes cada tipo de dano
// repetia essa lógica por conta própria; impacto e ricochete só removiam a carta, então o
// Ork podia desaparecer sem criar os Goblins. Todo caminho de morte em campo chama isto.
function ativarPassivasAoMorrer(nomeCarta, idUnico, campoDestino, mensagemOrk, mensagemBarril) {
    if (nomeCarta === "Ork") {
        let qtd = (typeof orkBuffado !== "undefined" && orkBuffado[idUnico]) ? 3 : 2;
        narrar(mensagemOrk || `💀 PASSIVA: O Ork morreu e invocou ${qtd} Goblins!`);
        let goblinsInvocados = [];
        for (let i = 0; i < qtd; i++) {
            goblinsInvocados.push(invocarToken("goblin", campoDestino));
        }
        animarTransformacaoOrk(idUnico, goblinsInvocados);
    }

    if (typeof processarMortePassivaBarril === "function") {
        processarMortePassivaBarril(nomeCarta, idUnico, campoDestino, mensagemBarril || "O Barril foi destruído!");
    }
}

function aplicarDanoAtaqueArea(idPacoteAlvo, dano, isInimigo) {
    let idPuro = idPacoteAlvo.replace("pacote-", "");
    if (typeof escudoGuerreiro !== 'undefined' && escudoGuerreiro[idPuro] && Number(dano) > 0) {
        narrar(`🛡️ BLANG! O escudo de uma das cartas bloqueou o golpe da área e QUEBROU!`);
        delete escudoGuerreiro[idPuro];
        quebrarVisualEscudo(idPuro);
        return;
    }
    aplicarDanoDireto(idPacoteAlvo, dano, isInimigo);
}

// 🛢️ PASSIVA BARRIL DE MADEIRA — rola o dado quando o Barril morre e decide se ele vira
// um Barril de Goblin (3) ou um Barril de Bárbaro (5), sempre "Sem Habilidade" (só a
// passiva). Compartilhada pelos 3 jeitos de uma carta morrer (ataque normal dos dois lados
// e aplicarDanoDireto, usada por poções/habilidades/ataques em área).
// 🔥 INCENDIÁRIO — botão "Jogar Pólvora" que dá o START do ciclo. Só deixa acender se
// existir pelo menos 1 carta inimiga na arena AGORA; senão a pólvora se perderia no
// vazio e o ciclo ficaria travado sem alvo pro resto da partida (era esse o bug de
// ele "atacar involuntariamente" com a arena vazia).
function iniciarAtaqueIncendiario(idIncendiario, isInimigo) {
    if (incendiarioCiclo[idIncendiario] !== undefined) return; // já está em ciclo, não deixa reiniciar

    let ladoInc = isInimigo ? "j2" : "j1";
    let ladoInimigo = ladoInc === "j1" ? "j2" : "j1";
    let classeInimiga = ladoInimigo === "j1" ? "carta-aliada" : "carta-inimiga";
    let campoInimigo = document.getElementById("campo-" + ladoInimigo);
    let temAlvo = campoInimigo && campoInimigo.getElementsByClassName(classeInimiga).length > 0;

    if (!temAlvo) {
        narrar("🔥 Ainda não há ninguém na arena inimiga! O Incendiário espera o momento certo pra jogar a pólvora.");
        return;
    }

    executarFaseIncendiario(idIncendiario, 1);
    incendiarioCiclo[idIncendiario] = 1; // guarda a ÚLTIMA fase executada (1); a próxima passagem de turno roda a fase 2

    let pacoteInc = document.getElementById("pacote-" + idIncendiario);
    let botao = pacoteInc && pacoteInc.querySelector(".btn-polvora-incendiario");
    if (botao) botao.style.display = "none"; // uso único pra começar o ciclo
}

// 🔥 INCENDIÁRIO — executa UMA fase do ciclo (1=joga pólvora, 2/3=queima 1 dano em cada
// alvo marcado, 4=parado). Chamada tanto pelo botão "Jogar Pólvora" (fase 1)
// quanto a cada passagem de turno (fases seguintes).
function executarFaseIncendiario(idIncendiario, fase) {
    let pacoteInc = document.getElementById("pacote-" + idIncendiario);
    if (!pacoteInc) {
        delete incendiarioCiclo[idIncendiario];
        delete incendiarioAlvos[idIncendiario];
        delete incendiarioFasesVisuais[idIncendiario];
        sincronizarVisuaisIncendiario();
        return;
    }

    let ladoInc = pacoteInc.closest("#campo-j1") ? "j1" : "j2";
    let ladoInimigo = ladoInc === "j1" ? "j2" : "j1";
    let classeInimiga = ladoInimigo === "j1" ? "carta-aliada" : "carta-inimiga";
    let nomeInc = pacoteInc.querySelector(".nome-carta").innerText.trim();
    let rotuloInc = ladoInc === "j1" ? nomeInc : `${nomeInc} do oponente`;

    if (fase === 1) {
        let campoInimigo = document.getElementById("campo-" + ladoInimigo);
        let inimigos = campoInimigo ? Array.from(campoInimigo.getElementsByClassName(classeInimiga)).map(p => p.id) : [];
        incendiarioAlvos[idIncendiario] = inimigos;
        incendiarioFasesVisuais[idIncendiario] = 1;
        sincronizarVisuaisIncendiario();
        animarSalpicoPolvoraIncendiario(idIncendiario, inimigos);
        if (inimigos.length > 0) narrar(`🔥 ${rotuloInc} jogou pólvora em todas as cartas inimigas da arena!`);
    } else if (fase === 2 || fase === 3) {
        let alvos = incendiarioAlvos[idIncendiario] || [];
        let algumAtingido = false;
        incendiarioFasesVisuais[idIncendiario] = fase;
        sincronizarVisuaisIncendiario();
        alvos.forEach(idAlvo => {
            if (document.getElementById(idAlvo)) {
                animarFogoIncendiario(idAlvo, fase === 2);
                aplicarDanoDireto(idAlvo, 1, ladoInimigo === "j2");
                algumAtingido = true;
            }
        });
        if (algumAtingido) {
            narrar(fase === 2
                ? `🔥 ${rotuloInc} acendeu a pólvora! 1 de dano em cada carta atingida.`
                : `🔥 A pólvora do ${rotuloInc} continua queimando! Mais 1 de dano em cada carta atingida.`);
        }
    } else if (fase === 4) {
        incendiarioFasesVisuais[idIncendiario] = 4;
        sincronizarVisuaisIncendiario();
    }
    // fase 4: parado, não faz nada — só espera o ciclo reiniciar.

    if (typeof atualizarTodosUnidoes === "function") atualizarTodosUnidoes();
    sincronizarVisuaisIncendiario();
}

function processarMortePassivaBarril(nomeDestaCarta, idBarrilDestruido, campoDestino, mensagemBase) {
    if (nomeDestaCarta !== "Barril") return;

    let dadoBarril = Math.floor(Math.random() * 6) + 1;
    let cartaDaPassiva = dadoBarril === 3
        ? "Barril de Goblin"
        : (dadoBarril === 5 ? "Barril de Bárbaro" : null);

    // O Barril fosco quebra sobre todas as cartas que ele protegia. O vínculo é removido
    // imediatamente, mas o visual permanece tempo suficiente para as lascas aparecerem.
    Object.keys(cartasProtegidas).forEach(idProtegido => {
        if (String(cartasProtegidas[idProtegido]) !== String(idBarrilDestruido)) return;
        quebrarVisualProtecaoBarril(idProtegido, !!cartaDaPassiva);
        delete cartasProtegidas[idProtegido];
    });

    narrar(`💥 ${mensagemBase} Rolando dado da passiva: 🎲 ${dadoBarril}`);

    if (cartaDaPassiva) {
        setTimeout(() => {
            let mensagem = cartaDaPassiva === "Barril de Goblin"
                ? "📦 Um Barril de Goblins (Sem Hab.) surgiu dos destroços!"
                : "🪵 Um Barril de Bárbaro (Sem Hab.) surgiu dos destroços!";
            narrar(mensagem);
            let cartaLibertada = invocarTokenPeloNomeSemHabilidade(cartaDaPassiva, campoDestino);
            animarCartaSaindoDoBarril(cartaLibertada);
        }, 1500);
    } else {
        setTimeout(() => narrar("O Barril virou apenas lascas de madeira."), 1500);
    }
}

// 🐴 Aplica dano do Cavalo de Tróia em TODAS as cartas de um lado — tanto no campo quanto
// ainda na mão. Cartas no campo passam por aplicarDanoDireto (assim mantêm as passivas de
// morte, tipo Ork/Barril); cartas na mão só perdem vida e somem se chegarem a 0, sem
// acionar passivas de campo (nunca chegaram a entrar em batalha).
function aplicarDanoCavaloDeTroia(ladoInimigo, dano) {
    let campoInimigo = document.getElementById("campo-" + ladoInimigo);
    if (campoInimigo) {
        let cartasCampo = Array.from(campoInimigo.querySelectorAll("div[id^='pacote-']"));
        cartasCampo.forEach(pacote => {
            aplicarDanoDireto(pacote.id, dano, ladoInimigo === "j2");
        });
    }

    let maoInimiga = document.getElementById("mao-" + ladoInimigo);
    if (maoInimiga) {
        let cartasMao = Array.from(maoInimiga.querySelectorAll("div[id^='pacote-']"));
        cartasMao.forEach(pacote => {
            let idPuro = pacote.id.replace("pacote-", "");

            // 🧪 Só TROPAS levam dano — poções/itens de suporte (Fogueira, Besta, etc.) não são atingidos.
            // Usa o maior prefixo válido do banco de cartas (evita confundir "escudo_item" com "escudo",
            // ou "barril" com "barrilbarbaro"/"barrilgoblin").
            let infoCarta = bancoDeCartas
                .filter(c => idPuro === c.id || idPuro.startsWith(c.id + "_") || idPuro.startsWith(c.id + "-"))
                .sort((a, b) => b.id.length - a.id.length)[0];
            let ehSuporte = infoCarta && suportesReais.includes(infoCarta.id);
            if (ehSuporte) return;

            let txtVida = document.getElementById("vida-" + idPuro);
            if (!txtVida) return;
            // 🩹 CORREÇÃO: nunca deixa a vida mostrar número negativo — trava em 0.
            let vidaAtual = Math.max(0, parseFloat(txtVida.innerText) - dano);
            txtVida.innerText = vidaAtual;
            if (typeof mostrarEfeitoPerdaVida === "function") mostrarEfeitoPerdaVida(idPuro);
            if (vidaAtual <= 0) {
                let nomeCartaMao = pacote.querySelector(".nome-carta") ? pacote.querySelector(".nome-carta").innerText.trim() : "";
                registrarMorte(nomeCartaMao, ladoInimigo);
                pacote.remove();
            }
        });
    }
}

function aplicarDanoDireto(idPacoteAlvo, dano, isInimigo) {
    let idPuro = idPacoteAlvo.replace("pacote-", "");
    let txtVida = document.getElementById("vida-" + idPuro);
    if (!txtVida) return;

    // 🐴 CAVALO DE TRÓIA: não tem vida, não pode ser atacado (nem por ataques em área, poções ou habilidades).
    let pacoteCheck = document.getElementById(idPacoteAlvo);
    let nomeCheckExibido = pacoteCheck && pacoteCheck.querySelector(".nome-carta") ? pacoteCheck.querySelector(".nome-carta").innerText.trim() : "";
    let nomeCheck = obterNomeEfetivoCarta(idPuro, nomeCheckExibido);
    if (nomeCheck === 'Cavalo de Tróia') return;

    let vidaAtual = Math.max(0, parseFloat(txtVida.innerText) - dano);
    txtVida.innerText = vidaAtual;

    if (vidaAtual <= 0) {
        let pacote = document.getElementById(idPacoteAlvo);
        if (!pacote) return;
        let nomeExibido = pacote.querySelector(".nome-carta").innerText;
        let nomeDestaCarta = obterNomeEfetivoCarta(idPuro, nomeExibido);
        // 🩹 CORREÇÃO: descobre o lado do Ork pela posição real dele no campo (igual já
        // era feito certo no roubo do Ladrão), em vez de confiar no parâmetro "isInimigo" —
        // ele não tem um significado consistente entre quem chama esta função, então usar
        // ele pra decidir o lado dos Goblins invocados dava resultado errado às vezes.
        let campoDestino = pacote.closest("#campo-j2") ? "campo-j2" : "campo-j1";
        registrarMorte(nomeDestaCarta, campoDestino === "campo-j2" ? "j2" : "j1");
        guardarOrigemTransformacaoOrk(nomeDestaCarta, idPuro, pacote);
        pacote.remove();
        
        ativarPassivasAoMorrer(nomeDestaCarta, idPuro, campoDestino);
    }
}
function obterCartasAdjacentes(idPacoteAlvo) {
    let pacote = document.getElementById(idPacoteAlvo);
    if (!pacote) return [];
    
    let campo = pacote.parentElement;
    let cartas = Array.from(campo.querySelectorAll("div[id^='pacote-']"));
    let index = cartas.indexOf(pacote);
    let adjacentes = [];
    
    if (index > 0) adjacentes.push(cartas[index - 1]);
    if (index < cartas.length - 1) adjacentes.push(cartas[index + 1]);
    
    return adjacentes;
}

// 🗡️ CAVALEIRO DAS TREVAS — aplica dano no alvo principal escolhido + seus vizinhos reais
// no campo (usa obterCartasAdjacentes, o mesmo helper que o Barril já usa pra isso).
// Sem Cavaleiro "despertado": 1 carta sozinha leva 2, alvo+vizinho(s) levam 3 cada (máx. 2 cartas).
// Cavaleiro "despertado" (tirou 5 no dado): sempre 5 de dano no alvo + até 2 vizinhos (3 cartas).
function _calcularAtaqueCavaleiro(idCavaleiro, vizinhos) {
    if (typeof cavaleiroAtivado !== 'undefined' && cavaleiroAtivado[idCavaleiro]) {
        return { danoArea: 5, alvosMaximos: 3 };
    }
    if (vizinhos.length > 0) {
        return { danoArea: 3, alvosMaximos: 2 };
    }
    return { danoArea: 2, alvosMaximos: 1 };
}

function aplicarAlvoCavaleiro(idPacoteAlvo) {
    let pacoteAlvo = document.getElementById(idPacoteAlvo);
    if (!pacoteAlvo) return;

    let vizinhos = obterCartasAdjacentes(idPacoteAlvo);
    let { danoArea, alvosMaximos } = _calcularAtaqueCavaleiro(idCavaleiroAtivo, vizinhos);
    let alvos = [pacoteAlvo, ...vizinhos].slice(0, alvosMaximos);
    let especialAtivo = typeof cavaleiroAtivado !== "undefined" && !!cavaleiroAtivado[idCavaleiroAtivo];

    narrar(`⚔️ O Cavaleiro das Trevas focou ${alvos.length} inimigo(s) (alvo + vizinhos) causando ${danoArea} de dano em cada!`);
    animarAtaqueAreaCavaleiro(idCavaleiroAtivo, pacoteAlvo, alvos, especialAtivo);
    alvos.forEach(pacote => aplicarDanoAtaqueArea(pacote.id, danoArea, false));

    modoAlvoCavaleiro = false;
    idCavaleiroAtivo = null;
    passarTurno();
    if (typeof atualizarTodosUnidoes === "function") atualizarTodosUnidoes();
}

function aplicarAlvoCavaleiroInimigo(idPacoteAlvo) {
    let pacoteAlvo = document.getElementById(idPacoteAlvo);
    if (!pacoteAlvo) return;

    let vizinhos = obterCartasAdjacentes(idPacoteAlvo);
    let { danoArea, alvosMaximos } = _calcularAtaqueCavaleiro(idCavaleiroAtivo, vizinhos);
    let alvos = [pacoteAlvo, ...vizinhos].slice(0, alvosMaximos);
    let especialAtivo = typeof cavaleiroAtivado !== "undefined" && !!cavaleiroAtivado[idCavaleiroAtivo];

    narrar(`⚔️ O Cavaleiro das Trevas inimigo focou ${alvos.length} de suas cartas (alvo + vizinhos) causando ${danoArea} de dano em cada!`);
    animarAtaqueAreaCavaleiro(idCavaleiroAtivo, pacoteAlvo, alvos, especialAtivo);
    alvos.forEach(pacote => aplicarDanoAtaqueArea(pacote.id, danoArea, true));

    modoAlvoCavaleiroInimigo = false;
    idCavaleiroAtivo = null;
    passarTurno();
    if (typeof atualizarTodosUnidoes === "function") atualizarTodosUnidoes();
}


// ✨ Efeito do Ícaro: uma centelha de imaginação viaja até a carta escolhida.
// O efeito usa coordenadas fixas, então continua visível mesmo enquanto a carta antiga
// é substituída pela nova identidade.
function animarPoderCriacaoIcaro(idOrigem, pacoteAlvo) {
    if (!pacoteAlvo) return;

    let origem = document.getElementById("pacote-" + idOrigem);
    let rectOrigem = (origem || pacoteAlvo).getBoundingClientRect();
    let rectAlvo = pacoteAlvo.getBoundingClientRect();
    let inicioX = rectOrigem.left + rectOrigem.width / 2;
    let inicioY = rectOrigem.top + rectOrigem.height / 2;
    let fimX = rectAlvo.left + rectAlvo.width / 2;
    let fimY = rectAlvo.top + rectAlvo.height / 2;
    let mesmoAlvo = origem === pacoteAlvo;

    let energia = document.createElement("div");
    energia.className = "energia-criacao-icaro" + (mesmoAlvo ? " energia-criacao-propria" : "");
    energia.style.setProperty("--icaro-inicio-x", inicioX + "px");
    energia.style.setProperty("--icaro-inicio-y", inicioY + "px");
    energia.style.setProperty("--icaro-meio-x", ((inicioX + fimX) / 2 + (mesmoAlvo ? 52 : 0)) + "px");
    energia.style.setProperty("--icaro-meio-y", (Math.min(inicioY, fimY) - (mesmoAlvo ? 72 : 48)) + "px");
    energia.style.setProperty("--icaro-fim-x", fimX + "px");
    energia.style.setProperty("--icaro-fim-y", fimY + "px");
    energia.innerHTML = '<span class="nucleo-imaginacao">✦</span><i>✧</i><i>◌</i><i>✦</i>';
    document.body.appendChild(energia);

    if (origem) origem.classList.add("icaro-imaginando");
    pacoteAlvo.classList.add("alvo-imaginado-icaro");
    setTimeout(() => {
        energia.remove();
        if (origem && origem.isConnected) origem.classList.remove("icaro-imaginando");
        if (pacoteAlvo.isConnected) pacoteAlvo.classList.remove("alvo-imaginado-icaro");
    }, 1050);
}

// A nova carta aparece como um rascunho e ganha cor enquanto os traços se completam.
function animarRevelacaoIcaro(pacoteNovo) {
    if (!pacoteNovo) return;

    pacoteNovo.classList.add("carta-criada-por-icaro");
    let rascunho = document.createElement("div");
    rascunho.className = "rascunho-criacao-icaro";
    rascunho.innerHTML = '<span class="ideia-criacao">✦</span><i></i><i></i><i></i><i></i>';
    pacoteNovo.appendChild(rascunho);

    setTimeout(() => {
        rascunho.remove();
        if (pacoteNovo.isConnected) pacoteNovo.classList.remove("carta-criada-por-icaro");
    }, 1350);
}

// ✏️ Efeito do Thiago: o lápis vai exatamente ao atributo alterado. Para reduzir,
// a borracha passa pelo valor; para aumentar, o lápis redesenha e deixa um +1.
function animarAjusteThiago(idOrigem, idAlvo, atributo, aumentar) {
    let origem = document.getElementById("pacote-" + idOrigem);
    let pacoteAlvo = document.getElementById("pacote-" + idAlvo);
    let atributoEl = document.getElementById(atributo + "-" + idAlvo);
    if (!pacoteAlvo || !atributoEl) return;

    let rectOrigem = (origem || pacoteAlvo).getBoundingClientRect();
    let rectAtributo = atributoEl.getBoundingClientRect();
    let inicioX = rectOrigem.left + rectOrigem.width / 2;
    let inicioY = rectOrigem.top + rectOrigem.height / 2;
    let fimX = rectAtributo.left + rectAtributo.width / 2;
    let fimY = rectAtributo.top + rectAtributo.height / 2;
    let tipo = aumentar ? "desenhando" : "apagando";

    let lapis = document.createElement("div");
    lapis.className = "lapis-ajuste-thiago lapis-thiago-" + tipo;
    lapis.style.setProperty("--thiago-inicio-x", inicioX + "px");
    lapis.style.setProperty("--thiago-inicio-y", inicioY + "px");
    lapis.style.setProperty("--thiago-fim-x", fimX + "px");
    lapis.style.setProperty("--thiago-fim-y", fimY + "px");
    lapis.innerHTML = '<span>✏️</span>';

    let marca = document.createElement("div");
    marca.className = "marca-ajuste-thiago marca-thiago-" + tipo;
    marca.style.left = fimX + "px";
    marca.style.top = fimY + "px";
    marca.innerHTML = aumentar
        ? '<i class="traco-lapis-thiago"></i><b>+1</b>'
        : '<i class="po-borracha"></i><i class="po-borracha"></i><i class="po-borracha"></i><b>−1</b>';

    document.body.appendChild(lapis);
    document.body.appendChild(marca);
    if (origem) origem.classList.add("thiago-editando");
    pacoteAlvo.classList.add("alvo-edicao-thiago");

    setTimeout(() => {
        lapis.remove();
        marca.remove();
        if (origem && origem.isConnected) origem.classList.remove("thiago-editando");
        if (pacoteAlvo.isConnected) pacoteAlvo.classList.remove("alvo-edicao-thiago");
    }, 1250);
}

// 🎨 ÍCARO — transforma a carta clicada em outra TROPA sorteada aleatoriamente (nunca em
// suporte/poção, nunca no próprio "Criador"), mantendo a vida e o dano atuais dela.
// Recria a carta do zero (mesmo padrão que converterCartaRoubada usa pro Bruxo) pra ela
// realmente ganhar a passiva e a Habilidade da carta sorteada, não só o nome/imagem.
function aplicarTransformacaoIcaro(idPacoteAlvo) {
    let pacoteAlvo = document.getElementById(idPacoteAlvo);
    if (!pacoteAlvo) return;

    let candidatas = bancoDeCartas.filter(c => !suportesReais.includes(c.id) && c.id !== "criador");
    if (candidatas.length === 0) return;
    let novaCartaInfo = candidatas[Math.floor(Math.random() * candidatas.length)];

    let idUnico = idPacoteAlvo.replace("pacote-", "");
    let vidaEl = document.getElementById("vida-" + idUnico);
    let danoEl = document.getElementById("dano-" + idUnico);
    let vidaAtual = vidaEl ? vidaEl.innerText : novaCartaInfo.vida;
    let danoAtual = danoEl ? danoEl.innerText : novaCartaInfo.dano;
    let nomeAntigo = pacoteAlvo.querySelector(".nome-carta").innerText.trim();
    let estavaCongelada = pacoteAlvo.classList.contains("congelada");
    let ehAliado = pacoteAlvo.closest("#campo-j1") !== null;

    animarPoderCriacaoIcaro(idIcaroAtivo, pacoteAlvo);

    let cartaObj = { nome: novaCartaInfo.nome, idUnico: idUnico, img: novaCartaInfo.img, vida: vidaAtual, dano: danoAtual };
    let classeCss = ehAliado ? "carta-aliada" : "carta-inimiga";
    let funcaoJogar = ehAliado ? "jogarCarta" : "jogarCartaInimigo";
    let html = criarHTMLCarta(cartaObj, funcaoJogar, classeCss, ehAliado);

    let temp = document.createElement("div");
    temp.innerHTML = html.trim();
    let novoElemento = temp.firstElementChild;

    // Insere no MESMO lugar da carta antiga (preserva a ordem no campo, importante pra
    // habilidades que dependem de vizinhos, tipo Cavaleiro das Trevas e Barril).
    pacoteAlvo.parentElement.insertBefore(novoElemento, pacoteAlvo);
    pacoteAlvo.remove();

    if (estavaCongelada) novoElemento.classList.add("congelada");

    // "Liga" a carta de verdade — ataque, habilidade, tudo já funcionando com a nova identidade.
    if (ehAliado) jogarCarta("pacote-" + idUnico);
    else jogarCartaInimigo("pacote-" + idUnico);

    // As funções acima podem reposicionar a carta; busca novamente o elemento definitivo.
    animarRevelacaoIcaro(document.getElementById("pacote-" + idUnico));

    narrar(`🎨 ÍCARO transformou ${nomeAntigo} em ${novaCartaInfo.nome}! Vida (${vidaAtual}) e dano (${danoAtual}) continuam os mesmos — e agora ela tem a passiva e a Habilidade de ${novaCartaInfo.nome}.`);

    modoTransformacaoIcaro = false;
    idIcaroAtivo = null;
    if (typeof atualizarTodosUnidoes === "function") atualizarTodosUnidoes();
}

// ⚖️ THIAGO — ajusta em ±1 a vida OU o dano da carta clicada (jogador escolhe os dois na hora).
function aplicarAjusteThiago(idPacoteAlvo) {
    let pacoteAlvo = document.getElementById(idPacoteAlvo);
    if (!pacoteAlvo) return;
    let idPuro = idPacoteAlvo.replace("pacote-", "");

    // 🤖 Se for o BOT decidindo (não um humano jogando, nem mesmo o Jogador 2 manual no
    // PvP local), pula os pop-ups de confirm() — eles travariam esperando um clique que
    // nunca vem — e sempre enfraquece o alvo tirando 1 de DANO (o alvo já é a maior
    // ameaça escolhida em botResolverEscolhaPendente).
    let ehDecisaoDoBot = (typeof window !== "undefined" && window.__rpgBotJogando === true);
    let ajustarVida, aumentar;
    if (ehDecisaoDoBot) {
        ajustarVida = false;
        aumentar = false;
    } else {
        ajustarVida = confirm("Qual atributo ajustar?\n\n[ OK ] = VIDA\n[ CANCELAR ] = DANO");
        aumentar = confirm("Aumentar ou diminuir em 1?\n\n[ OK ] = Aumentar (+1)\n[ CANCELAR ] = Diminuir (-1)");
    }

    let isInimigo = pacoteAlvo.closest("#campo-j2") !== null;

    // Registra as posições antes do ajuste, pois diminuir a vida pode eliminar a carta.
    animarAjusteThiago(idThiagoAtivo, idPuro, ajustarVida ? "vida" : "dano", aumentar);

    if (ajustarVida) {
        // Reaproveita aplicarDanoDireto: dano negativo cura (+1 vida), dano positivo tira 1 de vida.
        aplicarDanoDireto(idPacoteAlvo, aumentar ? -1 : 1, isInimigo);
        narrar(`⚖️ THIAGO ${aumentar ? "aumentou" : "diminuiu"} 1 de VIDA da carta escolhida!`);
        // Vida não é recalculada automaticamente por nada, então aqui pode atualizar à vontade.
        if (typeof atualizarTodosUnidoes === "function") atualizarTodosUnidoes();
    } else {
        let txtDano = document.getElementById("dano-" + idPuro);
        if (txtDano) {
            let novoDano = parseFloat(txtDano.innerText) + (aumentar ? 1 : -1);
            txtDano.innerText = novoDano;
        }
        narrar(`⚖️ THIAGO ${aumentar ? "aumentou" : "diminuiu"} 1 de DANO da carta escolhida!`);
        // 🩹 NÃO chama atualizarTodosUnidoes() aqui: se o alvo for um Unidão, essa função
        // recalcula o dano dele automaticamente (1 + maior dano do time) e apagaria na hora
        // o ajuste manual do Thiago. Deixando de fora, o ±1 realmente fica valendo.
    }

    modoAjusteThiago = false;
    idThiagoAtivo = null;
}

// 👥 Botão "Trocar Parceiro" — sempre disponível, pode ser clicado quantas vezes quiser.
function trocarParceiroSeparado(idUnico, ehAliado) {
    let pacoteSeparado = document.getElementById("pacote-" + idUnico);
    if (!pacoteSeparado) return;

    let lado = ehAliado ? "j1" : "j2";
    let classeCss = ehAliado ? "carta-aliada" : "carta-inimiga";
    let outrosAliados = Array.from(document.getElementById("campo-" + lado).getElementsByClassName(classeCss))
        .filter(p => p.id !== "pacote-" + idUnico);

    if (outrosAliados.length === 0) {
        return narrar("❌ Não tem nenhuma outra carta do seu time em campo pra virar parceira agora.");
    }

    modoParceriaSeparado = true;
    idSeparadoParceriaAtivo = idUnico;
    narrar(`👥 Escolha a nova carta parceira — clique em outra carta do seu time em campo.`);
}

// 👥 Busca reversa: dado o ID de quem atacou, acha o Separado/Separadois que tem ESSA
// carta como parceira (se houver). Usado porque agora é o ataque da PARCEIRA que arrasta
// o Separado junto — não o contrário.
function encontrarSeparadoParceiroDe(idCartaQueAtacou) {
    if (typeof parceriaSeparado === 'undefined') return null;
    for (let idSep in parceriaSeparado) {
        if (parceriaSeparado[idSep] === idCartaQueAtacou) return idSep;
    }
    return null;
}

// 👥 SEPARADO/SEPARADOIS — resolve o clique de quem vira parceira.
function aplicarParceriaSeparado(idPacoteAlvo) {
    let idPuro = idPacoteAlvo.replace("pacote-", "");
    if (idPuro === idSeparadoParceriaAtivo) {
        return narrar("❌ Escolha outra carta — ela não pode ser parceira dela mesma!");
    }

    let pacoteSeparado = document.getElementById("pacote-" + idSeparadoParceriaAtivo);
    let pacoteClicado = document.getElementById(idPacoteAlvo);
    if (!pacoteSeparado || !pacoteClicado) return;

    let ladoSeparado = pacoteSeparado.closest("#campo-j1") ? "j1" : "j2";
    let ladoClicado = pacoteClicado.closest("#campo-j1") ? "j1" : "j2";
    if (ladoClicado !== ladoSeparado) {
        return narrar("❌ Alvo inválido! A parceira precisa ser uma carta do MESMO time.");
    }

    parceriaSeparado[idSeparadoParceriaAtivo] = idPuro;
    let nomeParceira = pacoteClicado.querySelector(".nome-carta").innerText.trim();
    narrar(`👥 Parceria formada com ${nomeParceira}! A partir de agora, elas atacam juntas o mesmo alvo.`);

    modoParceriaSeparado = false;
    idSeparadoParceriaAtivo = null;
}

// 👥 Descobre se o ataque que ACABOU de acontecer faz parte de uma sequência dividida do
// Separado/Separadois (habilidade do dado 6) — seja porque quem atacou é o próprio Separado,
// seja porque é a parceira dele. Retorna o ID do Separado dono da sequência, ou null.
function obterSeparadaoDivididoAtivo(idAtacante) {
    if (typeof separadaoDividido === 'undefined') return null;
    if (separadaoDividido[idAtacante] > 0) return idAtacante;
    let idSeparadoParceiro = encontrarSeparadoParceiroDe(idAtacante);
    if (idSeparadoParceiro && separadaoDividido[idSeparadoParceiro] > 0) return idSeparadoParceiro;
    return null;
}


// Cria o relógio usado pelos dois efeitos do Viajante. Os ponteiros são elementos
// separados para poderem girar ao contrário ou parar de repente no especial.
function criarRelogioDoViajante(classeExtra) {
    let relogio = document.createElement("div");
    relogio.className = "relogio-do-viajante " + (classeExtra || "");
    relogio.innerHTML = `
        <span class="marca-tempo marca-tempo-12"></span>
        <span class="marca-tempo marca-tempo-3"></span>
        <span class="marca-tempo marca-tempo-6"></span>
        <span class="marca-tempo marca-tempo-9"></span>
        <i class="ponteiro-tempo ponteiro-hora"></i>
        <i class="ponteiro-tempo ponteiro-minuto"></i>
        <b class="pino-relogio-temporal"></b>
    `;
    return relogio;
}

// Passiva: o relógio aparece sobre o próprio Viajante e gira ao contrário, como
// se ele estivesse rebobinando a rodada do time inteiro.
function animarVoltaNoTempo(idViajante) {
    let pacote = document.getElementById("pacote-" + idViajante);
    if (!pacote) return;

    let rect = pacote.getBoundingClientRect();
    let efeito = document.createElement("div");
    efeito.className = "efeito-volta-no-tempo";
    efeito.style.left = (rect.left + rect.width / 2) + "px";
    efeito.style.top = (rect.top + Math.min(58, rect.height * 0.28)) + "px";
    efeito.innerHTML = '<i class="anel-temporal"></i><i class="anel-temporal"></i>';
    efeito.appendChild(criarRelogioDoViajante("relogio-rebobinando"));
    document.body.appendChild(efeito);

    pacote.classList.add("viajante-rebobinando-tempo");
    setTimeout(() => {
        efeito.remove();
        if (pacote.isConnected) pacote.classList.remove("viajante-rebobinando-tempo");
    }, 1750);
}

// Especial: a carta verdadeira sai da batalha na mesma hora, preservando a regra do jogo.
// Um eco visual sem IDs fica por alguns instantes, preso dentro do relógio, até desaparecer.
function animarCartaPresaNoTempo(pacoteAlvo) {
    if (!pacoteAlvo) return;

    let rect = pacoteAlvo.getBoundingClientRect();
    let eco = pacoteAlvo.cloneNode(true);
    eco.removeAttribute("id");
    eco.querySelectorAll("[id]").forEach(el => el.removeAttribute("id"));
    eco.querySelectorAll("button").forEach(botao => {
        botao.disabled = true;
        botao.removeAttribute("onclick");
    });
    eco.classList.add("eco-carta-presa-no-tempo");
    eco.style.left = rect.left + "px";
    eco.style.top = rect.top + "px";
    eco.style.width = rect.width + "px";
    eco.style.height = rect.height + "px";
    eco.style.margin = "0";
    eco.appendChild(criarRelogioDoViajante("relogio-prendendo-tempo"));

    let distorcao = document.createElement("div");
    distorcao.className = "distorcao-prisao-temporal";
    distorcao.style.left = (rect.left + rect.width / 2) + "px";
    distorcao.style.top = (rect.top + rect.height / 2) + "px";

    document.body.appendChild(eco);
    document.body.appendChild(distorcao);
    setTimeout(() => {
        eco.remove();
        distorcao.remove();
    }, 1850);
}

// ⏳ VIAJANTE DO TEMPO — Passiva (uso único): reseta TODAS as habilidades/passivas de uso
// único já gastas nas duas mesas (o botão "Especial" reaparece pra quem já usou), sem
// mexer em vida, dano ou posição de nenhuma carta.
function usarPassivaViajante(idUnico, botaoClicado) {
    if (viajantesJaUsaram[idUnico]) {
        return narrar("⏳ Este Viajante do Tempo já usou a Passiva dele!");
    }

    let pacoteViajante = document.getElementById("pacote-" + idUnico);
    let lado = (pacoteViajante && pacoteViajante.closest("#campo-j1")) ? "j1" : "j2";

    animarVoltaNoTempo(idUnico);

    let campo = document.getElementById("campo-" + lado);
    if (campo) {
        Array.from(campo.querySelectorAll("button")).forEach(btn => {
            if (btn.style.display === "none") btn.style.display = "";
        });
    }

    viajantesJaUsaram[idUnico] = true;
    if (botaoClicado) botaoClicado.style.display = "none"; // essa própria Passiva é uso único

    narrar(`⏳ O tempo voltou! Todas as Habilidades e Especiais já usados no time ${lado === "j1" ? "aliado" : "do oponente"} estão disponíveis de novo (vida e dano de ninguém mudaram).`);
    if (typeof atualizarTodosUnidoes === "function") atualizarTodosUnidoes();
}

// ⏳ Habilidade do Viajante do Tempo (dado 1) — resolve o clique na carta inimiga que
// fica presa em um momento do tempo e SOME da batalha.
function aplicarPrenderNoTempo(idPacoteAlvo) {
    let pacoteViajante = document.getElementById("pacote-" + idPrenderNoTempoAtivo);
    let pacoteClicado = document.getElementById(idPacoteAlvo);
    if (!pacoteViajante || !pacoteClicado) return;

    let ladoViajante = pacoteViajante.closest("#campo-j1") ? "j1" : "j2";
    let ladoClicado = pacoteClicado.closest("#campo-j1") ? "j1" : "j2";
    if (ladoClicado === ladoViajante) {
        return narrar("❌ Alvo inválido! Escolha uma carta INIMIGA pra prender no tempo.");
    }

    let idPuro = idPacoteAlvo.replace("pacote-", "");
    let nomeAlvo = pacoteClicado.querySelector(".nome-carta").innerText.trim();

    animarCartaPresaNoTempo(pacoteClicado);
    pacoteClicado.remove(); // ela desaparece da batalha — presa em outro momento do tempo

    narrar(`⏳ ${nomeAlvo} ficou PRESA em um momento do tempo e SUMIU da batalha!`);

    modoPrenderNoTempo = false;
    idPrenderNoTempoAtivo = null;
}

function aplicarAlvoBarril(idPacoteAlvo, viaEspecial) {
    let pacoteAlvo = document.getElementById(idPacoteAlvo);
    let pacoteBarril = document.getElementById("pacote-" + idBarrilAtivo);
    
    // 👇 SE ALGO CORRER MAL, DESLIGA A MIRA PARA NÃO ENCRAVAR O JOGO!
    if (!pacoteAlvo || !pacoteBarril) {
        modoAlvoBarril = false;
        modoAlvoBarrilInimigo = false;
        return;
    }
    // Descobre de qual lado está o Barril e de qual lado está o Alvo
    let ladoBarril = pacoteBarril.closest("#campo-j1") ? "j1" : "j2";
    let ladoAlvo = pacoteAlvo.closest("#campo-j1") ? "j1" : "j2";

    // Impede o Barril de atacar as cartas do próprio time
    if (ladoBarril === ladoAlvo) {
        return narrar("❌ Escolha uma carta do campo oposto para o Barril atacar!");
    }

    let nomeAlvo = pacoteAlvo.querySelector(".nome-carta").innerText;
    let isInimigoParaOJogo = (ladoAlvo === "j2"); 

    // Desliga a mira
    modoAlvoBarril = false;
    modoAlvoBarrilInimigo = false;

    let idBarrilPuro = idBarrilAtivo;
    let idAlvoPuro = idPacoteAlvo.replace("pacote-", "");
    
    alvosDoBarril[idBarrilPuro] = idAlvoPuro; 
    animarLancamentoBarrilGoblin(idBarrilPuro, idAlvoPuro);

    narrar(`🎯 Os Goblins do Barril focaram-se em [${nomeAlvo}]!`);

    // LÊ O DANO EXTRA (BUFFS DA BESTA, UNIDÃO, ETC)
    let txtDanoBarril = document.getElementById("dano-" + idBarrilPuro);
    let buffDano = txtDanoBarril ? parseFloat(txtDanoBarril.innerText) : 0;

    // DANO DE IMPACTO
    if (!barrilJaImpactou[idBarrilPuro]) {
        barrilJaImpactou[idBarrilPuro] = true;

        // 🎯 Carta atacada: 1 de impacto + o dano atual do Barril (0,75 base dos 3 goblins,
        // ou mais se estiver com Besta/Unidão) = 1,75 no caso padrão.
        let danoAlvoPrincipal = 1 + buffDano;
        aplicarDanoAtaqueArea(idPacoteAlvo, danoAlvoPrincipal, isInimigoParaOJogo);
        narrar(`💥 BUM! O impacto do Barril causou ${danoAlvoPrincipal} de dano na carta atacada!`);

        // 🩸 Vizinhos: impacto fixo de 1, sem escalar com o dano do Barril.
        let danoImpactoVizinhos = 1;
        let vizinhos = obterCartasAdjacentes(idPacoteAlvo);
        vizinhos.forEach(vizinho => {
            aplicarDanoAtaqueArea(vizinho.id, danoImpactoVizinhos, isInimigoParaOJogo);
        });
        if (vizinhos.length > 0) narrar(`💥 O impacto também atingiu as cartas vizinhas, causando ${danoImpactoVizinhos} de dano em cada!`);

        // 🦇 VAMPI7 — esse impacto conta como um ataque de verdade também.
        dispararVampi7JuntoDoAtaque(idBarrilPuro, idPacoteAlvo);
        // 🛸 PORTABLE — ataca junto enquanto a bateria durar.
        dispararPortableJuntoDoAtaque(idBarrilPuro, idPacoteAlvo);
    }

    idBarrilAtivo = null;

    if (viaEspecial) {
        modoEspecialBarrilGoblin = false;
        usarHabilidade('Barril de Goblin', idBarrilPuro, null);
    }
    passarTurno(); 
}
function equiparSuporte(idAlvo) {
    if (!suportePreparado) return; 

    let pacoteAlvo = document.getElementById("pacote-" + idAlvo);
    if (!pacoteAlvo) return;
    
    let nomeAlvo = pacoteAlvo.querySelector(".nome-carta").innerText.trim();
    let danoElemento = document.getElementById("dano-" + idAlvo);
    let danoAtual = 0;
    if (danoElemento) danoAtual = parseFloat(danoElemento.innerText);

    // --- REGRA DO ESCUDO ---
    if (suportePreparado === 'Escudo') {
        let itemNaMaoEscudo = document.getElementById("pacote-" + idItemNaMao);
        if (!itemNaMaoEscudo) return;

        let quemJogouEscudo = itemNaMaoEscudo.parentElement ? itemNaMaoEscudo.parentElement.id : "";
        let alvoNoCampo1Escudo = pacoteAlvo.closest("#campo-j1") !== null;
        let alvoNoCampo2Escudo = pacoteAlvo.closest("#campo-j2") !== null;

        if ((quemJogouEscudo.includes("j1") && !alvoNoCampo1Escudo) || (quemJogouEscudo.includes("j2") && !alvoNoCampo2Escudo)) {
            return narrar("❌ Alvo inválido! O Escudo só pode ser usado em cartas ALIADAS.");
        }

        // Não pode em suporte/poção — só em tropas de verdade.
        let infoAlvoEscudo = bancoDeCartas
            .filter(c => idAlvo === c.id || idAlvo.startsWith(c.id + "_") || idAlvo.startsWith(c.id + "-"))
            .sort((a, b) => b.id.length - a.id.length)[0];
        if (infoAlvoEscudo && suportesReais.includes(infoAlvoEscudo.id)) {
            return narrar("❌ Alvo inválido! O Escudo só pode ser usado em tropas, não em suportes/poções.");
        }

        escudoGuerreiro[idAlvo] = true; // reaproveita o mesmo mecanismo de bloqueio do Guerreiro
        ativarVisualEscudo(idAlvo);

        itemNaMaoEscudo.remove();

        narrar(`🛡️ [${nomeAlvo}] recebeu um Escudo! Ela vai ignorar completamente o próximo ataque que sofrer.`);
        suportePreparado = null;
    }

    // --- REGRA DA BESTA ---
    if (suportePreparado === 'Besta') {
        let itemNaMaoBesta = document.getElementById("pacote-" + idItemNaMao);
        if (!itemNaMaoBesta) return;

        let quemJogouBesta = itemNaMaoBesta.parentElement ? itemNaMaoBesta.parentElement.id : "";
        let alvoNoCampo1Besta = pacoteAlvo.closest("#campo-j1") !== null;
        let alvoNoCampo2Besta = pacoteAlvo.closest("#campo-j2") !== null;

        if ((quemJogouBesta.includes("j1") && !alvoNoCampo1Besta) || (quemJogouBesta.includes("j2") && !alvoNoCampo2Besta)) {
            return narrar("❌ Alvo inválido! A Besta só pode ser equipada em cartas ALIADAS.");
        }

        let bonus = (nomeAlvo === 'Arqueiro') ? 2 : 1;
        if (danoElemento) danoElemento.innerText = danoAtual + bonus;
        
        itemNaMaoBesta.remove();

        // 🚨 EFEITO DE GANHO DE ATAQUE AQUI:
            mostrarEfeitoAtaque(idAlvo);
        
        narrar(`🏹 A Besta foi equipada em [${nomeAlvo}]! O dano base subiu para ${danoAtual + bonus}.`);
        suportePreparado = null;
    }

    // --- REGRA DA AUVEX ---
    if (suportePreparado === 'Auvex') {
        let itemNaMaoAuvex = document.getElementById("pacote-" + idItemNaMao);
        if (!itemNaMaoAuvex) return;

        let quemJogouAuvex = itemNaMaoAuvex.parentElement ? itemNaMaoAuvex.parentElement.id : "";
        let alvoNoCampo1Auvex = pacoteAlvo.closest("#campo-j1") !== null;
        let alvoNoCampo2Auvex = pacoteAlvo.closest("#campo-j2") !== null;

        if ((quemJogouAuvex.includes("j1") && !alvoNoCampo1Auvex) || (quemJogouAuvex.includes("j2") && !alvoNoCampo2Auvex)) {
            return narrar("❌ Alvo inválido! A Auvex só pode ser equipada em cartas ALIADAS.");
        }

        if (danoElemento) danoElemento.innerText = danoAtual + 1;

        itemNaMaoAuvex.remove();

        mostrarEfeitoAtaque(idAlvo);

        narrar(`⚡ Auvex equipada em [${nomeAlvo}]! O dano subiu pra ${danoAtual + 1}, de forma PERMANENTE.`);
        suportePreparado = null;
    }

    // --- REGRA DA VELUX ---
    if (suportePreparado === 'Velux') {
        let itemNaMaoVelux = document.getElementById("pacote-" + idItemNaMao);
        if (!itemNaMaoVelux) return;

        let quemJogouVelux = itemNaMaoVelux.parentElement ? itemNaMaoVelux.parentElement.id : "";
        let alvoNoCampo1Velux = pacoteAlvo.closest("#campo-j1") !== null;
        let alvoNoCampo2Velux = pacoteAlvo.closest("#campo-j2") !== null;

        if ((quemJogouVelux.includes("j1") && !alvoNoCampo1Velux) || (quemJogouVelux.includes("j2") && !alvoNoCampo2Velux)) {
            return narrar("❌ Alvo inválido! A poção Velux só pode ser usada em cartas ALIADAS.");
        }

        pocaoVeluxAtiva[idAlvo] = true;
        ativarEfeitoVelocidade(idAlvo);
        
        itemNaMaoVelux.remove();
        
        narrar(`⚡ Poção Velux derramada sobre [${nomeAlvo}]! Segundo ataque liberado imediatamente!`);
        suportePreparado = null;
    }

    // --- REGRA DA ADIV ---
    if (suportePreparado === 'Adiv') {
        let itemNaMaoAdiv = document.getElementById("pacote-" + idItemNaMao);
        if (!itemNaMaoAdiv) return;

        let quemJogouAdiv = itemNaMaoAdiv.parentElement ? itemNaMaoAdiv.parentElement.id : "";
        let alvoNoCampo1Adiv = pacoteAlvo.closest("#campo-j1") !== null;
        let alvoNoCampo2Adiv = pacoteAlvo.closest("#campo-j2") !== null;

        // Ofensiva: só pode mirar no lado OPOSTO de quem jogou a poção
        if ((quemJogouAdiv.includes("j1") && alvoNoCampo1Adiv) || (quemJogouAdiv.includes("j2") && alvoNoCampo2Adiv)) {
            return narrar("❌ Alvo inválido! A poção Adiv só pode ser usada em cartas INIMIGAS.");
        }

        itemNaMaoAdiv.remove();

        // 🚨 NOVO EFEITO AQUI: Coração partido caindo da carta alvo!
        mostrarEfeitoPerdaVida(idAlvo);
        
        narrar(`🧪 Splash! A poção Adiv foi atirada em [${nomeAlvo}], causando 1 de dano direto!`);
        
        let isInimigo = pacoteAlvo.closest("#campo-j2") !== null;
        aplicarDanoDireto("pacote-" + idAlvo, 1, isInimigo);
        suportePreparado = null;
    }

   // --- REGRA DA RECUPERIDA ---
    if (suportePreparado === 'Recuperida') {
        let itemNaMao = document.getElementById("pacote-" + idItemNaMao);
        if (!itemNaMao) return;
        
        let quemJogou = itemNaMao.parentElement ? itemNaMao.parentElement.id : "";
        let alvoNoCampo1 = pacoteAlvo.closest("#campo-j1") !== null;
        let alvoNoCampo2 = pacoteAlvo.closest("#campo-j2") !== null;
        
        if ((quemJogou.includes("j1") && !alvoNoCampo1) || (quemJogou.includes("j2") && !alvoNoCampo2)) {
            return narrar("❌ Alvo inválido! A poção Recuperida só pode ser usada em cartas ALIADAS.");
        }
        
        itemNaMao.remove();
        
        let txtVida = document.getElementById("vida-" + idAlvo);
        if (txtVida) {
            let vidaAtual = parseFloat(txtVida.innerText);
            txtVida.innerText = vidaAtual + 1;
            
            // 🚨 EFEITO DE VIDA AQUI: Sobe 1 coração para indicar a cura da poção!
            // (Se quiser que subam 3 corações, é só trocar "ganhou" por "recuperou")
            mostrarEfeitoVida(idAlvo, "ganhou");
            
            narrar(`🧪 Glup glup! A poção Recuperida curou 1 de vida de [${nomeAlvo}]!`);
        }
        suportePreparado = null;
    }

    // --- REGRA DA PLUS LIFE ---
    if (suportePreparado === 'PlusLife') {
        let itemNaMaoPlusLife = document.getElementById("pacote-" + idItemNaMao);
        if (!itemNaMaoPlusLife) return;

        let quemJogouPlusLife = itemNaMaoPlusLife.parentElement ? itemNaMaoPlusLife.parentElement.id : "";
        let alvoNoCampo1PlusLife = pacoteAlvo.closest("#campo-j1") !== null;
        let alvoNoCampo2PlusLife = pacoteAlvo.closest("#campo-j2") !== null;

        if ((quemJogouPlusLife.includes("j1") && !alvoNoCampo1PlusLife) || (quemJogouPlusLife.includes("j2") && !alvoNoCampo2PlusLife)) {
            return narrar("❌ Alvo inválido! A Plus Life só pode ser usada em cartas ALIADAS.");
        }

        itemNaMaoPlusLife.remove();

        let txtVidaPlusLife = document.getElementById("vida-" + idAlvo);
        if (txtVidaPlusLife) {
            let vidaAtualPlusLife = parseFloat(txtVidaPlusLife.innerText);
            txtVidaPlusLife.innerText = vidaAtualPlusLife + 2;

            // 🚨 EFEITO DE VIDA AQUI: Sobe 3 corações em cascata, pra destacar que curou mais que a Recuperida
            mostrarEfeitoVida(idAlvo, "recuperou");

            narrar(`💚 Plus Life usada! [${nomeAlvo}] ganhou 2 de vida.`);
        }
        suportePreparado = null;
    }

    // --- REGRA DA TRAIÇÃO (PASSO 1: Escolher o Traidor) ---
    if (suportePreparado === 'Traicao') {
        let itemNaMao = document.getElementById("pacote-" + idItemNaMao);
        if (!itemNaMao) return;

        let quemJogou = itemNaMao.parentElement ? itemNaMao.parentElement.id : "";
        let alvoNoCampo1 = pacoteAlvo.closest("#campo-j1") !== null;
        let alvoNoCampo2 = pacoteAlvo.closest("#campo-j2") !== null;

        // Se a poção saiu da tua mão (j1), só podes atirar num inimigo (j2)
        if (quemJogou.includes("j1") && !alvoNoCampo2) {
            return narrar("❌ Alvo inválido! Deves atirar a Poção da Traição numa carta do INIMIGO.");
        }
        // Se a poção saiu da mão do oponente (j2), ele só pode atirar numa carta TUA (j1)
        if (quemJogou.includes("j2") && !alvoNoCampo1) {
            return narrar("❌ Alvo inválido! O Oponente deve atirar a Poção da Traição numa carta SUA.");
        }

        modoTraicao = true;
        idTraidor = idAlvo;
        
        narrar(`🗡️ [${nomeAlvo}] bebeu a Poção da Traição! Agora CLICA num parceiro dele para sofrer o ataque!`);
        itemNaMao.remove();
        suportePreparado = null; // Limpa para evitar bugs no próximo clique
    }
}

function ativarSuporte(nomeOriginal, idItem) {
    suportePreparado = nomeOriginal;
    idItemNaMao = idItem;
    
    if (nomeOriginal === 'Besta') {
        narrar(`⚡ AÇÃO RÁPIDA: Besta engatilhada! Clique na IMAGEM de uma tropa na arena.`);
    } else if (nomeOriginal === 'Auvex') {
        narrar(`⚡ Auvex engatilhada! Clique na imagem de uma tropa ALIADA pra ela ganhar +1 de ataque PERMANENTE.`);
    } else if (nomeOriginal === 'Velux') {
        narrar(`✨ Poção Velux preparada! Pode ser usada a qualquer momento!`);
    } else if (nomeOriginal === 'Adiv') {
        narrar(`🧪 Splash! Poção Adiv engatilhada! Clique em QUALQUER carta na arena para tirar 1 de vida.`);
    } else if (nomeOriginal === 'Recuperida') {
        narrar(`🧪 MODO CURA: Poção Recuperida engatilhada! Clique na imagem de uma criatura ALIADA para curar 1 de vida.`);
    } else if (nomeOriginal === 'PlusLife') {
        narrar(`💚 Plus Life engatilhada! Clique na imagem de uma criatura ALIADA para ela ganhar 2 de vida.`);
    } else if (nomeOriginal === 'Traicao') {
        narrar(`🧪 Poção da Traição engatilhada! Clique em uma carta INIMIGA para ela se voltar contra o próprio time.`);
    } else if (nomeOriginal === 'Escudo') {
        narrar(`🛡️ Escudo preparado! Clique numa carta ALIADA que não seja suporte/poção — ela fica imune ao próximo ataque que sofrer.`);
    }
}

// 💀 REVIVERTA — em vez de clicar num alvo em campo (como as outras poções), abre o
// cemitério dos dois lados como miniaturas clicáveis. A carta escolhida (sua ou do
// oponente) volta com os atributos ORIGINAIS de fábrica, direto pra mão de quem usou.
function usarReviverta(idItem, ehAliado) {
    if (cemiterio.j1.length === 0 && cemiterio.j2.length === 0) {
        return narrar("💀 Ainda não há nenhuma carta morta pra reviver!");
    }
    revivertaPendente = { idItem, ehAliado };
    mostrarCemiterioReviverta(idItem, ehAliado);
}

function mostrarCemiterioReviverta(idItem, ehAliado) {
    let antigo = document.getElementById("overlay-cemiterio");
    if (antigo) antigo.remove();

    let overlay = document.createElement("div");
    overlay.id = "overlay-cemiterio";
    overlay.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); z-index:9999; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:20px; padding:20px; box-sizing:border-box; overflow:auto; font-family:'Georgia', serif;";

    let titulo = document.createElement("h2");
    titulo.innerText = "💀 Reviverta — escolha uma carta pra trazer de volta";
    titulo.style.cssText = "color: var(--borda-ouro, #d4af37); text-align:center; margin:0;";
    overlay.appendChild(titulo);

    function criarColuna(rotulo, lado) {
        let col = document.createElement("div");
        col.style.cssText = "display:flex; flex-direction:column; align-items:center; gap:10px; width:100%; max-width:700px;";

        let h = document.createElement("h3");
        h.innerText = rotulo;
        h.style.cssText = "color: var(--borda-ouro, #d4af37); margin: 5px 0;";
        col.appendChild(h);

        let linha = document.createElement("div");
        linha.style.cssText = "display:flex; flex-wrap:wrap; gap:10px; justify-content:center; width:100%;";

        if (cemiterio[lado].length === 0) {
            let vazio = document.createElement("p");
            vazio.innerText = "Nenhuma carta morta aqui ainda.";
            vazio.style.cssText = "color:#ccc; font-style:italic;";
            linha.appendChild(vazio);
        } else {
            cemiterio[lado].forEach((carta, index) => {
                let mini = document.createElement("div");
                mini.style.cssText = "width:100px; background: var(--bg-carta, #f4eedb); border:3px solid var(--borda-carta, #8c6d4f); border-radius:8px; padding:6px; text-align:center; cursor:pointer;";
                mini.innerHTML = `
                    <div style="font-size:0.75rem; font-weight:bold; color:#2c2520; margin-bottom:3px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${carta.nome}</div>
                    <img src="${carta.img}" style="width:100%; height:60px; object-fit:contain; border-radius:4px;">
                    <div style="font-size:0.75rem; color:#2c2520; margin-top:3px;">❤️${carta.vida} ⚔️${carta.dano}</div>
                `;
                mini.onclick = function () {
                    reviverCartaDoCemiterio(lado, index, idItem, ehAliado);
                };
                linha.appendChild(mini);
            });
        }

        col.appendChild(linha);
        return col;
    }

    overlay.appendChild(criarColuna("💀 Cemitério Aliado", ehAliado ? "j1" : "j2"));
    overlay.appendChild(criarColuna("💀 Cemitério Inimigo", ehAliado ? "j2" : "j1"));

    let btnCancelar = document.createElement("button");
    btnCancelar.innerText = "Cancelar";
    btnCancelar.onclick = function () { revivertaPendente = null; overlay.remove(); };
    overlay.appendChild(btnCancelar);

    document.body.appendChild(overlay);
}

function reviverCartaDoCemiterio(lado, index, idItem, ehAliado) {
    let dadosCarta = cemiterio[lado][index];
    if (!dadosCarta) return;

    cemiterio[lado].splice(index, 1);

    let idMaoHTML = ehAliado ? "mao-j1" : "mao-j2";
    let funcaoJogar = ehAliado ? "jogarCarta" : "jogarCartaInimigo";
    let classeCss = ehAliado ? "carta-aliada" : "carta-inimiga-espera";

    // 🩹 CORREÇÃO: o ID precisa conter "inimigo" quando vai pra mão do oponente — é assim que
    // o resto do jogo (equiparSuporte, etc.) sabe de quem é a carta. Sem isso, suportes revividos
    // pro lado do bot davam "Ação inválida" na hora de usar.
    let idUnico = dadosCarta.id + (ehAliado ? "-revivida-" : "-inimigo-revivida-") + Math.floor(Math.random() * 100000);
    let novaCarta = { ...dadosCarta, idUnico: idUnico };

    let htmlDaCarta = criarHTMLCarta(novaCarta, funcaoJogar, classeCss, ehAliado);
    let divMao = document.getElementById(idMaoHTML);
    if (divMao) divMao.insertAdjacentHTML('beforeend', htmlDaCarta);

    let pacoteItem = document.getElementById("pacote-" + idItem);
    if (pacoteItem) pacoteItem.remove();

    let overlay = document.getElementById("overlay-cemiterio");
    if (overlay) overlay.remove();
    revivertaPendente = null;

    narrar(`✨ Reviverta! [${dadosCarta.nome}] voltou dos mortos com os atributos originais (❤️${dadosCarta.vida} ⚔️${dadosCarta.dano}) e foi para a mão ${ehAliado ? "aliada" : "do oponente"}.`);
}

// 🃏 CRACKER — mostra a Mão e o Campo do ADVERSÁRIO como miniaturas clicáveis. Rouba a carta
// escolhida direto pra sua própria mão: se veio do campo, reseta pros atributos originais de
// fábrica (ela "recomeça do zero" pra você); se veio da mão, mantém como estava.
function usarCracker(idItem, ehAliado) {
    let ladoOponente = ehAliado ? "j2" : "j1";
    let temAlvoMao = document.querySelectorAll(`#mao-${ladoOponente} div[id^='pacote-']`).length > 0;
    let temAlvoCampo = document.querySelectorAll(`#campo-${ladoOponente} div[id^='pacote-']`).length > 0;

    if (!temAlvoMao && !temAlvoCampo) {
        return narrar("🃏 O adversário não tem nenhuma carta na mão nem em campo pra roubar!");
    }

    crackerPendente = { idItem, ehAliado };
    mostrarRouboCracker(idItem, ehAliado);
}

function mostrarRouboCracker(idItem, ehAliado) {
    let antigo = document.getElementById("overlay-cracker");
    if (antigo) antigo.remove();

    let ladoOponente = ehAliado ? "j2" : "j1";

    let overlay = document.createElement("div");
    overlay.id = "overlay-cracker";
    overlay.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); z-index:9999; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:20px; padding:20px; box-sizing:border-box; overflow:auto; font-family:'Georgia', serif;";

    let titulo = document.createElement("h2");
    titulo.innerText = "🃏 Cracker — escolha uma carta do adversário pra roubar";
    titulo.style.cssText = "color: var(--borda-ouro, #d4af37); text-align:center; margin:0;";
    overlay.appendChild(titulo);

    function extrairDadosCarta(pacote) {
        let idPuro = pacote.id.replace("pacote-", "");
        let nomeEl = pacote.querySelector(".nome-carta");
        let imgEl = pacote.querySelector("img");
        let vidaEl = document.getElementById("vida-" + idPuro);
        let danoEl = document.getElementById("dano-" + idPuro);
        return {
            nome: nomeEl ? nomeEl.innerText.trim() : "",
            img: imgEl ? imgEl.getAttribute("src") : "",
            vida: vidaEl ? vidaEl.innerText : "0",
            dano: danoEl ? danoEl.innerText : "0",
        };
    }

    function criarColuna(rotulo, seletor, origem) {
        let col = document.createElement("div");
        col.style.cssText = "display:flex; flex-direction:column; align-items:center; gap:10px; width:100%; max-width:700px;";

        let h = document.createElement("h3");
        h.innerText = rotulo;
        h.style.cssText = "color: var(--borda-ouro, #d4af37); margin: 5px 0;";
        col.appendChild(h);

        let linha = document.createElement("div");
        linha.style.cssText = "display:flex; flex-wrap:wrap; gap:10px; justify-content:center; width:100%;";

        let pacotes = Array.from(document.querySelectorAll(seletor));
        if (pacotes.length === 0) {
            let vazio = document.createElement("p");
            vazio.innerText = "Nenhuma carta aqui.";
            vazio.style.cssText = "color:#ccc; font-style:italic;";
            linha.appendChild(vazio);
        } else {
            pacotes.forEach(pacote => {
                let dados = extrairDadosCarta(pacote);
                let mini = document.createElement("div");
                mini.style.cssText = "width:100px; background: var(--bg-carta, #f4eedb); border:3px solid var(--borda-carta, #8c6d4f); border-radius:8px; padding:6px; text-align:center; cursor:pointer;";
                mini.innerHTML = `
                    <div style="font-size:0.75rem; font-weight:bold; color:#2c2520; margin-bottom:3px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${dados.nome}</div>
                    <img src="${dados.img}" style="width:100%; height:60px; object-fit:contain; border-radius:4px;">
                    <div style="font-size:0.75rem; color:#2c2520; margin-top:3px;">❤️${dados.vida} ⚔️${dados.dano}</div>
                `;
                mini.onclick = function () {
                    roubarCartaCracker(pacote.id, origem, idItem, ehAliado);
                };
                linha.appendChild(mini);
            });
        }

        col.appendChild(linha);
        return col;
    }

    overlay.appendChild(criarColuna("✋ Mão do Adversário", `#mao-${ladoOponente} div[id^='pacote-']`, "mao"));
    overlay.appendChild(criarColuna("⚔️ Campo do Adversário", `#campo-${ladoOponente} div[id^='pacote-']`, "campo"));

    let btnCancelar = document.createElement("button");
    btnCancelar.innerText = "Cancelar";
    btnCancelar.onclick = function () { crackerPendente = null; overlay.remove(); };
    overlay.appendChild(btnCancelar);

    document.body.appendChild(overlay);
}

function roubarCartaCracker(idPacoteDomOriginal, origem, idItem, ehAliado) {
    let pacoteOriginal = document.getElementById(idPacoteDomOriginal);
    if (!pacoteOriginal) return;

    let idPuro = idPacoteDomOriginal.replace("pacote-", "");
    let nomeCarta = pacoteOriginal.querySelector(".nome-carta").innerText.trim();
    let vidaAtual = document.getElementById("vida-" + idPuro) ? document.getElementById("vida-" + idPuro).innerText : "0";
    let danoAtual = document.getElementById("dano-" + idPuro) ? document.getElementById("dano-" + idPuro).innerText : "0";
    let imgAtual = pacoteOriginal.querySelector("img") ? pacoteOriginal.querySelector("img").getAttribute("src") : "";

    let base = bancoDeCartas.find(c => c.nome === nomeCarta);

    let dadosNovaCarta;
    if (origem === "campo" && base) {
        // 🃏 Roubada do CAMPO — reseta pros atributos originais de fábrica.
        dadosNovaCarta = { id: base.id, nome: base.nome, img: base.img, vida: base.vida, dano: base.dano };
    } else {
        // ✋ Roubada da MÃO — mantém como estava.
        dadosNovaCarta = { id: base ? base.id : idPuro, nome: nomeCarta, img: imgAtual, vida: vidaAtual, dano: danoAtual };
    }

    pacoteOriginal.remove();

    let idMaoHTML = ehAliado ? "mao-j1" : "mao-j2";
    let funcaoJogar = ehAliado ? "jogarCarta" : "jogarCartaInimigo";
    let classeCss = ehAliado ? "carta-aliada" : "carta-inimiga-espera";

    // 🩹 CORREÇÃO: mesma marcação de lado no ID (ver comentário na Reviverta).
    let idUnico = dadosNovaCarta.id + (ehAliado ? "-roubada-" : "-inimigo-roubada-") + Math.floor(Math.random() * 100000);
    let novaCarta = { ...dadosNovaCarta, idUnico: idUnico };

    let htmlDaCarta = criarHTMLCarta(novaCarta, funcaoJogar, classeCss, ehAliado);
    let divMao = document.getElementById(idMaoHTML);
    if (divMao) divMao.insertAdjacentHTML('beforeend', htmlDaCarta);

    let pacoteItem = document.getElementById("pacote-" + idItem);
    if (pacoteItem) pacoteItem.remove();

    let overlay = document.getElementById("overlay-cracker");
    if (overlay) overlay.remove();
    crackerPendente = null;

    narrar(`🃏 Cracker! [${nomeCarta}] foi roubado(a) do ${origem === "campo" ? "campo" : "mão"} do adversário${origem === "campo" ? ", voltando com os atributos originais," : ""} e foi pra mão ${ehAliado ? "aliada" : "do oponente"}!`);

    // 🤖 Se o jogador roubou a única carta que o bot tinha em campo, ele ficaria sem
    // alvo para atacar durante o próprio turno. O bot pode reagir colocando UMA tropa da mão,
    // sem ganhar um turno completo nem atacar fora de hora. No modo PvP local esta função
    // não existe, portanto o segundo jogador continua totalmente manual.
    if (ehAliado && origem === "campo") {
        let campoDoBot = document.getElementById("campo-j2");
        let campoFicouVazio = campoDoBot && campoDoBot.querySelectorAll("div[id^='pacote-']").length === 0;
        if (campoFicouVazio && typeof window.botReporCampoAposCracker === "function") {
            setTimeout(() => window.botReporCampoAposCracker(), 500);
        }
    }
}

// 💥 ALLSFORMS — dá +3 de dano pra TODAS as tropas do próprio time já em campo (suportes/poções
// que estejam ali, tipo Cavalo de Tróia/Fogueira, não contam), durando 1 rodada (2 passagens de
// turno). Não precisa escolher alvo, então é resolvido na hora — sem tela nem clique nenhum.
function usarAllsforms(idItem, ehAliado) {
    let ladoProprio = ehAliado ? "j1" : "j2";
    let campoProprio = document.getElementById("campo-" + ladoProprio);
    let classeCss = ehAliado ? "carta-aliada" : "carta-inimiga";

    let tropas = campoProprio ? Array.from(campoProprio.getElementsByClassName(classeCss)).filter(pacote => {
        let idPuro = pacote.id.replace("pacote-", "");
        let infoCarta = bancoDeCartas
            .filter(c => idPuro === c.id || idPuro.startsWith(c.id + "_") || idPuro.startsWith(c.id + "-"))
            .sort((a, b) => b.id.length - a.id.length)[0];
        let ehSuporte = infoCarta && suportesReais.includes(infoCarta.id);
        return !ehSuporte;
    }) : [];

    if (tropas.length === 0) {
        return narrar("💥 Allsforms não encontrou nenhuma tropa em campo pra buffar!");
    }

    tropas.forEach(pacote => {
        let idPuro = pacote.id.replace("pacote-", "");
        let txtDano = document.getElementById("dano-" + idPuro);
        if (!txtDano) return;
        let danoAtual = parseFloat(txtDano.innerText) || 0;
        txtDano.innerText = danoAtual + 3;

        if (!buffsAllsforms[idPuro]) buffsAllsforms[idPuro] = [];
        buffsAllsforms[idPuro].push({ bonus: 3, restam: 2 }); // 1 rodada = 2 passagens de turno
    });

    let pacoteItem = document.getElementById("pacote-" + idItem);
    if (pacoteItem) pacoteItem.remove();

    narrar(`💥 Allsforms! Todas as tropas ${ehAliado ? "aliadas" : "do oponente"} em campo ganharam +3 de dano por 1 rodada!`);
}

// 🪞 DUPLIQUETION — cria uma CÓPIA de uma carta ESCOLHIDA PELO PRÓPRIO DONO (mão ou campo,
// nunca do adversário), com metade da vida e do dano atuais (mantém fração, ex: 3 vira 1.5).
// A carta original continua no lugar, intacta — só nasce uma cópia nova na sua mão.
// 🧪 Diz se um pacote em tela (mão ou campo) é um suporte/poção (Besta, Escudo, Vampi7 etc.)
// em vez de uma tropa de verdade — usado pra filtrar quem pode ser alvo de coisas como
// Allsforms e Dupliquetion.
function ehPacoteSuporte(pacote) {
    let idPuro = pacote.id.replace("pacote-", "");
    let infoCarta = bancoDeCartas
        .filter(c => idPuro === c.id || idPuro.startsWith(c.id + "_") || idPuro.startsWith(c.id + "-"))
        .sort((a, b) => b.id.length - a.id.length)[0];
    return !!(infoCarta && suportesReais.includes(infoCarta.id));
}

function usarDupliquetion(idItem, ehAliado) {
    let ladoProprio = ehAliado ? "j1" : "j2";
    let temAlvoMao = Array.from(document.querySelectorAll(`#mao-${ladoProprio} div[id^='pacote-']`))
        .filter(p => p.id !== "pacote-" + idItem && !ehPacoteSuporte(p)).length > 0;
    let temAlvoCampo = Array.from(document.querySelectorAll(`#campo-${ladoProprio} div[id^='pacote-']`))
        .filter(p => !ehPacoteSuporte(p)).length > 0;

    if (!temAlvoMao && !temAlvoCampo) {
        return narrar("🪞 Você ainda não tem nenhuma TROPA pra copiar (suportes/poções não podem ser copiados)!");
    }

    dupliquetionPendente = { idItem, ehAliado };
    mostrarDupliquetion(idItem, ehAliado);
}

function mostrarDupliquetion(idItem, ehAliado) {
    let antigo = document.getElementById("overlay-dupliquetion");
    if (antigo) antigo.remove();

    let ladoProprio = ehAliado ? "j1" : "j2";

    let overlay = document.createElement("div");
    overlay.id = "overlay-dupliquetion";
    overlay.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); z-index:9999; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:20px; padding:20px; box-sizing:border-box; overflow:auto; font-family:'Georgia', serif;";

    let titulo = document.createElement("h2");
    titulo.innerText = "🪞 Dupliquetion — escolha uma carta SUA pra copiar";
    titulo.style.cssText = "color: var(--borda-ouro, #d4af37); text-align:center; margin:0;";
    overlay.appendChild(titulo);

    function extrairDadosCarta(pacote) {
        let idPuro = pacote.id.replace("pacote-", "");
        let nomeEl = pacote.querySelector(".nome-carta");
        let imgEl = pacote.querySelector("img");
        let vidaEl = document.getElementById("vida-" + idPuro);
        let danoEl = document.getElementById("dano-" + idPuro);
        return {
            nome: nomeEl ? nomeEl.innerText.trim() : "",
            img: imgEl ? imgEl.getAttribute("src") : "",
            vida: vidaEl ? vidaEl.innerText : "0",
            dano: danoEl ? danoEl.innerText : "0",
        };
    }

    function criarColuna(rotulo, pacotes) {
        let col = document.createElement("div");
        col.style.cssText = "display:flex; flex-direction:column; align-items:center; gap:10px; width:100%; max-width:700px;";

        let h = document.createElement("h3");
        h.innerText = rotulo;
        h.style.cssText = "color: var(--borda-ouro, #d4af37); margin: 5px 0;";
        col.appendChild(h);

        let linha = document.createElement("div");
        linha.style.cssText = "display:flex; flex-wrap:wrap; gap:10px; justify-content:center; width:100%;";

        if (pacotes.length === 0) {
            let vazio = document.createElement("p");
            vazio.innerText = "Nenhuma carta aqui.";
            vazio.style.cssText = "color:#ccc; font-style:italic;";
            linha.appendChild(vazio);
        } else {
            pacotes.forEach(pacote => {
                let dados = extrairDadosCarta(pacote);
                let mini = document.createElement("div");
                mini.style.cssText = "width:100px; background: var(--bg-carta, #f4eedb); border:3px solid var(--borda-carta, #8c6d4f); border-radius:8px; padding:6px; text-align:center; cursor:pointer;";
                mini.innerHTML = `
                    <div style="font-size:0.75rem; font-weight:bold; color:#2c2520; margin-bottom:3px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${dados.nome}</div>
                    <img src="${dados.img}" style="width:100%; height:60px; object-fit:contain; border-radius:4px;">
                    <div style="font-size:0.75rem; color:#2c2520; margin-top:3px;">❤️${dados.vida} ⚔️${dados.dano}</div>
                `;
                mini.onclick = function () {
                    copiarCartaDupliquetion(pacote.id, idItem, ehAliado);
                };
                linha.appendChild(mini);
            });
        }

        col.appendChild(linha);
        return col;
    }

    let pacotesMao = Array.from(document.querySelectorAll(`#mao-${ladoProprio} div[id^='pacote-']`))
        .filter(p => p.id !== "pacote-" + idItem && !ehPacoteSuporte(p));
    let pacotesCampo = Array.from(document.querySelectorAll(`#campo-${ladoProprio} div[id^='pacote-']`))
        .filter(p => !ehPacoteSuporte(p));

    overlay.appendChild(criarColuna("✋ Sua Mão", pacotesMao));
    overlay.appendChild(criarColuna("⚔️ Seu Campo", pacotesCampo));

    let btnCancelar = document.createElement("button");
    btnCancelar.innerText = "Cancelar";
    btnCancelar.onclick = function () { dupliquetionPendente = null; overlay.remove(); };
    overlay.appendChild(btnCancelar);

    document.body.appendChild(overlay);
}

function copiarCartaDupliquetion(idPacoteOriginal, idItem, ehAliado) {
    let pacoteOriginal = document.getElementById(idPacoteOriginal);
    if (!pacoteOriginal) return;

    let idPuro = idPacoteOriginal.replace("pacote-", "");
    let nomeCarta = pacoteOriginal.querySelector(".nome-carta").innerText.trim();
    let vidaAtual = parseFloat(document.getElementById("vida-" + idPuro) ? document.getElementById("vida-" + idPuro).innerText : 0) || 0;
    let danoAtual = parseFloat(document.getElementById("dano-" + idPuro) ? document.getElementById("dano-" + idPuro).innerText : 0) || 0;
    let imgAtual = pacoteOriginal.querySelector("img") ? pacoteOriginal.querySelector("img").getAttribute("src") : "";

    let base = bancoDeCartas.find(c => c.nome === nomeCarta);
    let idBase = base ? base.id : idPuro;

    let vidaCopia = vidaAtual / 2;
    let danoCopia = danoAtual / 2;

    let idMaoHTML = ehAliado ? "mao-j1" : "mao-j2";
    let funcaoJogar = ehAliado ? "jogarCarta" : "jogarCartaInimigo";
    let classeCss = ehAliado ? "carta-aliada" : "carta-inimiga-espera";

    // 🩹 CORREÇÃO: mesma marcação de lado no ID (ver comentário na Reviverta).
    let idUnico = idBase + (ehAliado ? "-copia-" : "-inimigo-copia-") + Math.floor(Math.random() * 100000);
    let novaCarta = { id: idBase, nome: nomeCarta, img: imgAtual, vida: vidaCopia, dano: danoCopia, idUnico: idUnico };

    let htmlDaCarta = criarHTMLCarta(novaCarta, funcaoJogar, classeCss, ehAliado);
    let divMao = document.getElementById(idMaoHTML);
    if (divMao) divMao.insertAdjacentHTML('beforeend', htmlDaCarta);

    let pacoteItem = document.getElementById("pacote-" + idItem);
    if (pacoteItem) pacoteItem.remove();

    let overlay = document.getElementById("overlay-dupliquetion");
    if (overlay) overlay.remove();
    dupliquetionPendente = null;

    narrar(`🪞 Dupliquetion! Uma cópia de [${nomeCarta}] nasceu com metade da vida e do dano (❤️${vidaCopia} ⚔️${danoCopia}) na mão ${ehAliado ? "aliada" : "do oponente"}!`);
}
function executarTraicao(idAlvoPacote) {
    let pacoteTraidor = document.getElementById("pacote-" + idTraidor);
    let pacoteVitima = document.getElementById(idAlvoPacote);
    
    if (!pacoteTraidor || !pacoteVitima) {
        modoTraicao = false;
        idTraidor = null;
        return;
    }
    
    let idVitima = idAlvoPacote.replace("pacote-", "");
    if (idTraidor === idVitima) return narrar("❌ O traidor não pode esfaquear a si mesmo! Escolha outra carta do lado dele.");

    // Descobre em qual lado da arena cada um está (j1 ou j2)
    let ladoTraidor = pacoteTraidor.closest("#campo-j1") ? "j1" : "j2";
    let ladoVitima = pacoteVitima.closest("#campo-j1") ? "j1" : "j2";
    
    // A vítima TEM que ser parceira do traidor
    if (ladoTraidor !== ladoVitima) {
        return narrar("❌ O alvo precisa ser um ALIADO do traidor (estar do mesmo lado da arena)!");
    }

    let nomeTraidor = pacoteTraidor.querySelector(".nome-carta").innerText.trim();
    let nomeVitima = pacoteVitima.querySelector(".nome-carta").innerText.trim();
    
    let danoElemento = document.getElementById("dano-" + idTraidor);
    let danoDoTraidor = danoElemento ? parseFloat(danoElemento.innerText) : 0;
    
    narrar(`🗡️ TRAIÇÃO! [${nomeTraidor}] esfaqueou seu próprio parceiro [${nomeVitima}] causando ${danoDoTraidor} de dano! Turno encerrado!`);
    
    // Aplica o dano
    let isInimigo = (ladoVitima === "j2");
    aplicarDanoDireto(idAlvoPacote, danoDoTraidor, isInimigo);

    // Finaliza e desliga o modo traição
    modoTraicao = false;
    idTraidor = null;

    // 🔥 AQUI ESTÁ A MÁGICA: Passa o turno automaticamente após a traição!
    passarTurno();
}
// 🪵 Faz uma cópia visual do Barril rolar até o alvo. O impacto e a transformação reais
// só são liberados quando ele chega, para a animação e a regra do jogo acontecerem juntas.
function animarBarrilBarbaroRolando(idBarril, idPacoteAlvo, aoImpactar) {
    let pacoteBarril = document.getElementById("pacote-" + idBarril);
    let pacoteAlvo = document.getElementById(idPacoteAlvo);
    if (!pacoteBarril || !pacoteAlvo) {
        if (typeof aoImpactar === "function") aoImpactar();
        return;
    }

    let origem = obterCentroVisual(pacoteBarril);
    let destino = obterCentroVisual(pacoteAlvo);
    if (!origem || !destino) {
        if (typeof aoImpactar === "function") aoImpactar();
        return;
    }

    pacoteBarril.classList.add("barril-barbaro-partindo");

    let barrilVisual = document.createElement("span");
    barrilVisual.className = "barril-barbaro-rolando";
    barrilVisual.setAttribute("aria-hidden", "true");
    barrilVisual.style.left = origem.x + "px";
    barrilVisual.style.top = origem.y + "px";
    barrilVisual.style.setProperty("--barril-barbaro-x", (destino.x - origem.x) + "px");
    barrilVisual.style.setProperty("--barril-barbaro-y", (destino.y - origem.y) + "px");
    barrilVisual.style.setProperty("--barril-barbaro-meio-x", ((destino.x - origem.x) / 2) + "px");
    barrilVisual.style.setProperty("--barril-barbaro-meio-y", ((destino.y - origem.y) / 2 - 32) + "px");

    let imagemOriginal = pacoteBarril.querySelector("img");
    if (imagemOriginal) {
        let imagem = document.createElement("img");
        imagem.src = imagemOriginal.src;
        imagem.alt = "";
        barrilVisual.appendChild(imagem);
    } else {
        barrilVisual.textContent = "🛢️";
    }
    document.body.appendChild(barrilVisual);

    setTimeout(() => {
        let impacto = document.createElement("span");
        impacto.className = "impacto-barril-barbaro";
        impacto.setAttribute("aria-hidden", "true");
        impacto.style.left = destino.x + "px";
        impacto.style.top = destino.y + "px";

        for (let i = 0; i < 7; i++) {
            let fumaca = document.createElement("b");
            fumaca.className = "fumaca-barril-barbaro";
            fumaca.style.setProperty("--fumaca-barbaro-x", (((i % 4) - 1.5) * 25) + "px");
            fumaca.style.setProperty("--fumaca-barbaro-y", (-22 - (i % 3) * 17) + "px");
            fumaca.style.setProperty("--fumaca-barbaro-atraso", (i * 0.035) + "s");
            impacto.appendChild(fumaca);
        }

        for (let i = 0; i < 6; i++) {
            let lasca = document.createElement("i");
            lasca.className = "lasca-barril-barbaro";
            lasca.style.setProperty("--lasca-barbaro-x", (((i % 3) - 1) * 34) + "px");
            lasca.style.setProperty("--lasca-barbaro-y", (i < 3 ? -31 - i * 5 : 22 + (i - 3) * 7) + "px");
            lasca.style.setProperty("--lasca-barbaro-giro", ((i * 63) - 120) + "deg");
            impacto.appendChild(lasca);
        }

        let barbaroVisual = document.createElement("span");
        barbaroVisual.className = "barbaro-saindo-do-impacto";
        let barbaroBase = bancoDeCartas.find(carta => carta.nome === "Bárbaro");
        let imagemBarbaro = document.createElement("img");
        imagemBarbaro.src = barbaroBase ? barbaroBase.img : "barbaro.png";
        imagemBarbaro.alt = "";
        barbaroVisual.appendChild(imagemBarbaro);
        impacto.appendChild(barbaroVisual);

        document.body.appendChild(impacto);
        setTimeout(() => { if (impacto.parentNode) impacto.remove(); }, 1250);

        let alvoAtual = document.getElementById(idPacoteAlvo);
        if (alvoAtual) {
            alvoAtual.classList.remove("impactado-pelo-barril-barbaro");
            void alvoAtual.offsetWidth;
            alvoAtual.classList.add("impactado-pelo-barril-barbaro");
            setTimeout(() => {
                if (alvoAtual.isConnected) alvoAtual.classList.remove("impactado-pelo-barril-barbaro");
            }, 720);
        }

        if (typeof aoImpactar === "function") aoImpactar();
    }, 700);

    setTimeout(() => { if (barrilVisual.parentNode) barrilVisual.remove(); }, 850);
}

// Reconstrói a carta como um Bárbaro de verdade. Assim ela recebe a imagem, os botões
// e os cliques normais da nova forma, sem recuperar a vida perdida pelo Barril.
function transformarBarrilBarbaroEmBarbaro(idUnico, ehAliado) {
    let pacoteAntigo = document.getElementById("pacote-" + idUnico);
    let barbaroBase = bancoDeCartas.find(c => c.nome === "Bárbaro");
    if (!pacoteAntigo || !barbaroBase || !pacoteAntigo.parentElement) return null;

    let vidaEl = document.getElementById("vida-" + idUnico);
    let vidaAntesDaTransformacao = vidaEl ? parseFloat(vidaEl.innerText) : 2;
    if (!Number.isFinite(vidaAntesDaTransformacao)) vidaAntesDaTransformacao = 2;

    // O Bárbaro tem no máximo 2 de vida ao nascer, mas nunca cura o dano que o Barril já tomou.
    let vidaDoBarbaro = Math.max(0, Math.min(2, vidaAntesDaTransformacao));
    let cartaBarbaro = {
        ...barbaroBase,
        idUnico: idUnico,
        vida: vidaDoBarbaro,
        dano: 2
    };

    let html = criarHTMLCarta(
        cartaBarbaro,
        ehAliado ? "jogarCarta" : "jogarCartaInimigo",
        ehAliado ? "carta-aliada" : "carta-inimiga",
        ehAliado
    );
    let temp = document.createElement("div");
    temp.innerHTML = html.trim();
    let pacoteNovo = temp.firstElementChild;
    let estavaCongelado = pacoteAntigo.classList.contains("congelada");

    pacoteAntigo.parentElement.insertBefore(pacoteNovo, pacoteAntigo);
    pacoteAntigo.remove();

    if (estavaCongelado) pacoteNovo.classList.add("congelada");

    // Se Ctrl C/V copiou o Barril, a cópia também termina ao sair o Bárbaro.
    if (typeof ctrlV !== "undefined" && ctrlV[idUnico]) delete ctrlV[idUnico];

    // Prepara os controles da arena sem contar a transformação como uma nova invocação.
    if (ehAliado) jogarCarta("pacote-" + idUnico, true);
    else jogarCartaInimigo("pacote-" + idUnico, true);

    pacoteNovo.classList.add("barbaro-revelado-do-barril");
    setTimeout(() => {
        if (pacoteNovo.isConnected) pacoteNovo.classList.remove("barbaro-revelado-do-barril");
    }, 1050);

    return pacoteNovo;
}

function aplicarAlvoBarrilBarbaro(idPacoteAlvo) {
    if (barrilBarbaroEmAnimacao) return;

    let pacoteAlvo = document.getElementById(idPacoteAlvo);
    let pacoteBarril = document.getElementById("pacote-" + idBarrilAtivo);
    if (!pacoteAlvo || !pacoteBarril) {
        modoAlvoBarrilBarbaro = false;
        modoAlvoBarrilBarbaroInimigo = false;
        idBarrilAtivo = null;
        return;
    }

    let barrilEhAliado = !!pacoteBarril.closest("#campo-j1");
    let alvoEhAliado = !!pacoteAlvo.closest("#campo-j1");
    if (barrilEhAliado === alvoEhAliado) {
        return narrar("❌ O Barril de Bárbaro precisa atingir uma carta do campo oposto!");
    }

    let idBarrilQueAtacou = idBarrilAtivo;
    let splashAtivo = !!splashBarbaroAtivo[idBarrilQueAtacou];
    modoAlvoBarrilBarbaro = false;
    modoAlvoBarrilBarbaroInimigo = false;
    barrilBarbaroEmAnimacao = true;

    animarBarrilBarbaroRolando(idBarrilQueAtacou, idPacoteAlvo, () => {
        concluirImpactoBarrilBarbaro(idPacoteAlvo, idBarrilQueAtacou, barrilEhAliado, splashAtivo);
    });
}

function concluirImpactoBarrilBarbaro(idPacoteAlvo, idBarrilQueAtacou, ehBarrilAliado, splashAtivo) {
    let pacoteAlvo = document.getElementById(idPacoteAlvo);
    let pacoteBarrilAtivo = document.getElementById("pacote-" + idBarrilQueAtacou);
    if (!pacoteAlvo || !pacoteBarrilAtivo) {
        barrilBarbaroEmAnimacao = false;
        delete splashBarbaroAtivo[idBarrilQueAtacou];
        idBarrilAtivo = null;
        narrar("🪵 O impacto do Barril de Bárbaro foi interrompido.");
        return;
    }

    let idSemPacoteAlvo = idPacoteAlvo.replace("pacote-", "");
    let txtVidaAlvo = document.getElementById("vida-" + idSemPacoteAlvo);
    if (!txtVidaAlvo) {
        barrilBarbaroEmAnimacao = false;
        return;
    }

    let textoNarracao = ehBarrilAliado ? "🪵 Seu Barril atingiu o alvo!" : "🪵 O Barril Inimigo atingiu sua carta!";

    // 1. Dano de Impacto Fixo (3 de Dano)
    // 🩹 CORREÇÃO: nunca deixa a vida mostrar número negativo — trava em 0.
    let vidaAtual = Math.max(0, parseFloat(txtVidaAlvo.innerText) - 3);
    txtVidaAlvo.innerText = vidaAtual;

    if (vidaAtual <= 0) {
        textoNarracao += " O alvo principal foi esmagado!";
        let nomeAlvoExibido = pacoteAlvo.querySelector(".nome-carta").innerText.trim();
        let nomeAlvoBarrilBarbaro = obterNomeEfetivoCarta(idSemPacoteAlvo, nomeAlvoExibido);
        let ladoAlvoBarrilBarbaro = pacoteAlvo.closest("#campo-j1") ? "j1" : "j2";
        registrarMorte(nomeAlvoBarrilBarbaro, ladoAlvoBarrilBarbaro);
        guardarOrigemTransformacaoOrk(nomeAlvoBarrilBarbaro, idSemPacoteAlvo, pacoteAlvo);
        pacoteAlvo.remove();
        ativarPassivasAoMorrer(
            nomeAlvoBarrilBarbaro,
            idSemPacoteAlvo,
            "campo-" + ladoAlvoBarrilBarbaro
        );
    } else {
        textoNarracao += " Causando 3 de dano direto.";
    }

    // 2. Dano Splash (Se o Especial rodou 5 antes, só pra ESTE Barril específico)
    if (splashAtivo) {
        textoNarracao += " 💥 Splash! As cartas ao lado sofreram 1 de dano!";
        let vizinhos = [];
        if (pacoteAlvo.previousElementSibling) vizinhos.push(pacoteAlvo.previousElementSibling);
        if (pacoteAlvo.nextElementSibling) vizinhos.push(pacoteAlvo.nextElementSibling);

        vizinhos.forEach(vizinho => {
            if (vizinho.id && vizinho.id.includes("pacote-")) {
                let txtVidaVizinho = document.getElementById("vida-" + vizinho.id.replace("pacote-", ""));
                if (txtVidaVizinho) {
                    // 🩹 CORREÇÃO: nunca deixa a vida mostrar número negativo — trava em 0.
                    let vidaViz = Math.max(0, parseFloat(txtVidaVizinho.innerText) - 1);
                    txtVidaVizinho.innerText = vidaViz;
                    if (vidaViz <= 0) {
                        let idVizinhoBarril = vizinho.id.replace("pacote-", "");
                        let nomeVizinhoExibido = vizinho.querySelector(".nome-carta") ? vizinho.querySelector(".nome-carta").innerText.trim() : "";
                        let nomeVizinhoBarril = obterNomeEfetivoCarta(idVizinhoBarril, nomeVizinhoExibido);
                        let ladoVizinhoBarril = vizinho.closest("#campo-j1") ? "j1" : "j2";
                        registrarMorte(nomeVizinhoBarril, ladoVizinhoBarril);
                        guardarOrigemTransformacaoOrk(nomeVizinhoBarril, idVizinhoBarril, vizinho);
                        vizinho.remove();
                        ativarPassivasAoMorrer(
                            nomeVizinhoBarril,
                            idVizinhoBarril,
                            "campo-" + ladoVizinhoBarril
                        );
                    }
                }
            }
        });
    }

    textoNarracao += " E um Bárbaro saiu de dentro do Barril!";
    narrar(textoNarracao);

    // 🦇 VAMPI7 — o impacto do Barril de Bárbaro também conta como um ataque de verdade.
    dispararVampi7JuntoDoAtaque(idBarrilQueAtacou, idPacoteAlvo);
    // 🛸 PORTABLE — ataca junto enquanto a bateria durar.
    dispararPortableJuntoDoAtaque(idBarrilQueAtacou, idPacoteAlvo);

    // 3. Transformação real: preserva a vida restante e recria a carta como Bárbaro 2/2.
    transformarBarrilBarbaroEmBarbaro(idBarrilQueAtacou, ehBarrilAliado);

    // 4. Limpa as variáveis e passa a vez
    modoAlvoBarrilBarbaro = false;
    modoAlvoBarrilBarbaroInimigo = false;
    delete splashBarbaroAtivo[idBarrilQueAtacou];
    idBarrilAtivo = null;
    barrilBarbaroEmAnimacao = false;

    passarTurno();
    if (typeof atualizarTodosUnidoes === "function") atualizarTodosUnidoes();
}
// Função auxiliar para gerar poção aleatória

function gerarPocaoAleatoria(idMao) {
    // Busca Inteligente das Poções
    let todasPocoes = bancoDeCartas.filter(c => {
        let n = c.nome.toLowerCase();
        return n.includes("Poção de Gelo") || n.includes("velux") || n.includes("veluz") || n.includes("adiv") || n.includes("recuperida") || n.includes("pocaotraicao");
    });

    if (todasPocoes.length > 0) {
        let dadosPocao = todasPocoes[Math.floor(Math.random() * todasPocoes.length)];
        let novoIdPocao = "pocao-" + Math.floor(Math.random() * 100000); 
        let cartaPocaoNova = { ...dadosPocao, idUnico: novoIdPocao };
        
        let maoDestino = document.getElementById(idMao);
        if (maoDestino) {
            let ehAliado = idMao.includes("j1");
            let funcaoClick = ehAliado ? 'jogarCarta' : 'jogarCartaInimigo'; 
            
            // 🚀 CORREÇÃO: Aplica a classe normal do seu jogo para manter os 140px!
            let classeNormal = ehAliado ? 'carta-aliada' : 'carta-inimiga-espera';
            
            maoDestino.insertAdjacentHTML('beforeend', criarHTMLCarta(cartaPocaoNova, funcaoClick, classeNormal, ehAliado));
        }
    } else {
        narrar("Erro crítico: Nenhuma poção foi encontrada no banco de dados!");
    }
}
// ====== MOTOR DO BUMERANGUE ======
// 🪃 BUMERSKELETON — chamada quando o Especial foi clicado ANTES de atacar: o clique no
// inimigo aqui faz o papel do ataque normal (dano base + ricochete nos outros) e, assim
// que a cadeia termina, já rola a habilidade especial nela.
function aplicarEspecialBumerskeletonAntesDeAtacar(idPacoteAlvo) {
    let idBume = idBumerskeletonEspecialAtivo;
    modoEspecialBumerskeleton = false;
    idBumerskeletonEspecialAtivo = null;

    let pacoteBume = document.getElementById("pacote-" + idBume);
    let pacoteAlvo = document.getElementById(idPacoteAlvo);
    if (!pacoteBume || !pacoteAlvo) return;

    let ladoBume = pacoteBume.closest("#campo-j1") ? "j1" : "j2";
    let ladoAlvo = pacoteAlvo.closest("#campo-j1") ? "j1" : "j2";
    if (ladoBume === ladoAlvo) return narrar("❌ Escolha uma carta do campo OPOSTO para o bumerangue acertar!");

    let idAlvoPuro = idPacoteAlvo.replace("pacote-", "");
    let txtDanoBume = document.getElementById("dano-" + idBume);
    let danoBase = txtDanoBume ? parseFloat(txtDanoBume.innerText) : 0;
    let txtVidaAlvo = document.getElementById("vida-" + idAlvoPuro);
    if (!txtVidaAlvo) return;

    let nomeAlvo = pacoteAlvo.querySelector(".nome-carta").innerText;
    let isInimigoParaOJogo = (ladoAlvo === "j2");
    let campoAlvoId = (ladoAlvo === "j1") ? "campo-j1" : "campo-j2";

    aplicarDanoAtaqueArea(idPacoteAlvo, danoBase, isInimigoParaOJogo);
    narrar(`🪃 O bumerangue acertou [${nomeAlvo}] causando ${danoBase} de dano!`);

    // 🦇 VAMPI7 — o golpe inicial do bumerangue também conta como um ataque de verdade.
    dispararVampi7JuntoDoAtaque(idBume, idPacoteAlvo);
    // 🛸 PORTABLE — ataca junto enquanto a bateria durar.
    dispararPortableJuntoDoAtaque(idBume, idPacoteAlvo);

    // Se o alvo já morreu com o golpe inicial, a cadeia continua nos outros normalmente.
    executarChainBumerangue(idBume, idAlvoPuro, campoAlvoId, () => {
        usarHabilidade("Bumerskeleton", idBume, null);
    });
}

function executarChainBumerangue(idBumerskeleton, idPrimeiroAlvo, campoAlvoId, aoConcluir) {
    try {
        if (typeof alvosDoBumerangue === 'undefined') {
            return narrar("⚠️ Erro: As variáveis do bumerangue estão faltando no topo do main.js!");
        }
        alvosDoBumerangue[idBumerskeleton] = [idPrimeiroAlvo];
        let pontoVisualAnterior = iniciarTrajetoVisualBumerangue(idBumerskeleton, idPrimeiroAlvo);

        let campo = document.getElementById(campoAlvoId);
        if (!campo) { if (typeof aoConcluir === "function") aoConcluir(); return; }

        let classeCartas = (campoAlvoId === "campo-j2") ? "carta-inimiga" : "carta-aliada";
        let outrasCartas = Array.from(campo.getElementsByClassName(classeCartas));

        let delay = 600; 
        let indexDano = 1; 

        outrasCartas.forEach(pacote => {
            let idOutroAlvo = pacote.id.replace("pacote-", "");

            if (idOutroAlvo === idPrimeiroAlvo) return;

            // Salva o dano para o ricochete
            let danoDestaBatida = 3; 
            if (typeof tabelaDanoBumerangue !== 'undefined') {
                danoDestaBatida = tabelaDanoBumerangue[indexDano] || 4;
            }

            let origemDesteRicochete = pontoVisualAnterior;
            pontoVisualAnterior = registrarRicocheteVisualBumerangue(
                idBumerskeleton,
                origemDesteRicochete,
                pacote,
                Math.max(0, (delay - 180) / 1000)
            );

            setTimeout(() => {
                let txtVida = document.getElementById("vida-" + idOutroAlvo);
                let nomeAlvo = pacote.querySelector(".nome-carta").innerText;
                
                if (txtVida) {
                    let vidaAtual = parseFloat(txtVida.innerText);
                    // 🩹 CORREÇÃO: nunca deixa a vida mostrar número negativo — trava em 0.
                    let novaVida = Math.max(0, vidaAtual - danoDestaBatida);
                    txtVida.innerText = novaVida;
                    
                    alvosDoBumerangue[idBumerskeleton].push(idOutroAlvo);

                    if (typeof mostrarEfeitoPerdaVida === "function") mostrarEfeitoPerdaVida(idOutroAlvo);
                    narrar(`🪃 O bumerangue ricocheteou em [${nomeAlvo}] e causou ${danoDestaBatida} de Dano!`);

                    if (novaVida <= 0) {
                        let nomeEfetivoAlvo = obterNomeEfetivoCarta(idOutroAlvo, nomeAlvo);
                        narrar(`BUM! [${nomeAlvo}] foi destruído pelo ricochete!`);
                        registrarMorte(nomeEfetivoAlvo, campoAlvoId === "campo-j2" ? "j2" : "j1");
                        guardarOrigemTransformacaoOrk(nomeEfetivoAlvo, idOutroAlvo, pacote);
                        pacote.remove();
                        ativarPassivasAoMorrer(nomeEfetivoAlvo, idOutroAlvo, campoAlvoId);
                    }
                }
            }, delay);
            
            delay += 600;
            indexDano++;
        });

        // ⏳ Só avisa que a cadeia terminou depois do último ricochete de verdade ter acontecido.
        if (typeof aoConcluir === "function") {
            setTimeout(aoConcluir, delay + 200);
        }
    } catch (erro) {
        console.error("Erro no ricochete: ", erro);
    }
}
function mostrarEfeitoVida(idCarta, tipo) {
    // Busca a carta na tela. Tenta procurar pelo "pacote-id", se não achar, tenta só pelo "id" direto.
    let carta = document.getElementById("pacote-" + idCarta) || document.getElementById(idCarta);
    
    if (!carta) return; // Se a carta não estiver visível (ex: já morreu), aborta o efeito

    // Função interna que cria um único coração
    function gerarCoracao(atraso) {
        let coracao = document.createElement("div");
        coracao.innerText = "❤️";
        coracao.classList.add("efeito-coracao");
        
        // Joga um pouquinho para a esquerda ou direita aleatoriamente (entre 15% e 35% da carta)
        // Isso faz o coração nascer mais ou menos em cima do ícone da vida, e não no meio da carta.
        let posicaoX = Math.random() * 20 + 15;
        coracao.style.left = posicaoX + "%";
        
        // Define se ele espera um pouquinho antes de subir (para o efeito de "recuperou" vida)
        coracao.style.animationDelay = atraso + "s";

        carta.appendChild(coracao);

        // O coração se auto-destrói do HTML após a animação acabar (1.2s de animação + o atraso)
        setTimeout(() => {
            if (coracao.parentNode) {
                coracao.remove();
            }
        }, 1200 + (atraso * 1000));
    }

    // Aplica o efeito baseado no que você pediu:
    if (tipo === "ganhou") {
        // Sobe 1 coração imediato
        gerarCoracao(0);
        
    } else if (tipo === "recuperou") {
        // Sobe 3 corações em cascata (um após o outro)
        gerarCoracao(0);
        gerarCoracao(0.2);
        gerarCoracao(0.4);
    }
}
function mostrarEfeitoPerdaVida(idCarta) {
    let carta = document.getElementById("pacote-" + idCarta) || document.getElementById(idCarta);
    if (!carta) return;

    let coracao = document.createElement("div");
    coracao.innerText = "🖤"; // Você pode trocar por "🖤" se preferir!
    coracao.classList.add("efeito-perda-vida");
    
    // Posição aleatória perto do centro-esquerda
    let posicaoX = Math.random() * 20 + 15;
    coracao.style.left = posicaoX + "%";

    carta.appendChild(coracao);

    // Auto-destrói após 1.2 segundos
    setTimeout(() => {
        if (coracao.parentNode) {
            coracao.remove();
        }
    }, 1200);
}
function mostrarEfeitoAtaque(idCarta) {
    let carta = document.getElementById("pacote-" + idCarta) || document.getElementById(idCarta);
    if (!carta) return;

    let espada = document.createElement("div");
    espada.innerText = "⚔️"; 
    espada.classList.add("efeito-ataque");
    
    // 🚨 Diferença: Joga mais para a DIREITA (entre 65% e 85%), onde fica o status de ataque!
    let posicaoX = Math.random() * 20 + 65; 
    espada.style.left = posicaoX + "%";

    carta.appendChild(espada);

    // Auto-destrói após 1.2 segundos
    setTimeout(() => {
        if (espada.parentNode) {
            espada.remove();
        }
    }, 1200);
}
function mostrarEfeitoPerdaAtaque(idCarta) {
    let carta = document.getElementById("pacote-" + idCarta) || document.getElementById(idCarta);
    if (!carta) return;

    let espada = document.createElement("div");
    espada.innerText = "⚔️"; 
    espada.classList.add("efeito-perda-ataque");
    
    // Fica do lado DIREITO, na direção do ícone de ataque
    let posicaoX = Math.random() * 20 + 65;
    espada.style.left = posicaoX + "%";

    carta.appendChild(espada);

    // Auto-destrói
    setTimeout(() => {
        if (espada.parentNode) {
            espada.remove();
        }
    }, 1200);
}

// 🛡️ Efeito discreto compartilhado pelo Guerreiro e pelo suporte Escudo.
// O estado real continua em escudoGuerreiro; estas funções cuidam apenas do visual.
function criarHTMLVisualEscudo() {
    return `<div class="visual-escudo-ativo" aria-hidden="true"><span class="icone-escudo-fosco"></span></div>`;
}

function localizarCartaDoEscudo(idCarta) {
    let idPuro = String(idCarta).replace("pacote-", "");
    return document.getElementById("pacote-" + idPuro);
}

function ativarVisualEscudo(idCarta) {
    let carta = localizarCartaDoEscudo(idCarta);
    if (!carta) return;

    carta.classList.add("com-escudo-ativo");

    let visual = carta.querySelector(":scope > .visual-escudo-ativo");
    if (!visual) carta.insertAdjacentHTML("afterbegin", criarHTMLVisualEscudo());
}

function quebrarVisualEscudo(idCarta) {
    let carta = localizarCartaDoEscudo(idCarta);
    if (!carta) return;

    carta.classList.remove("com-escudo-ativo");

    let visual = carta.querySelector(":scope > .visual-escudo-ativo");
    if (!visual) {
        carta.insertAdjacentHTML("afterbegin", criarHTMLVisualEscudo());
        visual = carta.querySelector(":scope > .visual-escudo-ativo");
    }

    visual.classList.add("escudo-quebrando");

    [
        [-34, -30, -38], [34, -28, 42], [-42, 16, -65],
        [39, 22, 58], [0, 42, 12]
    ].forEach(([x, y, giro], indice) => {
        let fragmento = document.createElement("span");
        fragmento.className = "fragmento-escudo";
        fragmento.textContent = indice % 2 === 0 ? "◆" : "◢";
        fragmento.style.setProperty("--escudo-x", x + "px");
        fragmento.style.setProperty("--escudo-y", y + "px");
        fragmento.style.setProperty("--escudo-giro", giro + "deg");
        visual.appendChild(fragmento);
    });

    setTimeout(() => {
        if (visual.parentNode) visual.remove();
    }, 650);
}

function sincronizarVisuaisEscudo() {
    document.querySelectorAll("[id^='pacote-']").forEach(carta => {
        let idCarta = carta.id.replace("pacote-", "");
        if (escudoGuerreiro[idCarta]) ativarVisualEscudo(idCarta);
    });
}

// 🛢️ BARRIL PROTETOR — a carta real do Barril permanece na fileira. A protegida recebe
// somente a aura marrom; o visual de quebra continua preparado, mas fica oculto até quebrar.
function posicionarBarrilSobreCartaProtegida(idCarta, idBarril) {
    let idCartaPuro = String(idCarta).replace("pacote-", "");
    let idBarrilPuro = String(idBarril).replace("pacote-", "");
    let carta = document.getElementById("pacote-" + idCartaPuro);
    let barril = document.getElementById("pacote-" + idBarrilPuro);
    if (!carta || !barril || carta === barril) return;

    let campo = carta.closest("#campo-j1, #campo-j2");
    if (!campo || barril.closest("#campo-j1, #campo-j2") !== campo) return;

    barril.classList.add("barril-empilhado-sobre-carta");
    barril.dataset.cartaProtegida = idCartaPuro;

    let auraClicavel = barril.querySelector(":scope > .aura-barril-empilhado");
    if (!auraClicavel) {
        auraClicavel = document.createElement("span");
        auraClicavel.className = "aura-barril-empilhado";
        auraClicavel.setAttribute("role", "button");
        auraClicavel.setAttribute("aria-label", "Barril protetor");
        auraClicavel.title = "Barril protetor — clique para selecionar";
        auraClicavel.innerHTML = "<i></i>";
        auraClicavel.onclick = function(evento) {
            evento.stopPropagation();
            let imagemOriginal = barril.querySelector("img, .imagem-carta");
            if (imagemOriginal) imagemOriginal.click();
        };
        barril.appendChild(auraClicavel);
    }

    // Ao receber position:absolute, o Barril deixa de ocupar um espaço na fileira. A leitura
    // abaixo já usa a posição nova da carta protegida para centralizar a pilha corretamente.
    let retanguloCampo = campo.getBoundingClientRect();
    let retanguloCarta = carta.getBoundingClientRect();
    let larguraBarril = barril.offsetWidth || retanguloCarta.width;
    let esquerda = retanguloCarta.left - retanguloCampo.left + campo.scrollLeft
        + (retanguloCarta.width - larguraBarril) / 2;
    let topo = retanguloCarta.top - retanguloCampo.top + campo.scrollTop - 7;

    barril.style.left = esquerda + "px";
    barril.style.top = topo + "px";
}

function restaurarPosicaoBarril(idBarril) {
    let barril = document.getElementById("pacote-" + String(idBarril).replace("pacote-", ""));
    if (!barril) return;
    barril.classList.remove("barril-empilhado-sobre-carta");
    barril.removeAttribute("data-carta-protegida");
    barril.style.removeProperty("left");
    barril.style.removeProperty("top");
    let auraClicavel = barril.querySelector(":scope > .aura-barril-empilhado");
    if (auraClicavel) auraClicavel.remove();
}

function ativarVisualProtecaoBarril(idCarta, idBarril) {
    let carta = document.getElementById("pacote-" + String(idCarta).replace("pacote-", ""));
    if (!carta) return;

    carta.classList.add("com-protecao-barril");
    let visual = carta.querySelector(":scope > .visual-protecao-barril");
    if (!visual) {
        visual = document.createElement("div");
        visual.className = "visual-protecao-barril";
        visual.setAttribute("aria-hidden", "true");
        visual.innerHTML = '<span class="icone-barril-fosco"><i></i></span>';
        carta.insertAdjacentElement("afterbegin", visual);
    }
    visual.dataset.barrilId = String(idBarril);
    // Garante o formato original: Barril visível ao lado das cartas, sem nada sobre o alvo.
    restaurarPosicaoBarril(idBarril);
}

function quebrarVisualProtecaoBarril(idCarta, passivaAtivada) {
    let carta = document.getElementById("pacote-" + String(idCarta).replace("pacote-", ""));
    if (!carta) return;

    carta.classList.remove("com-protecao-barril");
    carta.classList.add("carta-liberta-do-barril");

    let visual = carta.querySelector(":scope > .visual-protecao-barril");
    if (!visual) {
        ativarVisualProtecaoBarril(idCarta, "quebrando");
        visual = carta.querySelector(":scope > .visual-protecao-barril");
        carta.classList.remove("com-protecao-barril");
    }
    if (!visual) return;

    visual.classList.add("barril-protecao-quebrando");
    if (passivaAtivada) visual.classList.add("barril-passiva-ativada");

    [
        [-45, -35, -70], [43, -32, 64], [-54, 2, -105],
        [52, 10, 92], [-30, 43, 38], [31, 45, -42], [2, -51, 18]
    ].forEach(([x, y, giro], indice) => {
        let lasca = document.createElement("span");
        lasca.className = "lasca-protecao-barril lasca-barril-" + (indice % 3);
        lasca.style.setProperty("--lasca-barril-x", x + "px");
        lasca.style.setProperty("--lasca-barril-y", y + "px");
        lasca.style.setProperty("--lasca-barril-giro", giro + "deg");
        visual.appendChild(lasca);
    });

    setTimeout(() => {
        carta.classList.remove("carta-liberta-do-barril");
        if (visual.parentNode) visual.remove();
    }, 900);
}

function animarCartaSaindoDoBarril(carta) {
    if (!carta) return;

    carta.classList.remove("carta-saindo-da-passiva-barril");
    void carta.offsetWidth;
    carta.classList.add("carta-saindo-da-passiva-barril");

    let casca = document.createElement("span");
    casca.className = "casca-passiva-barril";
    casca.setAttribute("aria-hidden", "true");
    casca.innerHTML = '<i class="metade-barril metade-barril-esquerda"></i><i class="metade-barril metade-barril-direita"></i>';
    carta.appendChild(casca);

    setTimeout(() => {
        carta.classList.remove("carta-saindo-da-passiva-barril");
        if (casca.parentNode) casca.remove();
    }, 1100);
}

function sincronizarVisuaisProtecaoBarril() {
    document.querySelectorAll(".visual-protecao-barril").forEach(visual => {
        if (visual.classList.contains("barril-protecao-quebrando")) return;
        let carta = visual.parentElement;
        let idCarta = carta && carta.id ? carta.id.replace("pacote-", "") : "";
        let idBarril = cartasProtegidas[idCarta];
        let vinculoValido = idBarril
            && String(idBarril) === String(visual.dataset.barrilId)
            && document.getElementById("pacote-" + idBarril);
        if (!vinculoValido) {
            if (carta) carta.classList.remove("com-protecao-barril");
            visual.remove();
        }
    });

    Object.entries(cartasProtegidas).forEach(([idCarta, idBarril]) => {
        if (String(idCarta) === String(idBarril)) {
            delete cartasProtegidas[idCarta];
            restaurarPosicaoBarril(idBarril);
            return;
        }
        let barrilExiste = document.getElementById("pacote-" + idBarril);
        let cartaExiste = document.getElementById("pacote-" + idCarta);
        if (barrilExiste && cartaExiste) {
            ativarVisualProtecaoBarril(idCarta, idBarril);
        } else {
            restaurarPosicaoBarril(idBarril);
            delete cartasProtegidas[idCarta];
        }
    });

    // Se um vínculo foi trocado ou a carta protegida saiu do campo, devolve o Barril
    // sobrevivente à fileira normal em vez de deixá-lo preso no ar.
    document.querySelectorAll(".barril-empilhado-sobre-carta").forEach(barril => {
        let idBarril = barril.id.replace("pacote-", "");
        let idCarta = barril.dataset.cartaProtegida || "";
        if (!idCarta || String(cartasProtegidas[idCarta]) !== String(idBarril)) {
            restaurarPosicaoBarril(idBarril);
        }
    });
}

function sincronizarVisuaisVenenoMago() {
    Object.values(venenosMago).forEach(efeito => {
        let alvo = document.getElementById("pacote-" + efeito.idAlvo);
        if (alvo) alvo.classList.add("envenenada");
    });
}

window.onload = function() {
    iniciarJogo();
    sincronizarVisuaisEscudo();
    sincronizarVisuaisVenenoMago();
    sincronizarVisuaisIncendiario();
    sincronizarVisuaisGeloBumerskeleton();
    sincronizarMarcadoresBarrilGoblin();
    sincronizarVisuaisProtecaoBarril();

    window.addEventListener("resize", sincronizarVisuaisProtecaoBarril);
    document.addEventListener("scroll", sincronizarVisuaisProtecaoBarril, true);

    // Se uma carta protegida/envenenada/marcada for recriada ou movida, o visual reaparece nela.
    new MutationObserver(() => {
        sincronizarVisuaisEscudo();
        sincronizarVisuaisVenenoMago();
        sincronizarVisuaisIncendiario();
        sincronizarVisuaisGeloBumerskeleton();
        sincronizarMarcadoresBarrilGoblin();
        sincronizarVisuaisProtecaoBarril();
    }).observe(document.body, {
        childList: true,
        subtree: true
    });
};
