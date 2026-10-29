const sessionId = localStorage.getItem("session_id") || crypto.randomUUID();
localStorage.setItem("session_id", sessionId);

const messagesEl = document.getElementById("messages");
const form = document.getElementById("chatForm");
const input = document.getElementById("messageInput");

function addBubble(text, cls) {
  const div = document.createElement("div");
  div.className = "bubble " + cls;
  div.textContent = text;
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

async function loadSettings() {
  const res = await fetch("/api/settings");
  const data = await res.json();
  document.getElementById("companyName").textContent = data.company_name;
  document.title = data.company_name + " Chat";
  const parts = data.company_name.split(" ");
  document.getElementById("logoMark").textContent = parts.map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}

async function sendMessage(text) {
  addBubble(text, "user");
  input.value = "";
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId, message: text }),
    });
    const data = await res.json();
    if (!res.ok) {
      addBubble(data.detail || "The assistant could not reply.", "alert");
      return;
    }
    addBubble(data.answer, "bot");
    if (data.escalated) {
      addBubble("This query was escalated for a human teammate.", "alert");
    }
  } catch (err) {
    addBubble("Could not reach the server. Check that the API is running.", "alert");
  }
}

form.addEventListener("submit", function (event) {
  event.preventDefault();
  const text = input.value.trim();
  if (text) {
    sendMessage(text);
  }
});

document.querySelectorAll(".chip").forEach(function (chip) {
  chip.addEventListener("click", function () {
    sendMessage(chip.getAttribute("data-q"));
  });
});

loadSettings();
addBubble("Hello. I can help with FAQs about accounts, billing, shipping, and plans. Ask a question to get started.", "bot");
