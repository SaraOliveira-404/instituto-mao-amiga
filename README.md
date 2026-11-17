# Instituto Mão Amiga  

App em React Native (Expo) que consome uma API Spring Boot própria.
Pontos de coleta e doações são gerenciados por HTTP.

## Onde está cada parte

- **App:** raiz do repositório (Expo / React Native, TypeScript)
- **API:** pasta `api/` (Spring Boot, H2 em arquivo)

## Como rodar

### Requisitos
- Java 17 e Maven
- Node.js e Expo (`npx expo`)

### 1. API (Spring Boot, porta 8083)
```bash
cd api
mvn spring-boot:run
```
- API: http://localhost:8083/api/v1/pontos
- Swagger: http://localhost:8083/swagger-ui/index.html
- Console do H2: http://localhost:8083/h2-console
  (JDBC URL: `jdbc:h2:file:./data/maoamiga`, usuário `sa`, senha vazia)

### 2. App (Expo, na raiz do projeto)
```bash
npm install
npx expo start
```
- Navegador: pressione `w`
- Celular: escaneie o QR code com o Expo Go (celular e computador na mesma rede)

### 3. Onde trocar o IP do app
Arquivo `src/services/api.ts`, constante `API_URL`:
```ts
export const API_URL = 'http://SEU_IP:8083/api/v1';
```
- No navegador do computador, `localhost` funciona.
- No celular, use o IP do computador (`ipconfig` no Windows, campo "Endereço IPv4").
- Teste rápido: abra `http://SEU_IP:8083/api/v1/pontos` no navegador do celular.

-------------------------------------------------------------------------------------

## N2-1 · API de pontos de coleta

Java 17 · para rodar: `cd api && mvn spring-boot:run`
Swagger: http://localhost:8083/swagger-ui/index.html

### Endpoints

| Método | URL | Respostas |
|---|---|---|
| GET | `/api/v1/pontos` | 200 |
| GET | `/api/v1/pontos/{id}` | 200 / 404 |
| POST | `/api/v1/pontos` | 201 / 400 |
| PUT | `/api/v1/pontos/{id}` | 200 / 404 |
| DELETE | `/api/v1/pontos/{id}` | 204 

### Prints do Swagger

**GET /api/v1/pontos → 200**
![GET lista 200](prints/[N2-1]/GET_200.png)

**GET /api/v1/pontos/{id} → 200**
![GET id 200](prints/GETid_200.png)

**GET /api/v1/pontos/{id} → 404**
![GET id 404](prints/[N2-1]/GETid_404.png)

**POST /api/v1/pontos → 201**
![POST 201](prints/[N2-1]/POST_201.png)

**POST /api/v1/pontos → 400 (nome vazio)**
![POST 400](prints/[N2-1]/POST_400.png)

**PUT /api/v1/pontos/{id} → 200**
![PUT 200](prints/[N2-1]/PUT_200.png)

**PUT /api/v1/pontos/{id} → 404**
![PUT 404](prints/[N2-1]/PUT_404.png)

**DELETE /api/v1/pontos/{id} → 204**
![DELETE 204](prints/[N2-1]/DELETE_204.png)

----------------------------------------------------------------------------------------

## N2-2 · Busca de pontos com paginação

Chamadas e respostas:
1. Sem filtro: http://localhost:8083/api/v1/pontos/filtro?page=0&size=10
2. Filtrando por bairro: http://localhost:8083/api/v1/pontos/filtro?filtro=Setor&page=0&size=10&sort=bairro,asc
3. Segunda página: http://localhost:8083/api/v1/pontos/filtro?page=1&size=10

----------------------------------------------------------------------------------------

## N2-3 · App listando os pontos da API

Funciona no celular pela rede local e pelo navegador

----------------------------------------------------------------------------------------

## N2-4 · App: cadastrar, editar e excluir pontos

Concluído

----------------------------------------------------------------------------------------

## N2-5 · CRUD de doações na API

### Endpoints

| Método | URL | Respostas |
|---|---|---|
| GET | `/api/v1/doacoes/filtro?filtro=...&page=0&size=10` | 200 |
| GET | `/api/v1/doacoes/{id}` | 200 / 404 |
| POST | `/api/v1/doacoes` | 201 / 400 |
| PUT | `/api/v1/doacoes/{id}` | 200 / 404 |
| DELETE | `/api/v1/doacoes/{id}` | 204 

### Prints do Swagger

**GET /api/v1/doacoes/filtro → 200**
![GET filtro 200](prints/[N2-5]/GETfiltro_200.png)

**GET /api/v1/doacoes/{id} → 200**
![GET id 200](prints/[N2-5]/GETid_200.png)

**GET /api/v1/doacoes/{id} → 404**
![GET id 404](prints/[N2-5]/GETid_404.png)

**POST /api/v1/doacoes → 201**
![POST 201](prints/[N2-5]/POST_201.png)

**POST /api/v1/doacoes → 400 (quantidade zero)**
![POST 400](prints/[N2-5]/POST_400.png)

**PUT /api/v1/doacoes/{id} → 200**
![PUT 200](prints/[N2-5]/PUT_200.png)

**PUT /api/v1/doacoes/{id} → 404**
![PUT 404](prints/[N2-5]/PUT_404.png)

**DELETE /api/v1/doacoes/{id} → 204**
![DELETE 204](prints/[N2-5]/DELETE_204.png)

----------------------------------------------------------------------------------------

## N2-6 Histórico e cadastro de doações pela API

Concluído

----------------------------------------------------------------------------------------

## N2-7 · Editar e excluir doação pela API 

Concluído

----------------------------------------------------------------------------------------

## N2-8 · Pontos favoritos e roteiro de demonstração

### Favoritos
- O coração (♡/♥) fica em cada ponto da lista (área de toque 44x44).
- Só os **ids** são salvos no AsyncStorage, então continuam ao fechar e reabrir o app.
- A tela "Meus Pontos" busca cada favorito na API pelo id. Ponto excluído (404) fica de fora e é limpo dos favoritos.
- Para desmarcar na própria tela, toque no ♥: o ponto some na hora e o AsyncStorage é atualizado.

### Decisão técnica
Os favoritos ficam no aparelho (AsyncStorage) porque são uma preferência de quem usa o app e não precisam ser compartilhados.
Já os pontos e as doações ficam no servidor (API + H2) porque são dados do Instituto: precisam ser os mesmos para todo mundo e sobreviver mesmo que o app seja desinstalado.
