const express = require('express');
const app = express();

app.use(express.json());

const auth = require('./rotas/auth');
const usuarios = require('./rotas/usuarios');
const agendamentos = require('./rotas/agendamentos');
const fila = require('./rotas/fila');

app.use('/auth', auth);
app.use('/usuarios', usuarios);
app.use('/agendamentos', agendamentos);
app.use('/fila', fila);

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});