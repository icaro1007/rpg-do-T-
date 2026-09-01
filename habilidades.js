let orkBuffado = {}; 
let modoCura = false;
let idCurandeiroAtivo = "";
let buffCuraCurandeiro = 0;       
let modoAtaqueCurandeiro = false;  
let modoCuraInimigo = false;
let buffCuraCurandeiroInimigo = 0;
let modoAtaqueCurandeiroInimigo = false;
let modoLadrao = false;
let faseLadrao = 0; 
let tipoRouboLadrao = ""; 
let ladroesQueJaRoubaram = {}; 
let cavaleiroAtivado = {}; // Guarda quais Cavaleiros conseguiram o bônus permanente
window.mensageirosEmArea = window.mensageirosEmArea || {};

function iniciarCura(idUnicoCurandeiro) {
    modoCura = true;
    idCurandeiroAtivo = idUnicoCurandeiro;
    narrar("💚 Modo Cura Ativado! Clique em uma de suas cartas no campo para curá-la.");
}

function aplicarCuraAliada(idDoPacote) {
    let idPuro = idDoPacote.replace("pacote-", "");
    let nomeCarta = document.getElementById(idDoPacote).querySelector(".nome-carta").innerText;
    
    let cartaOriginal = bancoDeCartas.find(c => c.nome === nomeCarta);
    if (!cartaOriginal) return;

    let maxVida = cartaOriginal.vida;
    let valorCura = maxVida / 2; 

    let txtVida = document.getElementById("vida-" + idPuro);
    let vidaAtual = parseFloat(txtVida.innerText);
    
    let novaVida = Math.min(maxVida, vidaAtual + valorCura);
    txtVida.innerText = novaVida;

    // 🚨 EFEITO DE VIDA AQUI: Como foi uma cura, usamos "recuperou" (sobe 3 corações)
    mostrarEfeitoVida(idPuro, "recuperou");

    let msgBuff = "";
    if (buffCuraCurandeiro > 0) {
        let txtDano = document.getElementById("dano-" + idPuro);
        let danoAtual = parseFloat(txtDano.innerText);
        txtDano.innerText = danoAtual + buffCuraCurandeiro;

        // 🚨 EFEITO AQUI: Sobe a espadinha!
        mostrarEfeitoAtaque(idPuro);

        msgBuff = ` e recebeu +${buffCuraCurandeiro} de ataque permanentemente!`;
        buffCuraCurandeiro = 0; 
    }

    narrar(`💚 ${nomeCarta} foi curado em +${valorCura} de vida${msgBuff}. Como você curou, seu turno acabou.`);
    
    modoCura = false;
    idCurandeiroAtivo = "";
    passarTurno();

    atualizarTodosUnidoes();
}

function iniciarCuraInimigo(idUnicoCurandeiro) {
    modoCuraInimigo = true;
    narrar("💚 Modo Cura Ativado! O Oponente deve clicar numa carta dele para curar.");
}

function aplicarCuraInimiga(idDoPacote) {
    let idPuro = idDoPacote.replace("pacote-", "");
    let nomeCarta = document.getElementById(idDoPacote).querySelector(".nome-carta").innerText;
    
    let cartaOriginal = bancoDeCartas.find(c => c.nome === nomeCarta);
    if (!cartaOriginal) return;

    let maxVida = cartaOriginal.vida;
    let valorCura = maxVida / 2;

    let txtVida = document.getElementById("vida-" + idPuro);
    let vidaAtual = parseFloat(txtVida.innerText);
    
    let novaVida = Math.min(maxVida, vidaAtual + valorCura);
    txtVida.innerText = novaVida;

    // 🚨 EFEITO DE VIDA AQUI: Como foi uma cura, usamos "recuperou" (sobe 3 corações)
    mostrarEfeitoVida(idPuro, "recuperou");

    let msgBuff = "";
    if (buffCuraCurandeiroInimigo > 0) {
        let txtDano = document.getElementById("dano-" + idPuro);
        let danoAtual = parseFloat(txtDano.innerText);
        txtDano.innerText = danoAtual + buffCuraCurandeiroInimigo;

        // 🚨 EFEITO AQUI: Sobe a espadinha!
        mostrarEfeitoAtaque(idPuro);

        msgBuff = ` e recebeu +${buffCuraCurandeiroInimigo} de ataque permanentemente!`;
        buffCuraCurandeiroInimigo = 0; 
    }

    narrar(`💚 ${nomeCarta} do Oponente foi curado em +${valorCura} de vida${msgBuff}. O turno dele acabou.`);
    
    modoCuraInimigo = false;
    passarTurno();

    atualizarTodosUnidoes();
}

