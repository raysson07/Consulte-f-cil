const express = require('express');
const router = express.Router();
const conexao = require('../db');
const autenticar = require('../middleware/auth');

router.post('/criar', autenticar, (req, res) => {
  const { nome, data_nascimento, especialidade, data_consulta, horario, local, motivo } = req.body;
  const usuario_id = req.usuario.id;

  conexao.query(
    'INSERT INTO agendamentos (usuario_id, nome, data_nascimento, especialidade, data_consulta, horario, local, motivo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [usuario_id, nome, data_nascimento, especialidade, data_consulta, horario, local, motivo],
    (erro, resultado) => {
      if (erro) return res.status(500).json({ erro: 'Erro ao criar agendamento' });

      const agendamento_id = resultado.insertId;

      conexao.query(
        'INSERT INTO fila (agendamento_id, posicao) SELECT ?, COUNT(*) + 1 FROM fila',
        [agendamento_id],
        (erro2) => {
          if (erro2) return res.status(500).json({ erro: 'Erro ao entrar na fila' });
          res.json({ mensagem: 'Agendamento criado com sucesso!', id: agendamento_id });
        }
      );
    }
  );
});

router.get('/meus', autenticar, (req, res) => {
  const usuario_id = req.usuario.id;

  conexao.query(
    'SELECT * FROM agendamentos WHERE usuario_id = ? ORDER BY data_consulta',
    [usuario_id],
    (erro, resultado) => {
      if (erro) return res.status(500).json({ erro: 'Erro ao buscar agendamentos' });
      res.json(resultado);
    }
  );
});

module.exports = router;