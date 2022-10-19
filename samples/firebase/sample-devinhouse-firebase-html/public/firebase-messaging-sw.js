// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');


// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
    apiKey: "AIzaSyD688MiH0zCmR8E4Eai9h9AGHR1tmFPdVI",
    authDomain: "sample-devinhouse-eb8a8.firebaseapp.com",
    databaseURL: "https://sample-devinhouse-eb8a8-default-rtdb.firebaseio.com",
    projectId: "sample-devinhouse-eb8a8",
    storageBucket: "sample-devinhouse-eb8a8.appspot.com",
    messagingSenderId: "801260524042",
    appId: "1:801260524042:web:e9aa66e44cb2be7a2b85f3",
    measurementId: "G-W42PEXWTCF"
  });
  
  // Retrieve an instance of Firebase Messaging so that it can handle background
  // messages.
  const messaging = firebase.messaging();


messaging.setBackgroundMessageHandler(function (payload) {
    console.log(
        "[firebase-messaging-sw.js] Received background message ",
        payload,
    );
    // Customize notification here
    const notificationTitle = "Background Message Title";
    const notificationOptions = {
        body: "Background Message body.",
        icon: "/icon.png",
    };

    return self.registration.showNotification(
        notificationTitle,
        notificationOptions,
    );
});

let enableForegroundNotification = true;
messaging.onMessage(function (payload) {
    console.log('Message received. ', payload);
    notisElem.innerHTML = notisElem.innerHTML + JSON.stringify(payload);

    if (enableForegroundNotification) {
        let notification = payload.notification;
        navigator.serviceWorker
            .getRegistrations()
            .then((registration) => {
                registration[0].showNotification(notification.title);
            });
    }
});