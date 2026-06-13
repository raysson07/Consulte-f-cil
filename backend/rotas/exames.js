const express = require('express');
const router = express.Router();
const conexao = require('../db');
const autenticar = require('../middleware/auth');

router.post('/criar', autenticar, (req, res) => {
  const { nome, data_nascimento, tipoexame, data_exame, horario, local, motivo } = req.body;
  const usuario_id = req.usuario.id;

  if (!nome || !data_nascimento || !tipoexame || !data_exame || !horario || !local || !motivo)
    return res.status(400).json({ erro: 'Preencha todos os campos' });

  if (tipoexame === '' || tipoexame === 'Selecione o exame')
    return res.status(400).json({ erro: 'Selecione um tipo de exame' });

  const hoje = new Date().toISOString().split('T')[0];
  if (data_exame < hoje)
    return res.status(400).json({ erro: 'Data do exame não pode ser no passado' });

  conexao.query(
    'INSERT INTO exames (usuario_id, nome, data_nascimento, tipoexame, data_exame, horario, local, motivo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [usuario_id, nome, data_nascimento, tipoexame, data_exame, horario, local, motivo],
    (erro, resultado) => {
      if (erro) return res.status(500).json({ erro: 'Erro ao criar exame' });
      res.json({ mensagem: 'Exame agendado com sucesso!', id: resultado.insertId });
    }
  );
});

router.get('/meus', autenticar, (req, res) => {
  const usuario_id = req.usuario.id;

  conexao.query(
    'SELECT * FROM exames WHERE usuario_id = ? ORDER BY data_exame',
    [usuario_id],
    (erro, resultado) => {
      if (erro) return res.status(500).json({ erro: 'Erro ao buscar exames' });
      res.json(resultado);
    }
  );
});

module.exports = router;