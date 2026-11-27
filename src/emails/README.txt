PASTA DE E-MAILS (src/assets/emails/)
====================================

Cada arquivo .txt nesta pasta representa 1 e-mail do jogo (seja um e-mail recebido na caixa de entrada ou uma cena em que o Sanghyeok digita automaticamente um e-mail).

1. E-mails recebidos (type: inbox):
   id: e1                       (ID único — não altere ids já existentes)
   type: inbox
   category: initial          (use "initial" apenas para e-mails que já começam na caixa de entrada)
   order: 1                   (ordem na caixa inicial)
   from: Nome do remetente
   email: remetente@dominio.com
   subject: Assunto do e-mail
   preview: Texto curto exibido na prévia da lista
   time: 02:15
   unread: true               (true = não lido, false = lido)
   quickReplyLabel: Reply     (opcional — mostra botão de resposta rápida)
   audioAttachment: chapter7_minseok_statement  (opcional — anexa gravação de voz de src/assets/recordings/)
   body:
   Texto completo do e-mail...
   (linhas em branco dentro de "body:" são mantidas como parágrafos)

2. E-mails digitados automaticamente pelo Sanghyeok (type: compose):
   id: ch6-mail-kang-brother  (ID único — não altere ids já existentes)
   type: compose
   to: kang.minhyeok@ggpd.gov.kr
   subject: Assunto do e-mail
   time: 14:30
   body:
   Corpo completo que será digitado na tela...
