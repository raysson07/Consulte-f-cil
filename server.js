const express = require('express');
const app = express();

app.use(express.json());

// Importa as rotas
const usuarios = require('./backend/rotas/usuarios');
const agendamentos = require('./backend/rotas/agendamentos');
const fila = require('./backend/rotas/fila');

app.use('/usuarios', usuarios);
app.use('/agendamentos', agendamentos);
app.use('/fila', fila);

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});s