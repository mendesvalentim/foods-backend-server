var database = require('./database.js');
var datasnap = require('./datasnap.js');

function validaCredenciais(user, callback) {
    var sql = "SELECT NomeCompleto FROM SysUsuario WHERE UPPER(Login)=UPPER(':login') AND SENHA=':senha' AND ATIVO=1";
    sql = sql.replace(':login', user.name);
    sql = sql.replace(':senha', user.pass);
    database.query(sql, function (result) {
        callback(result.length>0);
    });
}

function consultaMesas(callback) {
   // Tipo, Ordem, ?, ?, Tamanho?, Tamanho, ?, null
   var tableStructure = [["ID", 6, 0, 0, 0, 4, 4, 0, false, false, 0, false, false], ["DESCRICAO", 1, 1, 0, 0, 11, 10, 0, false, false, 0, false, false], ["DISPONIVEL", 6, 2, 0, 0, 4, 4, 0, false, false, 0, false, false], ["STATUS", 6, 3, 0, 0, 4, 4, 0, false, false, 0, false, false], ["OBSERVACAO", 1, 4, 0, 0, 51, 50, 0, true, false, 0, false, false]];
   var sql = "SELECT R.ID, R.DESCRICAO, R.DISPONIVEL, R.STATUS, COALESCE(R.OBSERVACAO,'') AS OBSERVACAO " +
             "FROM RESMESA R " +
             "WHERE R.STATUS <> 3 AND R.DISPONIVEL = 1 AND R.PRACA like '%' ORDER BY R.ID";
   database.query(sql, function(result) {
       result = datasnap.prepareResult(tableStructure, result);
       callback(result);
   });
}

function consultaPedidosCons(numeroCartao, callback) {
    var tableStructure = [["ID",6,0,0,0,4,4,0,false,false,0,false,false],["IDLOCALCONSUMO",6,1,0,0,4,4,0,false,false,0,false,false],["USUARIO",1,2,0,0,31,30,0,false,false,0,false,false],["IDPRODUTO",6,3,0,0,4,4,0,false,false,0,false,false],["QTDE",8,4,0,65534,34,18,0,false,false,0,false,false],["OBSERVACAO",1,5,0,0,201,200,0,false,false,0,false,false],["OCUPANTES",6,6,0,0,4,4,0,false,false,0,false,false],["SABORES",1,7,0,0,201,200,0,false,false,0,false,false],["DESCRICAO",1,8,0,0,101,100,0,true,false,0,false,false],["VLRTOTAL",8,9,0,65532,34,18,0,true,false,0,false,false],["PRECOVENDA",8,10,0,65534,34,18,0,true,false,0,false,false],["IDENTIFICACAO",1,11,0,0,101,100,0,true,false,0,false,false],["VALORSERVICO",8,12,0,65534,34,18,0,false,false,0,false,false]]
    var sql = 
        "SELECT                                                                " +
        "     c.ID                                                             " +
        "     , c.IDLOCALCONSUMO                                               " +
        "     , c.USUARIO                                                      " +
        "     , c.IDPRODUTO                                                    " +
        "     , c.QTDE                                                         " +
        "     , COALESCE(c.OBSERVACAO, '') as observacao                       " +
        "     , COALESCE(c.OCUPANTES,0) OCUPANTES                              " +
        "     , COALESCE(c.SABORES,'') SABORES                                 " +
        "     , p.descricao                                                    " +
        "     , COALESCE((c.qtde * COALESCE(c.VALORUNITARIO,0)),0) as vlrTotal " +
        "     , COALESCE(c.VALORUNITARIO,0) precovenda                         " +
        "     , COALESCE(c.IDENTIFICACAO,'') IDENTIFICACAO                     " +
        "     , COALESCE(c.VALORSERVICO, 0) VALORSERVICO                       " +
        "FROM LCTOCONSUMO c INNER JOIN ESTPRODUTOS p on p.id = c.idproduto     " +
        "WHERE c.idlocalconsumo = " + numeroCartao;

    database.query(sql, function(result) {
        result = datasnap.prepareResult(tableStructure, result);
        callback(result);
    });
}

