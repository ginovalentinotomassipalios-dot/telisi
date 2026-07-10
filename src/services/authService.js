import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "firebase/auth";


import { app } from "../firebase/firebase";



const auth = getAuth(app);



const googleProvider = new GoogleAuthProvider();



// Login con Google

export async function loginWithGoogle(){

  try{

    const result =
      await signInWithPopup(
        auth,
        googleProvider
      );


    return result.user;


  }catch(error){

    console.error(
      "Error login Google:",
      error
    );

    return null;

  }

}



// Cerrar sesión

export async function logout(){

  await signOut(auth);

}



// Detectar usuario conectado

export function listenAuth(callback){

  return onAuthStateChanged(
    auth,
    callback
  );

}