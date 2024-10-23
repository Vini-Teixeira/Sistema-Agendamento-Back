const express = require('express')
const { getAgendamentos, createAgendamentos, updateAgendamentos, deleteAgendamentos }
= require('../controllers/agendamentoController')
const authMiddleware = require('../middlewares/authMiddleware')
const router = express.Router()

router.get('/',authMiddleware ,getAgendamentos)
router.post('/',authMiddleware ,createAgendamentos)
router.put('/',authMiddleware ,updateAgendamentos)
router.delete('/',authMiddleware ,deleteAgendamentos)

module.exports = router