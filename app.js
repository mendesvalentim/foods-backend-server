var auth = require('./auth.js').auth;
var express = require('express');
var bodyParser = require('body-parser');
var mobileServer = require('./mobileServer.js');
var datasnap = require('./datasnap.js');
var app = express();

// Middleware para corrigir o cabeçalho incorreto enviado pelo post do datasnap
app.use(function (req, res, next) {
   if (req.url=='/datasnap/rest/TServMet/%22EnviarItem%22/') {
       console.log('Corrigindo cabeçalho da requisição POST...');
       req.headers['content-type'] = 'application/json';
   }
   next();
});

app.use(bodyParser.json());

// login
app.get(datasnap.route('EchoString/ABC/'), auth, function (req, res) {
    res.status(200).send('{"result":["ABC"]}');
});

// Rota para obter a lista de mesas disponíveis/consumindo
app.get(datasnap.route('ConsultaMesas//'), auth, function (req, res) {
    var praca = req.params.praca;
    console.log('-> ConsultaMesas');
    mobileServer.consultaMesas(praca, function(result) {
        res.send(result);
    });
});

app.get(datasnap.route('ConsultaMesas/:praca'), auth, function (req, res) {
    const praca = req.params.praca;
    console.log('-> ConsultaMesas ' + praca);
    mobileServer.consultaMesas(praca, function(result) {
        res.send(result);
    });
});

// Rota para obter dados da mesa/cartão
app.get(datasnap.route('ConsultaPedidosCons/:NumeroCartao/'), auth, function (req, res) {
    var numeroCartao = req.params.NumeroCartao;
    console.log('-> ConsultaPedidosCons', numeroCartao);
    mobileServer.consultaPedidosCons(numeroCartao, function(result) {
        res.send(result);
    });
});

// Retorna os grupos
app.get(datasnap.route('ConsultaGrupo/'), auth, function (req, res) {
    console.log('-> ConsultaGrupo');
    mobileServer.consultaGrupo(function (result) {
        res.send(result);
    });
});

// Retorna os produtos de determinado grupo
app.get(datasnap.route('ConsultaProdutos/:IdGrupo/'), auth, function (req, res) {
    var idGrupo = req.params.IdGrupo;
    console.log('-> ConsultaProdutos', idGrupo);
    mobileServer.consultaProdutos(idGrupo, function (result) {
        res.send(result);
    });
});

// Acompanhamentos/Adicionais
app.get(datasnap.route('ConsultaAcompanhamento/:CodigoProduto/'), auth, function (req, res) {
    var codigoProduto = req.params.CodigoProduto;
    console.log('-> ConsultaAcompanhamento', codigoProduto);
    mobileServer.consultaAcompanhamento(codigoProduto, function (result) {
        res.send(result);
    });
});

app.get(datasnap.route('ConsultaSabores/:IdProduto/'), auth, function (req, res) {
    var idProduto = req.params.IdProduto;
    console.log('-> ConsultaSabores', idProduto);
    mobileServer.consultaSabores(idProduto, function (result) {
        res.send(result);
    });
});

// TODO: revisar
app.get(datasnap.route('ConsultaProdutosId/:IdProduto/'), auth, function (req, res) {
    var idProduto = req.params.IdProduto;
    console.log('-> ConsultaProdutosId', idProduto);
    mobileServer.consultaProdutoId(idProduto, function (result) {
        res.send(result);
    });    
});

// Envio diretamente ao selecionar o item
///datasnap/rest/TServMet/"EnviarItem"/
app.post(datasnap.route('%22EnviarItem%22/'), auth, function (req, res) {
    console.log('-> EnviarItem')
    var parameters = req.body._parameters;
    mobileServer.enviarItem(parameters, function (result) {
        res.send(result);
    });
});

// consulta cartão (essa rota possui uma barra dupla antes do parametro de numero do cartão
app.get(datasnap.route('ConsultaCartao//:NumeroCartao/'), auth, function (req, res) {
    var numeroCartao = req.params.NumeroCartao;
    console.log('-> ConsultaCartao', numeroCartao);
    mobileServer.consultaCartao(numeroCartao, function (result) {
        res.send(result);
    });
});

//app.get('*', function (req, res) {
//   console.log(req);
//   console.log(req.headers);
//});

app.listen(1032, function () {
  console.log('Aguardando conexões na porta 1032...');
});

