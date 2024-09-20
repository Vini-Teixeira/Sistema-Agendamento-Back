require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors')

const PORT = process.env.PORT || 3000

const app = express();
app.use(express.json());

app.use(cors())

// Definindo o modelo de usuário
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    senha: { type: String, required: true },
    confirmeSenha: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

//Definindo o modelo de agendamento
const agendamentoSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    telefone: { type: String, required: true },
    placa: { type: String, required: true },
    servico: { type: String, required: true }
})

const Agendamento = mongoose.model('Agendamento', agendamentoSchema)

// Rota Pública
app.get('/', (req, res) => {
    res.status(200).json({ msg: 'API acessada!' });
});

// Rota privada para obter usuário por ID
app.get('/user/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findById(id).select('-senha -confirmeSenha');
        if (!user) {
            return res.status(404).json({ msg: 'Usuário não encontrado.' });
        }
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ msg: 'Erro ao buscar usuário.', error: error.message });
    }
});

// Registro de Usuário
app.post('/auth/registroUsuario', async (req, res) => {
    const { email, senha, confirmeSenha } = req.body;

    if (!email || !senha || !confirmeSenha) {
        return res.status(422).json({ msg: 'Campo obrigatório não preenchido.' });
    }
    if (senha !== confirmeSenha) {
        return res.status(422).json({ msg: 'As senhas não conferem' });
    }

    try {
        const usuarioExistente = await User.findOne({ email: email });
        if (usuarioExistente) {
            return res.status(422).json({ msg: 'Usuário já cadastrado no sistema.' });
        }

        const salt = await bcrypt.genSalt(12);
        const senhaHash = await bcrypt.hash(senha, salt);

        const user = new User({
            email, senha: senhaHash, confirmeSenha: senhaHash
        });

        await user.save();
        res.status(201).json({ msg: 'Usuário criado com sucesso!' });
    } catch (error) {
        res.status(500).json({ msg: 'Erro detectado. Tente novamente mais tarde.', error: error.message });
    }
});

// Login de usuário
app.post('/auth/loginUsuario', async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(422).json({ msg: 'Todos os campos são obrigatórios' });
    }

    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ msg: 'Usuário ou Senha inválidos.' });
        }

        const checagemSenha = await bcrypt.compare(senha, user.senha);
        if (!checagemSenha) {
            return res.status(404).json({ msg: 'Usuário ou Senha inválidos.' });
        }

        const secret = process.env.SECRET;
        const token = jwt.sign({ id: user._id }, secret, { expiresIn: '1h' });
        res.status(200).json({ msg: 'Autenticado!', token });
    } catch (error) {
        res.status(500).json({ msg: 'Erro detectado. Tente novamente mais tarde.', error: error.message });
    }
});

//Rotas relacionadas ao agendamento de Serviços
app.get('/agendamentos', async (req, res) => {
    try {
        const agendamentos = await Agendamento.find()
        res.status(200).json(agendamentos)
    } catch (error) {
        res.status(500).json({message: 'Erro interno ao buscar agendamentos.', error: error.message})
    }
})

app.post('/agendamentos', async (req, res) => {
    const { nome, telefone, placa, servico } = req.body

    if(!nome || !telefone || !placa || !servico) {
        return res.status(400).json({message: 'Todos os campos são obrigatórios!'})
    }

    try {
        // Verifica se já existe um agendamento com os mesmos detalhes
        const agendamentoExistente = await Agendamento.findOne({ telefone, placa });
        if (agendamentoExistente) {
            return res.status(409).json({ message: 'Agendamento já existe com esses detalhes.' });
        }

        const novoAgendamento = new Agendamento({ nome, telefone, placa, servico });
        const agendamentoSalvo = await novoAgendamento.save();
        res.status(200).json(agendamentoSalvo);
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor.', error });
    }
})

app.put('/agendamentos/:id', async (req, res) => {
    const { id } = req. params
    const { nome, telefone, placa, servico } = req.body

    try {
        const agendamento = await Agendamento.findById(id)
        if(!agendamento) {
            return res.status(404).json({message: 'Agendamento não encontrado'})
        }

        agendamento.nome = nome
        agendamento.telefone = telefone
        agendamento.placa = placa
        agendamento.servico = servico

        const agendamentoAtualizado = await agendamento.save()
        res.status(200).json(agendamentoAtualizado)

    } catch (error) {
        res.status(500).json({message: 'Erro ao atualizar', error: error.message})
    }
})

app.delete('/agendamentos', async (req, res) => {
    const { ids } = req.body
    try {
        await Agendamento.deleteMany({_id: { $in: ids }})
        res.status(200).send({message: 'Agendamento(s) removido(s) com sucesso'})
    } catch (error) {
        res.status(500).send({ error: 'Erro interno no servidor'})
    }
})

// Conexão com o banco de dados
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@sistema-agendamento-bac.5riwz50.mongodb.net/?retryWrites=true&w=majority`)
    .then(() => {
        console.log('Conexão com o banco de dados estabelecida!');
        app.listen(PORT, () => {
            console.log(`Servidor rodando na Porta ${PORT}`);
        });
    })
    .catch((error) => console.log('Erro ao conectar com o banco de dados:', error));