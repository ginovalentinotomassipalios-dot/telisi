import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

export async function firebaseTest() {
  await addDoc(collection(db, "test"), {
    mensaje: "Hola Telisi",
    fecha: new Date().toISOString()
  });

  console.log("Firebase conectado correctamente.");
}