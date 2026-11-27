PASTA DE NARRAÇÕES (src/assets/narrations/)
==========================================

Cada arquivo .txt nesta pasta representa uma cena de narração (usada tanto na tela preta cinematográfica quanto salva no app "Narrations").

Como editar:
1. O primeiro bloco (antes do primeiro "---") contém os dados da cena:
   id: narration-ch6-kyu-doorstep   (ID único usado pelo jogo — não altere o id de cenas existentes)
   chapter: 6                         (número do capítulo)
   title: Título da cena
   location: Localização exibida no app Narrations
   dateTime: Dia e hora exibidos no app Narrations
   summary: Resumo curto exibido no card do app Narrations

2. Cada bloco após "---" é uma fala ou batida de narração na tela:
   kind: narration   (ou "dialogue" para fala de personagem)
   speaker: Nome do personagem (apenas quando kind for "dialogue")
   text: Texto exibido na tela preta e salvo no memo de narrações.
