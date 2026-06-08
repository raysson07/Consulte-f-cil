const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const conexao = require('../db');

router.post('/cadastro', (req, res) => {
  const { nome, email, senha, telefone, data_nascimento, cpf } = req.body;

  if (!nome || !email || !senha)
    return res.status(400).json({ erro: 'Preencha todos os campos' });

  conexao.query('SELECT * FROM usuario WHERE email = ?', [email], (erro, resultado) => {
    if (erro) return res.status(500).json({ erro: 'Erro no servidor' });
    if (resultado.length > 0)
      return res.status(400).json({ erro: 'Email já cadastrado' });

    bcrypt.hash(senha, 10, (erro, hash) => {
      if (erro) return res.status(500).json({ erro: 'Erro ao criptografar senha' });

      conexao.query(
        'INSERT INTO usuario (nome, email, senha, telefone, data_nascimento, cpf) VALUES (?, ?, ?, ?, ?, ?)',
        [nome, email, hash, telefone, data_nascimento, cpf],
        (erro) => {
          if (erro) return res.status(500).json({ erro: 'Erro ao cadastrar' });
          res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!' });
        }
      );
    });
  });
});

router.post('/login', (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha)
    return res.status(400).json({ erro: 'Preencha todos os campos' });

  conexao.query('SELECT * FROM usuario WHERE email = ?', [email], (erro, resultado) => {
    if (erro) return res.status(500).json({ erro: 'Erro no servidor' });
    if (resultado.length === 0)
      return res.status(401).json({ erro: 'Email ou senha inválidos' });

    const usuario = resultado[0];

    bcrypt.compare(senha, usuario.senha, (erro, valido) => {
      if (erro) return res.status(500).json({ erro: 'Erro ao verificar senha' });
      if (!valido)
        return res.status(401).json({ erro: 'Email ou senha inválidos' });

      const token = jwt.sign(
        { id: usuario.id, email: usuario.email },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
      );

      res.json({ mensagem: 'Login realizado!', token });
    });
  });
});

module.exports = router;