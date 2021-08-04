const database = require('./database');

function storeVenda(venda) {
    return new Promise(async (resolve, reject) => {
        let con = await database.getConnection();

        con.connect(function (err) {
            if (err) reject({ stored: false, error: err });

            let sql = 'INSERT INTO vendas (nome_comprador,data_venda,valor,creci_corretor,codigo_imovel) VALUES('
                + `'${venda.nome_comprador}', '${venda.data_venda}', ${venda.valor}, '${venda.creci_corretor}', ${venda.codigo_imovel})`;

            con.query(sql, function (err, result) {
                if (err) {
                    let error = err;
                    return reject({ stored: false, error: error });
                }
                resolve({ stored: true, result: result });
            });
        });
    });
}

function getVendas() {
    return new Promise(async (resolve, reject) => {
        let con = await database.getConnection();

        con.connect(function (err) {
            if (err) reject({ error: err });

            let sql = 'SELECT * from vendas';

            con.query(sql, function (err, result) {
                if (err) {
                    let error = err;
                    return reject({ error: error });
                }
                let vendas = new Array();
                result.forEach(data => {
                    vendas.push({
                        codigo: data.codigo,
                        nome_comprador: data.nome_comprador,
                        data_venda: data.data_venda,
                        valor: data.valor,
                        creci_corretor: data.creci_corretor,
                        codigo_imovel: data.codigo_imovel
                    });
                });
                resolve(vendas);
            });
        });
    });
}

function getVendasByDate(date) {
    return new Promise(async (resolve, reject) => {
        let con = await database.getConnection();

        con.connect(function (err) {
            if (err) reject({ error: err });

            let sql = `SELECT * FROM vendas WHERE data_venda LIKE '%${date.replace('-','/')}'`;

            con.query(sql, function (err, result) {
                if (err) {
                    let error = err;
                    return reject({ error: error });
                }
                let vendas = new Array();
                result.forEach(data => {
                    vendas.push({
                        codigo: data.codigo,
                        nome_comprador: data.nome_comprador,
                        data_venda: data.data_venda,
                        valor: data.valor,
                        creci_corretor: data.creci_corretor,
                        codigo_imovel: data.codigo_imovel
                    });
                });
                resolve(vendas);
            });
        });
    });
}

function getVendasVendedor(creci) {
    return new Promise(async (resolve, reject) => {
        let con = await database.getConnection();

        con.connect(function (err) {
            if (err) reject({ error: err });

            let sql = `SELECT * from vendas WHERE creci_corretor='${creci}'`;

            con.query(sql, function (err, result) {
                if (err) {
                    let error = err;
                    return reject({ error: error });
                }
                let vendas = new Array();
                result.forEach(data => {
                    vendas.push({
                        codigo: data.codigo,
                        nome_comprador: data.nome_comprador,
                        data_venda: data.data_venda,
                        valor: data.valor,
                        creci_corretor: data.creci_corretor,
                        codigo_imovel: data.codigo_imovel
                    });
                });
                resolve(vendas);
            });
        });
    });
}

module.exports = { storeVenda, getVendas, getVendasVendedor, getVendasByDate }