function usarHabilidade(nome, idUnico, botao, aoConcluir) {
    // 🆕 aoConcluir: callback opcional chamado com (sucesso: boolean) quando o resultado do
    // dado desta habilidade for conhecido (pode ser na hora ou depois de um setTimeout).
    // Usado pelo Ctrl C/V pra saber se a habilidade copiada deu certo antes de rolar o bônus.
    let notificar = function (sucesso) { if (typeof aoConcluir === "function") aoConcluir(sucesso); };
    let dadoTela = document.getElementById("dado-tela");

    /// 🎭 CRIADOR (ÍCARO / THIAGO) — 2 usos únicos em sequência:
    /// 1º clique: rola o dado e vira Ícaro (1-3) ou Thiago (4-6).
    /// 2º clique: ativa o poder da forma escolhida (lê o nome ATUAL na carta, não o "nome"
    /// recebido aqui, que sempre chega como "Criador" porque é o valor fixo do onclick).
    if (nome === 'Criador') {
        let pacoteCriador = document.getElementById('pacote-' + idUnico);
        if (!pacoteCriador) return;
        let elemNomeCriador = pacoteCriador.querySelector('.nome-carta');
        let nomeAtual = elemNomeCriador ? elemNomeCriador.innerText.trim() : 'Criador';

        if (nomeAtual === 'Criador') {
            // FASE 1: ainda não se transformou.
            let dado = Math.floor(Math.random() * 6) + 1;
            document.getElementById("dado-tela").innerText = "🎲 " + dado;

            let elemVida = document.getElementById('vida-' + idUnico);
            let elemDano = document.getElementById('dano-' + idUnico);

            if (dado <= 3) {
                elemNomeCriador.innerText = 'Ícaro';
                if (elemVida) elemVida.innerText = 3;
                if (elemDano) elemDano.innerText = 3;
                narrar(`🎲 Tirou ${dado}! O Criador se tornou ÍCARO! Clique em Especial de novo pra usar o poder dele: transformar qualquer carta em outra.`);
            } else {
                elemNomeCriador.innerText = 'Thiago';
                if (elemVida) elemVida.innerText = 4;
                if (elemDano) elemDano.innerText = 2;
                narrar(`🎲 Tirou ${dado}! O Criador se tornou THIAGO! Clique em Especial de novo pra usar o poder dele: ajustar ±1 um atributo de qualquer carta.`);
            }
            // 🚨 NÃO esconde o botão — ele ainda tem o 2º uso (o poder da forma escolhida).
            notificar(true);
            return;
        }

        if (nomeAtual === 'Ícaro') {
            modoTransformacaoIcaro = true;
            idIcaroAtivo = idUnico;
            narrar("🎨 ÍCARO ativado! Clique em qualquer carta em jogo (sua ou do oponente) pra transformá-la em outra tropa aleatória, mantendo a vida e o dano dela.");
            if (botao) botao.style.display = 'none';
            return;
        }

        if (nomeAtual === 'Thiago') {
            modoAjusteThiago = true;
            idThiagoAtivo = idUnico;
            narrar("⚖️ THIAGO ativado! Clique em qualquer carta em jogo pra ajustar vida ou dano dela em ±1.");
            if (botao) botao.style.display = 'none';
            return;
        }
    }

    /// 🔥 HABILIDADE: INCENDIÁRIO (dado 4 = faz os turnos 1, 2 e 3 numa jogada só)
    if (nome === 'Incendiário') {
        let dado = Math.floor(Math.random() * 6) + 1;
        document.getElementById("dado-tela").innerText = "🎲 " + dado;
        if (botao) botao.style.display = 'none'; // uso único

        if (dado === 4) {
            narrar("🎲 Tirou 4! O Incendiário jogou a pólvora e queimou as 2 rodadas inteiras nessa mesma jogada!");
            executarFaseIncendiario(idUnico, 1); // joga a pólvora
            executarFaseIncendiario(idUnico, 2); // 1ª queimada
            executarFaseIncendiario(idUnico, 3); // 2ª queimada — os turnos 1, 2 e 3 viram 1 turno só
            incendiarioCiclo[idUnico] = 3; // guarda a ÚLTIMA fase executada (3); próxima passagem = fase 4 (parado), depois disso reinicia normal (sem o especial)
            notificar(true);
        } else {
            narrar(`🎲 Tirou ${dado}. Não deu 4 — a habilidade não ativou dessa vez.`);
            notificar(false);
        }
        return;
    }

    /// ⏳ HABILIDADE: VIAJANTE DO TEMPO (dado 1 = prende uma carta inimiga no tempo)
    if (nome === 'Viajante do Tempo') {
        let dado = Math.floor(Math.random() * 6) + 1;
        document.getElementById("dado-tela").innerText = "🎲 " + dado;
        if (botao) botao.style.display = 'none'; // uso único

        if (dado === 1) {
            modoPrenderNoTempo = true;
            idPrenderNoTempoAtivo = idUnico;
            narrar("🎲 Tirou 1! Clique numa carta INIMIGA pra prendê-la em um momento do tempo — ela vai sumir da batalha!");
            notificar(true);
        } else {
            narrar(`🎲 Tirou ${dado}. Não deu 1 — a habilidade não ativou dessa vez.`);
            notificar(false);
        }
        return;
    }

    /// 👥 HABILIDADE: SEPARADO / SEPARADOIS (dado 6 = ataque dividido em 2 alvos)
    if (nome === 'Separado' || nome === 'Separadois') {
        let idParceira = typeof parceriaSeparado !== 'undefined' ? parceriaSeparado[idUnico] : null;
        let parceiraViva = idParceira && document.getElementById('pacote-' + idParceira);

        if (!parceiraViva) {
            if (botao) botao.style.display = 'none';
            notificar(false);
            return narrar(`❌ ${nome} não tem uma parceira viva em campo pra usar essa habilidade!`);
        }

        let dado = Math.floor(Math.random() * 6) + 1;
        document.getElementById("dado-tela").innerText = "🎲 " + dado;
        if (botao) botao.style.display = 'none'; // uso único, vale a tentativa mesmo se não der 6

        if (dado === 6) {
            separadaoDividido[idUnico] = 2; // faltam 2 ataques: o do Separado e o da parceira
            narrar(`🎲 Tirou 6! Agora é só atacar normalmente: clique em Atacar em ${nome} pra escolher um alvo, e depois em Atacar na parceira pra escolher OUTRO alvo — as duas vão atacar sem se puxar dessa vez, e o turno só passa depois das duas.`);
            notificar(true);
        } else {
            narrar(`🎲 Tirou ${dado}. Não deu 6 — a habilidade não ativou dessa vez.`);
            notificar(false);
        }
        return;
    }

    /// 🪵 HABILIDADE ESPECIAL: BARRIL DE BÁRBARO
    if (nome.includes('Barril de Bárbaro')) { // 🔥 CORREÇÃO: Estava nomeCarta, agora é só 'nome'
        let dado = Math.floor(Math.random() * 6) + 1;
        document.getElementById("dado-tela").innerText = "🎲 " + dado;
        
        if (dado === 5) {
            splashBarbaroAtivo[idUnico] = true;
            narrar("🎲 O dado rolou 5! O próximo impacto causará +1 de dano nas cartas vizinhas!");
        } else {
            splashBarbaroAtivo[idUnico] = false; 
            narrar(`🎲 O dado rolou ${dado}. Sem dano em área, mas o impacto de 3 de dano continua preparado!`);
        }
        
        // Esconde o botão roxo após usar a habilidade única
        if (botao) botao.style.display = 'none';
        notificar(dado === 5);
        return;
    }
    // 🛡️ HABILIDADE ESPECIAL: BARRIL (Criar Vínculo de Guarda-Costas)
    if (nome === 'Barril') {
        // O dono precisa ser descoberto pela posição REAL da carta. Cartas trazidas pelo
        // Necromante recebem IDs "necro_...", sem a palavra "inimigo", mesmo quando são do
        // P2; usar o ID fazia o Barril do bot proteger uma carta do jogador e criava um loop.
        let pacoteBarril = document.getElementById("pacote-" + idUnico);
        let barrilEhDoInimigo = pacoteBarril
            ? !!pacoteBarril.closest('#campo-j2, #mao-j2')
            : idUnico.includes("inimigo"); // fallback apenas se a carta já tiver saído da tela

        if (barrilEhDoInimigo) {
            modoProtecaoBarrilInimigo = true;
            idBarrilProtetor = idUnico;
            narrar("🛡️ MODO ESCUDO INIMIGO: Clique em uma carta do OPONENTE para o Barril proteger!");
        } else {
            // Se o ID não tem "inimigo", é o seu Barril (P1)
            modoProtecaoBarril = true;
            idBarrilProtetor = idUnico;
            narrar("🛡️ MODO ESCUDO ALIADO: Clique em uma de SUAS cartas para o Barril proteger!");
        }
        
        if (botao) botao.style.display = 'none'; // Some com o botão após o uso
        notificar(true); // não tem dado — sempre "ativa"
        return;
    }
    // 🧪 HABILIDADE ESPECIAL: BRUXO (Polimorfia e Controle Mental)
    if (nome === 'Bruxo') {
        if (botao) botao.style.display = 'none'; // Some com o botão
        
        let dado = Math.floor(Math.random() * 6) + 1;
        let dadoTela = document.getElementById("dado-tela");
        
        // Efeito visual do dado
        dadoTela.style.animation = 'none';
        setTimeout(() => dadoTela.style.animation = '', 10);
        dadoTela.innerText = "🎲 " + dado;

        setTimeout(() => {
            // 🚀 SALVA O ID DO BRUXO ATIVO ANTES DE ENTRAR NOS MODOS
            idBruxoAtivo = idUnico; 

            if (dado === 4) {
                modoBruxoTransformar = true;
                narrar("🧪 O Bruxo tirou 4! Clique em uma carta INIMIGA para transformá-la em Poção!");
                notificar(true);
            } else if (dado === 6) {
                modoBruxoRoubar = true;
                narrar("🔮 O Bruxo tirou 6! Clique em uma carta INIMIGA para ROUBÁ-LA!");
                notificar(true);
            } else {
                narrar(`🎲 O Bruxo rolou ${dado}. A magia falhou e ele virou poção!`);
                
                // Pega o bruxo correto e o lado dele para gerar a poção
                let pacoteBruxo = document.getElementById("pacote-" + idUnico);
                if (pacoteBruxo) {
                    let oBruxoEAliado = pacoteBruxo.closest("#campo-j1") !== null;
                    let maoDestino = oBruxoEAliado ? "mao-j1" : "mao-j2";
                    gerarPocaoAleatoria(maoDestino); // Cria a poção
                    pacoteBruxo.remove(); // Remove o Bruxo do campo
                }
                
                idBruxoAtivo = null; // Reseta o uso
                notificar(false);
            }
        }, 1000);
        
        return;
    }
    // ❄️ IMPEDIR CARTAS CONGELADAS DE USAR ESPECIAL
    let pacoteDono = document.getElementById("pacote-" + idUnico);
    if (pacoteDono && pacoteDono.classList.contains("congelada")) {
        narrar("❄️ Esta carta está congelada e não pode usar habilidades!");
        notificar(false);
        return;
    }

    // ❄️ EFEITO DA POÇÃO DE GELO
    if (nome === 'Poção de Gelo' || nome === 'Gelo' || nome === 'Pocaogelo' || idUnico.includes("pocaogelo")) {
        let dado = Math.floor(Math.random() * 6) + 1; // Rola o dado de 1 a 6
        narrar(`🧪 Você usou a Poção de Gelo! O dado rolou: ${dado}`);

        if (dado === 5) {
            narrar("❄️ NEVASCA! Todas as cartas inimigas (campo e mão) foram congeladas por 1 rodada a mais!");
            
            let pacotePocao = document.getElementById("pacote-" + idUnico);
            let aPocaoEAliada = true;
            
            if (pacotePocao) {
                aPocaoEAliada = pacotePocao.closest("#campo-j1") !== null || pacotePocao.closest("#mao-j1") !== null;
            }
            
            // Descobre quem é o inimigo para mirar nele
            let idCampoInimigo = aPocaoEAliada ? "campo-j2" : "campo-j1";
            let idMaoInimiga = aPocaoEAliada ? "mao-j2" : "mao-j1";
            
            // 🎯 A MÁGICA AQUI: Seleciona apenas as CARTAS ([id^="pacote-"]) dentro da mão e do campo do inimigo
            let cartasInimigas = document.querySelectorAll(`#${idCampoInimigo} [id^="pacote-"], #${idMaoInimiga} [id^="pacote-"]`);
            
            if (cartasInimigas.length === 0) {
                narrar("💨 A nevasca soprou, mas não havia cartas inimigas para congelar!");
            } else {
                // Congela cada uma das cartas individualmente
                cartasInimigas.forEach(pacoteCard => {
                    // Extrai o ID único da carta removendo o prefixo "pacote-"
                    let idCarta = pacoteCard.id.replace("pacote-", "");
                    
                    // Antes eram 3 passagens; +2 equivale a uma rodada completa a mais.
                    duracaoGelo[idCarta] = 5;
                    
                    // Aplica o visual de gelo direto na carta!
                    pacoteCard.classList.add("congelada");
                });
                
                narrar(`❄️ Sucesso! A nevasca congelou todas as ${cartasInimigas.length} carta(s) do oponente!`);
            }
            
            if (pacotePocao) pacotePocao.remove();
            idPocaoAtiva = null;
            modoGeloSimples = false;
        } else {
            // Qualquer outro dado ativa o Alvo Simples
            narrar("❄️ Gelo Simples ativado! Clique em uma carta do OPONENTE (campo ou mão) para congelar.");
            modoGeloSimples = true;
            idPocaoAtiva = idUnico;
        }
        
        if (typeof atualizarTodosUnidoes === "function") atualizarTodosUnidoes();
        if (dado === 5) passarTurno(); // 🩹 CORREÇÃO: a nevasca é uma ação completa, precisa passar o turno
        notificar(true); // Gelo sempre "funciona" de algum jeito (nevasca ou alvo simples)
        return;
    }
    if (nome === 'Necromante') {
        let resultadoDado = Math.floor(Math.random() * 6) + 1;
        
        dadoTela.style.animation = 'none';
        setTimeout(() => dadoTela.style.animation = '', 10);
        dadoTela.innerText = "🎲 " + resultadoDado;

        let ehAliado = botao.closest('#campo-j1') || botao.closest('#mao-j1') || botao.closest('.carta-aliada'); 
        
        let idMao = ehAliado ? "mao-j1" : "mao-j2";
        let idCampo = ehAliado ? "campo-j1" : "campo-j2";
        
        let maoHTML = document.getElementById(idMao);
        let campoHTML = document.getElementById(idCampo);

        if (resultadoDado >= 3 && resultadoDado <= 5) {
            // LÓGICA INFALÍVEL: Pega as cartas direto do HTML da mão (elas têm o ID começando com pacote-necro_)
            let cartasInvocadasNoHTML = Array.from(maoHTML.querySelectorAll('div[id^="pacote-necro_"]'));

            if (cartasInvocadasNoHTML.length > 0) {
                let danoExtra = 0;

                cartasInvocadasNoHTML.forEach(pacoteCarta => {
                    // Move a carta fisicamente para a arena
                    campoHTML.appendChild(pacoteCarta);
                    
                    // Libera os botões de ação dela
                    let divAcoes = pacoteCarta.querySelector("div[id^='acoes-']");
                    if (divAcoes) divAcoes.style.display = "block";
                    
                    // Ajusta a classe para aliado ou inimigo
                    pacoteCarta.className = ehAliado ? "carta-aliada" : "carta-inimiga";
                    
                    // Lê o dano da carta direto da tela
                    let idDaCarta = pacoteCarta.id.replace("pacote-", "");
                    let elemDano = document.getElementById("dano-" + idDaCarta);
                    if (elemDano) {
                        danoExtra += parseFloat(elemDano.innerText);
                    }

                    // A invocação direta pulava o clique normal de "jogar carta" e deixava a
                    // imagem com o comportamento antigo da mão. Ativamos o modo de batalha
                    // agora; isso também dispara corretamente a passiva de outro Necromante.
                    if (ehAliado) jogarCarta(pacoteCarta.id);
                    else jogarCartaInimigo(pacoteCarta.id);
                });

                let danoTotal = 1 + danoExtra;
                narrar(`🔮 SUCESSO! Dado: ${resultadoDado}. As cartas saltaram da mão para a arena! Causaram ${danoTotal} de dano!`);
            } else {
                narrar(`🔮 SUCESSO! Dado: ${resultadoDado}. Porém as cartas invocadas já não estão na mão! Causou 1 de dano.`);
            }
            notificar(true);
        } else {
            narrar(`❌ FALHOU! O dado deu ${resultadoDado}. As cartas continuam na mão.`);
            notificar(false);
        }
        
        botao.style.display = "none"; 
        if (typeof atualizarTodosUnidoes === "function") atualizarTodosUnidoes();
        return; // SEM PASSAR O TURNO!
    }
    
    if (nome === 'Ork') {
        let resultadoDado = Math.floor(Math.random() * 6) + 1;
        
        dadoTela.style.animation = 'none';
        setTimeout(() => dadoTela.style.animation = '', 10);
        dadoTela.innerText = "🎲 " + resultadoDado;

        if (resultadoDado === 1) {
            orkBuffado[idUnico] = true; 
            narrar(`🔮 SUCESSO! Dado: 1. O Ork entrou em fúria! Se morrer, invocará 3 Goblins.`);
        } else {
            narrar(`❌ FALHOU! Dado: ${resultadoDado}. O Ork não se enfureceu.`);
        }
        
        botao.style.display = "none"; 
        notificar(resultadoDado === 1);
        return; // SEM PASSAR O TURNO!
    }
    
    if (nome === 'Curandeiro') {
        let ehAliado = botao.closest('#campo-j1') || botao.closest('#mao-j1') || botao.closest('.carta-aliada');
        
        // 🩹 CORREÇÃO: era 2 dados independentes (um pro +1 dano, outro pro bônus de cura),
        // mas a carta descreve os dois efeitos como consequência do MESMO resultado —
        // dava pra ganhar o bônus de cura sem ganhar o +1 de dano, o que não devia acontecer.
        let dado = Math.floor(Math.random() * 6) + 1;

        dadoTela.style.animation = 'none';
        setTimeout(() => dadoTela.style.animation = '', 10);
        dadoTela.innerText = "🎲 " + dado;

        let ehImpar = (dado % 2 !== 0);
        let deuBuff = (dado === 1 || dado === 3);

        let msgDano = "";
        if (ehImpar) {
            let spanDano = document.getElementById("dano-" + idUnico);
            let danoAtual = parseFloat(spanDano.innerText);
            spanDano.innerText = danoAtual + 1;
            msgDano = ehAliado ? "💥 Dado ÍMPAR! Seu Curandeiro ganhou +1 de Ataque." : "💥 Dado ÍMPAR! O Curandeiro Inimigo ganhou +1 de Ataque.";
        } else {
            msgDano = "❌ Dado foi PAR (sem ganho de ataque, sem bônus de cura).";
        }

        let msgBuff = "";
        if (deuBuff) {
            if (ehAliado) buffCuraCurandeiro = 0.5;
            else buffCuraCurandeiroInimigo = 0.5;
            msgBuff = "✨ Dado foi 1 ou 3! A próxima cura dará +0.5 de bônus.";
        }

        narrar(`🔮 Habilidade Curandeiro: ${msgDano} ${msgBuff}`);
        botao.style.display = "none";
        notificar(ehImpar);
        return; // SEM PASSAR O TURNO!
    }

    if (nome === "Ctrl C" || nome === "Ctrl V") {
        let dadosCopia = ctrlV[idUnico];
        if (!dadosCopia) return narrar("Erro: Não encontrei os dados da carta copiada!");
        
        // 🚨 CORREÇÃO: Esconde o botão do Ctrl para ele não ser usado várias vezes
        botao.style.display = "none";
        
        let nomeCopiado = dadosCopia.nomeOriginal;
        narrar(`🔮 O ${nome} ativou a habilidade copiada de [${nomeCopiado}]!`);
        
        // 🩹 CORREÇÃO: o dado bônus (+1 dano no 3) só deveria rolar SE a habilidade copiada
        // tiver dado certo — antes ele rolava sempre, mesmo quando a cópia falhava.
        usarHabilidade(nomeCopiado, idUnico, botao, function (sucessoCopiado) {
            if (!sucessoCopiado) {
                narrar(`❌ A habilidade copiada de [${nomeCopiado}] não deu certo — sem chance de dado bônus desta vez.`);
                return;
            }

            // Depois de 1.5s (dá tempo de ler o resultado da habilidade copiada), rola o dado extra
            setTimeout(() => {
                let dadoBonus = Math.floor(Math.random() * 6) + 1;
                let dadoTela = document.getElementById("dado-tela");
                
                dadoTela.style.animation = 'none';
                setTimeout(() => dadoTela.style.animation = '', 10);
                dadoTela.innerText = "🎲 " + dadoBonus;
                
                if (dadoBonus === 3) {
                    let elemDano = document.getElementById("dano-" + idUnico);
                    let danoAtual = parseInt(elemDano.innerText);
                    elemDano.innerText = danoAtual + 1;

                    // 🚨 EFEITO AQUI: Sobe a espadinha!
                    mostrarEfeitoAtaque(idUnico);

                    narrar(`🎯 A habilidade copiada deu certo, e o dado bônus do ${nome} tirou 3! Ganhou +1 de Dano permanentemente!`);
                } else {
                    narrar(`🎲 A habilidade copiada deu certo, mas o dado bônus do ${nome} tirou ${dadoBonus}. Sem bônus de dano extra.`);
                }
            }, 1500);
        });
        
        return; // SEM PASSAR O TURNO!
    }

    // --- HABILIDADE DO CAVALEIRO DAS TREVAS ---
    if (nome === 'Cavaleiro das Trevas') {
        let ehAliado = botao.closest(".carta-aliada") !== null;
        
        if (cavaleiroAtivado[idUnico]) {
            notificar(false);
            return narrar("A habilidade deste Cavaleiro já está ativada com poder máximo!");
        }
        
        botao.style.display = "none"; // Some com o botão pra não clicar de novo
        
        narrar("Rolando o dado para despertar o Cavaleiro (precisa de 5)...");
        
        setTimeout(() => {
            let dado = Math.floor(Math.random() * 6) + 1;
            document.getElementById("dado-tela").innerText = "🎲 " + dado;
            
            if (dado === 5) {
                cavaleiroAtivado[idUnico] = true;
                let elemDano = document.getElementById("dano-" + idUnico);
                if (elemDano) elemDano.innerText = "5"; 
                narrar("MÁXIMO PODER! O Cavaleiro das Trevas despertou e agora dá 5 de dano em até 3 cartas!");
            } else {
                narrar(`Tirou ${dado}. A habilidade falhou.`);
            }
            
            if (typeof atualizarTodosUnidoes === "function") atualizarTodosUnidoes();
            notificar(dado === 5);
        }, 1200);
        return; // SEM PASSAR O TURNO!
    }
    
    // --- REGRA DO TRIO DE GOBLIN ---
    if (nome === "Trio de Goblin") {
        let vidaAtual = parseFloat(document.getElementById("vida-" + idUnico).innerText);
        if (vidaAtual > 2) {
            notificar(false);
            return narrar("❌ O Trio de Goblin só pode usar a habilidade especial quando restar apenas 1 Goblin (2 ou menos de vida)!");
        } else {
            narrar("🔥 Restou apenas um! O último do Trio ativou a habilidade do Goblin!");
            nome = "Goblin"; // Truque: Muda o nome para Goblin, assim o código dele cai direto no bloco do Goblin logo abaixo!
        }
    }

    // --- HABILIDADE DO GOBLIN ---
    if (nome === 'Goblin') {
        let dado = Math.floor(Math.random() * 6) + 1;
        document.getElementById("dado-tela").innerText = "🎲 " + dado;

        if (dado === 1 || dado === 2) {
            narrar(`💰 SUCESSO! Dado: ${dado}. O Goblin preparou o roubo! Clique em uma carta INIMIGA na arena para roubar 1 de DANO.`);
            modoRouboGoblin = true;
            faseRouboGoblin = 1;
            idGoblinLadrao = idUnico; // Guarda qual Goblin ativou o roubo (define o "lado" da habilidade)
        } else {
            narrar(`❌ FALHOU! Tirou ${dado}. O Goblin tentou roubar, mas tropeçou e foi pego.`);
        }

        botao.style.display = "none";
        notificar(dado === 1 || dado === 2);
        return; // Habilidade não passa o turno!
    }
    // --- HABILIDADE DO GUERREIRO ---
    if (nome === 'Guerreiro') {
        let dado = Math.floor(Math.random() * 6) + 1; // Rola o dado de 1 a 6
        
        let dadoTela = document.getElementById("dado-tela");
        dadoTela.style.animation = 'none';
        setTimeout(() => dadoTela.style.animation = '', 10);
        dadoTela.innerText = "🎲 " + dado;
        
        if (dado >= 1 && dado <= 4) {
            escudoGuerreiro[idUnico] = true;
            narrar(`🛡️ SUCESSO! O Guerreiro rolou ${dado} e ergueu o seu escudo impenetrável para esta rodada!`);
        } else {
            narrar(`🎲 FALHA... O Guerreiro rolou ${dado} e o escudo encravou.`);
        }
        
        // Bloqueia o botão para ser de Uso Único
        botao.style.display = "none";
        notificar(dado >= 1 && dado <= 4);
        return; // Ação rápida, não passa o turno!
    }
    // --- HABILIDADE: MAGO (VENENO) ---
    if (nome === 'Mago') {
        let pacoteMago = document.getElementById("pacote-" + idUnico);
        if (!pacoteMago) { notificar(false); return; }

        let ehAliadoMago = pacoteMago.closest("#campo-j1") !== null;
        if ((ehAliadoMago && turnoAtivo !== 1) || (!ehAliadoMago && turnoAtivo !== 2)) {
            notificar(false);
            return narrar("⏳ Ainda não é a vez deste Mago usar o veneno!");
        }

        let campoOposto = document.getElementById(ehAliadoMago ? "campo-j2" : "campo-j1");
        let classeOposta = ehAliadoMago ? ".carta-inimiga" : ".carta-aliada";
        if (!campoOposto || campoOposto.querySelectorAll(classeOposta).length === 0) {
            notificar(false);
            return narrar("☠️ Não há nenhuma carta no campo oposto para envenenar!");
        }

        let dado = Math.floor(Math.random() * 6) + 1;
        dadoTela.style.animation = 'none';
        setTimeout(() => dadoTela.style.animation = '', 10);
        dadoTela.innerText = "🎲 " + dado;
        if (botao) botao.style.display = "none";

        let sucesso = dado === 1 || dado === 4 || dado === 6;
        if (sucesso) {
            modoAlvoVenenoMago = true;
            idMagoVenenoAtivo = idUnico;
            narrar(`☠️ SUCESSO! O Mago tirou ${dado}. Clique numa carta do campo oposto para envenená-la por 2 rodadas!`);
        } else {
            modoAlvoVenenoMago = false;
            idMagoVenenoAtivo = null;
            narrar(`🎲 FALHA! O Mago tirou ${dado} e o veneno não foi lançado.`);
        }

        notificar(sucesso);
        return; // A habilidade é rápida: depois de escolher o alvo, o Mago ainda pode atacar.
    }

    // --- HABILIDADE: BARRIL DE GOBLINS ---
    if (nome.includes('Barril de Goblin')) { // 🚀 .includes FAZ O CTRL V FUNCIONAR!
        let idAlvo = alvosDoBarril[idUnico];
        if (!idAlvo) {
            // 📦 Ainda não atacou nesta rodada — deixa ativar o Especial já escolhendo o alvo:
            // o clique no inimigo vai aplicar o impacto normal E rolar esta habilidade em seguida.
            let pacoteBarril = document.getElementById("pacote-" + idUnico);
            if (!pacoteBarril) { notificar(false); return; }
            let ehAliadoBarril = pacoteBarril.closest("#campo-j1") !== null;
            if ((ehAliadoBarril && turnoAtivo !== 1) || (!ehAliadoBarril && turnoAtivo !== 2)) {
                notificar(false);
                return narrar("⏳ Ainda não é a vez desta carta atacar!");
            }
            modoEspecialBarrilGoblin = true;
            idBarrilAtivo = idUnico;
            if (botao) botao.style.display = "none";
            return narrar("📦 Clique na carta do OPONENTE pra focar os goblins nela e já rolar a habilidade!");
        }

        // 🚀 LÊ O DANO EXTRA (BUFFS DA BESTA, UNIDÃO, ETC)
        let txtDano = document.getElementById("dano-" + idUnico);
        let buffDano = txtDano ? parseFloat(txtDano.innerText) : 0;

        let dado = Math.floor(Math.random() * 6) + 1;
        
        let dadoTela = document.getElementById("dado-tela");
        dadoTela.style.animation = 'none';
        setTimeout(() => dadoTela.style.animation = '', 10);
        dadoTela.innerText = "🎲 " + dado;
        
        if (dado === 3) {
            // ➕ Só o BÔNUS (0,5) — os vizinhos já levaram o impacto base (1) na passiva.
            // Total nos vizinhos: 1 (base) + 0,5 (bônus) = 1,5, como esperado.
            let danoHabilidade = 0.5 + buffDano;
            
            let vizinhos = obterCartasAdjacentes("pacote-" + idAlvo);
            vizinhos.forEach(vizinho => {
                let isInimigo = vizinho.closest("#campo-j2") !== null;
                aplicarDanoDireto(vizinho.id, danoHabilidade, isInimigo);
            });
            narrar(`🎲 SUCESSO! Tirou 3! O Barril causou +${danoHabilidade} de dano extra nos vizinhos do alvo focado!`);
        } else {
            narrar(`🎲 FALHA! Tirou ${dado}. A habilidade não ativou.`);
        }
        
        if (botao) botao.style.display = "none";
        notificar(dado === 3);
        return; 
    }

if (nome === "Bumerskeleton") { 
        // 1. Verifica se o Bumerskeleton já atacou nesta rodada
        if (!alvosDoBumerangue[idUnico] || alvosDoBumerangue[idUnico].length === 0) {
            // 🪃 Ainda não atacou nesta rodada — deixa ativar o Especial já escolhendo o alvo:
            // o clique no inimigo vai lançar o bumerangue (com ricochete) E já rolar a habilidade.
            let pacoteBume = document.getElementById("pacote-" + idUnico);
            if (!pacoteBume) { notificar(false); return; }
            let ehAliadoBume = pacoteBume.closest("#campo-j1") !== null;
            if ((ehAliadoBume && turnoAtivo !== 1) || (!ehAliadoBume && turnoAtivo !== 2)) {
                notificar(false);
                return narrar("⏳ Ainda não é a vez desta carta atacar!");
            }
            modoEspecialBumerskeleton = true;
            idBumerskeletonEspecialAtivo = idUnico;
            if (botao) botao.style.display = "none";
            return narrar("🪃 Clique numa carta inimiga pra lançar o bumerangue nela e já rolar a habilidade!");
        }

        // 🚨 A MÁGICA AQUI: Esconde o botão roxo! A chance é gasta na hora!
        if (botao) botao.style.display = "none";

        let alvosAtingidos = alvosDoBumerangue[idUnico]; 

        // Rola o dado
        let dado = Math.floor(Math.random() * 6) + 1;
        
        // Efeito visual no dado da tela
        let dadoTela = document.getElementById("dado-tela");
        if (dadoTela) {
            dadoTela.style.animation = 'none';
            setTimeout(() => dadoTela.style.animation = '', 10);
            dadoTela.innerText = "🎲 " + dado;
        }

        narrar(`🎲 Bumerskeleton rolou o dado e tirou: ${dado}!`);

        if (dado === 1) {
            // EFEITO 1: BUMERANGUE VOLTA
            let primeiroAlvo = alvosAtingidos[0]; 
            let pacoteAlvo = document.getElementById("pacote-" + primeiroAlvo);
            
            if (pacoteAlvo) {
                // Descobre qual é o próximo dano da escala 
                let danoDoRetorno = tabelaDanoBumerangue[alvosAtingidos.length] || 4; 
                if (typeof animarBumerangueEntre === "function") {
                    animarBumerangueEntre(primeiroAlvo, idUnico, true);
                }
                
                let txtVida = document.getElementById("vida-" + primeiroAlvo);
                let vidaAtual = parseFloat(txtVida.innerText);
                txtVida.innerText = vidaAtual - danoDoRetorno;

                if (typeof mostrarEfeitoPerdaVida === "function") mostrarEfeitoPerdaVida(primeiroAlvo);
                
                narrar(`🪃 O bumerangue fez a curva! Retornou dando ${danoDoRetorno} de DANO na primeira carta! ROLANDO DADO DE NOVO...`);
                
                // Rola o dado de novo imediatamente após 2 segundos!
                setTimeout(() => {
                    usarHabilidade(nome, idUnico, null); // "null" para o botão não dar erro no retorno
                }, 2000);
            } else {
                narrar("🪃 O bumerangue voltou, mas o primeiro alvo já estava destruído!");
            }
            notificar(true);

        } else if (dado === 3) {
            // EFEITO 3: FOGO EM TODOS
            alvosAtingidos.forEach(idAlvo => {
                let txtVida = document.getElementById("vida-" + idAlvo);
                if (txtVida) {
                    if (typeof ativarFogoCarta === "function") ativarFogoCarta(idAlvo, 1500, false);
                    // 🩹 CORREÇÃO: nunca deixa a vida mostrar número negativo — trava em 0.
                    txtVida.innerText = Math.max(0, parseFloat(txtVida.innerText) - 0.25);
                    if (typeof mostrarEfeitoPerdaVida === "function") mostrarEfeitoPerdaVida(idAlvo);
                }
            });
            narrar(`🔥 FOGO! O rastro do bumerangue incendiou TODAS as cartas atingidas (-0.25 de vida)!`);
            notificar(true);
            passarTurno(); // 🩹 CORREÇÃO: faltava passar o turno — dava pra atacar de novo de graça.

       } else if (dado === 5) {
            // GELO EM TODOS
            alvosAtingidos.forEach(idAlvo => {
                let pacote = document.getElementById("pacote-" + idAlvo);
                if (pacote) {
                    pacote.classList.add("congelada"); 
                    pacote.style.filter = "hue-rotate(180deg) brightness(1.2)"; 
                    
                    if (typeof duracaoGelo !== 'undefined') {
                        duracaoGelo[idAlvo] = 5; // antes 3; +2 passagens = +1 rodada completa
                    }
                }
            });
            narrar(`❄️ GELO ABSOLUTO! Todas as cartas no trajeto do bumerangue foram CONGELADAS!`);
            notificar(true);
            passarTurno(); // 🩹 CORREÇÃO: faltava passar o turno — dava pra atacar de novo de graça.
            
        } else {
            // 🚨 MENSAGEM DE FALHA: Se não cair 1, 3 ou 5
            narrar(`💀 Falhou! O dado tirou ${dado} (não foi 1, 3 ou 5). O bumerangue caiu e a chance foi perdida!`);
            notificar(false);
            passarTurno(); // 🩹 CORREÇÃO: faltava passar o turno — dava pra atacar de novo de graça.
        }
    }
    if (nome === "Mensageiro") {
        if (botao) botao.style.display = "none";

        let dado = Math.floor(Math.random() * 6) + 1;
        
        let dadoTela = document.getElementById("dado-tela");
        if (dadoTela) {
            dadoTela.style.animation = 'none';
            setTimeout(() => dadoTela.style.animation = '', 10);
            dadoTela.innerText = "🎲 " + dado;
        }

        narrar(`🎲 Mensageiro rolou o dado e tirou: ${dado}!`);

        if (dado === 6) {
            narrar("🌪️ SUCESSO! O Mensageiro ativou seu Modo Área! Seus ataques normais agora causam 2 de dano a TODOS!");
            
            // Liga o modo área para ESTA carta específica
            window.mensageirosEmArea[idUnico] = true;
            
            // Atualiza o visual do texto da carta para o jogador lembrar!
            let txtDano = document.getElementById("dano-" + idUnico);
            if (txtDano) {
                txtDano.innerText = "2"; 
                txtDano.style.color = "#9b59b6"; // Muda a cor do dano para roxo para indicar a mudança
            }
        } else {
            narrar(`💀 Falhou! O dado tirou ${dado}. O Mensageiro continua com ataques normais.`);
        }
        notificar(dado === 6);
    }
}