function consultaGrupo(callback) {
    var tableStructure = [["IDGRUPO", 6, 0, 0, 0, 4, 4, 0, false, false, 0, false, false], ["DESCRICAO", 1, 1, 0, 0, 51, 50, 0, true, false, 0, false, false], ["QTDE", 6, 2, 0, 0, 4, 4, 0, true, false, 0, false, false], ["SUB", 6, 3, 0, 0, 4, 4, 0, true, false, 0, false, false]];
    var sql = 
        "SELECT                                                                               " +
        "  G.ID IDGRUPO,                                                                      " +
        "  G.descricao,                                                                       " +
        "  (SELECT count(P.id) FROM estprodutos P WHERE P.idgrupo = G.ID) AS QTDE,            " +
        "  COALESCE((SELECT COUNT(r.ID) FROM ESTGRUPOS r WHERE r.IDGRUPOPAI = g.ID),0) SUB    " +
        "FROM ESTGRUPOS G                                                                     " +
        "WHERE G.IDGRUPOPAI IS NULL AND G.ATIVO = 1 AND G.DISPONIVELMOBILE = 'S' AND TIPO = 0 " +
        "ORDER BY G.descricao                                                                 ";
    database.query(sql, function (result) {
        result = datasnap.prepareResult(tableStructure, result);
        callback(result);
    });
}

// Consulta de Produtos
// Obs: o :IdGrupo vem vazio quando a consulta de produtos deve retornar todos os produtos
//      Neste caso é só omitir o where na consulta ao banco de dados
function consultaProdutos(idGrupo, callback) {
    var tableStructure = [ ["ID",6,0,0,0,4,4,0,true,false,0,false,false], ["DESCRICAO",1,1,0,0,51,50,0,true,false,0,false,false], ["PRECOVENDA",8,2,0,65532,34,18,0,true,false,0,false,false], ["SABORES",6,3,0,0,4,4,0,true,false,0,false,false], ["ADIC",6,4,0,0,4,4,0,true,false,0,false,false], ["VENDEMEIAPORCAO",1,5,31,0,2,1,0,true,false,0,false,false], ["VALORMEIAPORCAO",8,6,0,65534,34,18,0,true,false,0,false,false], ["FRACIONADO",1,7,31,0,2,1,0,true,false,0,false,false] ];
    var sql = 
        "SELECT                                                                                       " +
        "  PRO.ID,                                                                                    " +
        "  PRO.DESCRICAO,                                                                             " +
        "  PRO.PRECOVENDA,                                                                            " +
        "  COALESCE((SELECT COUNT(*) FROM ressaboreproduto r WHERE r.idproduto = PRO.ID), 0) sabores, " +
        "  COALESCE((SELECT COUNT(*) FROM RESCOMPPRODUTO a WHERE a.idproduto = pro.id),0) ADIC,       " +
        "  COALESCE(PRO.VENDEMEIAPORCAO,'')  VENDEMEIAPORCAO,                                         " +
        "  COALESCE(PRO.VALORMEIAPORCAO,0) VALORMEIAPORCAO,                                           " +
        "  COALESCE(PRO.FRACIONADO,'') FRACIONADO                                                     " +
        "FROM VWPRODUTOS PRO                                                                          " +
        "LEFT OUTER JOIN ESTGRUPOS GRU ON (GRU.ID=PRO.IDGRUPO)                                        ";
        if (idGrupo>0)
            sql += "WHERE PRO.IDGRUPO = " + idGrupo;
    database.query(sql, function (result) {
        result = datasnap.prepareResult(tableStructure, result);
        callback(result);
    });
}

// TODO: Implementar
function consultaProdutosId(idProduto, callback) {

}

