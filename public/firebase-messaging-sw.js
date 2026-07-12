importScripts(
  "https://www.gstatic.com/firebasejs/12.15.0/firebase-app-compat.js"
);

importScripts(
  "https://www.gstatic.com/firebasejs/12.15.0/firebase-messaging-compat.js"
);


firebase.initializeApp({

  apiKey: "AIzaSyBnS4Oyp4Ntycqiq7nQRyiZr",

  authDomain: "telisi.firebaseapp.com",

  projectId: "telisi",

  storageBucket: "telisi.firebasestorage.app",

  messagingSenderId: "286285003684",

  appId: "1:286285003684:web:cd16f6a9b86a20e5765f31",

  measurementId: "G-WJB2XJV2RM"

});


const messaging = firebase.messaging();



messaging.onBackgroundMessage((payload)=>{


  console.log(
    "[Telisi] Notificación recibida:",
    payload
  );



  const data = payload.data || {};



  let title =
    payload.notification?.title ||
    data.title ||
    "🔔 Telisi";



  let body =
    payload.notification?.body ||
    data.body ||
    "Tenés una nueva actividad";




  if(title === "Telisi"){

    title = "🔔 Telisi";

  }




  if(!body.includes("Telisi")){

    body =
      `${body}\n\nOrganizá tu día con Telisi`;

  }




  const options = {


    body,


    icon:"/icon-192.png",


    badge:"/icon-192.png",


    tag:"telisi-notification",


    renotify:true,


    requireInteraction:false,


    vibrate:[
      200,
      100,
      200
    ],


    data:{

      url:"/"

    }


  };




  self.registration.showNotification(

    title,

    options

  );


});






// Actualiza el Service Worker inmediatamente

self.addEventListener(

  "install",

  () => {

    self.skipWaiting();

  }

);






self.addEventListener(

  "activate",

  (event)=>{


    event.waitUntil(

      self.clients.claim()

    );


  }

);






// Abrir Telisi al tocar la notificación

self.addEventListener(

  "notificationclick",

  (event)=>{


    event.notification.close();



    event.waitUntil(

      clients.openWindow("/")

    );


  }

);