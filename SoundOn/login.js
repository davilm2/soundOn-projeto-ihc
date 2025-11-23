document.querySelector('.login-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Impede a página de recarregar
    
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    if(user && pass) {
        // Redireciona para a tela principal
        window.location.href = "index.html"; 
    } else {
        alert("Por favor, preencha os campos.");
    }
});