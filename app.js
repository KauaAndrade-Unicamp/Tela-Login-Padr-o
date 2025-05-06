/* imports */
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = express()

//Config Json response
app.use(express.json())

//Models
const User = require('./models/User')

//Config public folder
const path = require('path')
app.use(express.static(path.join(__dirname, 'public')))

// Open route 
app.get('/', (req, res) => {
    res.status(200).json({ msg: "Welcome to API" })
});

app.get('/site', (req, res) => {

    // retornar arquivo html
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
    res.status(200)

})

// Private route 
app.get("/user/:id", checkToken, async (req, res) => {

    const id = req.params.id

    // check if user exists
    const user = await User.findById(id, '-password')

    if (!user) {

        return res.status(422).json({ msg: 'Usuario não encontrado' })
    }

    res.status(200).json({ user })
})

function checkToken(req,res, next){

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) { 
        return res.status(401).json({ msg: ' Acesso Bloqueado!' })
    }
    try{

        const secret = process.env.SECRET

        jwt.verify(token, secret)

        next()

    }catch(error){
        res.status(400).json({msg:"Token Invalido" })
    }
}
//Reister User
app.post('/auth/register', async (req, res) => {

    const { name, email, telefone, password, confirmpassword } = req.body;

    //Validation
    if (!name) {
        return res.status(422).json({ msg: 'O nome é obrigatório!' });
    }
    if (!email) {
        return res.status(422).json({ msg: 'O email é obrigatório!' });
    }
    if (!telefone) {
        return res.status(422).json({ msg: 'O número é obrigatorio' });
    }
    if (!password) {
        return res.status(422).json({ msg: 'A senha é obrigatória!' });
    }
    if (password.length < 8) {
        return res.status(422).json({ msg: 'A senha deve ter no mínimo 8 caracteres!' });
    }
    if (confirmpassword !== password) {
        return res.status(422).json({ msg: 'As senhas não conferem!' });
    }


    //check if user exists
    const userExists = await User.findOne({ email: email });

    if (userExists) {
        return res.status(422).json({ msg: 'Já existe um usuário cadastrado com esse email!' });
    }

    //Create password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    //Create user
    const user = new User({
        name,
        email,
        telefone,
        password: passwordHash,
    });

    try {

        await user.save()

        res.status(201).json({ msg: 'Usuário cadastrado com sucesso!' });

    } catch (error) {

        console.log(error)

        res.status(500).json({ msg: 'Erro ao cadastrar usuário!, tente cadastrar mais tarde' });

    }
});


//Login User
app.post('/auth/login', async (req, res) => {

    const { email, password } = req.body

    //Validation
    if (!email) {
        return res.status(422).json({ msg: 'O email é obrigatório!' });
    }
    if (!password) {
        return res.status(422).json({ msg: 'A senha é obrigatória!' });
    }
    if (password.length < 8) {
        return res.status(422).json({ msg: 'A senha deve ter no mínimo 8 caracteres!' });
    }

    //Check if user exist
    const user = await User.findOne({ email: email });

    if (!user) {

        return res.status(404).json({ msg: 'Usuário não encontrado' });
    }

    //Check if password match
    const checkPassword = await bcrypt.compare(password, user.password)

    if (!checkPassword) {

        return res.status(422).json({ msg: 'Senha inválidada' })

    }

    try {

        const secret = process.env.SECRET

        const token = jwt.sign({
            id: user._id
        },
            secret,
        )

        res.status(200).json({ msg: "Autenticação realizada com sucesso", token })

    } catch (err) {
        console.log(error)

        res.status(500).json({ msg: 'Erro ao logar!' });

    }

})


//Credenciais
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS

mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.2e9of8p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
    .then(() => {
        app.listen(3000)
        console.log("Connected to DB")
    }).catch((err) => console.log(err))
