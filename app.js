// [ADDED] SUKA Messenger local prototype interactions
const conversations = [
  { id: "nadia", name: "Nadia Putri", initials: "NP", color: "violet", time: "10:42", preview: "Nanti aku kabari lagi ya.", unread: 2, online: true, group: false,
    messages: [
      { from: "them", text: "Hai! Gimana kabarnya hari ini?", time: "10:35" },
      { from: "me", text: "Baik, lagi menyelesaikan beberapa hal. Kamu gimana?", time: "10:37" },
      { from: "them", text: "Aku juga baik. Eh, soal rencana akhir pekan kemarin...", time: "10:39" },
      { from: "me", text: "Iya, aku masih tertarik. Kita atur waktunya saja.", time: "10:40" },
      { from: "them", text: "Nanti aku kabari lagi ya.", time: "10:42" }
    ] },
  { id: "studio", name: "Studio Kreatif", initials: "SK", color: "coral", time: "09:18", preview: "Raka: File desainnya sudah aku kirim.", unread: 4, online: false, group: true,
    messages: [
      { from: "them", text: "Pagi semua, ini update untuk konsep minggu ini.", time: "09:10" },
      { from: "them", text: "Raka: File desainnya sudah aku kirim.", time: "09:18" }
    ] },
  { id: "arya", name: "Arya Mahendra", initials: "AM", color: "blue", time: "Kemarin", preview: "Sip, terima kasih banyak!", unread: 0, online: false, group: false,
    messages: [
      { from: "them", text: "Sudah aku cek dokumennya.", time: "16:20" },
      { from: "me", text: "Ada bagian yang perlu diperbaiki?", time: "16:24" },
      { from: "them", text: "Sip, terima kasih banyak!", time: "16:27" }
    ] },
  { id: "keluarga", name: "Keluarga", initials: "K", color: "green", time: "Senin", preview: "Ibu: Jangan lupa makan ya.", unread: 0, online: false, group: true,
    messages: [
      { from: "them", text: "Ibu: Jangan lupa makan ya.", time: "08:15" },
      { from: "me", text: "Iya Bu, nanti aku makan. Terima kasih.", time: "08:20" }
    ] }
];

const app = document.querySelector("#app");
const list = document.querySelector("#conversation-list");
const search = document.querySelector("#chat-search");
const messageArea = document.querySelector("#message-area");
const messageInput = document.querySelector("#message-input");
const messageForm = document.querySelector("#message-form");
const chatName = document.querySelector("#chat-name");
const chatAvatar = document.querySelector("#chat-avatar");
const chatStatus = document.querySelector("#chat-status");
const activeChat = document.querySelector("#active-chat");
const chatEmpty = document.querySelector("#chat-empty");
const infoDialog = document.querySelector("#info-dialog");
let activeId = "nadia";
let activeFilter = "all";

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}

function currentChat() {
  return conversations.find((conversation) => conversation.id === activeId);
}

function renderConversations() {
  const term = search.value.trim().toLowerCase();
  const visible = conversations.filter((conversation) => {
    const matchesSearch = conversation.name.toLowerCase().includes(term) || conversation.preview.toLowerCase().includes(term);
    const matchesFilter = activeFilter === "all" ||
      (activeFilter === "unread" && conversation.unread > 0) ||
      (activeFilter === "groups" && conversation.group);
    return matchesSearch && matchesFilter;
  });

  document.querySelector("#conversation-count").textContent = String(visible.length).padStart(2, "0");
  if (!visible.length) {
    list.innerHTML = '<p class="no-results">Tidak ada percakapan yang cocok.</p>';
    return;
  }

  list.innerHTML = visible.map((conversation) => `
    <button class="conversation-item ${conversation.id === activeId ? "is-active" : ""}" type="button" role="listitem" data-chat-id="${conversation.id}" aria-current="${conversation.id === activeId ? "true" : "false"}">
      <span class="avatar avatar-${conversation.color}">${escapeHTML(conversation.initials)}</span>
      <span class="conversation-copy">
        <span class="conversation-topline">
          <span class="conversation-name">${escapeHTML(conversation.name)}</span>
          ${conversation.group ? '<span class="group-label">GRUP</span>' : ""}
        </span>
        <span class="conversation-preview">${escapeHTML(conversation.preview)}</span>
      </span>
      <span class="conversation-meta">
        <span>${escapeHTML(conversation.time)}</span>
        ${conversation.unread ? `<span class="unread-count">${conversation.unread}</span>` : ""}
      </span>
    </button>
  `).join("");
}

