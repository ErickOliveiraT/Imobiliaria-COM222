const database = require('./database');

function storeCorretor(corretor) {
    return new Promise(async (resolve, reject) => {
        let con = await database.getConnection();

        con.connect(function (err) {
            if (err) reject({ stored: false, error: err });

            let sql = 'INSERT INTO corretores (creci,nome,tipo,comissao,salario,data_admissao) VALUES('
                + `'${corretor.creci}', '${corretor.nome}', '${corretor.tipo}', ${corretor.comissao}, ${corretor.salario}, '${corretor.data_admissao}')`;

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

function getCorretores() {
    return new Promise(async (resolve, reject) => {
        let con = await database.getConnection();

        con.connect(function (err) {
            if (err) reject({ error: err });

            let sql = 'SELECT * from corretores';

            con.query(sql, function (err, result) {
                if (err) {
                    let error = err;
                    return reject({ error: error });
                }
                let corretores = new Array();
                result.forEach(data => {
                    corretores.push({
                        creci: data.creci,
                        nome: data.nome,
                        tipo: data.tipo,
                        comissao: data.comissao,
                        salario: data.salario,
                        data_admissao: data.data_admissao,
                    });
                });
                resolve(corretores);
            });
        });
    });
}

function getCorretor(creci) {
    return new Promise(async (resolve, reject) => {
        let con = await database.getConnection();

        con.connect(function (err) {
            if (err) reject({ error: err });

            let sql = 'SELECT * from corretores WHERE creci='
                + `'${creci}';`;

            con.query(sql, function (err, result) {
                if (err) {
                    let error = err;
                    return reject({ error: error });
                }
                resolve({
                    creci: result[0].creci,
                    nome: result[0].nome,
                    tipo: result[0].tipo,
                    comissao: result[0].comissao,
                    salario: result[0].salario,
                    data_admissao: result[0].data_admissao,
                });
            });
        });
    });
}

function updateCorretor(corretor) {
    return new Promise(async (resolve) => {
        let con = await database.getConnection();

        con.connect(function (err) {
            if (err) resolve({ error: err });

            let sql;
            if (corretor.salario && !corretor.comissao) sql = `UPDATE corretores SET salario=${corretor.salario} WHERE creci='${corretor.creci}'`;
            if (corretor.comissao && !corretor.salario) sql = `UPDATE corretores SET comissao=${corretor.comissao} WHERE creci='${corretor.creci}'`;

            con.query(sql, async function (err, result) {
                if (err) resolve({ updated: false, error: err });
                resolve({ updated: result.affectedRows > 0 ? true : false });
            });
        });
    });
}

module.exports = { storeCorretor, getCorretores, getCorretor, updateCorretor }