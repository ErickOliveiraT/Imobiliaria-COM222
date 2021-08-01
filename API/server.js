const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

app.use(express.json());
app.unsubscribe(cors());

const imoveis = require('./controllers/imoveis');
const corretores = require('./controllers/corretores');

app.get('/', function (req, res) {
    res.sendStatus(200);
});

//Cadastro de imóvel
app.post('/imoveis', async (req, res) => {
    const tipos = ['casa', 'apartamento', 'sala comercial', 'lote', 'chácara', 'sítio', 'fazenda'];
    const tipo = req.body.tipo;
    const descricao = req.body.descricao;
    const nome_vendedor = req.body.nome_vendedor;
    const preco = req.body.preco;
    const imagem = req.body.imagem;
    const data = req.body.data;

    if (!tipo || !tipos.includes(tipo)) return res.status(400).send({ error: 'Tipo de imóvel inválido ou não especificado' });
    if (!descricao || descricao == '') return res.status(400).send({ error: 'Descrição não informada' });
    if (!nome_vendedor || nome_vendedor == '') return res.status(400).send({ error: 'Nome do vendedor não informado' });
    if (!preco) return res.status(400).send({ error: 'Preço não informado' });
    if (!data || data == '') return res.status(400).send({ error: 'Data não informada' });

    const imovel = {
        tipo,
        descricao,
        nome_vendedor,
        preco,
        imagem,
        data
    };

    imoveis.storeImovel(imovel)
        .then((response) => {
            if (response.stored) return res.status(201).send(JSON.stringify(response));
            res.status(400).send(response);
        })
        .catch((error) => { res.status(400).send(error) });
});

// Consulta imóveis
app.get('/imoveis', async (req, res) => {
    imoveis.getImoveis()
        .then((response) => {
            if (response.stored) return res.status(200).send(JSON.stringify(response));
            res.status(400).send(response);
        })
        .catch((error) => { res.status(400).send(error) });
});

// Consulta imóvel pelo código
app.get('/imoveis/:codigo?', async (req, res) => {
    const codigo = req.params.codigo;

    if (!codigo || codigo.trim() == '') return res.status(400).send({ error: 'Código não informado' });

    imoveis.getImovel(codigo)
        .then((response) => {
            if (response.stored) return res.status(200).send(JSON.stringify(response));
            res.status(400).send(response);
        })
        .catch((error) => { res.status(400).send(error) });
});

// Atualiza imóvel
app.put('/imoveis/:codigo?', async (req, res) => {
    const codigo = req.params.codigo;
    const descricao = req.body.descricao;
    const nome_vendedor = req.body.nome_vendedor;
    const preco = req.body.preco;
    const imagem = req.body.imagem;
    const data = req.body.data;

    if (!codigo || codigo.trim() == '') return res.status(400).send({ error: 'Código não informado' });
    if (!descricao || descricao == '') return res.status(400).send({ error: 'Descrição não informada' });
    if (!nome_vendedor || nome_vendedor == '') return res.status(400).send({ error: 'Nome do vendedor não informado' });
    if (!preco) return res.status(400).send({ error: 'Preço não informado' });
    if (!data || data == '') return res.status(400).send({ error: 'Data não informada' });

    const imovel = {
        codigo,
        descricao,
        nome_vendedor,
        preco,
        imagem,
        data
    };

    imoveis.updateImovel(imovel)
        .then((response) => {
            if (response.updated) return res.status(200).send(JSON.stringify(response));
            res.status(400).send(response);
        })
        .catch((error) => { res.status(400).send(error) });
});

// Deleta imóvel
app.delete('/imoveis/:codigo?', async (req, res) => {
    const codigo = req.params.codigo;

    if (!codigo || codigo.trim() == '') return res.status(400).send({ error: 'Código não informado' });

    imoveis.deleteImovel(codigo)
        .then((response) => {
            if (response.stored) return res.status(200).send(JSON.stringify(response));
            res.status(400).send(response);
        })
        .catch((error) => { res.status(400).send(error) });
});

// Cadastra corretor
app.post('/corretores', async (req, res) => {
    const tipos = ['contratado', 'comissionado'];
    const tipo = req.body.tipo;
    const nome = req.body.nome;
    const creci = req.body.creci;
    const comissao = tipo === 'contratado' ? 1 : req.body.comissao;
    const salario = tipo === 'comissionado' ? null : req.body.salario;
    const data_admissao = req.body.data_admissao;

    if (!tipo || !tipos.includes(tipo)) return res.status(400).send({ error: 'Tipo do corretor inválido ou não especificado' });
    if (!nome || nome == '') return res.status(400).send({ error: 'Nome não informado' });
    if (!creci || creci == '') return res.status(400).send({ error: 'Creci não informado' });
    if (!comissao) return res.status(400).send({ error: 'Comissão não informada' });
    if (comissao < 1 || comissao > 3) return res.status(400).send({ error: 'Comissão deve ser entre 1% a 3%' });
    if (!salario && tipo == 'contratado') return res.status(400).send({ error: 'Salário não informado' });
    if (!data_admissao || data_admissao == '') return res.status(400).send({ error: 'Data de admissão não informada' });

    const corretor = {
        tipo,
        nome,
        creci,
        comissao,
        salario,
        data_admissao,
    };

    corretores.storeCorretor(corretor)
        .then((response) => {
            if (response.stored) return res.status(201).send(JSON.stringify(response));
            res.status(400).send(response);
        })
        .catch((error) => { res.status(400).send(error) });
});

// Consulta Corretor
app.get('/corretores', async (req, res) => {
    corretores.getCorretores()
        .then((response) => {
            if (response.stored) return res.status(200).send(JSON.stringify(response));
            res.status(400).send(response);
        })
        .catch((error) => { res.status(400).send(error) });
});

// Consulta corretor pelo creci
app.get('/corretores/:creci?', async (req, res) => {
    const creci = req.params.creci;

    if (!creci || creci.trim() == '') return res.status(400).send({ error: 'Creci não informado' });

    corretores.getCorretor(creci)
        .then((response) => {
            if (response.stored) return res.status(200).send(JSON.stringify(response));
            res.status(400).send(response);
        })
        .catch((error) => { res.status(400).send(error) });
});

// Atualiza Corretor
app.put('/corretores/:creci?', async (req, res) => {
    const creci = req.params.creci;
    const salario = req.body.salario || null;
    const comissao = req.body.comissao || null;

    if (!creci) return res.status(400).send({ error: 'CRECI não informado' });
    if (!salario && !comissao) return res.status(400).send({ error: 'É necessário informar a comissão ou salário' });
    if (comissao && (comissao < 1 || comissao > 3)) return res.status(400).send({ error: 'Comissão deve ser entre 1% a 3%' });

    const corretor = {
        creci,
        salario,
        comissao
    }

    corretores.updateCorretor(corretor)
    .then((response) => {
        if (response.updated) return res.status(200).send(JSON.stringify(response));
        res.status(400).send(response);
    })
    .catch((error) => { res.status(400).send(error) });
});



const port = process.env.SERVER_PORT || 3000;
app.listen(port);
console.log('Server listening on port ', port);