const Agendamento = require('../models/Agendamento')

const getAgendamentos = async (req, res) => {
    try {
        const agendamentos = await Agendamento.find()
        res.status(200).json(agendamentos)
    } catch (error) {
        res.status(500).json({msg: "Erro ao buscar agendamentos.", error: error.message})
    }
}

const createAgendamentos = async (req, res) => {
    const { nome, telefone, placa, servico } = req.body

    if(!nome || !telefone || !placa || !servico) {
        return res.status(400).json({msg: "Todos os campos são obrigatórios."})
    }

    try {
        const agendamentoExistente = await Agendamento.findOne({ telefone, placa })
        if(agendamentoExistente) {
            return res.status(409).json({msg: "Agendamento já existe com essas informações."})
        }

        const novoAgendamento = new Agendamento({nome, telefone, placa, servico})
        const agendamentoSalvo = await novoAgendamento.save()
        res.status(200).json(agendamentoSalvo)
    } catch (error) {
        res.status(500).json({msg: "Erro interno no servidor.", error})
    }
}

const updateAgendamentos = async (req, res) => {
    const { id } = req.params
    const { nome, telefone, placa, servico } = req.body

    try {
        const agendamento = await Agendamento.findById(id)
        if(!agendamento) {
            return res.status(404).json({msg: "Agendamento não encontrado."})
        }
        
        agendamento.nome = nome
        agendamento.telefone = telefone
        agendamento.placa = placa
        agendamento.servico = servico

        const agendamentoAtualizado = await agendamento.save()
        res.status(200).json(agendamentoAtualizado)
    } catch (error) {
        res.status(500).json({msg: "Erro ao atualizar.", error: error.message})
    }
}

const deleteAgendamentos = async (req, res) => {
    const { ids } = req.body
    try {
        await Agendamento.deleteMany({ _id: {$in: ids} })
        res.status(200).send({msg: "Agendamento(s) removido(s) com sucesso."})
    } catch (error) {
        res.status(500).send({ error: "Erro interno no servidor."})
    }
}

module.exports = { getAgendamentos, createAgendamentos, updateAgendamentos, deleteAgendamentos }