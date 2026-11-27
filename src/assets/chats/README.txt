# PASTA DE CHATS DO WHATSAPP (src/assets/chats/)
#
# Como adicionar, editar ou remover mensagens:
# 1. Cada arquivo .txt nesta pasta representa uma conversa em um ou mais capítulos.
# 2. O primeiro bloco (antes do primeiro "---") define os dados do contato:
#    id: identificador único do chat (ex: hyunjun, tenente, republica)
#    chapter: capítulo em que aparece (ex: 1, 2, 3 ou all)
#    order: ordem de exibição na lista (1, 2, 3...)
#    name: nome exibido no WhatsApp
#    subtitle: descrição abaixo do nome
#    number: número de telefone
#    avatar: id da pasta do personagem em src/assets/profiles/ (ex: hyunjun) ou police / dorm304
#    unread: quantidade inicial de não lidas (ex: 1 ou 0)
#
# 3. Cada bloco após "---" é UMA mensagem na ordem cronológica:
#    sender: me (Lee Sanghyeok / dono do celular) ou them (o outro personagem)
#    time: horário da mensagem (ex: 09:16) — o relógio do celular acompanha esse horário!
#    initial: true (já aparece recebida ao abrir o capítulo) ou false (faz parte da conversa animada)
#             * Se não informar "initial", todas as mensagens de "them" antes da primeira de "me"
#               já aparecem carregadas ao iniciar o capítulo, e da primeira de "me" em diante
#               elas são digitadas e enviadas ao vivo.
#    delay: tempo (em ms) da animação "typing..." antes da resposta de "them" (padrão: 6000)
#    text: texto da mensagem (pode usar várias linhas se quiser)
