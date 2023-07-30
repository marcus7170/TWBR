// ==UserScript==
// @name         Notificações para Discord
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Envia notificações para o Discord através de um webhook.
// @author       Marcus7170 --> Discord devmarcus7170
// @match        https://*.tribalwars.com.br/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Substitua 'SEU_URL_DO_WEBHOOK' pelo URL do webhook que você copiou do Discord
    const webhookURL = 'SEU_URL_DO_WEBHOOK';

    // Verifica se o navegador suporta a API de notificações
    if (!("Notification" in window)) {
        console.log("Este navegador não suporta notificações.");
        return;
    }

    // Permite que o usuário dê permissão para exibir notificações
    Notification.requestPermission().then(function(permission) {
        if (permission === "granted") {
            console.log("Permissão para notificações concedida!");
        }
    });

    // Função para enviar a notificação para o Discord via webhook
    function enviarNotificacaoParaDiscord(titulo, mensagem, urlImagem, urlNotificacao, jogador, coordenadaAldeia, horarioNotificacao) {
        const payload = JSON.stringify({
            "embeds": [
                {
                    "title": titulo,
                    "description": mensagem,
                    "thumbnail": {
                        "url": urlImagem
                    },
                    "url": urlNotificacao,
                    "footer": {
                        "text": `Notificação na conta: ${jogador.name} - Coordenada da Aldeia: ${coordenadaAldeia} - Horário: ${horarioNotificacao}`
                    }
                }
            ]
        });

        fetch(webhookURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: payload
        }).then(response => {
            console.log("Notificação enviada para o Discord!");
        }).catch(error => {
            console.error("Erro ao enviar notificação para o Discord:", error);
        });
    }

    // Observa se há novas notificações na página
    new MutationObserver(function(mutationsList, observer) {
        for (const mutation of mutationsList) {
            if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
                const novaNotificacao = mutation.addedNodes[0];
                const tituloElement = novaNotificacao.querySelector(".content strong");
                const mensagemElement = novaNotificacao.querySelector(".content p");
                const imagemElement = novaNotificacao.querySelector(".img-container img");
                const urlNotificacao = window.location.href;
                if (tituloElement && mensagemElement && imagemElement) {
                    const titulo = tituloElement.textContent.trim();
                    const mensagem = mensagemElement.textContent.trim();
                    const urlImagem = imagemElement.src;
                    const jogador = TribalWars.getGameData().player; // Obter dados do jogador
                    const aldeia = TribalWars.getGameData().village; // Obter dados da aldeia
                    const coordenadaAldeia = `(${aldeia.x}|${aldeia.y})`;
                    const horarioNotificacao = new Date().toLocaleString(); // Obter o horário atual

                    if (!titulo.startsWith("Progresso da realização")) {
                        enviarNotificacaoParaDiscord(titulo, mensagem, urlImagem, urlNotificacao, jogador, coordenadaAldeia, horarioNotificacao);
                    }
                }
            }
        }
    }).observe(document.getElementById('side-notification-container'), { childList: true });

})();
