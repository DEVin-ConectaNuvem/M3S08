//1 - Campos

var msgElem = document.getElementById('msg');
var tokenElem = document.getElementById('token');
var notisElem = document.getElementById('notis');
var errElem = document.getElementById('err');

var messaging = firebase.messaging();


messaging.requestPermission()
    .then(function () {
        msgElem.innerHTML = '<br> Permissão de notificação concedida.';
        console.log('Permissão de notificação concedida.');

        // get the token in the form of promise
        return messaging.getToken();
    })
    .then(function (token) {
        tokenElem.innerHTML = 'Device token é : <br> <br>' + token;
    })
    .catch(function (err) {
        errElem.innerHTML = errElem.innerHTML + '; ' + err;
        console.log('Não foi possível obter permissão para notificar.', err);
    });