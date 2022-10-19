# MongoDb

Para os exercícios práticos vamos utilizar o MongoDb via Docker, dispensando a necessidade de um serviço sempre em execução na sua máquina de desenvolvimento.

## Requisitos

### Docker 

Você precisa do Docker instalado e rodando em sua máquina. Caso ainda não tenha realizado a instalação você pode seguir o guia oficial [aqui](https://docs.docker.com/engine/install/).

### Docker Compose

Para ser mais fácil a execução do nosso contêiner, vamos usar esta ferramenta. Caso ainda não tenha realizado a instalação você pode seguir o guia oficial [aqui](https://docs.docker.com/compose/install/).

O arquivo *files/mongo/docker/docker-compose.yml* contém as configurações necessários para a execução do nosso contêiner mongo.


```yaml

version: '3.7'
services:
  mongodb:
    container_name: mongodb
    image: mongo:latest
    environment:
      MONGO_INITDB_ROOT_USERNAME: dev
      MONGO_INITDB_ROOT_PASSWORD: dev
    ports:
      - 27017:27017
    volumes:
      - /volume:/data/db

```

Entre no diretório *files/mongo/docker/* e execute o comando abaixo:

```shell

docker-compose up -d

```

### Connection String

Para se conectar com o nosso banco de dados as configurações seguindo as configurações acima, sua Connection String será igual abaixo. Caso necessário, modifique as informações que alterou na execução dos containers.

```shell

mongodb://dev:dev@localhost:27017/admin

```

### GUI Client

Caso queira gerenciar seu banco de uma forma visual, você pode utilizar a ferramenta:


* [MongoDb Compass](https://www.mongodb.com/try/download/compass)


## Operadores de Query

> Primeiramente realize o import da collections *files/mongo/import/restaurant.json* em sua instalação local.

Seguindo a documentação dos operadores do mongoDB que pode ser vista [aqui](https://www.mongodb.com/docs/manual/reference/operator/). Vamos reailizar os exercicios abaixo para um melhor entendimento.

### O que são operadores de Query?

* São funcionalidades do MongoDB para deixar nossas **queries mais precisas**;
* Os operadores são **divididos em tipos**, como: de comparação e lógicos;
* Sua sintaxe é: **$nome_operador**;

### Operador $eq (igual)

Especifica a condição de igualdade. o ```$eq```. O operador corresponde a documentos em que o valor de um campo é igual ao valor especificado.

Se executarmos a consulta:

```javaScript

db.restaurants.findOne({ rating: {$eq: 5} })

```
Estamos buscando um restaurante com nota igual a 5.

### Operador $gt e $gte (maior e maior ou igual)

Os operadores ```$gt``` e ```$gte``` verificam se um dado é maior ou igual a algum valor específico;

Se executarmos a consulta:

```javaScript

db.restaurants.findOne({ rating: {$gte: 4} })

```

Estamos buscando por restaurantes de nota 4 ou maior;

Se alterássemos a consulta para: 

```javaScript

db.restaurants.findOne({ rating: {$gt: 4} })

```

Estamos buscando por restaurantes apenas por notas maiores que 4;

### LAB 1 

* Selecione restaurantes que tem nota maior ou igual a 3;
* E também que o tipo de comida é Breakfast;

### Operador $lt e $lte (menor e menor ou igual)

O operador ```$$lt``` e ```$$lte``` verificam se um dado é menor e menor ou igual a algum valor específico;

Se executarmos a consulta:

```javaScript

db.restaurants.findOne({ rating: {$lt: 2} })

```
Estamos buscando por estaurantes de nota menor que 2;

Se alterássemos a consulta para: 

```javaScript

db.restaurants.findOne({ rating: {$lte: 2} })

```
stamos buscando por restaurantes por notas 2 e menores;


### Operador $in (incluido)

O operadoror ```$in``` verifica registros que se encaixam em apenas um dos passados na lista de consulta;

Se executarmos a consulta:

```javaScript

db.find({type_of_food: {$in: ["Pizza", "Chinese"]}})

```
Estamos buscando por restaurantes que servem pizza ou comida chinesa;

### Operador $ne (não é igual )

O operador ```$ne``` (não é igual) trás resultados que não são iguais ao informado, é o inverso de ```$eq```;

Se executarmos a consulta:

```javaScript

db.restaurants.findOne({ rating: {$ne: 5} })

```
Estamos retornando o primeiro restaurante que não é nota 5.

### Operador $exists (contem)

O operador ```$exists``` retorna apenas os dados que possuem determinado campo;

Se executarmos a consulta:

```javaScript

db.restaurants.find({high_score: {$exists: true}})

```

Estamos retornando só os registros que possuem high_score;

### Operador $text (texto)

O operador ```$text``` faz uma busca sobre o texto do campo que foi informado no filtro;

Se executarmos a consulta:

```javaScript

db.restaurants.find({$text: {$search: "pizza"}}).pretty()

```
Estamos buscando um texto com o conteúdo ¨pizza¨, mas para o funcionamento correto será preciso criar um índice. Veremos mais adiante o processo de criação de indice e voltaremos neste exemplo. 



### LAB 2

* Adicione um campo que qualifica os restaurantes ruins, ou seja que tem nota menor ou igual 2;
* Depois faça uma seleção dos mesmos com exists, baseado neste novo campo;

## Relacionamentos

### O que são relacionamentos?

São registros que possuem **ligações** entre si;

#### Tipos de relação

 * one to one; 
 * one to many;
 * many to many;

Onde cada uma possui um método diferente de ser aplicado no **MongoDB**. Além de uma forma especial, graças a flexibilidade dos documents, que é a embedded documents;

#### Embedded documents

**Embedded documents** é uma forma simples de fazer relacionamento entre documents. A ideia é inserir um document dentro do registro principal.

Este recurso funciona bem para One to One e One to Many, porém não para Many to Many;

Exemplo:

```javaScript

use relationships

db.embedded.insertOne({
  nome: "Matheus",
  idade: 30,
  endereco: {
    rua: "Rua das flores",
    numero: "1314",
    complemento: "Casa"
  }
})

db.embedded.findOne()

const matheus = db.embedded.findOne()

matheus.endereco.rua

db.embedded.insertOne({
  nome: "João",
  idade: 40,
  enderecos: {
    casa: {
      rua: "Rua das flores",
      numero: "1314",
      complemento: "Casa"
    },
    trabalho: {
      rua: "Rua das árvores",
      numero: "102 C",
      complemento: "Galpão"
    }
  }
})

const joao = db.embedded.findOne({nome: "João"})

joao.enderecos.trabalho.numero

```

#### One to One

A relação **One to One** é quando um registro possui uma ligação única com outro, e o inverso também é verdadeiro.

##### Exemplo

Um sistema permite o cadastro de um único endereço por usuário, então podemos dizer que o endereço é único para cada usuário.

```javaScript

db.pessoas.insertOne({
  nome: "Matheus",
  idade: 30,
  profissao: "Programador"
})

matheus = db.pessoas.findOne()

matheusId = matheus._id

matheusId

db.enderecos.insertOne({
  rua: "Rua das flores",
  numero: "1414",
  complemento: "Casa",
  pessoa_id: matheusId
})

db.enderecos.findOne()

db.enderecos.find({pessoa_id: matheusId})

``` 
No exemplo acima trabalhos com duas **collections**, *pessoas* e *enderecos* e as conectamos atravéz do **id** ```pessoa_id: matheusId```

#### One to Many

A relação **One to Many** é quando um registro pode possuir mais vínculos com uma outra collection, porém o inverso é falso.

##### Exemplo

Um usuário pode fazer várias compras, mas uma compra pertence a apenas um usuário.

```javaScript

db.pessoas.insertOne({
  nome: "Gustavo",
  idade: 29,
  profissao: "Gerente"
})

gustavo = db.pessoas.findOne({nome: "Gustavo"})

gustavoId = gustavo._id

db.compras.insertMany([
  {produtos: ["Livro", "Celular"], pessoa_id: matheusId},
  {produtos: ["Mouse", "Teclado"], pessoa_id: matheusId},
  {produtos: ["Agenda"], pessoa_id: matheusId},
  {produtos: ["Barbeador", "Suporte monitor"], pessoa_id: gustavoId},
])

db.compras.find({})

db.compras.find({pessoa_id: matheusId})
db.compras.find({pessoa_id: gustavoId})

```

Desta maneira a collection de compras contém em cada compra uma referência ao usuário que será o **_id**.

#### Many to Many

A relação Many to Many acontece quando os registros das duas collections possuem mais de uma relação entre si;

##### Exemplo

Temos alunos e cursos, um curso pode ter vários alunos matriculados e um aluno pode estar fazendo vários cursos.

```javaScript

db.cursos.insertMany([
  {nome: "PHP avançado"},
  {nome: "JavaScript básico"},
  {nome: "Banco de dados NoSQL"}
])

db.pessoas.insertOne({nome: "Pedro", idade: 40})

db.cursos.find()

const gustavo = db.pessoas.findOne({nome: "Gustavo"})
const matheus = db.pessoas.findOne({nome: "Matheus"})

const php = db.cursos.findOne({nome: "PHP avançado"})
const js = db.cursos.findOne({nome: "JavaScript básico"})

db.curso_pessoa.insertMany([
  {curso_id: php._id, pessoa_id: matheus._id},
  {curso_id: js._id, pessoa_id: matheus._id},
  {curso_id: js._id, pessoa_id: gustavo._id},
])

db.curso_pessoa.find()

```
Como esta no exemplo acima foi criada uma estrutura intermediária ou seja, uma collection normalmente é o que acontece nessas sistuações.

Esta collection intermediaria contém apenas os ids de cursos e alunos.

Consulta de todos os alunos do curso de **js**.

```javaScript

const idsAlunos = [];

db.curso_pessoa.find({curso_id: js._id}).forEach(function(aluno) {
  idsAlunos.push(aluno.pessoa_id)
});

idsAlunos

db.pessoas.find({_id: {$in: idsAlunos}})

```

### Query de arrays e Documents

....

### Índices

....

### Aggregation

....

## Outros

* Quando for ultilizado o mongoDB com alguma linguagem de programação é preciso instalar o drive apropriado para a liguagem;

* Todos os drives estão disponíveis na documentação oficial [aqui.](https://www.mongodb.com/docs/drivers/)
