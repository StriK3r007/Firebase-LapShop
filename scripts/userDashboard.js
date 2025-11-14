import { getDataFromDB } from "./utils.js";
import {
    onAuthStateChanged,
    signOut,
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";
import { auth } from "./firebaseconfig.js";

const fullName = document.getElementById("user-name")
const fullNameInitials = document.getElementById("user-name-initials")
const logoutBtn = document.getElementById("logout-btn")

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const uid = user.uid;

        const userInfo = await getDataFromDB(uid, "users");
        
        const role =  userInfo[0].role
        if(role !== 'customer') {
            window.location = "../pages/signin.html";
            return
        }

        
        const userName =  userInfo[0].fullName
        if (userInfo[0].profile == '') {
            const userNameInitials = userName.split(" ").slice(0, 2).map(word => word[0]).join('')
            fullNameInitials.textContent = userNameInitials
        } else {
            const profileImage = document.createElement("img")
            profileImage.classList.add("rounded-full", "h-10", "w-10", "object-cover")
            profileImage.src = userInfo[0].profile
            fullNameInitials.appendChild(profileImage)
        }

        fullName.textContent = userName + "!"

    } else {
        window.location = "../pages/signin.html"
    }
});

// async function getDataFromDB(uid, collections) {
//     const data = [];

//     const q = query(collection(db, collections), where("uid", "==", uid));
//     const querySnapshot = uid
//         ? await getDocs(q)
//         : await getDocs(collection(db, collections));
//     querySnapshot.forEach((doc) => {
//         data.push({ ...doc.data(), docid: doc.id });
//     });
//     return data;
// }

logoutBtn.addEventListener("click", () => {
    signOut(auth)
    .then(() => {
        window.location = "../pages/signin.html";
    })
    .catch((error) => {
        console("error occured", error);
    });
});