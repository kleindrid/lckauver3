PASTA DE FICHAS DOS INTERROGADOS / PERSONAGENS (src/assets/dossiers/)
==========================================================================

Estrutura:
  src/assets/dossiers/<id_do_personagem>/dossier.txt

Como editar ou adicionar informações em qualquer ficha:
1. O primeiro bloco (antes de "---") define os dados principais do personagem:
   id: identificador (ex: hyunjun, minhyung, dohyeon)
   name: Nome completo exibido na ficha
   age: Idade
   role: Papel / Relação (ex: Dorm 304 · Room 304-A)
   residence: Onde mora
   attendedParty: true ou false (se compareceu à festa do Dohyeon)
   status: alive | dead | missing | detained
   deadFromChapter: (opcional) capítulo a partir do qual o status passa a dead (ex: 3)
   alibi: Declaração oficial no interrogatório da polícia
   interrogationSummary: Resumo do depoimento
   detectiveNotes: Anotações investigativas do Lee Sanghyeok / Delegacia

2. Você pode adicionar blocos extras separados por "---" para atualizações por capítulo ou se algum personagem morrer:
   chapter: 3             (ativa do capítulo 3 em diante)
   exactChapter: 3        (ativa apenas no capítulo 3)
   if_dead: minhyung      (só ativa se "minhyung" estiver morto no jogo!)
   if_alive: minhyung     (só ativa enquanto "minhyung" estiver vivo)
   time: Oct 24 · 20:45
   title: Título da atualização
   text: Conteúdo da atualização na ficha
