const form = document.getElementById("formAgendamento");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");

  if (!token) {
    alert("Você precisa estar logado!");
    window.location.href = "login.html";
    return;
  }

  const nome = document.getElementById("nome").value;
  const data_nascimento = document.getElementById("data_nascimento").value;
  const especialidade = document.getElementById("especialidade").value;
  const data_consulta = document.getElementById("data_consulta").value;
  const horario = document.getElementById("horario").value;
  const local = document.getElementById("local").value;
  const motivo = document.getElementById("motivo").value;

  const resposta = await fetch("http://localhost:3000/agendamentos/criar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      nome,
      data_nascimento,
      especialidade,
      data_consulta,
      horario,
      local,
      motivo
    })
  });

  const dados = await resposta.json();

  if (dados.mensagem) {
    alert("Agendamento realizado com sucesso!");
  } else {
    alert(dados.erro);
  }
});