const express = require('express');
const router = express.Router();
const conexao = require('../db');
const autenticar = require('../middleware/auth');

router.get('/:id', autenticar, (req, res) => {
  const { id } = req.params;

  conexao.query(
    'SELECT id, nome, email, telefone, data_nascimento FROM usuarios WHERE id = ?',
    [id],
    (erro, resultado) => {
      if (erro) return res.status(500).json({ erro: 'Erro ao buscar usuário' });
      if (resultado.length === 0) return res.status(404).json({ erro: 'Usuário não encontrado' });
      res.json(resultado[0]);
    }
  );
});

module.exports = router;