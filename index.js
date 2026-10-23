const express = require("express")
const app = express()
const mysql = require("mysql2/promise")

app.use(express.json())

const pool = mysql.createPool({
    host: "localhost",
    port: 3307,
    user: "root",
    password: "root",
    database: "usuarios_api",
    waitForConnections: true
})

app.get("/usuarios", async (req, res) => {
    const [usuario] = await pool.execute("SELECT * FROM usuarios")
    return res.json(usuario)
})



app.post("/usuarios", async (req,res) =>{
    const {email, senha} = req.body

   
    if(!email || !senha){
        return res.status(400).json({error: "E-mail, senha são obrigatórios"})
    }

const [resultado] = await pool.execute(
    "INSERT INTO usuarios (email, senha) VALUES (?, ?)",
    [email, senha]
)

return res.status(201).json({id : resultado.insertId, email, senha})

})
app.delete("/usuarios/:id", async (req, res) => {
    const id = req.params.id

    const [resultado] = await pool.execute(
        "DELETE FROM usuarios WHERE id = ?",
        [id]
    )
    if(resultado.affectedRows == 0){
        return res.status(404).json({error: "Usuário não encontrado!"})
    }
    return res.status(204).end()
})

app.put("/usuarios/:id", async (req, res) => {
    const {email, senha} = req.body
    const id = req.params.id

    if(!email || !senha){
        return res.status(400).json({error: "E-mail, e senha são obrigatórios"})
    }

    const [resultado] = await pool.execute(
        "UPDATE usuarios SET email = ?, senha = ? WHERE id = ?",
        [email, senha, id]
    )

    if(resultado.affectedRows === 0){
        return res.status(404).json({error: "Usuário não encontrado"})
    }


    return res.json({id, email, senha})
})

app.listen(3000,() => console.log("API no ar :D"))