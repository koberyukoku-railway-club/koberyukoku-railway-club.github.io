import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Firebase 初期化
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

// ユーザーのログイン情報
let currentUser = null;

onAuthStateChanged(auth, (user) => {
  currentUser = user;
  if (user) {
    loadAnnouncements();
  }
});

// お知らせをロード
async function loadAnnouncements() {
  const q = query(collection(db, "announcements"), orderBy("startDate", "desc"));
  const querySnapshot = await getDocs(q);
  const announcementList = document.getElementById("announcement-list");

  announcementList.innerHTML = ''; // 初期化

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const announcementItem = document.createElement("div");
    announcementItem.classList.add("announcement-item");

    // 投稿者名、内容、日付の表示
    announcementItem.innerHTML = `
      <div><strong>【${data.username}】</strong></div>
      <div class="announcement-content">${data.content}</div>
      <div><em>表示期間: ${new Date(data.startDate.seconds * 1000).toLocaleString()} - ${new Date(data.endDate.seconds * 1000).toLocaleString()}</em></div>
    `;

    // 編集・削除ボタン（投稿者のみ）
    if (data.username === currentUser.displayName) {
      const editBtn = document.createElement("button");
      editBtn.textContent = "編集";
      editBtn.classList.add("edit-btn");

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "削除";
      deleteBtn.classList.add("delete-btn");

      editBtn.onclick = () => editAnnouncement(doc.id);
      deleteBtn.onclick = () => deleteAnnouncement(doc.id);

      const btnContainer = document.createElement("div");
      btnContainer.classList.add("edit-delete-btns");
      btnContainer.appendChild(editBtn);
      btnContainer.appendChild(deleteBtn);

      announcementItem.appendChild(btnContainer);
    }

    announcementList.appendChild(announcementItem);
  });
}

// お知らせ投稿処理
document.getElementById("announcement-form").addEventListener("submit", async (event) => {
  event.preventDefault();

  const startDate = new Date(document.getElementById("start-date").value).getTime();
  const endDate = new Date(document.getElementById("end-date").value).getTime();
  const content = document.getElementById("content").value;

  if (currentUser) {
    await addDoc(collection(db, "announcements"), {
      username: currentUser.displayName,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      content: content,
    });

    loadAnnouncements();  // 再ロード
  }
});

// お知らせ削除処理
async function deleteAnnouncement(id) {
  await deleteDoc(doc(db, "announcements", id));
  loadAnnouncements();  // 再ロード
}

// お知らせ編集処理（追加機能が必要）
function editAnnouncement(id) {
  // 編集処理（必要な場合）
  console.log("編集機能が未実装です。");
}

