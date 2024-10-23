const express = require('express')
const { registroUsuario, loginUsuario, getUserById } = require('../controllers/authController')
const router = express.Router()

router.post('/registroUsuario', registroUsuario)
router.post('/loginUsuario', loginUsuario)
router.get('/user/:id', getUserById)

module.exports = router