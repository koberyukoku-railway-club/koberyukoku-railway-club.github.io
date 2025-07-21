import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyD4UOBvpG254FLtK0MGm6R3LKMbgU6huYA",
  authDomain: "tekken-portal-76f26.firebaseapp.com",
  projectId: "tekken-portal-76f26",
  storageBucket: "tekken-portal-76f26.firebasestorage.app",
  messagingSenderId: "516955782397",
  appId: "1:516955782397:web:35bb7ccd1a5bbf32ebd294"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 認証チェック
onAuthStateChanged(auth, user => {
  if (!user && location.pathname !== "/") {
    location.href = "/";
  }
});
