/* ==========================================================================
   BOT.JS — IA do Oponente (Jogador 2)
   --------------------------------------------------------------------------
   Este arquivo NÃO modifica main.js/habilidades.js/cartas.js.
   Ele só "escuta" quando o turno vira do Oponente (turnoAtivo === 2) e
   chama exatamente as mesmas funções que um clique do mouse chamaria.

   Pra jogar SEM o bot: não inclua esta tag <script> no index.html.
   Pra jogar COM o bot: inclua <script src="bot.js"></script> depois de main.js.
   ========================================================================== */

(function () {
    const BOT_DELAY_ACAO = 3000;   // pausa entre ações do bot (ms) — dá tempo de clicar no seu Especial
    const BOT_DELAY_INICIO = 2400; // pausa antes do bot começar a jogar no turno dele
    const MAX_ACOES_POR_TURNO = 40; // trava de segurança contra loop infinito

    let botJogando = false;
    let acoesNesteTurno = 0;

    // -------------------------------------------------------------------
    // UTILITÁRIOS DE LEITURA DO TABULEIRO
    // -------------------------------------------------------------------
    function estaVezDoBot() {
        return typeof turnoAtivo !== "undefined" && turnoAtivo === 2 &&
               typeof jogoIniciado !== "undefined" && jogoIniciado === true;
    }

    function idsNoContainer(containerId, classe) {
        let el = document.getElementById(containerId);
        if (!el) return [];
        return Array.from(el.getElementsByClassName(classe))
            .map(c => c.id.replace("pacote-", ""))
            // 🐴 O Cavalo de Tróia não pode ser atacado (nem escolhido como alvo de nada) —
            // tirando ele daqui de uma vez, nenhuma lógica do bot chega perto de tentar mirar nele.
            .filter(idUnico => nomeDaCarta(idUnico) !== "Cavalo de Tróia");
    }

    function idsNaMao(maoId) {
        let mao = document.getElementById(maoId);
        if (!mao) return [];
        return Array.from(mao.children)
            .filter(el => el.id && el.id.startsWith("pacote-"))
            .map(el => el.id.replace("pacote-", ""));
    }

    function nomeDaCarta(idUnico) {
        let el = document.querySelector('#pacote-' + cssEscape(idUnico) + ' .nome-carta');
        return el ? el.innerText.trim() : "";
    }

    function vidaDaCarta(idUnico) {
        let el = document.getElementById("vida-" + idUnico);
        return el ? parseFloat(el.innerText) : null;
    }

    function danoDaCarta(idUnico) {
        let el = document.getElementById("dano-" + idUnico);
        return el ? parseFloat(el.innerText) : null;
    }

    function estaCongelada(idUnico) {
        let el = document.getElementById("pacote-" + idUnico);
        return el ? el.classList.contains("congelada") : false;
    }

    function cssEscape(str) {
        return (window.CSS && CSS.escape) ? CSS.escape(str) : str.replace(/([^\w-])/g, '\\$1');
    }

    // Acha o id "base" (do bancoDeCartas) a partir do id único de uma instância.
    // Não dá pra usar split("_")[0] ingenuamente porque alguns ids-base já têm "_"
    // (ex: "escudo_item"), e tokens gerados em runtime (ex: "necro_xxxx") não batem
    // com nenhum id-base — nesse caso retornamos null de propósito (tratado como tropa).
    function idBaseDaCarta(idCarta) {
        if (typeof bancoDeCartas === "undefined") return null;
        let candidatos = bancoDeCartas
            .map(c => c.id)
            .filter(id => idCarta === id || idCarta.startsWith(id + "_") || idCarta.startsWith(id + "-"));
        if (candidatos.length === 0) return null;
        return candidatos.reduce((a, b) => (b.length > a.length ? b : a));
    }

    // Simula o clique na IMAGEM de uma carta.
    // Se a carta JÁ foi jogada uma vez, ela tem um onclick "de batalha" anexado
    // (é isso que checa suporte/traição/gelo/ataque pendente) — precisamos disparar
    // ESSE handler, não a função de "jogar carta da mão" de novo.
    function simularCliqueImagem(idUnico) {
        let el = document.getElementById("pacote-" + idUnico);
        if (!el) return false;
        let img = el.querySelector("img");
        if (!img) return false;
        try {
            if (typeof img.onclick === "function") {
                img.onclick(); // dispara o handler de batalha já anexado à carta
            } else {
                // Carta ainda não foi jogada nenhuma vez (só acontece pra alvo ainda na mão)
                let ehJ1 = el.closest("#campo-j1") !== null || el.closest("#mao-j1") !== null;
                if (ehJ1) jogarCarta("pacote-" + idUnico);
                else jogarCartaInimigo("pacote-" + idUnico);
            }
        } catch (e) {
            console.warn("[BOT] erro ao simular clique em", idUnico, e);
        }
        return true;
    }

    // -------------------------------------------------------------------
    // HEURÍSTICAS DE ESCOLHA DE ALVO
    // -------------------------------------------------------------------
    function maiorAmeaca(ids) {
        return ids.reduce((melhor, id) => {
            let d = danoDaCarta(id) || 0;
            let melhorD = melhor !== null ? (danoDaCarta(melhor) || 0) : -1;
            return d > melhorD ? id : melhor;
        }, null);
    }

    function alvoMaisFragil(ids) {
        return ids.reduce((melhor, id) => {
            let v = vidaDaCarta(id);
            if (v === null) return melhor;
            let melhorV = melhor !== null ? vidaDaCarta(melhor) : Infinity;
            return v < melhorV ? id : melhor;
        }, null);
    }

    function aliadoMaisFerido(ids) {
        return alvoMaisFragil(ids); // mesma lógica: quem tem menos vida precisa mais de cura
    }

    // -------------------------------------------------------------------
    // FASE 1 — RESOLVER QUALQUER ESCOLHA DE ALVO PENDENTE
    // (suporte engatilhado, traição em andamento, gelo, barril, ataque aguardando alvo)
    // -------------------------------------------------------------------
    function botResolverEscolhaPendente() {
        // --- Suporte/poção engatilhado (Besta, Velux, Adiv, Recuperida, Traição-passo1) ---
        if (typeof suportePreparado !== "undefined" && suportePreparado !== null) {
            let tipo = suportePreparado;
            let ofensivo = (tipo === "Adiv" || tipo === "Traicao");
            let candidatos = ofensivo
                ? idsNoContainer("campo-j1", "carta-aliada")
                : idsNoContainer("campo-j2", "carta-inimiga");
            if (candidatos.length === 0) return false;

            let alvo;
            if (tipo === "Adiv") alvo = alvoMaisFragil(candidatos);
            else if (tipo === "Traicao") alvo = maiorAmeaca(candidatos);
            else if (tipo === "Recuperida") alvo = aliadoMaisFerido(candidatos);
            else if (tipo === "Besta") {
                let arqueiro = candidatos.find(id => nomeDaCarta(id) === "Arqueiro");
                alvo = arqueiro || maiorAmeaca(candidatos);
            } else alvo = maiorAmeaca(candidatos); // Velux e afins

            if (!alvo) return false;
            simularCliqueImagem(alvo);
            return true;
        }

        // --- Traição já com traidor escolhido, falta escolher o parceiro-vítima ---
        if (typeof modoTraicao !== "undefined" && modoTraicao === true) {
            let traidorEl = document.getElementById("pacote-" + idTraidor);
            if (!traidorEl) return false;
            let ehJ1 = traidorEl.closest("#campo-j1") !== null;
            let candidatos = idsNoContainer(ehJ1 ? "campo-j1" : "campo-j2", ehJ1 ? "carta-aliada" : "carta-inimiga")
                .filter(id => id !== idTraidor);
            if (candidatos.length === 0) return false;
            simularCliqueImagem(maiorAmeaca(candidatos));
            return true;
        }

        // --- Poção de Gelo (alvo simples) aguardando escolha ---
        if (typeof modoGeloSimples !== "undefined" && modoGeloSimples === true) {
            let pocao = document.getElementById("pacote-" + idPocaoAtiva);
            let jogadaPeloBot = pocao && pocao.parentElement && pocao.parentElement.id.includes("j2");
            // Observação: mirar em cartas ainda na MÃO do adversário não funciona corretamente
            // no jogo hoje (a carta nunca foi "jogada", então não tem o clique de batalha anexado).
            // Por segurança, o bot só mira cartas que já estão em CAMPO.
            let candidatos = jogadaPeloBot
                ? idsNoContainer("campo-j1", "carta-aliada")
                : idsNoContainer("campo-j2", "carta-inimiga");
            if (candidatos.length === 0) return false;
            simularCliqueImagem(maiorAmeaca(candidatos));
            return true;
        }

        // --- Barril de Goblin aguardando alvo ---
        if (typeof modoAlvoBarril !== "undefined" && modoAlvoBarril === true) {
            let barrilEl = document.getElementById("pacote-" + idBarrilAtivo);
            if (!barrilEl) return false;
            let ehJ1 = barrilEl.closest("#campo-j1") !== null;
            let candidatos = idsNoContainer(ehJ1 ? "campo-j2" : "campo-j1", ehJ1 ? "carta-inimiga" : "carta-aliada");
            if (candidatos.length === 0) return false;
            simularCliqueImagem(maiorAmeaca(candidatos));
            return true;
        }

        // --- Barril de Bárbaro (impacto) do lado do bot aguardando alvo ---
        if (typeof modoAlvoBarrilBarbaroInimigo !== "undefined" && modoAlvoBarrilBarbaroInimigo === true) {
            let candidatos = idsNoContainer("campo-j1", "carta-aliada");
            if (candidatos.length === 0) return false;
            simularCliqueImagem(maiorAmeaca(candidatos));
            return true;
        }

        // --- Cavaleiro das Trevas do bot aguardando o alvo principal (vizinhos levam junto) ---
        if (typeof modoAlvoCavaleiroInimigo !== "undefined" && modoAlvoCavaleiroInimigo === true) {
            let candidatos = idsNoContainer("campo-j1", "carta-aliada");
            if (candidatos.length === 0) return false;
            // Foca a maior ameaça: ela e os vizinhos dela vão levar o dano em área.
            simularCliqueImagem(maiorAmeaca(candidatos));
            return true;
        }

        // --- 👥 Separado/Separadois do bot aguardando escolha de parceira ---
        if (typeof modoParceriaSeparado !== "undefined" && modoParceriaSeparado === true) {
            let candidatos = idsNoContainer("campo-j2", "carta-inimiga")
                .filter(id => "pacote-" + id !== "pacote-" + idSeparadoParceriaAtivo);
            if (candidatos.length === 0) return false;
            simularCliqueImagem(maiorAmeaca(candidatos));
            return true;
        }

        // --- 💚 Curandeiro do bot aguardando escolha de quem curar (prioriza o mais ferido) ---
        if (typeof modoCuraInimigo !== "undefined" && modoCuraInimigo === true) {
            let candidatos = idsNoContainer("campo-j2", "carta-inimiga");
            if (candidatos.length === 0) return false;
            simularCliqueImagem(aliadoMaisFerido(candidatos));
            return true;
        }

        // --- 🩸 Goblin do bot aguardando escolha de quem roubar dano ---
        if (typeof modoRouboGoblin !== "undefined" && modoRouboGoblin === true) {
            let candidatos = idsNoContainer("campo-j1", "carta-aliada");
            if (candidatos.length === 0) return false;
            simularCliqueImagem(maiorAmeaca(candidatos));
            return true;
        }

        // --- 🎨 Ícaro do bot aguardando alvo (mira a maior ameaça do time do jogador) ---
        if (typeof modoTransformacaoIcaro !== "undefined" && modoTransformacaoIcaro === true) {
            let candidatos = idsNoContainer("campo-j1", "carta-aliada");
            if (candidatos.length === 0) return false;
            simularCliqueImagem(maiorAmeaca(candidatos));
            return true;
        }

        // --- ⚖️ Thiago do bot aguardando alvo (enfraquece a maior ameaça do jogador) ---
        if (typeof modoAjusteThiago !== "undefined" && modoAjusteThiago === true) {
            let candidatos = idsNoContainer("campo-j1", "carta-aliada");
            if (candidatos.length === 0) return false;
            simularCliqueImagem(maiorAmeaca(candidatos));
            return true;
        }

        // --- ⏳ Viajante do Tempo do bot aguardando escolha de quem prender ---
        if (typeof modoPrenderNoTempo !== "undefined" && modoPrenderNoTempo === true) {
            let vjEl = document.getElementById("pacote-" + idPrenderNoTempoAtivo);
            if (!vjEl) return false;
            let ehJ1 = vjEl.closest("#campo-j1") !== null;
            let candidatos = idsNoContainer(ehJ1 ? "campo-j2" : "campo-j1", ehJ1 ? "carta-inimiga" : "carta-aliada");
            if (candidatos.length === 0) return false;
            simularCliqueImagem(maiorAmeaca(candidatos));
            return true;
        }

        // --- 🔮 Bruxo do bot aguardando escolha de alvo (transformar ou roubar) ---
        if ((typeof modoBruxoTransformar !== "undefined" && modoBruxoTransformar === true) ||
            (typeof modoBruxoRoubar !== "undefined" && modoBruxoRoubar === true)) {
            let bxEl = document.getElementById("pacote-" + idBruxoAtivo);
            if (!bxEl) return false;
            let ehJ1 = bxEl.closest("#campo-j1") !== null;
            let candidatos = idsNoContainer(ehJ1 ? "campo-j2" : "campo-j1", ehJ1 ? "carta-inimiga" : "carta-aliada");
            if (candidatos.length === 0) return false;
            simularCliqueImagem(maiorAmeaca(candidatos));
            return true;
        }

        // --- 🛡️ Barril do bot aguardando escolha de quem proteger (protege o mais frágil) ---
        if (typeof modoProtecaoBarrilInimigo !== "undefined" && modoProtecaoBarrilInimigo === true) {
            let candidatos = idsNoContainer("campo-j2", "carta-inimiga")
                .filter(id => id !== idBarrilProtetor);
            if (candidatos.length === 0) return false;
            simularCliqueImagem(alvoMaisFragil(candidatos));
            return true;
        }

        // --- 📦 Barril de Goblin: Especial usado ANTES de atacar, aguardando alvo ---
        if (typeof modoEspecialBarrilGoblin !== "undefined" && modoEspecialBarrilGoblin === true) {
            let barrilEl = document.getElementById("pacote-" + idBarrilAtivo);
            if (!barrilEl) return false;
            let ehJ1 = barrilEl.closest("#campo-j1") !== null;
            let candidatos = idsNoContainer(ehJ1 ? "campo-j2" : "campo-j1", ehJ1 ? "carta-inimiga" : "carta-aliada");
            if (candidatos.length === 0) return false;
            simularCliqueImagem(maiorAmeaca(candidatos));
            return true;
        }

        // --- 🪃 Bumerskeleton: Especial usado ANTES de atacar, aguardando alvo ---
        if (typeof modoEspecialBumerskeleton !== "undefined" && modoEspecialBumerskeleton === true) {
            let bumeEl = document.getElementById("pacote-" + idBumerskeletonEspecialAtivo);
            if (!bumeEl) return false;
            let ehJ1 = bumeEl.closest("#campo-j1") !== null;
            let candidatos = idsNoContainer(ehJ1 ? "campo-j2" : "campo-j1", ehJ1 ? "carta-inimiga" : "carta-aliada");
            if (candidatos.length === 0) return false;
            simularCliqueImagem(maiorAmeaca(candidatos));
            return true;
        }

        // --- Ataque do bot aguardando escolha de alvo (mais de 1 carta no seu campo) ---
        if (typeof modoAtaqueInimigo !== "undefined" && modoAtaqueInimigo === true) {
            let candidatos = idsNoContainer("campo-j1", "carta-aliada");
            if (candidatos.length === 0) return false;
            // prioriza finalizar quem já está fraco; senão ataca a maior ameaça
            let matavel = candidatos.filter(id => {
                let v = vidaDaCarta(id);
                return v !== null && typeof danoInimigoPreparado !== "undefined" && v <= danoInimigoPreparado;
            });
            let alvo = matavel.length > 0 ? maiorAmeaca(matavel) : alvoMaisFragil(candidatos);

            // 🛡️ Se o alvo escolhido estiver protegido por um Barril, o jogo OBRIGA a atacar
            // o Barril protetor primeiro (senão o ataque é recusado e o bot fica preso
            // tentando o mesmo alvo pra sempre). Redireciona pro Barril, se ele ainda existir.
            if (typeof cartasProtegidas !== "undefined" && cartasProtegidas[alvo]) {
                let idBarrilProtetor = cartasProtegidas[alvo];
                let barrilAindaExiste = document.getElementById("pacote-" + idBarrilProtetor);
                alvo = barrilAindaExiste ? idBarrilProtetor : alvo;
            }

            simularCliqueImagem(alvo);
            return true;
        }

        return false;
    }

    // -------------------------------------------------------------------
    // FASE 2 — JOGAR CARTAS DA MÃO (ações livres, não custam o turno)
    // -------------------------------------------------------------------
    function suporteTemAlvoDisponivel(nomeCarta) {
        let nome = nomeCarta.toLowerCase();
        // Adiv e Traição só podem mirar em cartas que já estejam no CAMPO do jogador —
        // se o campo dele ainda estiver vazio (ex: turno 1, bot começando), não tem alvo ainda.
        if (nome.includes("adiv") || nome.includes("traição") || nome.includes("traicao")) {
            return idsNoContainer("campo-j1", "carta-aliada").length > 0;
        }
        // Gelo Simples (quando não cai 5) também só congela cartas em CAMPO — ver nota em
        // botResolverEscolhaPendente. A nevasca (dado 5) não precisa de alvo, então tentar
        // vale a pena mesmo com o campo vazio (1/6 de chance por tentativa de vir a calhar,
        // mas evitamos a espera desnecessária se já sabemos que não tem alvo em campo).
        if (nome.includes("gelo")) {
            return idsNoContainer("campo-j1", "carta-aliada").length > 0;
        }
        return true; // demais suportes (Besta/Velux/Recuperida) sempre têm alvo válido nesta altura
    }

    function cartaEstaFatigada(idUnico) {
        // Tokens do Necromante ficam bloqueados por algumas rodadas antes de poderem ser jogados
        return typeof bloqueioNecro !== "undefined" && bloqueioNecro[idUnico] && bloqueioNecro[idUnico] > 0;
    }

    function botJogarCartasDaMao() {
        let idsMao = idsNaMao("mao-j2").filter(id => !cartaEstaFatigada(id));
        if (idsMao.length === 0) return false;

        // Prioriza colocar TROPAS em campo primeiro (presença no tabuleiro é quase sempre bom)
        let candidatosSuporte = [];
        for (let idCarta of idsMao) {
            let idBase = idBaseDaCarta(idCarta);
            let info = (typeof bancoDeCartas !== "undefined" && idBase) ? bancoDeCartas.find(c => c.id === idBase) : null;
            let ehSuporte = info && typeof suportesReais !== "undefined" && suportesReais.includes(info.id);
            if (!ehSuporte) {
                jogarCartaInimigo("pacote-" + idCarta);
                return true;
            }
            candidatosSuporte.push(idCarta);
        }

        // Só sobraram suportes/poções na mão — joga o primeiro que já tenha alvo válido agora
        for (let idCarta of candidatosSuporte) {
            let nome = nomeDaCarta(idCarta);
            if (suporteTemAlvoDisponivel(nome)) {
                jogarCartaInimigo("pacote-" + idCarta);
                return true;
            }
        }
        // Nenhum suporte restante tem alvo válido ainda (ex: Adiv/Traição sem campo do jogador
        // ocupado) — segura na mão por enquanto, tenta de novo em turnos futuros.
        return false;
    }

    // -------------------------------------------------------------------
    // FASE 2.5 — INCENDIÁRIO (acende a pólvora assim que houver alvo na arena)
    // -------------------------------------------------------------------
    function botIncendiario() {
        let parados = idsNoContainer("campo-j2", "carta-inimiga")
            .filter(id => nomeDaCarta(id) === "Incendiário")
            .filter(id => typeof incendiarioCiclo !== "undefined" && incendiarioCiclo[id] === undefined);
        if (parados.length === 0) return false;

        let inimigosNoCampo = idsNoContainer("campo-j1", "carta-aliada");
        if (inimigosNoCampo.length === 0) return false; // ainda sem alvo, bot espera

        try {
            iniciarAtaqueIncendiario(parados[0], true);
        } catch (e) {
            console.warn("[BOT] erro ao acender o Incendiário:", e);
            return false;
        }
        return true;
    }

    // -------------------------------------------------------------------
    // FASE 2.7 — USAR ESPECIAIS (o bot clica no botão "Especial 🔮" das
    // próprias cartas que ainda não usaram; a maioria não gasta o turno, e
    // qualquer alvo que precisem escolher é resolvido no próximo ciclo por
    // botResolverEscolhaPendente). Cura é a exceção: ela ENCERRA o turno,
    // então só vale a pena quando tem alguém realmente ferido pra curar.
    // -------------------------------------------------------------------
    function botUsarEspeciais() {
        let candidatos = idsNoContainer("campo-j2", "carta-inimiga").filter(id => {
            let btn = document.querySelector('#pacote-' + cssEscape(id) + ' button[onclick*="usarHabilidade"]');
            return btn && btn.style.display !== "none";
        });
        if (candidatos.length === 0) return false;

        for (let id of candidatos) {
            let nome = nomeDaCarta(id);
            let btn = document.querySelector('#pacote-' + cssEscape(id) + ' button[onclick*="usarHabilidade"]');
            if (!btn) continue;

            // 💚 Curandeiro: só vale usar (e encerrar o turno) se alguém do time estiver ferido.
            if (nome === "Curandeiro") {
                let aliados = idsNoContainer("campo-j2", "carta-inimiga").filter(outroId => outroId !== id);
                let algumFerido = aliados.some(outroId => {
                    let idBase = idBaseDaCarta(outroId);
                    let info = (typeof bancoDeCartas !== "undefined" && idBase) ? bancoDeCartas.find(c => c.id === idBase) : null;
                    let vidaMax = info ? info.vida : null;
                    let vidaAtual = vidaDaCarta(outroId);
                    return vidaMax !== null && vidaAtual !== null && vidaAtual < vidaMax;
                });
                if (!algumFerido) continue; // guarda a cura pra quando fizer falta de verdade
            }

            try {
                usarHabilidade(nome, id, btn);
            } catch (e) {
                console.warn("[BOT] erro ao usar Especial de", nome, e);
                continue;
            }
            return true; // uma ação por ciclo — dá tempo do "modo" pendente ser resolvido depois
        }
        return false;
    }

    // -------------------------------------------------------------------
    // FASE 3 — ATACAR (só UMA ação de ataque encerra o turno)
    // -------------------------------------------------------------------
    function botAtacar() {
        let tropasProntas = idsNoContainer("campo-j2", "carta-inimiga")
            .filter(id => !estaCongelada(id))
            // 👥 Separado/Separadois com parceira viva não ataca pelo próprio botão — só
            // quando a parceira ataca. Tirando eles daqui, o bot nunca tenta usá-los como
            // atacante principal (senão o clique é recusado e o bot trava sem passar a vez).
            .filter(id => {
                if (typeof parceriaSeparado === "undefined") return true;
                let nome = nomeDaCarta(id);
                if (nome !== "Separado" && nome !== "Separadois") return true;
                let idParceira = parceriaSeparado[id];
                return !(idParceira && document.getElementById("pacote-" + idParceira));
            });
        if (tropasProntas.length === 0) return false;

        let inimigosNoCampo = idsNoContainer("campo-j1", "carta-aliada");
        if (inimigosNoCampo.length === 0) return false; // ninguém pra atacar ainda

        // Prioriza a tropa que consegue MATAR alguém agora
        let melhorEscolha = null;
        for (let idTropa of tropasProntas) {
            let dano = danoDaCarta(idTropa) || 0;
            let podeMatar = inimigosNoCampo.some(idAlvo => {
                let v = vidaDaCarta(idAlvo);
                return v !== null && v <= dano;
            });
            if (podeMatar) { melhorEscolha = idTropa; break; }
        }
        // Senão, ataca com a tropa de maior dano
        if (!melhorEscolha) melhorEscolha = maiorAmeaca(tropasProntas) || tropasProntas[0];

        try {
            inimigoAtacar(melhorEscolha);
        } catch (e) {
            console.warn("[BOT] erro ao atacar com", melhorEscolha, e);
            return false;
        }
        return true;
    }

    // -------------------------------------------------------------------
    // LOOP PRINCIPAL DO TURNO DO BOT
    // -------------------------------------------------------------------
    function botCicloDeTurno() {
        if (!estaVezDoBot()) { botJogando = false; acoesNesteTurno = 0; return; }

        acoesNesteTurno++;
        if (acoesNesteTurno > MAX_ACOES_POR_TURNO) {
            console.warn("[BOT] limite de ações atingido, forçando passar o turno.");
            try { passarTurno(); } catch (e) { /* nada a fazer */ }
            botJogando = false; acoesNesteTurno = 0;
            return;
        }

        try {
            if (botResolverEscolhaPendente()) { setTimeout(botCicloDeTurno, BOT_DELAY_ACAO); return; }
            if (botJogarCartasDaMao())        { setTimeout(botCicloDeTurno, BOT_DELAY_ACAO); return; }
            if (botIncendiario())             { setTimeout(botCicloDeTurno, BOT_DELAY_ACAO); return; }
            if (botUsarEspeciais())           { setTimeout(botCicloDeTurno, BOT_DELAY_ACAO); return; }
            if (botAtacar())                  { setTimeout(botCicloDeTurno, BOT_DELAY_ACAO); return; }
        } catch (e) {
            console.error("[BOT] erro no ciclo de turno:", e);
        }

        // Não sobrou nenhuma ação válida — garante que o turno não trave
        if (typeof turnoAtivo !== "undefined" && turnoAtivo === 2) {
            try { passarTurno(); } catch (e) { /* nada a fazer */ }
        }
        botJogando = false;
        acoesNesteTurno = 0;
    }

    function verificarEIniciarBot() {
        if (estaVezDoBot() && !botJogando) {
            botJogando = true;
            acoesNesteTurno = 0;
            setTimeout(botCicloDeTurno, BOT_DELAY_INICIO);
        }
    }

    // -------------------------------------------------------------------
    // FASE DE ABERTURA — escolhe automaticamente a tropa de abertura do bot
    // -------------------------------------------------------------------
    function botEscolherCartaAbertura() {
        if (typeof faseAbertura === "undefined" || faseAbertura !== true) return;
        if (typeof aberturaEscolhaJ2 !== "undefined" && aberturaEscolhaJ2 !== null) return; // já escolheu

        let idsMao = idsNaMao("mao-j2");
        let candidatosTropa = idsMao.filter(function (id) {
            let idBase = idBaseDaCarta(id);
            let info = (typeof bancoDeCartas !== "undefined" && idBase) ? bancoDeCartas.find(c => c.id === idBase) : null;
            return info && !(typeof suportesReais !== "undefined" && suportesReais.includes(info.id));
        });
        if (candidatosTropa.length === 0) return;

        let escolhido = maiorAmeaca(candidatosTropa) || candidatosTropa[0];
        try {
            jogarCartaInimigo("pacote-" + escolhido);
        } catch (e) {
            console.warn("[BOT] erro ao escolher carta de abertura:", e);
        }
    }

    // -------------------------------------------------------------------
    // GANCHOS: escuta passarTurno() e rolarDado() sem alterar main.js
    // -------------------------------------------------------------------
    function instalarGanchos() {
        if (typeof window.passarTurno === "function" && !window.passarTurno.__botHooked) {
            let original = window.passarTurno;
            window.passarTurno = function (...args) {
                let r = original.apply(this, args);
                verificarEIniciarBot();
                return r;
            };
            window.passarTurno.__botHooked = true;
        }
        if (typeof window.rolarDado === "function" && !window.rolarDado.__botHooked) {
            let original = window.rolarDado;
            window.rolarDado = function (...args) {
                let r = original.apply(this, args);
                verificarEIniciarBot();
                return r;
            };
            window.rolarDado.__botHooked = true;
        }
        if (typeof window.onFaseAberturaPronta !== "function") {
            window.onFaseAberturaPronta = function () {
                setTimeout(botEscolherCartaAbertura, BOT_DELAY_INICIO);
            };
        }
    }

    // main.js/habilidades.js/cartas.js já devem ter carregado antes deste arquivo,
    // mas instalamos de novo no load só por segurança.
    instalarGanchos();
    window.addEventListener("load", instalarGanchos);

    console.log("[BOT] Sistema de IA do Oponente carregado. O bot assume o turno 2 automaticamente.");
})();
