# Exemplo de projeto usando nodeJs e mongoDB



## Tecnologias

* CSS
* HTML
* NodeJs
* MongoDB

### Setup

#### 1 - Criação do banco

Crie o banco de dados em seu ambiente local chamado **notesDb**.

Logo em seguida crie um usuário de acesso.

```
use notesDb

db.createUser( { user: "dev", pwd: "dev", roles: ["readWrite"] })

```

#### 2 - nodejs

Veja mais informações sobre instalação [aqui](https://nodejs.org/en/).


#### 3 - Install

```
npm install 

```

#### 4 - Start

```
npm start

```

A saida será um site estático disponível em [http://localhost:8080](http://localhost:8080)