// --- PASSIVA DO NECROMANTE (CORREÇÃO DE ERRO) ---
function verificarPassivaNecromante(carta, ehAliado) {
    // Verifica se a carta que acabou de entrar no campo é o Necromante
    if (carta.nome === "Necromante" && !carta.passivaAtivada) {
        narrar("💀 O Necromante entrou na arena com sua aura sombria!");
        carta.passivaAtivada = true;
        let maoArray = ehAliado ? maoJ1 : maoJ2; 
        let idMaoHTML = ehAliado ? "mao-j1" : "mao-j2";
        let funcaoJogar = ehAliado ? "jogarCarta" : "jogarCartaInimigo";
        let classeCss = ehAliado ? "carta-aliada" : "carta-inimiga-espera"; 
        
        let divMao = document.getElementById(idMaoHTML);

        // 🩹 CORREÇÃO: essa lista era uma cópia separada e congelada da lista real de
        // suportes/poções (suportesReais, em main.js) — nunca foi atualizada com nenhuma
        // das cartas novas (Vampi7, Portable, Plus Life, Reviverta, Cracker, Allsforms,
        // Dupliquetion, Auvex), então o Necromante podia invocar qualquer uma delas como
        // se fosse tropa. Agora usa a lista global de verdade, então nunca mais desatualiza.
        let listaDeSuportes = (typeof suportesReais !== 'undefined') ? suportesReais : [
            "besta", "recuperida", "velux", "pocaotraicao", 
            "adiv", "pocaogelo", "escudo_item", "cavalotroia", "fogueira"
        ];

        let bancoDeTropas = bancoDeCartas.filter(c => !listaDeSuportes.includes(c.id));

        for (let i = 0; i < 2; i++) {
            let indexSorteado = Math.floor(Math.random() * bancoDeTropas.length);
            let cartaSorteada = bancoDeTropas[indexSorteado];

            let novaCarta = {
                ...cartaSorteada, 
                idUnico: 'necro_' + Math.random().toString(36).substr(2, 9),
                invocadaPor: 'Necromante' 
            };

            // 🚨 NOVIDADE AQUI: A carta recebe 2 turnos de bloqueio (O seu e o do oponente = 1 rodada completa)
            bloqueioNecro[novaCarta.idUnico] = 2; 

            let htmlDaCarta = criarHTMLCarta(novaCarta, funcaoJogar, classeCss, ehAliado);
            if (divMao) {
                divMao.insertAdjacentHTML('beforeend', htmlDaCarta);
            }
        }
    }
}

