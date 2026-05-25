const express = require('express');
const router = express.Router();
const conexao = require('backend/js/db');

router.post('/cadastrar', (req, res) => {
  const { nome, email, senha, telefone, data_nascimento } = req.body;

  conexao.query(
    'INSERT INTO usuarios (nome, email, senha, telefone, data_nascimento) VALUES (?, ?, ?, ?, ?)',
    [nome, email, senha, telefone, data_nascimento],
    (erro, resultado) => {
      if (erro) return res.status(500).json({ erro: 'Erro ao cadastrar' });
      res.json({ mensagem: 'Usuário cadastrado com sucesso!', id: resultado.insertId });
    }
  );
});

router.post('/login', (req, res) => {
  const { email, senha } = req.body;

  conexao.query(
    'SELECT * FROM usuarios WHERE email = ? AND senha = ?',
    [email, senha],
    (erro, resultado) => {
      if (erro) return res.status(500).json({ erro: 'Erro ao fazer login' });
      if (resultado.length === 0) return res.status(401).json({ erro: 'Email ou senha incorretos' });
      res.json({ mensagem: 'Login realizado!', usuario: resultado[0] });
    }
  );
});

module.exports = router;