# Sample devInHouse Firebase

## Objetivo

Repositório contendo o conteúdo das práticas elabaoradas durante a semana, para entender como o Firebase trabalha, quais os seus benefícios e como usar os seus principais recursos.

### Conteúdo Práticos 

* O que é BaaS?
* O que é o Firebase?
* Prós e Contras de um BaaS
* Criando uma Conta
* Overview do Console
* REST e CRUD
* Iniciando um Projeto
* Real-Time Database
* Autenticação e Segurança
* Storage
* Hosting
* Notificações

## Tecnologias

* HTML
* JavaScript
* Firebase

### Setup

Este projeto utiliza o componente https-server para gerar servir como nosso servidor de arquivos estáticos.

Siga os requisitos abaixo para a correta utilização deste projeto.

#### 1 - nodejs

Veja mais informações sobre instalação [aqui](https://nodejs.org/en/).

#### 2 - https-server

```
npm install -g http-server
```

### Desenvolvendo em ambiente local

Após a instalação dos requisitos acima você deve:
- 1 - Clonar este reposítorio;
- 2 - Entrar na pasta **public** do projeto e executar o seguinte comando:

```
http-server -c1
```

A saida será um site estático disponível em http://localhost:8080