PASTA DE NOTAS POR CAPÍTULO (src/assets/notes/)
================================================

As notas funcionam como FICHAS DOS RESIDENTES DA REPÚBLICA (Dorm 304)
e ficam salvas acumulativamente no celular ao avançar os capítulos.

Como editar:
1. Arquivos por capítulo:
   - chapter1.txt (Fichas iniciais do Capítulo 1)
   - chapter2.txt (Atualizações de ficha do Capítulo 2 — mantém as do Cap. 1 salvas)
   - chapter3.txt (Atualizações de ficha do Capítulo 3 — mantém as dos Caps. 1 e 2 salvas)

2. Cada ficha é separada por uma linha com: ---
   Campos de cada ficha:
   title: Título da ficha (ex: Resident File #01 — Hyunjun)
   updatedAt: Horário/data exibida (ex: Today, 03:45)
   body: Conteúdo completo da ficha do residente

3. Tags opcionais para ativação automática por capítulo ou morte de personagem:
   chapter: 3             (aparece a partir do capítulo 3)
   exactChapter: 3        (aparece apenas no capítulo 3)
   if_dead: minhyung      (só aparece se o personagem "minhyung" morrer!)
   if_alive: minhyung     (só aparece enquanto o personagem estiver vivo)
   trigger: dossiers_unlocked  (só aparece após o evento acontecer no capítulo)