function consultaAcompanhamento(codigoProduto, callback) {
    var tableStructure = [["IDCOMPLEMENTO",6,0,0,0,4,4,0,false,false,0,false,false],["DESCRICAO",1,1,0,0,31,30,0,true,false,0,false,false]];
    var sql = 
        "SELECT PRO.IDCOMPLEMENTO, ADI.DESCRICAO                  " +
        "FROM RESCOMPPRODUTO PRO                                  " +
        "LEFT JOIN RESADICIONAIS ADI ON(ADI.ID=PRO.IDCOMPLEMENTO) " +
        "WHERE PRO.IDPRODUTO = " + codigoProduto;
    database.query(sql, function (result) {
        result = datasnap.prepareResult(tableStructure, result);
        callback(result);
    });
}

function consultaSabores(idProduto, callback) {
    var tableStructure = [["IDSABOR",6,0,0,0,4,4,0,false,false,0,false,false],["DESCRICAO",1,1,0,0,41,40,0,true,false,0,false,false]];
    var sql = "SELECT PRO.IDSABOR, ADI.DESCRICAO " +
              "FROM RESSABOREPRODUTO PRO " +
              "LEFT OUTER JOIN RESSABORES ADI ON (ADI.ID=PRO.IDSABOR) " +
              "WHERE ADI.ATIVO = 1 AND PRO.IDPRODUTO=" + idProduto;
    database.query(sql, function (result) {
        result = datasnap.prepareResult(tableStructure, result);
        callback(result);
    });
}

// TODO: implementar
function consultaCartao(numeroCartao, callback) {
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
    callback(result);
}

function enviarItem(parameters, callback) {
    var itens = parameters[0];
    itens.reverse();
    gravaItens(itens, parameters[1], function () {
        callback({"result": ["Item enviado com sucesso"]});
    });
}

function gravaItens(itens, usuario, callback) {
    item = itens.pop();

    if (item==undefined) {
        callback();
        return;
    }

/*
    Propriedades no primeiro item:
      "cliente":"*ADICIONAL HAMBURGUER ",
      "descMesa":"22",
      "percServico":0,
*/
    if (item.hasOwnProperty('descMesa')) {
        console.log('Atualizando dados mesa...', item.ocupantes, item.descMesa, item.idMesa);
        database.execute("UPDATE lctoconsumo SET ocupantes=?, IDENTIFICACAO='?' WHERE C.idlocalconsumo=?", 
                         [item.ocupantes, item.descMesa, item.idMesa]);
        database.execute("UPDATE RESMESA SET OBSERVACAO='?' WHERE DESCRICAO='?'", [item.cliente, item.idMesa]);
    }

    // define alguns valores padrão para o caso da propriedade não estar setada
    item.obs = item.obs || ''; // só existe se o adicional for definido no produto
    item.sabores = item.sabores || '';

    console.log('Gravando item: ', item, usuario);

    // lançar item em lctoconsumo
    database.execute("INSERT INTO LCTOCONSUMO (IDLOCALCONSUMO, USUARIO, IDPRODUTO, QTDE, OBSERVACAO, OCUPANTES, "+
                     "SABORES, IDENTIFICACAO, VALORUNITARIO, MEIAPORCAO, IDENTIFICACAOMESA) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                     [item.idMesa, usuario, item.idProduto, item.qtde, item.obs, item.ocupantes, item.sabores, 
                      item.produto, item.preco, item.meiaPorcao, item.descMesa]);

    gravaItens(itens, usuario, callback);
}

module.exports.validaCredenciais = validaCredenciais;
module.exports.consultaMesas = consultaMesas;
module.exports.consultaPedidosCons = consultaPedidosCons;
module.exports.consultaGrupo = consultaGrupo;
module.exports.consultaProdutos = consultaProdutos;
module.exports.consultaProdutosId = consultaProdutosId;
module.exports.consultaAcompanhamento = consultaAcompanhamento;
module.exports.consultaCartao = consultaCartao;
module.exports.consultaSabores = consultaSabores;
module.exports.enviarItem = enviarItem

