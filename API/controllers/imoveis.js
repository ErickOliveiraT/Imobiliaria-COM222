const database = require('./database');

function storeImovel(imovel) {
    return new Promise(async (resolve, reject) => {
        let con = await database.getConnection();

        con.connect(function (err) {
            if (err) reject({ stored: false, error: err });

            let sql = 'INSERT INTO imoveis (tipo,descricao,nome_vendedor,preco,imagem,data) VALUES('
                + `'${imovel.tipo}', '${imovel.descricao}', '${imovel.nome_vendedor}', ${imovel.preco}, '${imovel.imagem}', '${imovel.data}')`;

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

function getImoveis() {
    return new Promise(async (resolve, reject) => {
        let con = await database.getConnection();

        con.connect(function (err) {
            if (err) reject({ error: err });

            let sql = 'SELECT * from imoveis';

            con.query(sql, function (err, result) {
                if (err) {
                    let error = err;
                    return reject({ error: error });
                }
                let imoveis = new Array();
                result.forEach(data => {
                    imoveis.push({
                        tipo: data.tipo,
                        descricao: data.descricao,
                        nome_vendedor: data.nome_vendedor,
                        preco: data.preco,
                        imagem: data.imagem,
                        data: data.data,
                    });
                });
                resolve(imoveis);
            });
        });
    });
}

function getImovel(codigo) {
    return new Promise(async (resolve, reject) => {
        let con = await database.getConnection();

        con.connect(function (err) {
            if (err) reject({ error: err });

            let sql = 'SELECT * from imoveis WHERE codigo='
                + `'${codigo}';`;

            con.query(sql, function (err, result) {
                if (err) {
                    let error = err;
                    return reject({ error: error });
                }
                resolve({
                    tipo: result[0].tipo,
                    descricao: result[0].descricao,
                    nome_vendedor: result[0].nome_vendedor,
                    preco: result[0].preco,
                    imagem: result[0].imagem,
                    data: result[0].data,
                });
            });
        });
    });
}

function updateImovel(imovel) {
    return new Promise(async (resolve) => {
        let con = await database.getConnection();

        con.connect(function (err) {
            if (err) resolve({ error: err });

            let sql = `UPDATE imoveis SET descricao='${imovel.descricao}', nome_vendedor='${imovel.nome_vendedor}', preco=${imovel.preco}, imagem='${imovel.imagem}', data='${imovel.data}' WHERE codigo=${imovel.codigo}`;

            con.query(sql, async function (err, result) {
                if (err) resolve({ updated: false, error: err });
                resolve({ updated: true, new_imovel: imovel });
            });
        });
    });
}

function deleteImovel(codigo) {
    return new Promise(async (resolve) => {
        let con = await database.getConnection();

        con.connect(function (err) {
            if (err) resolve({ error: err });

            let sql = `DELETE FROM imoveis WHERE codigo=${codigo}`;

            con.query(sql, async function (err, result) {
                if (err) resolve({ deleted: false, error: err });
                resolve({ deleted: result.affectedRows > 0 ? true: false });
            });
        });
    });
}

module.exports = { storeImovel, getImoveis, getImovel, updateImovel, deleteImovel }