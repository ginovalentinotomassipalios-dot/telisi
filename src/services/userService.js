import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from "firebase/firestore";

import { db } from "../firebase/firebase";



export async function createUserProfile(user){


  const userRef =
    doc(
      db,
      "users",
      user.uid
    );



  const snapshot =
    await getDoc(userRef);



  if(!snapshot.exists()){


    await setDoc(
      userRef,
      {

        name:
          user.displayName || "Usuario",


        email:
          user.email || "",


        photo:
          user.photoURL || "",


        createdAt:
          serverTimestamp()

      }
    );


  }


}