function renderMessages() {
  const conversation = currentChat();
  if (!conversation) return;
  messageArea.innerHTML = '<div class="date-divider"><span>HARI INI</span></div>' +
    conversation.messages.map((message) => `
      <div class="message-row ${message.from === "me" ? "is-mine" : ""}">
        <div class="message-bubble">
          <p class="message-text">${escapeHTML(message.text)}</p>
          <span class="message-time">${escapeHTML(message.time)} ${message.from === "me" ? '<span class="message-status">✓✓</span>' : ""}</span>
        </div>
      </div>
    `).join("");
  messageArea.scrollTop = messageArea.scrollHeight;
}

function selectChat(id) {
  activeId = id;
  const conversation = currentChat();
  if (!conversation) return;
  conversation.unread = 0;
  chatName.textContent = conversation.name;
  chatAvatar.textContent = conversation.initials;
  chatAvatar.className = `avatar avatar-large avatar-${conversation.color}`;
  chatStatus.innerHTML = conversation.online ? '<span class="online-dot"></span> Aktif sekarang' : (conversation.group ? "Grup percakapan" : "Terakhir dilihat baru-baru ini");
  activeChat.hidden = false;
  chatEmpty.hidden = true;
  renderConversations();
  renderMessages();
  app.classList.add("mobile-chat-open");
}

function sendMessage(text) {
  const conversation = currentChat();
  if (!conversation || !text.trim()) return;
  const now = new Date();
  const time = now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  const cleanText = text.trim();
  conversation.messages.push({ from: "me", text: cleanText, time });
  conversation.preview = cleanText;
  conversation.time = time;
  conversations.splice(conversations.indexOf(conversation), 1);
  conversations.unshift(conversation);
  renderConversations();
  renderMessages();
}

list.addEventListener("click", (event) => {
  const button = event.target.closest("[data-chat-id]");
  if (button) selectChat(button.dataset.chatId);
});
search.addEventListener("input", renderConversations);
document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach((item) => item.classList.toggle("is-selected", item === button));
    renderConversations();
  });
});
messageForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = messageInput.value;
  if (!value.trim()) return;
  sendMessage(value);
  messageInput.value = "";
  messageInput.focus();
});
document.querySelector("#mobile-back").addEventListener("click", () => app.classList.remove("mobile-chat-open"));
document.querySelector("#theme-toggle").addEventListener("click", () => document.body.classList.toggle("dark-mode"));
document.querySelector("#profile-button").addEventListener("click", () => openInfo("Profil akun", "Ini adalah tampilan profil contoh. Pengaturan akun belum terhubung ke layanan apa pun."));
document.querySelector("#chat-info").addEventListener("click", () => {
  const conversation = currentChat();
  openInfo(conversation.name, conversation.group ? "Grup contoh untuk preview antarmuka SUKA Messenger." : "Kontak contoh untuk preview antarmuka SUKA Messenger.");
});
document.querySelector("#search-in-chat").addEventListener("click", () => {
  openInfo("Cari pesan", "Pencarian pesan dalam percakapan akan tersedia pada tahap berikutnya. Pencarian daftar percakapan sudah aktif.");
});
document.querySelector("#new-chat").addEventListener("click", () => {
  openInfo("Percakapan baru", "Pemilihan kontak membutuhkan sumber data kontak. Pada prototype ini, pilih salah satu percakapan contoh yang tersedia.");
});
document.querySelector("#attach-button").addEventListener("click", () => document.querySelector("#attachment-input").click());
document.querySelector("#attachment-input").addEventListener("change", (event) => {
  const file = event.target.files && event.target.files[0];
  if (file) openInfo("Lampiran dipilih", `File “${file.name}” dipilih secara lokal. Pengiriman file belum terhubung ke backend.`);
  event.target.value = "";
});
document.querySelector("#close-dialog").addEventListener("click", () => infoDialog.close());
document.querySelector("#dialog-confirm").addEventListener("click", () => infoDialog.close());
document.querySelector("#chat-search").addEventListener("keydown", (event) => {
  if (event.key === "/" && document.activeElement !== search) {
    event.preventDefault();
    search.focus();
  }
});
document.addEventListener("keydown", (event) => {
  if (event.key === "/" && document.activeElement !== search && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
    event.preventDefault();
    search.focus();
  }
});

function openInfo(title, copy) {
  document.querySelector("#dialog-title").textContent = title;
  document.querySelector("#dialog-copy").textContent = copy;
  infoDialog.showModal();
}

renderConversations();
selectChat(activeId);