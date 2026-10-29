const rowsEl = document.getElementById("queryRows");

async function loadSettings() {
  const res = await fetch("/api/settings");
  const data = await res.json();
  document.getElementById("companyName").textContent = data.company_name;
  document.title = data.company_name + " Dashboard";
  const parts = data.company_name.split(" ");
  document.getElementById("logoMark").textContent = parts.map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}

function esc(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function fmtTime(value) {
  const date = new Date(value);
  return date.toLocaleString();
}

async function toggleCheck(id, checked) {
  await fetch("/api/queries/" + id, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ checked: checked }),
  });
  loadQueries();
}

async function loadQueries() {
  const res = await fetch("/api/queries");
  const items = await res.json();
  const checked = items.filter((i) => i.checked).length;
  const escalated = items.filter((i) => i.escalated).length;
  document.getElementById("totalCount").textContent = items.length;
  document.getElementById("checkedCount").textContent = checked;
  document.getElementById("openCount").textContent = items.length - checked;
  document.getElementById("escalatedCount").textContent = escalated;

  rowsEl.innerHTML = "";
  if (!items.length) {
    rowsEl.innerHTML = "<tr><td colspan='5'>No queries yet. Start a chat first.</td></tr>";
    return;
  }

  items.forEach(function (item) {
    const tr = document.createElement("tr");
    const status = item.escalated
      ? "<span class='tag warn'>Escalated</span>"
      : "<span class='tag ok'>FAQ reply</span>";
    tr.innerHTML =
      "<td><input class='check' type='checkbox' " + (item.checked ? "checked" : "") + " /></td>" +
      "<td class='q'><strong>" + esc(item.question) + "</strong><div class='a'>Session " + esc(item.session_id.slice(0, 8)) + "</div></td>" +
      "<td class='a'>" + esc(item.answer) + "</td>" +
      "<td>" + status + "</td>" +
      "<td>" + fmtTime(item.created_at) + "</td>";
    const box = tr.querySelector("input");
    box.addEventListener("change", function () {
      toggleCheck(item.id, box.checked);
    });
    rowsEl.appendChild(tr);
  });
}

loadSettings();
loadQueries();
setInterval(loadQueries, 8000);