function usarPassivaLadrao(idUnico, botao) {
    let ehAliado = botao.closest('#campo-j1') || botao.closest('#mao-j1');

    // 🩹 NOVO: a passiva do Ladrão só pode ser usada 1 vez por turno, por lado (zera em
    // passarTurno). Antes dava pra usar quantas vezes quisesse dentro do mesmo turno.
    let ladoLadrao = ehAliado ? "j1" : "j2";
    if (typeof ladraoUsosPorLado !== 'undefined' && ladraoUsosPorLado[ladoLadrao] >= 1) {
        return narrar("❌ A passiva do Ladrão já foi usada neste turno! Só dá pra usar de novo no próximo.");
    }

    // 🩹 CORREÇÃO: era 'ladroesQueJaRoubaram[idUnico]' — uma trava que nunca era resetada
    // e travava a passiva pro resto do jogo depois do 1º uso. Passiva é "usa quando quiser",
    // então só bloqueamos se já tiver um roubo NESTE EXATO MOMENTO aguardando alvo.
    if (modoLadrao) {
        return narrar("❌ Já tem um roubo do Ladrão em andamento! Escolha o alvo antes de usar de novo.");
    }

    if (typeof ladraoUsosPorLado !== 'undefined') ladraoUsosPorLado[ladoLadrao]++;

    let dadoTela = document.getElementById("dado-tela");
    let resultadoDado = Math.floor(Math.random() * 6) + 1;

    dadoTela.style.animation = 'none';
    setTimeout(() => dadoTela.style.animation = '', 10);
    dadoTela.innerText = "🎲 " + resultadoDado;

    if (resultadoDado === 1 || resultadoDado === 3) {
        modoLadrao = true;
        faseLadrao = 1;
        tipoRouboLadrao = "vida";
        narrar(`💰 Ladrão tirou ${resultadoDado}! Clique em uma carta INIMIGA do campo para roubar 1 de VIDA.`);
    } else if (resultadoDado === 4 || resultadoDado === 6) {
        modoLadrao = true;
        faseLadrao = 1;
        tipoRouboLadrao = "dano";
        narrar(`💰 Ladrão tirou ${resultadoDado}! Clique em uma carta INIMIGA do campo para roubar 1 de DANO.`);
    } else {
        narrar(`❌ O Ladrão rolou ${resultadoDado}. O plano de roubo falhou e a chance foi gasta!`);
    }
}

