# Guia de Edição de Conteúdo — E-mails, Journal, Notícias e Narrações

Este guia mostra exatamente onde cada conteúdo fica salvo no projeto e como editar ou adicionar novos itens.

---

## 1. Emails (`Mail`)

Todos os e-mails (iniciais, recebidos por capítulo e e-mails digitados automaticamente pelo Sanghyeok) agora ficam em arquivos `.txt` individuais dentro de:
- **Pasta:** `src/assets/emails/`
- **Guia detalhado:** `src/assets/emails/README.txt`

Arquivos principais:
- `e1_enrollment.txt` e `e2_safety_advisory.txt` (`category: initial` — caixa inicial)
- `ch4_new_officer.txt`, `ch5_wangho_mail.txt`, `ch6_kang_reply.txt`, `ch7_kang_class_check.txt`, `ch7_kang_minseok_audio.txt`
- `ch6_compose_kang_brother.txt`, `ch7_compose_class_reply.txt`, `ch7_compose_kang_report.txt` (cenas em que o Sanghyeok digita automaticamente)

Para editar qualquer e-mail, abra o arquivo `.txt` correspondente e modifique `subject:`, `preview:`, `time:` ou `body:` (mantenha o campo `id:` igual ao original para não quebrar os gatilhos).

---

## 2. Journal (`Diário de Lee Sanghyeok`)

Todas as entradas do diário de Sanghyeok agora ficam em arquivos `.txt` individuais dentro de:
- **Pasta:** `src/assets/journals/`
- **Guia detalhado:** `src/assets/journals/README.txt`

### A) Entradas base de cada capítulo
- `chapter1.txt` até `chapter7.txt`
  - Campos: `id:`, `chapter:`, `title:`, `date:`, `mood:` e `body:`
  - `chapter5.txt` inclui também `prefilledText:` e `typedText:` para a animação do Sanghyeok digitando no início do Capítulo 5.

### B) Atualizações da história adicionadas durante o dia (`addendums`)
- `addendums.txt`
  - Contém as notas de atualizações anexadas ao diário nos capítulos 6 e 7 (como investigações do Wangho, ligações, hospital e encontros), cada uma identificada por seu `id:` e `text:`.

---

## 3. News (`Notícias` no Google / Safari)

Todas as matérias e boletins agora ficam em arquivos `.txt` individuais dentro de:
- **Pasta:** `src/assets/news/`
- **Guia detalhado:** `src/assets/news/README.txt`

Arquivos:
- `01_allstar_2008.txt` até `10_univ_campus_safety.txt`

Para editar qualquer notícia, abra o `.txt` desejado e altere `source:`, `headline:`, `byline:` ou as seções separadas por `---` (`heading:` e `text:`, separando parágrafos com uma linha em branco).

Para liberar uma **nova notícia** no navegador:
1. Adicione o novo `.txt` em `src/assets/news/` com um `id:` único.
2. Em `src/App.tsx`, atualize `getArticleTabTitle(articleId)` e adicione a regra de desbloqueio em `SafariApp` (`src/components/apps/SocialAndDockApps.tsx`) / `postedNewsIds` (`src/App.tsx`).

---

## 4. Narrações (`App Narrations` e Telas Pretas Cinematográficas)

Todas as cenas de narração ficam em arquivos `.txt` dentro de:
- **Pasta:** `src/assets/narrations/`
- **Guia detalhado:** `src/assets/narrations/README.txt`

Arquivos:
- `chapter6_kyu_doorstep.txt` (`id: narration-ch6-kyu-doorstep`)
- `chapter7_hospital_observation.txt` (`id: narration-ch7-hospital-observation`)

Qualquer edição em um `.txt` dessa pasta atualiza automaticamente tanto as legendas da cena cinematográfica quanto o memo salvo no app **Narrations**.

