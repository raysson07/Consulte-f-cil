const token =
   localStorage.getItem("token");

if (!token) {

   alert("Faça login");

   window.location.href =
      "login.html";

}