# Instituto Mão Amiga

App em React Native (Expo) que consome uma API Spring Boot própria.
Pontos de coleta e doações são gerenciados por HTTP.

## Onde está cada parte

- **App:** raiz do repositório (Expo / React Native, TypeScript)
- **API:** pasta `api/` (Spring Boot, H2 em arquivo)

---

## N2-1 · API de pontos de coleta

Java 17 · para rodar: `cd api && mvn spring-boot:run`
Swagger: http://localhost:8081/swagger-ui/index.html

### Endpoints

| Método | URL | Respostas |
|---|---|---|
| GET | `/api/v1/pontos` 
| GET | `/api/v1/pontos/{id}` 
| POST | `/api/v1/pontos` 
| PUT | `/api/v1/pontos/{id}` 
| DELETE | `/api/v1/pontos/{id}` 

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
![DELETE 204](prints/[N2-1]/DELETE_202.png)

---

## N2-2 · Busca de pontos com paginação

Chamadas e respostas:
1. Sem filtro: http://localhost:8081/api/v1/pontos/filtro?page=0&size=10
2. Filtrando por bairro: http://localhost:8081/api/v1/pontos/filtro?filtro=Setor&page=0&size=10&sort=bairro,asc
3. Segunda página: http://localhost:8081/api/v1/pontos/filtro?page=1&size=10

---

## N2-3 · App listando os pontos da API

Funciona no celular pela rede local e pelo navegador

---

## N2-4 · App: cadastrar, editar e excluir pontos

Concluído

---

## N2-5 · CRUD de doações na API

### Endpoints

| Método | URL | Respostas |
|---|---|---|
| GET | `/api/v1/doacoes/filtro?filtro=...&page=0&size=10` 
| GET | `/api/v1/doacoes/{id}` 
| POST | `/api/v1/doacoes` 
| PUT | `/api/v1/doacoes/{id}` 
| DELETE | `/api/v1/doacoes/{id}` 

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

---

## N2-6 Histórico e cadastro de doações pela API

Concluído

---

## N2-7 · Editar e excluir doação pela API 

Concluído

---

## N2-8 · Como rodar e roteiro de demonstração

_(pendente)_

- Versão do Java:
- Comando da API:
- Onde trocar o IP do app: `src/services/api.ts` (constante `API_URL`)
- Roteiro de até 3 minutos: