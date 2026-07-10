import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot,
  query,
  orderBy
} from "firebase/firestore";

import { db } from "../firebase/firebase";
import { getCurrentUser } from "./currentUserService";



function getUserEventsCollection(){

  const user = getCurrentUser();


  if(!user){

    throw new Error(
      "No hay usuario autenticado"
    );

  }


  return collection(
    db,
    "users",
    user.uid,
    "events"
  );

}



// Obtener eventos

export async function getEventsFromCloud(){

  const eventsCollection =
    getUserEventsCollection();


  const q = query(
    eventsCollection,
    orderBy("date"),
    orderBy("time")
  );


  const snapshot =
    await getDocs(q);



  return snapshot.docs.map(item => ({

    cloudId:item.id,

    ...item.data()

  }));

}



// Guardar evento

export async function saveEventToCloud(event){


  const eventsCollection =
    getUserEventsCollection();



  const docRef =
    await addDoc(
      eventsCollection,
      event
    );


  return docRef.id;

}



// Eliminar evento

export async function deleteEventFromCloud(cloudId){


  const user =
    getCurrentUser();


  if(!user) return;



  await deleteDoc(

    doc(
      db,
      "users",
      user.uid,
      "events",
      cloudId
    )

  );

}



// Actualizar evento

export async function updateEventInCloud(
  cloudId,
  data
){


  const user =
    getCurrentUser();


  if(!user) return;



  await updateDoc(

    doc(
      db,
      "users",
      user.uid,
      "events",
      cloudId
    ),

    data

  );

}



// Escuchar eventos en tiempo real

export function listenEventsFromCloud(callback){


  const eventsCollection =
    getUserEventsCollection();



  const q = query(

    eventsCollection,

    orderBy("date"),

    orderBy("time")

  );



  return onSnapshot(

    q,

    snapshot => {


      const events =
        snapshot.docs.map(item => ({

          cloudId:item.id,

          ...item.data()

        }));


      callback(events);


    }

  );

}