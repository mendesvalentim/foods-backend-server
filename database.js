var Firebird = require('node-firebird');

var options = {};
options.host = '127.0.0.1';
options.port = 3050;
options.database = '/ello/dados/buffalos.ello';
options.user = 'MOBILE';
options.password = 'masterkey';
options.role = null;            // default
options.pageSize = 4096;        // default when creating database

console.log('Criando pool de conexões com Firebird...');
var pool = Firebird.pool(5, options); // Cria 5 conexões

function execute(queryInstruction, values) {
    pool.get(function(err, db) {

        if (err)
            throw err;

        db.query(queryInstruction, values, function(err, result) {
            db.detach();
        });
    });
}

//pool.destroy();

function queryDatabase(queryInstruction, callback) {
    pool.get(function(err, db) {

        if (err)
            throw err;

        db.query(queryInstruction, function(err, result) {
            callback(result);
            db.detach();
        });

    });
}

module.exports.pool = pool;
module.exports.query = queryDatabase;
module.exports.execute = execute;

