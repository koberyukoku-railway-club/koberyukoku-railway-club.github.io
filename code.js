const accounts = [
  { id: 'admin',      password: 'xctsw2zP2Z220312!', name: '管理者' },
  { id: 'akamatsu',   password: 'fU3znFha',           name: '赤松克則' },
  { id: 'arakawa',    password: 'Hs9qngCY',           name: '荒川航太郎' },
  { id: 'ueda',       password: 'Hq7M4iQj',           name: '植田光一郎' },
  { id: 'matsumoto',  password: 'qA2xkpuJ',           name: '松本誠司' },
  { id: 'aritsu',     password: 'iK5gbpRs',           name: '有津楽人' },
  { id: 'shimura',    password: 'M9gZApJy',           name: '四村嶺伯' },
  { id: 'nakashima',  password: 'D2ezKXt4',           name: '中嶋拓人' },
  { id: 'mori',       password: 'G4yZKTVr',           name: '森悠成' },
  { id: 'hontani',    password: 'xctsw2zP2Z220312!',  name: '本谷はじめ' },
  { id: 'nikaido',    password: 'Br8gEDbj',           name: '二階堂宏紀' },
  { id: 'takeuchi',   password: 'g9MTFAvr',           name: '武内悠祐' }
];

function showUser(user) {
  const userDropdown = document.getElementById('userDropdown');
  const userName = document.getElementById('userName');
  const dropdownMenu = document.getElementById('dropdownMenu');

  userName.textContent = user.name;
  userDropdown.style.display = 'block';
  document.getElementById('loginForm').style.display = 'none';

  // Toggle dropdown
  userName.onclick = () => {
    dropdownMenu.style.display =
      dropdownMenu.style.display === 'block' ? 'none' : 'block';
  };

  // Hide dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!userDropdown.contains(e.target)) {
      dropdownMenu.style.display = 'none';
    }
  });
}

function login() {
  const inputId = document.getElementById('username').value.trim();
  const inputPw = document.getElementById('password').value;
  const user = accounts.find(acc => acc.id === inputId && acc.password === inputPw);

  if (user) {
    localStorage.setItem('loggedInUserId', user.id);
    showUser(user);
  } else {
    alert('ユーザーIDまたはパスワードが間違っています。');
  }
}

function logout() {
  localStorage.removeItem('loggedInUserId');
  location.reload();
}

window.addEventListener('DOMContentLoaded', () => {
  const savedId = localStorage.getItem('loggedInUserId');
  if (savedId) {
    const user = accounts.find(acc => acc.id === savedId);
    if (user) {
      showUser(user);
    } else {
      localStorage.removeItem('loggedInUserId');
    }
  }

  // Service Worker 登録
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(reg => console.log('Service Worker 登録成功:', reg.scope))
        .catch(err => console.error('Service Worker 登録失敗:', err));
    });
  }
});
