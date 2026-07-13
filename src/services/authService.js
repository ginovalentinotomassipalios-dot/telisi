import { Capacitor } from "@capacitor/core";

import { FirebaseAuthentication } from "@capacitor-firebase/authentication";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithCredential,
  signOut,
  onAuthStateChanged
} from "firebase/auth";

import { app } from "../firebase/firebase";


const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();


export async function loginWithGoogle() {
  try {
    if (Capacitor.isNativePlatform()) {
      const nativeResult =
        await FirebaseAuthentication.signInWithGoogle({
          skipNativeAuth: true
        });

      const idToken =
        nativeResult.credential?.idToken;

      if (!idToken) {
        throw new Error(
          "Google no devolvió un token de identidad."
        );
      }

      const credential =
        GoogleAuthProvider.credential(idToken);

      const webResult =
        await signInWithCredential(
          auth,
          credential
        );

      return webResult.user;
    }

    const webResult =
      await signInWithPopup(
        auth,
        googleProvider
      );

    return webResult.user;
  } catch (error) {
    console.error(
      "Error login Google:",
      error
    );

    return null;
  }
}


export async function logout() {
  if (Capacitor.isNativePlatform()) {
    await FirebaseAuthentication.signOut();
  }

  await signOut(auth);
}


export function listenAuth(callback) {
  return onAuthStateChanged(
    auth,
    callback
  );
}