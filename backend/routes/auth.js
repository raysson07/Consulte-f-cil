const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();

const usuarios = [];

router.post("/cadastro", async (req, res) => {

   const { email, senha } = req.body;

   const senhaHash = await bcrypt.hash(senha, 10);

   const usuario = {
      email,
      senha: senhaHash
   };

   usuarios.push(usuario);

   res.json({
      mensagem: "Usuário cadastrado"
   });

});

router.post("/login", async (req, res) => {

   const { email, senha } = req.body;

   const usuario = usuarios.find(
      u => u.email === email
   );

   if (!usuario) {

      return res.status(404).json({
         erro: "Usuário não encontrado"
      });

   }

   const senhaCorreta =
      await bcrypt.compare(
         senha,
         usuario.senha
      );

   if (!senhaCorreta) {

      return res.status(401).json({
         erro: "Senha inválida"
      });

   }

   const token = jwt.sign(

      { email: usuario.email },

      process.env.JWT_SECRET,

      { expiresIn: "1d" }

   );

   res.json({
      mensagem: "Login realizado",
      token
   });

});

module.exports = router;