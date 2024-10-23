const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const registroUsuario= async (req, res) => {
    const { email, senha, confirmeSenha } = req.body

    if(!email || !senha || !confirmeSenha) {
        return res.status(422).json({msg: "Campo obrigatório não preenchido."})
    }

    if(senha !== confirmeSenha) {
        return res.status(422).json({msg: "As senhas não conferem."})
    }

    try {
        const usuarioExistente = await User.findOne({ email })
        if(usuarioExistente) {
            return res.status(422).json({msg: "Usuário já cadastrado no sistema."})
        }

        const salt = await bcrypt.genSalt(12)
        const senhaHash = await bcrypt.hash(senha, salt)

        const user = new User({ email, senha: senhaHash, confirmeSenha: senhaHash })
        await user.save()
        res.status(201).json({msg: "Usuário criado com sucesso!"})
    } catch (error) {
        res.status(500).json({msg: "Erro detectado. Tente novamento mais tarde!", error})
    }
}

const loginUsuario = async (req, res) => {
    const { email, senha } = req.body

    if(!email || !senha) {
        return res.status(422).json({msg: "Todos os campos são obrigatórios."})
    }

    try {
        const user = await User.findOne({ email })
        if(!user) {
            return res.status(404).json({msg: "Usuário ou senha inválidos."})
        }

        const checagemSenha = await bcrypt.compare(senha, user.senha)
        if(!checagemSenha) {
            return res.status(404).json({msg: "Usuário ou senha inválidos."})
        }

        const secret = process.env.SECRET
        const token = jwt.sign({ id: user._id}, secret, {expiresIn: '1h'})
        res.status(200).json({msg: "Autenticado!", token})
    } catch (error) {
        res.status(500).json({msg: "Erro detectado. Tente novamente mais tarde.", error: error.message})
    }
}

const getUserById = async (req, res) => {
    const id = req.params.id
    try {
        const user = await User.findOne(id).select('-senha -confirmeSenha')
        if(!user) {
            return res.status(404).json({msg: "usuário não encontrado."})
        }
        return res.status(200).json({ user })
    } catch (error) {
        res.status(500).json({msg: "Erro ao buscar usuário.", error: error.message})
    }
}

module.exports = { registroUsuario, loginUsuario, getUserById }