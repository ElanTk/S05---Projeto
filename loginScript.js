
document.getElementById("btnUltimaConta").addEventListener("click", function () {
    // Dados do último usuário
    const id = 7503;
    const nome = "Joaozinho Sobrecarregado";

    // Salvando no localStorage
    localStorage.setItem("matriculaLogada", id);
    localStorage.setItem("usuarioLogado", nome);

    // Redireciona para a página principal
    window.location.href = "menu/mainAjudas.html";
});

document.getElementById("btnContaAcademica").addEventListener("click", () => {
    alert("Redireciona para o login acadêmico padrão do inatel, usando o banco de dados do mesmo.");
});