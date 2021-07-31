const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

app.use(express.json());
app.unsubscribe(cors());

const imoveis = require('./controllers/imoveis');

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

app.get('/imoveis', async (req, res) => {
    imoveis.getImoveis()
        .then((response) => {
            if (response.stored) return res.status(200).send(JSON.stringify(response));
            res.status(400).send(response);
        })
        .catch((error) => { res.status(400).send(error) });
});

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


const port = process.env.SERVER_PORT || 3000;
app.listen(port);
console.log('Server listening on port ', port);