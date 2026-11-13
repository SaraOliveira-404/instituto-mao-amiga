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

_(pendente)_

Chamadas e respostas:
1. Sem filtro
2. Filtrando por bairro
3. Segunda página

---

## N2-3 e N2-4 · App com pontos

_(pendente)_ Como o app foi testado: _(celular pela rede local / navegador)_

---

## N2-5 · API de doações

_(pendente)_ Prints do Swagger de cada endpoint, incluindo um 400 e um 404.

---

## N2-6 e N2-7 · App com doações

_(pendente)_

---

## N2-8 · Como rodar e roteiro de demonstração

_(pendente)_

- Versão do Java:
- Comando da API:
- Onde trocar o IP do app: `src/services/api.ts` (constante `API_URL`)
- Roteiro de até 3 minutos: