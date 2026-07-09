import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from "firebase/firestore";

import { db } from "../firebase/firebase";

const eventsCollection = collection(db, "events");

export async function getEventsFromCloud() {
  const snapshot = await getDocs(eventsCollection);

  return snapshot.docs.map(item => ({
    id: item.id,
    ...item.data()
  }));
}

export async function saveEventToCloud(event) {
  const docRef = await addDoc(eventsCollection, event);
  return docRef.id;
}

export async function deleteEventFromCloud(id) {
  await deleteDoc(doc(db, "events", id));
}

export async function updateEventInCloud(id, data) {
  await updateDoc(doc(db, "events", id), data);
}