function aplicarRouboPrejuizo(idPacoteAlvo) {
    let idPuro = idPacoteAlvo.replace("pacote-", "");
    
    if (tipoRouboLadrao === "vida") {
        let txtVida = document.getElementById("vida-" + idPuro);
        let vidaAtual = parseFloat(txtVida.innerText);
        // 🩹 CORREÇÃO: nunca deixa a vida mostrar número negativo — trava em 0.
        txtVida.innerText = Math.max(0, vidaAtual - 1);

        // 🚨 NOVO EFEITO AQUI: Coração partido caindo da carta alvo!
        mostrarEfeitoPerdaVida(idPuro);
        
        narrar("💰 Alvo surrupiado! Agora clique em uma carta SUA na arena para entregar +1 de VIDA.");
        
        if (vidaAtual - 1 <= 0) {
            let pacote = document.getElementById(idPacoteAlvo);
            let nomeExibido = pacote.querySelector(".nome-carta").innerText;
            let nomeDestaCarta = (typeof obterNomeEfetivoCarta === "function")
                ? obterNomeEfetivoCarta(idPuro, nomeExibido)
                : nomeExibido;
            let campoAlvo = pacote.closest("#campo-j2") ? "campo-j2" : "campo-j1";
            if (typeof registrarMorte === "function") registrarMorte(nomeDestaCarta, campoAlvo === "campo-j2" ? "j2" : "j1");
            pacote.remove();
            if (typeof ativarPassivasAoMorrer === "function") {
                ativarPassivasAoMorrer(
                    nomeDestaCarta,
                    idPuro,
                    campoAlvo,
                    undefined,
                    "O Barril morreu devido ao roubo!"
                );
            }
        }
    } else if (tipoRouboLadrao === "dano") {
        let txtDano = document.getElementById("dano-" + idPuro);
        let danoAtual = parseFloat(txtDano.innerText);
        txtDano.innerText = Math.max(0, danoAtual - 1); 

        // 🚨 EFEITO AQUI: A espada cai na carta que sofreu o roubo!
        mostrarEfeitoPerdaAtaque(idPuro);

        narrar("💰 Alvo surrupiado! Agora clique em uma carta SUA na arena para entregar +1 de DANO.");
    }
    
    faseLadrao = 2; 

    atualizarTodosUnidoes();
}

