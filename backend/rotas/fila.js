const express = require('express');
const router = express.Router();
const conexao = require('../db');
const autenticar = require('../middleware/auth');

router.get('/', autenticar, (req, res) => {
  conexao.query(
    `SELECT f.posicao, u.nome, a.tipo, a.status, a.data_hora
     FROM fila f
     JOIN agendamentos a ON f.agendamento_id = a.id
     JOIN usuarios u ON a.usuario_id = u.id
     WHERE a.status != 'concluido' AND a.status != 'cancelado'
     ORDER BY f.posicao`,
    (erro, resultado) => {
      if (erro) return res.status(500).json({ erro: 'Erro ao buscar fila' });
      res.json(resultado);
    }
  );
});

router.put('/atualizar/:agendamento_id', autenticar, (req, res) => {
  const { agendamento_id } = req.params;
  const { status } = req.body;

  conexao.query(
    'UPDATE agendamentos SET status = ? WHERE id = ?',
    [status, agendamento_id],
    (erro) => {
      if (erro) return res.status(500).json({ erro: 'Erro ao atualizar status' });
      res.json({ mensagem: 'Status atualizado!' });
    }
  );
});

module.exports = router;