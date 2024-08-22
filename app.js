const express = require("express");
const app = express();
const usermodel = require("./models/usermodel.js");



const cookieparser = require('cookie-parser');
app.use(cookieparser());

const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get("/",(req,res)=>{
    res.send("chuchu");

});

app.post('/create',async (req,res)=>{
    let{username , email , password}=  req.body;
    
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Create user with hashed password
    let createduser = await usermodel.create({
        username,
        email,
        password: hash
    });


let token = jwt.sign({email},"secret");
res.cookie("token", token);
res.send(createduser);
});


app.post('/login', async (req, res) => {
    try {
        let { email, password } = req.body;

        let user = await usermodel.findOne({ email });

        if (!user) {
            return res.status(404).send("User not found");
        }

        let isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            res.send("Welcome");
        } else {
            res.status(401).send("Invalid credentials");
        }
    } catch (error) {
        res.status(500).send("Error during login");
    }
});








app.listen(10100,()=>console.log("server chalu ho gya ji"));