function aplicarRouboBeneficio(idPacoteAliado) {
    let idPuro = idPacoteAliado.replace("pacote-", "");
    let nomeCarta = document.getElementById(idPacoteAliado).querySelector(".nome-carta").innerText;
    
    if (tipoRouboLadrao === "vida") {
        let txtVida = document.getElementById("vida-" + idPuro);
        let vidaAtual = parseFloat(txtVida.innerText);
        txtVida.innerText = vidaAtual + 1;

// 🚨 EFEITO DE VIDA AQUI: Sobe 1 coração só, pois ganhou pouca vida
        mostrarEfeitoVida(idPuro, "ganhou");

        narrar(`💰 Sucesso total! +1 de VIDA transferido para ${nomeCarta}. Agora você pode Atacar ou Curar!`);
    } else if (tipoRouboLadrao === "dano") {
        let txtDano = document.getElementById("dano-" + idPuro);
        let danoAtual = parseFloat(txtDano.innerText);
        txtDano.innerText = danoAtual + 1;

        // 🚨 EFEITO AQUI: Sobe a espadinha!
    mostrarEfeitoAtaque(idPuro);

        narrar(`💰 Sucesso total! +1 de DANO transferido para ${nomeCarta}. Agora você pode Atacar ou Curar!`);
    }

    modoLadrao = false;
    faseLadrao = 0;
    tipoRouboLadrao = "";

    atualizarTodosUnidoes();
}
function aplicarRouboDanoGoblin(idPacoteAlvo) {
    let pacoteClicado = document.getElementById(idPacoteAlvo);
    if (!pacoteClicado || !idGoblinLadrao) return;

    let pacoteGoblin = document.getElementById("pacote-" + idGoblinLadrao);
    if (!pacoteGoblin) {
        modoRouboGoblin = false;
        idGoblinLadrao = null;
        faseRouboGoblin = 1;
        return;
    }

    // O "lado" do Goblin decide quem é inimigo e quem é aliado nesta habilidade —
    // assim funciona certo tanto se for o SEU Goblin quanto o do oponente.
    let goblinEhJ1 = pacoteGoblin.closest("#campo-j1") !== null;
    let cliqueEhJ1 = pacoteClicado.closest("#campo-j1") !== null;
    let idPuroClicado = idPacoteAlvo.replace("pacote-", "");

    // --- FASE 1: escolher a carta INIMIGA que perde 1 de dano ---
    if (faseRouboGoblin === 1) {
        if (cliqueEhJ1 === goblinEhJ1) {
            return narrar("❌ Alvo inválido! Clique numa carta INIMIGA na arena para roubar 1 de DANO.");
        }

        let txtDanoAlvo = document.getElementById("dano-" + idPuroClicado);
        if (!txtDanoAlvo) return;
        let danoAtualAlvo = parseFloat(txtDanoAlvo.innerText);

        if (danoAtualAlvo <= 0) {
            narrar("Essa carta já tem 0 de dano! O Goblin não conseguiu roubar nada.");
            modoRouboGoblin = false;
            idGoblinLadrao = null;
            faseRouboGoblin = 1;
            if (typeof atualizarTodosUnidoes === "function") atualizarTodosUnidoes();
            return;
        }

        txtDanoAlvo.innerText = danoAtualAlvo - 1;
        mostrarEfeitoPerdaAtaque(idPuroClicado);

        faseRouboGoblin = 2; // agora espera o clique na carta aliada que vai receber
        narrar("💰 Roubou 1 de dano! Agora clique numa carta ALIADA (do time do Goblin) para entregar o ponto roubado.");
        return; // continua com modoRouboGoblin === true, esperando a 2ª escolha
    }

    // --- FASE 2: escolher a carta ALIADA (do time do Goblin) que recebe o dano roubado ---
    if (cliqueEhJ1 !== goblinEhJ1) {
        return narrar("❌ Alvo inválido! Escolha uma carta do TIME DO GOBLIN para receber o dano roubado.");
    }

    let txtDanoReceptor = document.getElementById("dano-" + idPuroClicado);
    if (txtDanoReceptor) {
        txtDanoReceptor.innerText = parseFloat(txtDanoReceptor.innerText) + 1;
        mostrarEfeitoAtaque(idPuroClicado);
    }

    narrar("💰 Roubo concluído! O ponto de dano foi entregue à carta escolhida!");

    modoRouboGoblin = false;
    idGoblinLadrao = null;
    faseRouboGoblin = 1;

    if (typeof atualizarTodosUnidoes === "function") atualizarTodosUnidoes();
}

