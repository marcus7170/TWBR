// ==UserScript==
// @name         Notificações para Discord
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Envia notificações para o Discord através de um webhook.
// @icon         https://i.imgur.com/7WgHTT8.gif
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

    let lastNotificationTime = 0; // Variável para armazenar o horário da última notificação enviada
    const sentNotifications = {}; // Objeto para armazenar os títulos das notificações enviadas e os horários

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
                        "text": `Conta: ${jogador.name} - Aldeia onde aba esta aberta: ${coordenadaAldeia} - Horário: ${horarioNotificacao}`
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

        lastNotificationTime = Date.now(); // Atualiza o horário da última notificação enviada
        sentNotifications[titulo] = lastNotificationTime; // Armazena o título e o horário da notificação enviada
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
                    // Caso queira ignorar alguma notificação, escreva o titulo dela em !titulo.startsWith(" ")
                    if (!titulo.startsWith("AAAA") && (!sentNotifications[titulo] || Date.now() - sentNotifications[titulo] >= 2000)) {
                        enviarNotificacaoParaDiscord(titulo, mensagem, urlImagem, urlNotificacao, jogador, coordenadaAldeia, horarioNotificacao);
                    }
                }
            }
        }
    }).observe(document.getElementById('side-notification-container'), { childList: true });

})();
