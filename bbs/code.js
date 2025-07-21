import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore, collection, addDoc, getDocs, query,
  orderBy, deleteDoc, doc, updateDoc, where, Timestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  getAuth, onAuthStateChanged, signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyD4UOBvpG254FLtK0MGm6R3LKMbgU6huYA",
  authDomain: "tekken-portal-76f26.firebaseapp.com",
  projectId: "tekken-portal-76f26",
  storageBucket: "tekken-portal-76f26.firebasestorage.app",
  messagingSenderId: "516955782397",
  appId: "1:516955782397:web:35bb7ccd1a5bbf32ebd294"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const postList = document.getElementById("postList");
const submitBtn = document.getElementById("submitPost");
const logoutButton = document.getElementById("logoutButton");

let currentUser = null;
let currentName = "";

// 日時フォーマット
function formatTimestamp(ts) {
  const d = ts.toDate();
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

// 表示
async function renderPosts() {
  postList.innerHTML = "";
  const now = Timestamp.now();
  const q = query(collection(db, "posts"), orderBy("startTime", "desc"));
  const snapshot = await getDocs(q);

  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const id = docSnap.id;
    const { name, content, startTime, endTime, uid } = data;

    if (startTime <= now && endTime >= now) {
      const div = document.createElement("div");
      div.className = "post";
      div.innerHTML = `
        <div class="post-header">
          ${name}<span class="post-time">${formatTimestamp(startTime)}</span>
        </div>
        <div class="post-body">${content}</div>
      `;

      if (uid === currentUser.uid) {
        const btns = document.createElement("div");
        btns.className = "post-buttons";

        const delBtn = document.createElement("button");
        delBtn.textContent = "削除";
        delBtn.onclick = async () => {
          await deleteDoc(doc(db, "posts", id));
          renderPosts();
        };

        const editBtn = document.createElement("button");
        editBtn.textContent = "編集";
        editBtn.onclick = async () => {
          const newContent = prompt("内容を編集:", content);
          if (newContent) {
            await updateDoc(doc(db, "posts", id), { content: newContent });
            renderPosts();
          }
        };

        btns.appendChild(editBtn);
        btns.appendChild(delBtn);
        div.appendChild(btns);
      }

      postList.appendChild(div);
    } else if (endTime < now) {
      deleteDoc(doc(db, "posts", id)); // 自動削除
    }
  });

  if (postList.innerHTML === "") postList.textContent = "表示するお知らせはありません。";
}

// 投稿
submitBtn.addEventListener("click", async () => {
  const content = document.getElementById("content").value.trim();
  const start = new Date(document.getElementById("startTime").value);
  const end = new Date(document.getElementById("endTime").value);

  if (!content || isNaN(start) || isNaN(end)) return alert("すべて入力してください");

  await addDoc(collection(db, "posts"), {
    name: currentName,
    uid: currentUser.uid,
    content,
    startTime: Timestamp.fromDate(start),
    endTime: Timestamp.fromDate(end),
  });

  document.getElementById("content").value = "";
  renderPosts();
});

// 認証確認
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    location.href = "/";
    return;
  }
  currentUser = user;

  // 名前取得
  const ref = doc(db, "emailToUsername", user.email);
  const snap = await getDocs(query(collection(db, "emailToUsername"), where("__name__", "==", user.email)));
  if (!snap.empty) {
    currentName = snap.docs[0].data().name;
  } else {
    currentName = "ユーザー";
  }

  renderPosts();
});

logoutButton.onclick = () => {
  signOut(auth).then(() => location.href = "/");
};
