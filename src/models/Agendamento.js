const mongoose = require('mongoose')

const agendamentoSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    telefone: { type: String, required: true },
    placa: { type: String, required: true },
    servico: { type: String, required: true }
})

module.exports = mongoose.model('Agendamento', agendamentoSchema)