# MongoDB

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

![Relacionamentos](../../docs/images/relacionamentos.png)

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

#### Query em embedded documents

Para resgatar um dado que está em um document em um outro document, vamos precisar de uma sintaxe diferente:

```javaScript

find({ “chave1.chave2”: “valor” })

```

é preciso colocar as duas chaves entre aspas e depois seguir com o valor, como é comum na busca por chaves;

Vamos criar a seguinte collections;

```javaScript

use masterselect

db.pessoas.insertMany([
  {
    nome: "Matheus",
    caracteristicas: {
      peso: "80kg",
      altura: "1.80m",
      cor_dos_olhos: "verdes",
      idade: 30,
    }
  },
  {
    nome: "Pedro",
    caracteristicas: {
      peso: "92kg",
      altura: "1.65m",
      cor_dos_olhos: "castanhos",
      idade: 25,
    }
  },
  {
    nome: "Maria",
    caracteristicas: {
      peso: "68kg",
      altura: "1.92m",
      cor_dos_olhos: "azuis",
      idade: 33,
    }
  },
  {
    nome: "Carla",
    caracteristicas: {
      peso: "72kg",
      altura: "1.72m",
      cor_dos_olhos: "castanhos",
      idade: 19,
    }
  },
])

db.pessoas.find()

db.pessoas.find({"caracteristicas.cor_dos_olhos": "castanhos"}).pretty()

```

#### Query em embedded com operador

A lógica para utilizar operadores é a mesma, colocar as chaves entre aspas;

```javaScript

find({ “chave1.chave2”: { $gt: 20 })

```

```javaScript
db.pessoas.find()

db.pessoas.find({"caracteristicas.idade": { $gt: 30 }}).pretty()

```

### LAB 3

* Selecione pessoas por dois campos: peso e idade, que ficam em características;
* Em peso utilize o operador $in;
* Em idade utilize o operador $gt;

#### Resposta 

```javaScript
db.pessoas.find({"caracteristicas.peso": {$in: ["80kg", "92kg"]}, "caracteristicas.idade": {$gt: 20}})
```

#### Query em item específico de array

Para encontrar item específico em array podemos utilizar o valor final;

```javaScript

db.alunos.find({ notas: 8 })

```

```javaScript
db.alunos.insertMany([
  {
    nome: "Matheus",
    matematica: [8, 7, 10, 8]
  },
  {
    nome: "Pedro",
    matematica: [8, 8, 9, 7]
  },
  {
    nome: "Maria",
    matematica: [6, 4, 10, 9]
  },
])
```

Neste exemplo todos os alunos com nota 8 serão retornados;

Para valores exatos, precisamos colocar o array inteiro:

```javaScript
db.alunos.find({matematica: [10, 8, 6, 5]})
```

Neste exemplo somente alunos que tiraram as quatro notas acima serão retornados;

## Índices (indexes)

> Primeiramente realize o import da collections *files/mongo/import/city.json* dentro de um banco em sua instalação local.

### Conceito

Índices são estruturas de dados especiais que armazenam uma pequena porção do conjunto de dados da collection de forma fácil de percorrer.

O índice armazena o valor de um campo específico ou conjunto de campos, ordenados pelo valor do campo. A ordenação das entradas de índice suporta correspondências de igualdade eficientes e operações de consulta baseadas em intervalo. Além disso, o MongoDB pode retornar resultados classificados usando a ordenação no índice.

