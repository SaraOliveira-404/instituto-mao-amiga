# Mão Amiga

App mobile (Expo / React Native + TypeScript) para consultar pontos de coleta e distribuição de doações e registrar o histórico de doações do usuário. Os dados ficam salvos no aparelho (AsyncStorage), então continuam lá depois de fechar o app.

## Como rodar

```bash
npm install
npx expo start
```

Abra no celular com o Expo Go (QR code) ou em um emulador.

## Roteiro de demonstração (≈ 3 minutos)

Siga os passos na ordem. Cada passo diz o que fazer e o que deve aparecer na tela.

### 1. Registrar uma doação
1. Na tela inicial, toque em **+ Cadastrar Doação**.
2. Escolha o **Tipo do item** (ex: *Roupas*). Os demais campos só liberam depois disso.
3. Preencha **Descrição** (ex: "Agasalhos de inverno") e **Quantidade** (ex: `10`).
4. Em **Ponto de destino**, escolha um ponto na lista.
5. Toque em **Cadastrar Doação**.

**Resultado:** aparece a mensagem verde *"Doação nº X cadastrada com sucesso!"* e o formulário é limpo.
Repita mais 2 ou 3 vezes com tipos diferentes (ex: *Alimentos*, *Livros*) para ter o que filtrar depois.

> Dica: tente salvar com campos vazios ou quantidade com letras para mostrar as mensagens de validação.

### 2. Ver o histórico
1. Volte à tela inicial e toque em **Minhas Doações**.

**Resultado:** lista com todas as doações, da mais recente para a mais antiga, com tipo, quantidade, destino, data e ID. Na tela inicial também há o resumo com o total por tipo.

### 3. Filtrar
1. Em **Minhas Doações**, toque no campo de filtro e digite `roupa`.

**Resultado:** aparecem sugestões de tipo e a lista mostra só as doações que combinam (a busca ignora acentos e maiúsculas). Se nada combinar, aparece *"Nenhuma doação encontrada"*. Apague o texto para voltar à lista completa.

### 4. Editar
1. Toque em uma doação para abrir o detalhe.
2. Toque em **Editar doação**. O formulário abre já preenchido.
3. Altere a quantidade ou a descrição e toque em **Salvar alterações**.

**Resultado:** volta ao detalhe com os dados atualizados e a mensagem *"Doação nº X editada com sucesso!"*. O ID continua o mesmo, sem duplicar a doação.

### 5. Excluir
1. No detalhe da doação, toque em **Excluir doação**.
2. Na confirmação, toque em **Cancelar** uma vez (nada é apagado) e depois repita e toque em **Excluir**.

**Resultado:** volta ao histórico com a mensagem *"Doação nº X excluída com sucesso!"* e o item some da lista.

### 6. Fechar e reabrir o app
1. Feche o app por completo (remova da lista de apps recentes, não basta minimizar).
2. Abra novamente e entre em **Minhas Doações**.

**Resultado:** as doações continuam lá, com as edições e sem as excluídas. Isso mostra que os dados persistem no aparelho.

## Estrutura do projeto

```
src/
  telas/         telas do app (lista de pontos, cadastro/edição, histórico, detalhes)
  componentes/   ItemDoacao (card) e ResumoDoacoes (totais por tipo)
  dados/         Doacoes.ts (único arquivo que usa AsyncStorage), Pontos.ts, TiposItem.ts
  utilitarios/   formatarData.ts
  tipos.ts       tipos compartilhados e rotas de navegação
```