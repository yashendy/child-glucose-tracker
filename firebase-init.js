// ===============================
// firebase-init.js
// تهيئة Firebase + مساعدين موحّدين لكل الصفحات
// ===============================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signInAnonymously,
  signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import {
  getStorage
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-storage.js";

// 🔐 إعدادات مشروعك
const firebaseConfig = {
  apiKey: "AIzaSyCOdrwdbw8b7YdWLPZ4TDdG2iS9kvvxQ7M",
  authDomain: "child-glucose-tracker.firebaseapp.com",
  projectId: "child-glucose-tracker",
  storageBucket: "child-glucose-tracker.firebasestorage.app",
  messagingSenderId: "294563325904",
  appId: "1:294563325904:web:39562550bf305fc01abbd5"
};

// ✅ تهيئة التطبيقات
const app     = initializeApp(firebaseConfig);
const auth    = getAuth(app);
const db      = getFirestore(app);
const storage = getStorage(app);

// ===============================
// مساعدين موحّدين
// ===============================

/**
 * يضمن وجود مستخدم مسجّل دخول (مجهولًا)
 * - يرجع Promise يحلّ بـ {user, uid}
 * - يخزّن uid في localStorage لاستخدامه بصفحات تانية
 */
async function ensureAuth() {
  // لو فيه مستخدم جاهز نستخدمه
  if (auth.currentUser) {
    const uid = auth.currentUser.uid;
    localStorage.setItem("userId", uid);
    return { user: auth.currentUser, uid };
  }
  // نسمع لحالة تسجيل الدخول… وإن مفيش، نعمل Anonymous Sign-in
  const user = await new Promise(async (resolve, reject) => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) {
        unsub();
        resolve(u);
      }
    }, reject);
    try {
      // نحاول تسجيل دخول مجهول فقط لو مفيش جلسة
      await signInAnonymously(auth);
    } catch (e) {
      reject(e);
    }
  });

  const uid = user.uid;
  localStorage.setItem("userId", uid);
  return { user, uid };
}

/**
 * تسجيل خروج سريع موحّد
 */
function logout() {
  return signOut(auth).then(() => {
    localStorage.removeItem("userId");
  });
}

/**
 * يرجّع childId من كويري سترينغ (?child=...)
 * - يرمي خطأ واضح لو مش موجود
 */
function requireChildIdFromQuery() {
  const params = new URLSearchParams(location.search);
  const childId = params.get("child");
  if (!childId) {
    throw new Error("لم يتم تمرير childId في عنوان الصفحة (?child=...)");
  }
  return childId;
}

/**
 * مسار صورة أفتراضية للطفل من مشروعك
 * ضعي الصورة في: /images/avatar-default.png
 */
function defaultAvatarPath() {
  return "images/avatar-default.png";
}

/**
 * يضبط صورة الطفل في عنصر <img>:
 * - لو فيه photoURL يستخدمه
 * - غير كده يستخدم الصورة الافتراضية
 * - لو حابة تضيفي Alt ديناميكي بالاسم
 */
function setChildAvatar(imgEl, childName, photoURL) {
  if (!imgEl) return;
  imgEl.alt = childName ? `صورة ${childName}` : "صورة الطفل";
  imgEl.src = photoURL || defaultAvatarPath();
}

/**
 * فورمات بسيط لتاريخ اليوم: YYYY-MM-DD
 */
function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

/**
 * تحويل Date إلى قيمة مناسبة لـ input[type=datetime-local]
 */
function toLocalDatetimeValue(d = new Date()) {
  const x = new Date(d);
  x.setMinutes(x.getMinutes() - x.getTimezoneOffset());
  return x.toISOString().slice(0, 16);
}

/**
 * تقريب إلى منزلة عشرية واحدة
 */
function round1(n) {
  const v = Math.round(Number(n) * 10) / 10;
  return Number.isFinite(v) ? v : null;
}

// ===============================
// تصدير ما سنحتاجه في الصفحات
// ===============================
export {
  app, auth, db, storage,
  ensureAuth, logout,
  requireChildIdFromQuery,
  defaultAvatarPath, setChildAvatar,
  todayISO, toLocalDatetimeValue, round1
};
