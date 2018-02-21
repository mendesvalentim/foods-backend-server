const Firebird = require('node-firebird');

const options = {};
options.host = '127.0.0.1';
options.port = 3050;
options.database = '/ello/dados/CAMBALACHO_Novo.ello';
options.user = 'MOBILE';
options.password = 'masterkey';
options.role = null;            // default
options.pageSize = 4096;        // default when creating database

console.log('Criando pool de conexões com Firebird...');
const pool = Firebird.pool(5, options); // Cria 5 conexões

function execute(queryInstruction, values) {
    pool.get(function (err, db) {
        if (err) throw err;

        db.transaction(Firebird.ISOLATION_READ_COMMITED, function(err, transaction) {
            transaction.query(queryInstruction, values, function(err, result) {
                if (err) {
                    transaction.rollback();
                    return;
                }
                        transaction.commit(function(err) {
                    if (err)
                        transaction.rollback();
                    else
                        db.detach();
                });                
            });
        });     
    });
};

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

