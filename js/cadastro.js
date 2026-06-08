const form = document.getElementById("formCadastro");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  const confirmar_senha = document.getElementById("confirmar_senha").value;
  const telefone = document.getElementById("telefone").value;
  const data_nascimento = document.getElementById("data_nascimento").value;
  const cpf = document.getElementById("cpf").value;

  if (senha !== confirmar_senha) {
    alert("As senhas não coincidem!");
    return;
  }

  const resposta = await fetch("http://localhost:3000/auth/cadastro", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      nome,
      email,
      senha,
      telefone,
      data_nascimento,
      cpf
    })
  });

  const dados = await resposta.json();

  if (dados.mensagem) {
    alert("Cadastro realizado com sucesso!");
    window.location.href = "login.html";
  } else {
    alert(dados.erro);
  }
});