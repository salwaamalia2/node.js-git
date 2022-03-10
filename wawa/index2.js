const express = require("express");
const { DataTypes } = require("sequelize");
const app = express();
const sequelize = require("./models/index").sequelize;
const User = require("./models/user");
const {hash, compare} = require("bcrypt")
const jwt = require("jsonwebtoken")



app.use(express.urlencoded({extended: true}))
app.use(express.json())


const authentticate = (req, res, next) => {
    const token = req.headers.authorization
    const payload = jwt.decode(token, "rahasia")
    if(token) {
        return res.status(200).json({message: "tidak punya akses"})
    }
    next()
}


app.post("/register", async (req, res) => {
    


    const data = await User(sequelize, DataTypes).create({
        nama:req.body.nama,
        kelas:req.body.kelas,
    })

    res.status(200).json(data)
})

app.post("/login", async (req, res) => {

    const user = await User(sequelize, DataTypes).findOne({
        where: {
            nama: req.body.nama
        }
    })
var payload={
    id:user.id,
    nama:user.nama
}


    const token = jwt.sign(payload, "rahasia")

    res.status(200).json({
        nama: req.body.nama,
        token
    })
})

app.delete("/delete_user/:id", authentticate, async (req, res) => {

     await User(sequelize, DataTypes).destroy({
        where: {
            id: req.params.id
        }
    })

    res.status(200).json({message: "user berhasil dihapus"})

})

app.listen(2000, console.log("Listening at " + 2000));
