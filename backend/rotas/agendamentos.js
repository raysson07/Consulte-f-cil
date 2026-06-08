const express = require('express');
const router = express.Router();
const conexao = require('../db');
const autenticar = require('../middleware/auth');

router.post('/criar', autenticar, (req, res) => {
  const { usuario_id, medico_id, tipo, data_hora } = req.body;

  conexao.query(
    'INSERT INTO agendamentos (usuario_id, medico_id, tipo, data_hora, status) VALUES (?, ?, ?, ?, "aguardando")',
    [usuario_id, medico_id, tipo, data_hora],
    (erro, resultado) => {
      if (erro) return res.status(500).json({ erro: 'Erro ao criar agendamento' });

      const agendamento_id = resultado.insertId;

      conexao.query(
        'INSERT INTO fila (agendamento_id, posicao) SELECT ?, COUNT(*) + 1 FROM fila',
        [agendamento_id],
        (erro2) => {
          if (erro2) return res.status(500).json({ erro: 'Erro ao entrar na fila' });
          res.json({ mensagem: 'Agendamento criado e adicionado à fila!', id: agendamento_id });
        }
      );
    }
  );
});

router.get('/meus/:usuario_id', autenticar, (req, res) => {
  const { usuario_id } = req.params;

  conexao.query(
    `SELECT a.id, a.tipo, a.data_hora, a.status, m.nome AS medico, m.especialidade
     FROM agendamentos a
     JOIN medicos m ON a.medico_id = m.id
     WHERE a.usuario_id = ?
     ORDER BY a.data_hora`,
    [usuario_id],
    (erro, resultado) => {
      if (erro) return res.status(500).json({ erro: 'Erro ao buscar agendamentos' });
      res.json(resultado);
    }
  );
});

module.exports = router;