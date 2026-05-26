const form = document.getElementById("formCadastro");

form.addEventListener("submit", async (e) => {

   e.preventDefault();

   const email =
      document.getElementById("email").value;

   const senha =
      document.getElementById("senha").value;

   const resposta = await fetch(
      "http://localhost:3000/auth/cadastro",
      {

         method: "POST",

         headers: {
            "Content-Type": "application/json"
         },

         body: JSON.stringify({
            email,
            senha
         })

      }
   );

   const dados = await resposta.json();

   alert(dados.mensagem);

});