# Notificações para Discord - UserScript

Este é um script de usuário (UserScript) que permite enviar notificações para o Discord através de um webhook sempre que uma nova notificação aparecer no jogo "Tribal Wars" (Guerras Tribais).

## Instalação

1. Certifique-se de que você possui uma extensão de gerenciador de scripts de usuário, como o Tampermonkey, instalado em seu navegador.
2. Copie todo o código do script fornecido acima.
3. Abra o painel de controle da extensão (por exemplo, no Tampermonkey) e clique em "Criar Novo Script".
4. Cole o código copiado na janela do script.
5. Substitua a variável `webhookURL` pelo URL real do webhook do Discord que você deseja usar para receber as notificações. Certifique-se de manter as aspas ao redor do URL.
6. Salve o script clicando em "Arquivo" e, em seguida, em "Salvar".

## Funcionalidade

Este script é projetado para funcionar em páginas que correspondam ao padrão `https://*.tribalwars.com.br/*`, ou seja, em domínios relacionados ao jogo "Tribal Wars" no Brasil. 
Quando o script é executado em uma página válida, ele verifica se o navegador suporta a API de notificações. Caso contrário, uma mensagem é exibida no console indicando que o navegador não suporta notificações.
Se o navegador suporta notificações, o script solicita permissão ao usuário para exibir notificações. Após concedida a permissão, o script observa a seção de notificações do jogo e envia uma notificação para o Discord sempre que uma nova notificação aparecer.
O título, a mensagem, a imagem (se houver), a URL da notificação, o jogador, a coordenada da aldeia e o horário da notificação são incluídos na notificação enviada para o Discord.
O script também possui uma verificação para ignorar notificações cujo título comece com "Progresso da realização", garantindo que apenas notificações relevantes sejam enviadas para o Discord.

## Aviso Legal

Este script foi criado apenas para fins educacionais e não tem a intenção de violar os termos de serviço do jogo "Tribal Wars" ou do Discord. Utilize o script por sua conta e risco, e certifique-se de usá-lo de forma ética e responsável. O autor não se responsabiliza por qualquer uso indevido ou violação dos termos de serviço.