[Fonte - Documentação Oficial](https://www.mongodb.com/docs/manual/indexes/)

![Indíce](../../docs/images/index-mongo.svg)

Podemos comparar um índice em banco noSQL à um índice em um livro. Já imaginou ter de procurar do começo ao fim de um livro por uma informação? Nesse caso usaríamos o seu índice, que nos indicaria a posição onde encontrar a informação de forma eficiente.

A ideia é evitar um **[table scan](https://en.wikipedia.org/wiki/Full_table_scan)** toda vez que realizamos uma consulta, ou seja, não queremos que o MongoDB faça uma varredura completa dentro da coleção para encontrar os documentos procurados. Os dados com índices são checados primeiro na hora de uma seleção.


> Importante o dado pertencente ao campo **_id** já vem com um índice criado por padrão

### Plano de Execução (explain)

Podemos ter informações do caminho que o MongoDB utilizou para realizar uma consulta com a função **explain**

Exemplo:

```javaScript

db.city.find({certificate_number: 3030353}).explain()

```

Neste exemplo vamos entender o caminho percorrido pela ferramente para encontrar o certificado número 3030353.

### Criação

#### Criando um Índice

Para criar um índice vamos utilizar o comando **createIndex**.

```javaScript

db.city.createIndex({ certificate_number: 1 })

```

Neste exemplo criamos um índice no dado **certificate_numer**. A partir de agora, todas as consultas que utilizem este campos serão mais rápidas.

#### Criando um Índice em campos de embedded documents

É possível criar índices para campo de **embedded documents**


```javaScript

db.city.createIndex({ "address.city": 1 })

```
Neste exemplo o campo *city* dentro do documento *address* agora tem um índice. Consequentemente as consultas que envolvem este campo, serão mais performáticas;

#### Criando um Índice compostos

É possivel criar nn MongoDB um índice para múltiplos campos.

Exemplo

```javaScript

db.city.createIndex({ certificate_number: 1, date: 1 })

```

Isso favorece as buscas quando os dois são incluídos na consulta como por exemplo:

```javaScript

db.city.find({certificate_number: 3030353}).explain()

```

#### Criando um Índice de texto

São índices que facilitam a busca de **texto** em um campo.

Exemplo

```javaScript

db.city.createIndex({ business_name: "text" })

```

Isso favorece as buscas quando acionado o campo **business_name**.

>Podemos ter apenas um índice de texto por collection


Exemplo de buscas após a criação do indice

```javaScript

db.city.find({ $text: { $search: "HOT DOG" } })

db.city.find({ $text: { $search: "HOT DOG" } }).explain()

```


### Busca

#### Buscando Índices de Collections

Podemos checar quais índices uma collection possui.

```javaScript

db.city.getIndexes()

```

Nesta busca todos os índices criados na collection *city* serão retornados;

#### Buscando Índices de banco

Podemos listar todos os índices criados de um banco. 

Para tal vamos ter que fazer primeiramente um loop em todas as collections com um **forEach** e logo após percorrer cada item do loop usando o comando getIndexes.

```javaScript
db.getCollectionNames().forEach(function(collection) {
   indexes = db[collection].getIndexes();
   print("Índices de " + collection + ":");
   printjson(indexes);
});

```

#### Removendo Índices de campos específicos

Para remover índices vamos utilizar a função **dropIndex**.

```javaScript

db.city.dropIndex({ certificate_number: 1 })

```
Neste exemplo teremos removido o indice criado no campo **certificate_number** e posterior a isso teremos uma queda na performance deste campo.

#### Removendo todos os Índices de uma collection

Podemos remover todos os índices de uma collection utilizando a função **dropIndexes**.

```javaScript

db.city.dropIndexes()

```
Neste exemplo teremos removido dos os indices criados na collection **city** com exceção do indice criado automáticamente pelo MongoDB no campo **_id** este nunca será excluido.


## Aggregation

> Primeiramente realize o import da collections *files/mongo/import/books.json* dentro de um banco em sua instalação local.

### Conceito

é um framework do MongoDB cujo o principal objetivo é **agregar** resultados se baseando muito no conceito de aggregate functions do SQL, para retornar valores que não obtidos somente em uma *collection*.

### Pipeline

**Pipeline** é um termo que está ligado ao aggregation, é o modo que construímos o resultado da nossas agragações.

Uma pipeline de agregação consiste em um ou mais estágios que processam documentos:

* Cada estágio realiza uma operação nos documentos de entrada. Por exemplo, um estágio pode filtrar documentos, agrupar documentos e calcular valores.

* Os documentos que saem de um estágio são passados ​​para o próximo estágio.

* Uma pipeline de agregação pode retornar resultados para grupos de documentos. Por exemplo, retorne os valores total, médio, máximo e mínimo.

Documentação oficial [aqui](https://www.mongodb.com/docs/manual/meta/aggregation-quick-reference/)

### $bucket

Categoriza os documentos recebidos em grupos, chamados de *buckets*, com base em uma expressão especificada e nos limites de um **bucket**

Podemos definir a classificação de um grupo baseado em um campo e receberemos uma contagem de dados neste grupo.

Sintax [aqui](https://www.mongodb.com/docs/manual/reference/operator/aggregation/bucket/#mongodb-pipeline-pipe.-bucket)

Exemplo:

```javaScript
db.books.aggregate([
  {
    $bucket: {
      groupBy: "$pageCount",
      boundaries: [100, 200, 300, 400, 500, 600, 700],
      default: "OTHERS",
      output: {
        "count": {$sum: 1}
      }
    }
  }
])
```

### $collStatus

O operador ```$collStatus``` tem como objetivo retornar dados de uma collection.

As informações que podem ser retornadas podem ser: inforções de banco, collection, horário atual, contagem de registros, etc...

Mas podemos resgatar dados mais avançados como: shards, quantidade de queries executadas.

Sintax [aqui](https://www.mongodb.com/docs/manual/reference/operator/aggregation/collStats/#mongodb-pipeline-pipe.-collStats)


Exemplo:

```javaScript

db.books.aggregate( [ { $collStats: { queryExecStats: { }, count: { } } } ] ).pretty()

```

### $sort

Com o operador ```$sort``` podemos ordenar os resultados se baseando em algum campo (1 crescente, -1 decrescente), geralmente é usado para fazer filtros de ordenação.

Sintax [aqui](https://www.mongodb.com/docs/manual/reference/operator/aggregation/sort/#mongodb-pipeline-pipe.-sort)

Exemplo:

```javaScript

db.books.aggregate([
  { $sort: { pageCount: -1 } }
]).pretty()

```

### $limit

Com o operador ```$limit``` podemos limitar o número de resultados retornados passamos um parâmetro com o número limite.

Sintax [aqui](https://www.mongodb.com/docs/manual/reference/operator/aggregation/limit/#mongodb-pipeline-pipe.-limit)

Exemplo:

```javaScript

db.books.aggregate([
  { $sort: { pageCount: -1 } },
  { $limit : 3 }
]).pretty();


```

### $match

Com o ```$match``` é possível determinar um filtro para os resultados.

Sintax [aqui](https://www.mongodb.com/docs/manual/reference/operator/aggregation/match/#mongodb-pipeline-pipe.-match)

Exemplo:

```javaScript
db.books.aggregate([
  { $sort: { pageCount: -1 } },
  { $match: { authors: "Robi Sen"}},
  { $limit : 3 }
]).pretty();

```

### $out

O ```$out``` nos permite criar uma collection a partir da aggregation e os retornos da agregação serão inseridos em uma nova collection, tendo assim só os dados filtrados.

Sintax [aqui](https://www.mongodb.com/docs/manual/reference/operator/aggregation/out/#mongodb-pipeline-pipe.-out)

Exemplo:

```javaScript

db.books.aggregate([
  { $match: { categories: "Java", pageCount: { $gt: 800 }}},
  { $limit : 5 },
  { $out: "bigjavabooks" }
]).pretty();

db.bigjavabooks.find().pretty()

```

### $sortByCount

O ```$sortByCount``` oderna os resultados por um campo específco

Sintax [aqui](https://www.mongodb.com/docs/manual/reference/operator/aggregation/sortByCount/#mongodb-pipeline-pipe.-sortByCount)

Exemplo:

```javaScript

db.books.aggregate( [ { $unwind: "$categories" },  { $sortByCount: "$categories" } ] )

```

### $lookup

> Primeiramente realize o import da collections *files/mongo/import/posts.json* e *files/mongo/import/comments.json* dentro de um banco em sua instalação local.

Executa uma junção externa a uma coleção no mesmo banco de dados para filtrar documentos da collections "ingressada" para processamento. 

O estágio $lookup adiciona um novo campo de matriz a cada documento de entrada. O novo campo de matriz contém os documentos correspondentes da coleção "ingressada". O estágio $lookup passa esses documentos reformulados para o próximo estágio.

Documentação oficial [aqui](https://www.mongodb.com/docs/manual/reference/operator/aggregation/lookup/#mongodb-pipeline-pipe.-lookup)

Exemplo:

```javaScript

use devinhouse

db.posts.aggregate([
    { $lookup:
        {
           from: "comments",
           localField: "title",
           foreignField: "postTitle",
           as: "comments"
        }
    }
])

```

* from: a collection à qual queremos nos juntar
* localField: o campo pelo qual queremos nos unir na collection local (a coleção na qual estamos executando a consulta)
* foreignField: o campo pelo qual queremos nos unir na collections estrangeira (a coleção com a qual queremos nos unir)
* as: o nome da matriz de saída para os resultados

## Outros

* Quando for ultilizado o mongoDB com alguma linguagem de programação é preciso instalar o drive apropriado para a liguagem;

* Todos os drives estão disponíveis na documentação oficial [aqui.](https://www.mongodb.com/docs/drivers/)
