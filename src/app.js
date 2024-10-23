require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Carregando as rotas
const authRoutes = require('./routes/authRoutes');
const agendamentoRoutes = require('./routes/agendamentoRoutes');

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:4200', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

// Conexão com o banco de dados
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@sistema-agendamento-bac.5riwz50.mongodb.net/SistemaAgendamentoBackend?retryWrites=true&w=majority`)
    .then(() => {
        console.log('Conexão com o banco de dados estabelecida!');
        app.listen(PORT, () => {
            console.log(`Servidor rodando na Porta ${PORT}`);
        });
    })
    .catch((error) => console.log('Erro ao conectar com o banco de dados:', error));

// Rotas
app.use('/auth', authRoutes);
app.use('/agendamentos', agendamentoRoutes);