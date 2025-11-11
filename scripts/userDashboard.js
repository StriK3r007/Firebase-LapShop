import {
    onAuthStateChanged,
    signOut,
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";
import { auth, db } from "./firebaseconfig.js";
import {
    collection,
    getDocs,
    query,
    where,
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const fullName = document.getElementById("user-name")
const fullNameInitials = document.getElementById("user-name-initials")
const logoutBtn = document.getElementById("logout-btn")

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const uid = user.uid;

        const userInfo = await getDataFromDB(uid, "users");
        
        const userName =  userInfo[0].fullName
        const userNameInitials = userName.split(" ").slice(0, 2).map(word => word[0]).join('')

        fullName.textContent = userName + "!"
        fullNameInitials.textContent = userNameInitials

    } else {
        window.location = "../pages/signin.html"
    }
});

async function getDataFromDB(uid, collections) {
    const data = [];

    const q = query(collection(db, collections), where("uid", "==", uid));
    const querySnapshot = uid
        ? await getDocs(q)
        : await getDocs(collection(db, collections));
    querySnapshot.forEach((doc) => {
        data.push({ ...doc.data(), docid: doc.id });
    });
    return data;
}


logoutBtn.addEventListener("click", () => {
    signOut(auth)
        .then(() => {
            window.location = "../pages/signin.html";
        })
        .catch((error) => {
            console("error occured");
        });
});
