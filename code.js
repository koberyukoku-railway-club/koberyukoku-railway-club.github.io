import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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
const db = getFirestore(app);

function showUser(name) {
  document.getElementById('userDropdown').style.display = 'block';
  document.getElementById('userName').textContent = name;
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('contentArea').style.display = 'flex';

  const dropdownMenu = document.getElementById('dropdownMenu');
  document.getElementById('userName').onclick = () => {
    dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
  };

  document.addEventListener('click', (e) => {
    if (!document.getElementById('userDropdown').contains(e.target)) {
      dropdownMenu.style.display = 'none';
    }
  });

  // ✅ ログイン後に /bbs を明示的に表示
  loadPage('/bbs');
}

window.login = async function () {
  const inputUsername = document.getElementById('username').value.trim();
  const inputPassword = document.getElementById('password').value;
  const loadingElem = document.getElementById('loading');
  loadingElem.style.display = 'block';

  try {
    const userRef = doc(db, "usernameMap", inputUsername);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      alert("ユーザーが存在しません。");
      loadingElem.style.display = 'none';
      return;
    }

    const { email, name } = userSnap.data();
    await signInWithEmailAndPassword(auth, email, inputPassword);
    showUser(name);
  } catch (error) {
    console.error(error);
    alert("ログインに失敗しました。ユーザーIDまたはパスワードが間違っている可能性があります。");
  } finally {
    loadingElem.style.display = 'none';
  }
};

window.logout = async function () {
  await signOut(auth);
  location.reload();
};

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const q = doc(db, "emailToUsername", user.email);
    const snapshot = await getDoc(q);
    if (snapshot.exists()) {
      const { name } = snapshot.data();
      showUser(name);
    } else {
      showUser("ユーザー");
    }
  }
});

window.loadPage = function (url) {
  document.getElementById('contentFrame').src = url;
};

window.openDrive = function () {
  window.location.href = "https://drive.google.com/drive/folders/1QbweptHSfYdVRsAym7yukE5p9Mfbrml43nS_N4chUE9mefunTTaU7-3MrMK84qs4hS5gOuDn";
};
