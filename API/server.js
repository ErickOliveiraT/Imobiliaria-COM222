const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

app.use(express.json());
app.use(cors());

const imoveis = require('./controllers/imoveis');
const corretores = require('./controllers/corretores');
const vendas = require('./controllers/vendas');

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
    const data_cadastro = req.body.data_cadastro;

    if (!tipo || !tipos.includes(tipo)) return res.status(400).send({ error: 'Tipo de imóvel inválido ou não especificado' });
    if (!descricao || descricao == '') return res.status(400).send({ error: 'Descrição não informada' });
    if (!nome_vendedor || nome_vendedor == '') return res.status(400).send({ error: 'Nome do vendedor não informado' });
    if (!preco) return res.status(400).send({ error: 'Preço não informado' });
    if (!data_cadastro || data_cadastro == '') return res.status(400).send({ error: 'Data de cadastro não informada' });

    const imovel = {
        tipo,
        descricao,
        nome_vendedor,
        preco,
        imagem,
        data_cadastro
    };

    imoveis.storeImovel(imovel)
        .then((response) => {
            if (response.stored) return res.status(201).send(response);
            res.status(400).send(response);
        })
        .catch((error) => { res.status(500).send(error) });
});

// Consulta imóveis
app.get('/imoveis', async (req, res) => {
    imoveis.getImoveis()
        .then((response) => {
            return res.status(200).send(response);
        })
        .catch((error) => { res.status(500).send(error) });
});

// Consulta imóvel pelo código
app.get('/imoveis/:codigo?', async (req, res) => {
    const codigo = req.params.codigo;

    if (!codigo || codigo.trim() == '') return res.status(400).send({ error: 'Código não informado' });

    imoveis.getImovel(codigo)
        .then((response) => {
            return res.status(200).send(response);
        })
        .catch((error) => { res.status(500).send(error) });
});

// Atualiza imóvel
app.put('/imoveis/:codigo?', async (req, res) => {
    const codigo = req.params.codigo;
    const descricao = req.body.descricao;
    const nome_vendedor = req.body.nome_vendedor;
    const preco = req.body.preco;
    const imagem = req.body.imagem;
    const data_cadastro = req.body.data_cadastro;
    const disponivel = req.body.disponivel;

    if (!codigo || codigo.trim() == '') return res.status(400).send({ error: 'Código não informado' });
    if (!descricao || descricao == '') return res.status(400).send({ error: 'Descrição não informada' });
    if (!nome_vendedor || nome_vendedor == '') return res.status(400).send({ error: 'Nome do vendedor não informado' });
    if (!preco) return res.status(400).send({ error: 'Preço não informado' });
    if (!data_cadastro || data_cadastro == '') return res.status(400).send({ error: 'Data de cadastro não informada' });
    if (!disponivel) return res.status(400).send({ error: 'Disponilidade não informada' });

    const imovel = {
        codigo,
        descricao,
        nome_vendedor,
        preco,
        imagem,
        data_cadastro,
        disponivel
    };

    imoveis.updateImovel(imovel)
        .then((response) => {
            if (response.updated) return res.status(200).send(response);
            res.status(400).send(response);
        })
        .catch((error) => { res.status(500).send(error) });
});

// Deleta imóvel
app.delete('/imoveis/:codigo?', async (req, res) => {
    const codigo = req.params.codigo;

    if (!codigo || codigo.trim() == '') return res.status(400).send({ error: 'Código não informado' });

    imoveis.deleteImovel(codigo)
        .then((response) => {
            if (response.stored) return res.status(200).send(response);
            res.status(400).send(response);
        })
        .catch((error) => { res.status(500).send(error) });
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
            if (response.stored) return res.status(201).send(response);
            res.status(400).send(response);
        })
        .catch((error) => { res.status(500).send(error) });
});

// Consulta Corretor
app.get('/corretores', async (req, res) => {
    corretores.getCorretores()
        .then((response) => {
            return res.status(200).send(response);
        })
        .catch((error) => { res.status(500).send(error) });
});

// Consulta corretor pelo creci
app.get('/corretores/:creci?', async (req, res) => {
    const creci = req.params.creci;

    if (!creci || creci.trim() == '') return res.status(400).send({ error: 'Creci não informado' });

    corretores.getCorretor(creci)
        .then((response) => {
            return res.status(200).send(response);
        })
        .catch((error) => { res.status(500).send(error) });
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
            if (response.updated) return res.status(200).send(response);
            res.status(400).send(response);
        })
        .catch((error) => { res.status(500).send(error) });
});

// Deleta Corretor
app.delete('/corretores/:creci?', async (req, res) => {
    const creci = req.params.creci;

    if (!creci || creci.trim() == '') return res.status(400).send({ error: 'Creci não informado' });

    corretores.deleteCorretor(creci)
        .then((response) => {
            if (response.deleted) return res.status(200).send(response);
            res.status(400).send(response);
        })
        .catch((error) => { res.status(500).send(error) });
});

//Rota para criação de vendas
app.post('/vendas', async (req, res) => {
    const nome_comprador = req.body.nome_comprador;
    const data_venda = req.body.data_venda;
    const valor = req.body.valor;
    const creci_corretor = req.body.creci_corretor;
    const codigo_imovel = req.body.codigo_imovel;

    if (!nome_comprador) return res.status(400).send({ error: 'Nome do comprado não informado' });
    if (!data_venda) return res.status(400).send({ error: 'Data da venda não informada' });
    if (!valor) return res.status(400).send({ error: 'Valor da venda não informado' });
    if (!creci_corretor) return res.status(400).send({ error: 'CRECI do corretor não informado' });
    if (!codigo_imovel) return res.status(400).send({ error: 'Código do imóvel não informado' });

    const venda = {
        nome_comprador,
        data_venda,
        valor,
        creci_corretor,
        codigo_imovel
    }

    vendas.storeVenda(venda)
        .then(async (response) => {
            if (response.stored) {
                try {
                    await imoveis.setNaoDisponivel(venda.codigo_imovel);
                    return res.status(201).send(response);
                }
                catch (e) {
                    console.error('Erro ao alterar disponibilidade do imóvel: ', err);
                    return res.status(201).send(response);
                }
            }
            res.status(400).send(response);
        })
        .catch((error) => { res.status(500).send(error) });
});

//Rota para consulta das vendas
app.get('/vendas', async (req, res) => {
    vendas.getVendas()
    .then(response => {
        return res.status(200).send(response);
    })
    .catch(err => {
        return res.status(500).send(err);
    })
});

//Rota para consulta das vendas por vendedor
app.get('/vendas/:creci?', async (req, res) => {
    const creci = req.params.creci;

    if (!creci || creci.trim() == '') return res.status(400).send({ error: 'Creci não informado' });

    vendas.getVendasVendedor(creci)
    .then(response => {
        return res.status(200).send(response);
    })
    .catch(err => {
        return res.status(500).send(err);
    })
});

const port = process.env.SERVER_PORT || 3000;
app.listen(port);
console.log('Server listening on port ', port);