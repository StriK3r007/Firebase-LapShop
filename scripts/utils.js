// utils.js
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";
import { db } from "./firebaseconfig.js";

export async function getDataFromDB(uid, collections) {
    const data = [];
    const q = query(collection(db, collections), where("uid", "==", uid));
    const querySnapshot = uid ? await getDocs(q) : await getDocs(collection(db, collections));
    querySnapshot.forEach((doc) => data.push({ ...doc.data(), docid: doc.id }));
    return data;
}