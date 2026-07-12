import { getMessaging, getToken } from "firebase/messaging";
import { app } from "../firebase/firebase";


const messaging = getMessaging(app);



export async function requestFCMToken() {

  try {

    console.log("🚀 Iniciando FCM");


    const permission =
      await Notification.requestPermission();


    console.log(
      "Permiso:",
      permission
    );



    if(permission !== "granted") {

      console.log(
        "❌ Permiso rechazado"
      );

      return null;

    }



    const registration =
  await navigator.serviceWorker.register(
    "/firebase-messaging-sw.js",
    {
      scope: "/"
    }
  );



    console.log(
      "⏳ Esperando Service Worker..."
    );


    await navigator.serviceWorker.ready;



    console.log(
      "✅ Service Worker activo"
    );



    const token =
      await getToken(
        messaging,
        {

          vapidKey:
          "BNGwXLUaaydBtV8tl09yaqm7Cv8UnA0pO9BE6vYLVqEhlz-VZKg8vG6v-ZXa3SYc-wuZRAmtCjHVvsXjh-WryHY",

          serviceWorkerRegistration:
          registration

        }
      );



    console.log(
      "🔥 TOKEN FCM:",
      token
    );



    return token;



  } catch(error) {


    console.error(
      "❌ Error FCM:",
      error
    );


    return null;

  }

}