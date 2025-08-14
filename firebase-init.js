// firebase-init.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

// إعدادات Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCOdrwdbw8b7YdWLPZ4TDdG2iS9kvvxQ7M",
  authDomain: "child-glucose-tracker.firebaseapp.com",
  projectId: "child-glucose-tracker",
  storageBucket: "child-glucose-tracker.firebasestorage.app",
  messagingSenderId: "294563325904",
  appId: "1:294563325904:web:39562550bf305fc01abbd5"
};

// التهيئة
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// التصدير
export { app, db, auth };
