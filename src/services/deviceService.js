import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";


export async function saveDeviceToken(token) {

  try {

    await setDoc(
      doc(db, "devices", token),
      {
        token,
        createdAt: new Date().toISOString(),
        userAgent: navigator.userAgent
      }
    );


    console.log(
      "✅ Dispositivo guardado en Firestore"
    );


  } catch(error) {

    console.error(
      "❌ Error guardando dispositivo:",
      error
    );

    return null;

  }

}
