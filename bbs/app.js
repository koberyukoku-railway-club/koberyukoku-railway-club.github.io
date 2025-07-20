// Firebase 初期化
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// email から名前（name）を取得
async function getUserNameByEmail(email) {
  const doc = await db.collection('emailToUsername').doc(email).get();
  return doc.exists ? doc.data().name : "不明なユーザー";
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

  const userName = await getUserNameByEmail(user.email);

  await db.collection("notices").add({
    username: userName,
    content,
    startAt: firebase.firestore.Timestamp.fromDate(startAt),
    endAt: firebase.firestore.Timestamp.fromDate(endAt),
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  });

  document.getElementById("notice-form").reset();
});

// お知らせの表示
function renderNotice(notice) {
  const div = document.createElement("div");
  div.className = "notice";
  div.innerHTML = `<div class="username">【${notice.username}】</div><div>${notice.content}</div>`;
  return div;
}

// 表示中のお知らせのみ取得（現在が startAt 〜 endAt の間）
auth.onAuthStateChanged((user) => {
  if (user) {
    db.collection("notices")
      .orderBy("createdAt", "desc")
      .onSnapshot((snapshot) => {
        const noticesDiv = document.getElementById("notices");
        noticesDiv.innerHTML = "";

        const now = new Date();

        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          const start = data.startAt?.toDate();
          const end = data.endAt?.toDate();

          if (start <= now && now <= end) {
            const noticeEl = renderNotice(data);
            noticesDiv.appendChild(noticeEl);
          }
        });
      });
  }
});
