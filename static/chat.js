// static/chat.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCCoKD-_GdqkSzwrAk9kLg191ra1oN19uo",
  authDomain: "carreview-6c9d7.firebaseapp.com",
  projectId: "carreview-6c9d7",
  storageBucket: "carreview-6c9d7.appspot.com",
  messagingSenderId: "585266517662",
  appId: "1:585266517662:web:4a76d501b406f1dfb38d8f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

let currentUid = null;
onAuthStateChanged(auth, (user) => {
  currentUid = user ? user.uid : null;
});

window.abrirChatModelo = async (marca, modelo) => {
  const container = document.getElementById("chat-content");
  const chatBox = document.getElementById("chat-box");
  const chatId = `${marca}_${modelo}`;

  chatBox.classList.add("expanded");

  container.innerHTML = `
    <div id="chat-header">
      <strong>Chat ${marca} ${modelo}</strong>
      <span onclick="toggleChat()" style="cursor:pointer;">✖</span>
    </div>
    <div id="chat-messages" style="flex:1; overflow-y:auto; padding:10px;"></div>
    <div id="chat-input-area" style="display:none; padding:10px; gap:10px; display:flex;">
      <input id="chat-input" placeholder="Digite uma mensagem..." style="flex:1; padding:8px;">
      <button id="send-btn">Enviar</button>
    </div>
  `;

  const chatRef = collection(db, "chats", chatId, "mensagens");
  const q = query(chatRef, orderBy("timestamp"));

  // Mostra mensagens
  onSnapshot(q, (snapshot) => {
    const chatBox = document.getElementById("chat-messages");
    chatBox.innerHTML = "";

    const loggedUser = auth.currentUser;

    snapshot.forEach(doc => {
      const msg = doc.data();
      const isMine = loggedUser && msg.uid === loggedUser.uid;

      const msgDiv = document.createElement("div");
      msgDiv.classList.add("msg");
      msgDiv.classList.add(isMine ? "direita" : "esquerda");
      msgDiv.innerHTML = `<strong>${msg.nome}</strong><br>${msg.texto}`;
      chatBox.appendChild(msgDiv);
    });

    chatBox.scrollTop = chatBox.scrollHeight;
  });

  // Mostra input se logado
  onAuthStateChanged(auth, (user) => {
    const inputArea = document.getElementById("chat-input-area");
    inputArea.style.display = user ? "flex" : "none";
  });

  // Envia mensagem
  document.getElementById("send-btn").onclick = async () => {
    const input = document.getElementById("chat-input");
    const texto = input.value.trim();
    const user = auth.currentUser;

    if (!user) {
      alert("Você precisa estar logado para comentar.");
      return;
    }

    if (texto === "") return;

    await addDoc(chatRef, {
      texto,
      nome: user.displayName,
      uid: user.uid,
      timestamp: new Date()
    });

    input.value = "";
  };
};
