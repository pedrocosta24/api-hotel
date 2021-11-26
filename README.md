# Golden Skin Hotel - API

### Guia de rotas

> Nota: Apenas se encontram aqui algumas das principais rotas da API.

---

### Rotas de autenticação

- **/auth/register** - _Post_

  - Rota destinada ao registo de utilizadores, exemplo:

  ```json
  {
    "name": "Pedro",
    "email": "pedrocosta2406@pm.me",
    "phone_number": "910000001",
    "address": {
      "street": "Rua das ruas",
      "city": "Paços de Ferreira",
      "postal_code": "4595-045",
      "country": "Portugal"
    },
    "birthday": "2000-06-24",
    "nif": 2391237323,
    "bookings": [],
    "password": "pedro123",
    "role": "ADMIN"
  }
  ```

  <br>

- **/auth/login** - _Post_

  - Rota destinada ao login do utilizador, exemplo:

  ```json
  {
    "email": "pedrocosta2406@pm.me",
    "password": "pedro123"
  }
  ```

  Retornará o token para fazer autenticação

  <br>

- **/auth/me** - _Get_

  - Rota destinada a fazer decode do token jwt:

    | Headers params | jwt token |
    | -------------- | :-------: |
    | x-access-token | jwt_token |

    Retornará JWT decoded

---

<br>

### Rotas Públicas

- **/rooms** - _Post_

  - Nesta rota é possivel filtrar quartos pelos seus respetivos campos, exemplo:

  ```json
  {
    "type": "single"
  }
  ```

  <br>

- **/rooms/number/:number** - _Post_
  - Nesta rota é possivel obter um quarto através do seu número:
  ```
    /rooms/number/24
  ```
  <br>

---

<br>

### Rotas de Administrador

- **/admin/users** - _Get_

  - Exemplo de filtragem de users via query params:

  ```
    /users?orderBy=name&direction=desc
    /users?page=2
  ```

  <br>

- **/admin/users/:id/bookings** - _Get, Put_

  - Rota para buscas de quartos reservados pelos hóspedes, também é possível realizar alterações do mesmo, exemplo:

  ```json
  // Objeto "Booking" dentro do user

  {
    "room": {
      "room_no": 24
    },
    "price_night": "70",
    "reserved": [
      {
        "from": "1636730759347",
        "to": "1637004600408"
      }
    ],
    "images": ["asd.png", "qpweiojq.png"],
    "no_guests": 1,
    "extras": ["asd"],
    "observations": "çlml",
    "reserved": [
      {
        "from": "2021-11-10",
        "to": "2021-11-15"
      }
    ],
    "no_nights": 3,
    "final_price": 300
  }
  ```

<br>

- **/admin/rooms** - _Get, Post_

  - Exemplo da criação de um quarto:

  ```json
  {
    "room_no": 24,
    "type": "single",
    "no_beds": "1",
    "capacity": "1",
    "amenities": {
      "wifi": true,
      "tv": true,
      "crib": false,
      "airConditioning": true,
      "iron": true,
      "smokeAlarm": true
    },
    "price_night": "70",
    "reserved": [],
    "images": ["asd.png", "qpweiojq.png"]
  }
  ```

  <br>

- **/admin/rooms/:id** - _Get, Put, Delete_
  - Exemplo de filtragem de quartos via query params:
  ```
    /rooms/:id?orderBy=room_no&direction=desc
    /rooms/:id?page=2
  ```
  <br>

---

<br>

**Work done by Diogo Martins & Pedro Costa 🚀**
