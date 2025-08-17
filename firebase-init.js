// firebase-init.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-storage.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-analytics.js";

// ✅ إعدادات مشروعك (من Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyCOdrwdbw8b7YdWLPZ4TDdG2iS9kvvxQ7M",
  authDomain: "child-glucose-tracker.firebaseapp.com",
  projectId: "child-glucose-tracker",
  storageBucket: "child-glucose-tracker.firebasestorage.app",
  messagingSenderId: "294563325904",
  appId: "1:294563325904:web:39562550bf305fc01abbd5",
  measurementId: "G-TWC063TD6X"
};

// ✅ تهيئة Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

// ✅ دوال مساعدة
function ensureAuth() {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, (user) => {
      if (user) resolve(user);
      else {
        alert("❌ لم يتم تسجيل الدخول");
        location.href = "index.html";
        reject("Not signed in");
      }
    });
  });
}

function requireChildIdFromQuery() {
  const params = new URLSearchParams(location.search);
  const id = params.get("child");
  if (!id) { 
    alert("❌ لا يوجد معرف طفل بالرابط"); 
    throw new Error("Missing child id"); 
  }
  return id;
}

function setChildAvatar(el, name, photoURL) {
  if (photoURL) {
    el.src = photoURL;
    el.alt = name || "👶";
  } else {
    el.src = "images/avatar-default.png";
    el.alt = name?.[0] || "👶";
  }
}

function toLocalDatetimeValue(d) {
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// ✅ التصدير للصفحات الأخرى
export { auth, db, storage, ensureAuth, requireChildIdFromQuery, setChildAvatar, toLocalDatetimeValue };
