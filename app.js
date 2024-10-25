// app.js

require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Carregando as rotas
const authRoutes = require('./src/routes/authRoutes');
const agendamentoRoutes = require('./src/routes/agendamentoRoutes');

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());

const allowedOrigins = ['http://localhost:4200', 'https://agendamento-chi.vercel.app'];

// Configurando o middleware de CORS
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS policy'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
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