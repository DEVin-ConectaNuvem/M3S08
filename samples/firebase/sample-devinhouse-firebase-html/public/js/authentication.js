// 1 - Buttons
var authEmailPassButton = document.getElementById('authEmailPassButton');
var createUserButton = document.getElementById('createUserButton');
var logOutButton = document.getElementById('logOutButton');
var authGitHubButton = document.getElementById('authGitHubButton');




// 2 - Inputs
var emailInput = document.getElementById('emailInput');
var passwordInput = document.getElementById('passwordInput');

// 3 - Displays
var displayName = document.getElementById('displayName');

// 4 - Criar novo usuário
createUserButton.addEventListener('click', function () {
    firebase
        .auth()
        .createUserWithEmailAndPassword(emailInput.value, passwordInput.value)
        .then(function () {
            alert('Bem vindo ' + emailInput.value);
        })
        .catch(function (error) {
            console.error(error.code);
            console.error(error.message);
            alert('Falha ao cadastrar, verifique o erro no console.')
        });
});

// 5 - Autenticar com E-mail e Senha
authEmailPassButton.addEventListener('click', function () {
    firebase
        .auth()
        .signInWithEmailAndPassword(emailInput.value, passwordInput.value)
        .then(function (result) {
            console.log(result);
            displayName.innerText = 'Bem vindo, ' + emailInput.value;
            alert('Autenticado ' + emailInput.value);
        })
        .catch(function (error) {
            console.error(error.code);
            console.error(error.message);
            alert('Falha ao autenticar, verifique o erro no console.')
        });
});

// 6- Logout
logOutButton.addEventListener('click', function () {
    firebase
        .auth()
        .signOut()
        .then(function () {
            displayName.innerText = 'Você não está autenticado';
            alert('Você se deslogou');
        }, function (error) {
            console.error(error);
        });
});


// 7 - Autenticar Anônimo
authAnonymouslyButton.addEventListener('click', function () {
    firebase
        .auth()
        .signInAnonymously()
        .then(function (result) {
            console.log(result);
            displayName.innerText = 'Bem vindo, desconhecido';
            alert('Autenticado Anonimamente');
        })
        .catch(function (error) {
            console.error(error.code);
            console.error(error.message);
            alert('Falha ao autenticar, verifique o erro no console.')
        });
});

// 8 - Autenticação via Provider
function signIn(provider) {
    firebase.auth()
        .signInWithPopup(provider)
        .then(function (result) {
            console.log(result);
            var token = result.credential.accessToken;
            displayName.innerText = 'Bem vindo, ' + result.user.displayName;
        }).catch(function (error) {
            console.log(error);
            alert('Falha na autenticação');
        });
}

// 9 - Autenticar com GitHub
authGitHubButton.addEventListener('click', function () {
    // Providers
    var provider = new firebase.auth.GithubAuthProvider();
    signIn(provider);
});

// 10 - Autenticar com Google
authGoogleButton.addEventListener('click', function () {
    // Providers
    var provider = new firebase.auth.GoogleAuthProvider();
    signIn(provider);
});






