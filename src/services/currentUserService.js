import { getAuth } from "firebase/auth";
import { app } from "../firebase/firebase";


const auth = getAuth(app);


export function getCurrentUser(){

  return auth.currentUser;

}