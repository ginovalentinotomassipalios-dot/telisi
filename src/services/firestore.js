import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from "firebase/firestore";

import { db } from "../firebase/firebase";

/* Obtener todos los eventos */
export async function getEvents() {
  const snapshot = await getDocs(collection(db, "events"));

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

/* Crear evento */
export async function saveEvent(event) {
  const docRef = await addDoc(collection(db, "events"), event);
  return docRef.id;
}

/* Eliminar evento */
export async function removeEvent(id) {
  await deleteDoc(doc(db, "events", id));
}

/* Actualizar evento */
export async function updateEvent(id, data) {
  await updateDoc(doc(db, "events", id), data);
}