function usarPassivaCtrlC(idUnico, botao) {
    let pacote = document.getElementById("pacote-" + idUnico);
    if (!pacote) return;
    let ehAliado = pacote.classList.contains("carta-aliada");
    
    let nomeDaCartaAtual = pacote.querySelector(".nome-carta").innerText; 
    let cartaAlvo = ehAliado ? ultimaCartaOponente : ultimaCartaJogador;
    
    if (!cartaAlvo) {
        return narrar("Nenhuma carta válida foi jogada pelo oponente ainda para ser copiada!");
    }
    
    let novaVida = Math.max(1, cartaAlvo.vida - 1);
    let novoDano = Math.max(1, cartaAlvo.dano - 1);
    
    document.getElementById("vida-" + idUnico).innerText = novaVida;
    document.getElementById("dano-" + idUnico).innerText = novoDano;
    
    ctrlV[idUnico] = {
        nomeOriginal: cartaAlvo.nome,
        ehAliado: ehAliado
    };
    
    narrar(`📋 Cópia concluída! Seu ${nomeDaCartaAtual} copiou [${cartaAlvo.nome}] com atributos reduzidos em 1.`);
    // Passivas de entrada/ciclo precisam ser ligadas no momento da cópia, pois o Ctrl já
    // estava no campo quando ganhou a nova identidade.
    if (cartaAlvo.nome === "Necromante") {
        narrar(`✨ PASSIVA COPIADA! O ${nomeDaCartaAtual} forçou a magia do Necromante e invocou 2 tropas da sua mão!`);
        verificarPassivaNecromante({nome: "Necromante", passivaAtivada: false}, ehAliado);
    }
    if (cartaAlvo.nome === "Cavalo de Tróia") {
        cavalosDeTroiaAtivos[idUnico] = 4;
        narrar(`🐴 PASSIVA COPIADA! O ${nomeDaCartaAtual} vai se abrir em 2 rodadas e causar 1 de dano em todas as cartas inimigas.`);
    }
    if (cartaAlvo.nome === "Portable") {
        portableDuracao[idUnico] = 4;
        narrar(`🛸 PASSIVA COPIADA! Por 2 rodadas, o ${nomeDaCartaAtual} atacará junto das outras cartas do seu time.`);
    }
    if (cartaAlvo.nome === "Separado" || cartaAlvo.nome === "Separadois") {
        let lado = ehAliado ? "j1" : "j2";
        let classe = ehAliado ? "carta-aliada" : "carta-inimiga";
        let outrosAliados = Array.from(document.getElementById("campo-" + lado).getElementsByClassName(classe))
            .filter(p => p.id !== "pacote-" + idUnico);
        if (outrosAliados.length > 0) {
            modoParceriaSeparado = true;
            idSeparadoParceriaAtivo = idUnico;
            narrar(`👥 PASSIVA COPIADA! Escolha outra carta do mesmo time para formar a parceria do ${nomeDaCartaAtual}.`);
        }
    }
    
    let divAcoes = pacote.querySelector("div[id^='acoes-']");
    
    let botaoAtaque;
    if (cartaAlvo.nome === "Incendiário") {
        botaoAtaque = `<button class="btn-polvora-incendiario" onclick="iniciarAtaqueIncendiario('${idUnico}', ${!ehAliado})" style="padding: 5px; background-color: #b34700; color: white; width: 100%; margin-bottom: 2px; cursor: pointer;">Jogar Pólvora 🔥</button>`;
        narrar(`🔥 PASSIVA COPIADA! O ${nomeDaCartaAtual} agora pode jogar pólvora e seguir o ciclo do Incendiário.`);
    } else {
        botaoAtaque = ehAliado ?
            `<button onclick="iniciarAtaque('${cartaAlvo.nome}', '${idUnico}')" style="padding: 5px; width: 100%; margin-bottom: 2px; cursor: pointer;">Atacar ⚔️</button>` :
            `<button onclick="inimigoAtacar('${idUnico}')" style="padding: 5px; background-color: darkred; color: white; width: 100%; margin-bottom: 2px; cursor: pointer;">Atacar ⚔️</button>`;
    }
    
    let btnEspecial = `<button onclick="usarHabilidade('${nomeDaCartaAtual}', '${idUnico}', this)" style="background-color: purple; color: white; width: 100%; margin-bottom: 2px; cursor: pointer;">Especial 🔮</button>`;
    
    let botoesExtras = [];
    if (cartaAlvo.nome === "Curandeiro") {
        botoesExtras.push(ehAliado ?
            `<button onclick="iniciarCura('${idUnico}')" style="background-color: green; color: white; width: 100%; margin-bottom: 2px; cursor: pointer;">Curar 💚</button>` : 
            `<button onclick="iniciarCuraInimigo('${idUnico}')" style="background-color: green; color: white; width: 100%; margin-bottom: 2px; cursor: pointer;">Curar Oponente 💚</button>`);
    }
    if (cartaAlvo.nome === "Ladrão") {
        botoesExtras.push(`<button onclick="usarPassivaLadrao('${idUnico}', this)" style="background-color: gold; font-weight: bold; width: 100%; margin-bottom: 2px; cursor: pointer;">Passiva 💰</button>`);
    }
    if (cartaAlvo.nome === "Separado" || cartaAlvo.nome === "Separadois") {
        botoesExtras.push(`<button onclick="trocarParceiroSeparado('${idUnico}', ${ehAliado})" style="background-color: #16a085; color: white; width: 100%; margin-bottom: 2px; cursor: pointer;">Trocar Parceiro 👥</button>`);
    }
    if (cartaAlvo.nome === "Viajante do Tempo") {
        botoesExtras.push(`<button onclick="usarPassivaViajante('${idUnico}', this)" style="background-color: #8e44ad; color: white; width: 100%; margin-bottom: 2px; cursor: pointer;">Viajar no Tempo ⏳</button>`);
    }

    divAcoes.innerHTML = `
        ${botaoAtaque}
        ${btnEspecial}
        ${botoesExtras.join("")}
    `;

    // 🩹 CORREÇÃO: faltava recalcular o bônus do Unidão na hora — sem isso, um Ctrl C que
    // acabou de copiar o Unidão ficava com o dano errado até alguma OUTRA ação disparar
    // atualizarTodosUnidoes() por conta própria.
    if (typeof atualizarTodosUnidoes === "function") atualizarTodosUnidoes();
}
