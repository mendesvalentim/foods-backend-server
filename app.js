var auth = require('./auth.js').auth;
var express = require('express');
var bodyParser = require('body-parser');
var mobileServer = require('./mobileServer.js');
var datasnap = require('./datasnap.js');
var app = express();

//app.use(bodyParser.urlencoded({ extended: false }));

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
    console.log('-> ConsultaMesas');
    mobileServer.consultaMesas(function(result) {
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

// TODO: revisar
app.get(datasnap.route('ConsultaProdutosId/:IdProduto/'), auth, function (req, res) {
    var idProduto = req.params.IdProduto;
    console.log('-> ConsultaProdutosId', idProduto);
    result = {"result":[{"table":[["ID",6,0,0,0,4,4,0,true,false,0,false,false],["DESCRICAO",1,1,0,0,51,50,0,true,false,0,false,false],["PRECOVENDA",8,2,0,65532,34,18,0,true,false,0,false,false],["SABORES",6,3,0,0,4,4,0,true,false,0,false,false],["ADIC",6,4,0,0,4,4,0,true,false,0,false,false],["VENDEMEIAPORCAO",1,5,31,0,2,1,0,true,false,0,false,false],["VALORMEIAPORCAO",8,6,0,65534,34,18,0,true,false,0,false,false],["FRACIONADO",1,7,31,0,2,1,0,true,false,0,false,false]],"ID":[602327],"DESCRICAO":["*REFRIG.LATA SABORES 350ML"],"PRECOVENDA":[2.75],"SABORES":[12],"ADIC":[0],"VENDEMEIAPORCAO":["N"],"VALORMEIAPORCAO":[0],"FRACIONADO":["S"]}]}
    //res.send({"result":[null]});
    res.send(result);
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

/* =========================================================== */
/* =========================================================== */
/* =========================================================== */
/* =========================================================== */

// consulta cartão (essa rota possui uma barra dupla antes do parametro de numero do cartão
app.get(datasnap.route('ConsultaCartao//:NumeroCartao/'), auth, function (req, res) {
    console.log('-> ConsultaCartao');
    //res.send(req.params.nome);
    
    // Tipo, Ordem, ?, ?, Tamanho?, Tamanho, ?, null

    result = {
        "result": [
            {
                "table": [ 
                    ["ID"          , 6, 0, 0, 0, 4 , 4,  0, false, false, 0, false, false],
                    ["DESCRICAO"   , 1, 1, 0, 0, 11, 10, 0, false, false, 0, false, false],
                    ["DISPONIVEL"  , 6, 2, 0, 0, 4 , 4,  0, false, false, 0, false, false],
                    ["STATUS"      , 6, 3, 0, 0, 4 , 4,  0, false, false, 0, false, false],
                    ["OBSERVACAO"  , 1, 4, 0, 0, 51, 50, 0, true , false, 0, false, false]
                ]                  ,
                "ID":[17]          ,
                "DESCRICAO":["17"] ,
                "DISPONIVEL":[1]   ,
                "STATUS":[0]       ,
                "OBSERVACAO":[""]
            }
        ]
    };

    res.send(result);

    // resposta para cartão não encontrado
    //{"result":[{"table":[]}]}
});

// -- ----------------------------------
// -- ----------------------------------
// -- ----------------------------------

/*
http://10.1.1.42:1032/datasnap/rest/TServMet/ConsultaSabores/602327/
{"result":[{"table":[["IDSABOR",6,0,0,0,4,4,0,false,false,0,false,false],["DESCRICAO",1,1,0,0,41,40,0,true,false,0,false,false]],"IDSABOR":[23,28,24,29,35,27,36,123,30,25,34,144],"DESCRICAO":["COCA-COLA","COCA-COLA ZERO","FANTA LARANJA","FANTA UVA","FANTA LARANJA ZERO","GUARANA ANTARCTICA","GUARANA ANTARCTICA ZERO","GUARANA BLACK","SCHWEPPES","SPRITE","SPRITE ZERO","AGUA TONICA"]}]}
*/

app.get('*', function (req, res) {
   console.log(req);
   console.log(req.headers);
});

app.listen(1032, function () {
  console.log('Aguardando conexões na porta 1032...');
});

//Content-type: text/html; charset=ISO-8859-1
//Pragma: dssession=895936.690184.573389,dssessionexpires=1200000

