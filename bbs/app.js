// Firebaseのモジュールをインポート
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";

// Firebaseの設定（プロジェクトの設定に合わせてコピペ）
const firebaseConfig = {
  apiKey: "AIzaSyD4UOBvpG254FLtK0MGm6R3LKMbgU6huYA",
  authDomain: "tekken-portal-76f26.firebaseapp.com",
  projectId: "tekken-portal-76f26",
  storageBucket: "tekken-portal-76f26.firebasestorage.app",
  messagingSenderId: "516955782397",
  appId: "1:516955782397:web:35bb7ccd1a5bbf32ebd294"
};

// Firebaseの初期化
const app = initializeApp(firebaseConfig);

// Firebaseの認証とFirestoreを取得
const auth = getAuth(app);
const db = getFirestore(app);

// usernameMap などを使ってユーザー名を取得する関数（例）
async function getUsername(email) {
  const userRef = collection(db, "emailToUsername");
  const userQuery = query(userRef, where("email", "==", email));
  const userSnapshot = await getDocs(userQuery);
  if (!userSnapshot.empty) {
    return userSnapshot.docs[0].data().username;  // ユーザー名を返す
  }
  return "不明なユーザー";
}

// 投稿フォーム処理
document.getElementById("notice-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const startAt = new Date(document.getElementById("startAt").value);
  const endAt = new Date(document.getElementById("endAt").value);
  const content = document.getElementById("content").value;

  const user = auth.currentUser;
  if (!user) {
    alert("ログインしてください");
    return;
  }

  const username = await getUsername(user.email);

  try {
    // Firestoreに投稿データを追加
    await addDoc(collection(db, "notices"), {
      username,
      content,
      startAt: startAt,
      endAt: endAt,
      createdAt: new Date()
    });

    document.getElementById("notice-form").reset(); // フォームをリセット
  } catch (e) {
    console.error("投稿に失敗しました: ", e);
  }
});

// お知らせの表示
function renderNotice(notice) {
  const div = document.createElement("div");
  div.className = "notice";
  div.innerHTML = `<div class="username">【${notice.username}】</div><div>${notice.content}</div>`;
  return div;
}

// Firestoreからお知らせを取得し表示
onAuthStateChanged(auth, (user) => {
  if (user) {
    const q = query(collection(db, "notices"), orderBy("createdAt", "desc"));
    onSnapshot(q, (snapshot) => {
      const noticesDiv = document.getElementById("notices");
      noticesDiv.innerHTML = "";  // 既存のお知らせを消す

      const now = new Date();

      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        const start = data.startAt.toDate();
        const end = data.endAt.toDate();

        // 現在の時間が表示期間内にあるかを確認
        if (start <= now && now <= end) {
          const noticeEl = renderNotice(data);
          noticesDiv.appendChild(noticeEl);
        }
      });
    });
  }
});
