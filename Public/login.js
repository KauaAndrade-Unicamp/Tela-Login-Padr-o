//Receive Register forms
//Receive forms
document.getElementById('register-form').addEventListener('submit', async (event) =>{
    event.preventDefault();

    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const telefone = document.getElementById('register-phone').value;
    const password = document.getElementById('register-password').value; 
    const confirmpassword = document.getElementById('register-confirm-password').value; 
    const errorDiv = document.getElementById('register-error');

    // Limpa mensagens anteriores
    errorDiv.textContent = '';

    try{
        const response = await fetch('http://localhost:3000/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, telefone, password, confirmpassword })
        });

        const data = await response.json();

        if (!response.ok) {
            errorDiv.textContent = data.msg || 'Erro ao fazer cadastro.';
          
            return;
        } 
        switchToLogin();
        alert('Cadastro realizado com sucesso!');
        // exemplo
    } catch (err) {
        errorDiv.textContent = 'Erro de conexão com o servidor.';
    }
})



//Receive forms
document.getElementById('login-form').addEventListener('submit', async (event) =>{
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value; 
    const errorDiv = document.getElementById('login-error');

    // Limpa mensagens anteriores
    errorDiv.textContent = '';

    try{
        const response = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            errorDiv.textContent = data.msg || 'Erro ao fazer login.';
            document.getElementById('password').value = ''; 
            // Limpa o campo de senha   
            return;
        }  
        alert('Login realizado com sucesso!');
        window.location.href = '/home'; // Redireciona para a página inicial após o login bem-sucedido
        // exemplo
    } catch (err) {
        errorDiv.textContent = 'Erro de conexão com o servidor.';
    }
})

document.addEventListener('DOMContentLoaded', function() {
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');
    const loginPanel = document.getElementById('login-panel');
    const registerPanel = document.getElementById('register-panel');
    const gotoLogin = document.getElementById('goto-login');
    const gotoRegister = document.getElementById('goto-register');

    // Phone number mask
    document.getElementById('register-phone').addEventListener('input', function(e) {
        let input = e.target;
        input.value = input.value.replace(/\D/g, '');
        
        if (input.value.length > 11) {
            input.value = input.value.slice(0, 11);
        }
        
        if (input.value.length >= 2) {
            input.value = '(' + input.value.slice(0, 2) + ')' + input.value.slice(2);
        }
        
        if (input.value.length >= 9) {
            input.value = input.value.slice(0, 9) + '-' + input.value.slice(9);
        }
    });

   

    // Event listeners
    loginTab.addEventListener('click', switchToLogin);
    registerTab.addEventListener('click', switchToRegister);
    gotoLogin.addEventListener('click', function(e) {
        e.preventDefault();
        switchToLogin();
    });
    gotoRegister.addEventListener('click', function(e) {
        e.preventDefault();
        switchToRegister();
    });

    // Form validation for register
   
});

function switchToLogin() {
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');
    const loginPanel = document.getElementById('login-panel');
    const registerPanel = document.getElementById('register-panel');
    loginTab.classList.add('active');
    registerTab.classList.remove('active');
    loginPanel.classList.add('active');
    registerPanel.classList.remove('active');
}

function switchToRegister() {
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');
    const loginPanel = document.getElementById('login-panel');
    const registerPanel = document.getElementById('register-panel');
    registerTab.classList.add('active');
    loginTab.classList.remove('active');
    registerPanel.classList.add('active');
    loginPanel.classList.remove('active');
}