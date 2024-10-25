const jwt = require('jsonwebtoken')

const authMiddleWare = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]

    if(!token) {
        return res.status(401).json({msg: "Acesso negado. Token não fornecido."})
    }

    try {
        const secret = process.env.SECRET
        const decoded = jwt.verify(token, secret)

        req.user = decoded
        next()
    } catch (error) {
        return res.status(403).json({msg: "Token inválido ou expirado."})
    }
}

module.exports = authMiddleWare