import { isConfigured, db, entriesCol } from "./firebase-config.js";
import {
  addDoc, deleteDoc, doc, onSnapshot,
  query, orderBy, serverTimestamp, writeBatch, getDocs
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

// ---- Guard: show warning if not configured ----
if (!isConfigured) {
  document.getElementById("config-warning-wrap").classList.remove("hidden");
} else {
  const appEl = document.getElementById("app");
  const entriesEl = document.getElementById("entries");
  const emptyState = document.getElementById("empty-state");
  const toast = document.getElementById("toast");

  appEl.classList.remove("hidden");
  listenForEntries();

  // ---- Toggle groups ----
  let currentCategory = "Service";
  let currentType = "Booking";
  let currentService = "Boarding";

  const serviceFields = document.getElementById("service-fields");
  const notesRow = document.getElementById("notes-row");
  const amountLabel = document.getElementById("amount-label");
  const addBtn = document.getElementById("add-btn");

  function updateFormVisibility() {
    if (currentCategory === "Expense") {
      serviceFields.classList.add("hidden");
      notesRow.classList.remove("hidden");
      amountLabel.textContent = "Amount";
      addBtn.textContent = "Log expense";
    } else {
      serviceFields.classList.remove("hidden");
      notesRow.classList.add("hidden");
      amountLabel.textContent = "Amount (optional)";
      addBtn.textContent = "Add to today's log";
    }
  }

  document.getElementById("category-toggle").addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    currentCategory = btn.dataset.val;
    [...btn.parentElement.children].forEach(b => b.classList.toggle("active", b === btn));
    updateFormVisibility();
  });

  document.getElementById("type-toggle").addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    currentType = btn.dataset.val;
    [...btn.parentElement.children].forEach(b => b.classList.toggle("active", b === btn));
  });

  document.getElementById("service-toggle").addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    currentService = btn.dataset.val;
    [...btn.parentElement.children].forEach(b => b.classList.toggle("active", b === btn));
  });

  // ---- Add entry ----
  document.getElementById("add-btn").addEventListener("click", async () => {
    const nameInput = document.getElementById("customer-name");
    const amountInput = document.getElementById("amount");
    const notesInput = document.getElementById("notes");
    const amount = amountInput.value ? parseFloat(amountInput.value) : null;

    if (currentCategory === "Expense") {
      // Expense: require an amount
      if (!amount || amount <= 0) {
        amountInput.focus();
        showToast("Enter an amount for this expense");
        return;
      }
      const notes = notesInput.value.trim();

      try {
        await addDoc(entriesCol, {
          category: "expense",
          amount,
          notes,
          createdAt: serverTimestamp()
        });
        amountInput.value = "";
        notesInput.value = "";
        showToast("Expense logged");
      } catch (err) {
        showToast("Couldn't save — check your connection");
      }
    } else {
      // Service entry
      const name = nameInput.value.trim();
      if (!name) {
        nameInput.focus();
        showToast("Add a customer name first");
        return;
      }

      try {
        await addDoc(entriesCol, {
          category: "service",
          name,
          type: currentType,
          service: currentService,
          amount,
          createdAt: serverTimestamp()
        });
        nameInput.value = "";
        amountInput.value = "";
        nameInput.focus();
        showToast(`Logged ${name}`);
      } catch (err) {
        showToast("Couldn't save — check your connection");
      }
    }
  });

  // ---- Listen for entries ----
  function listenForEntries() {
    const q = query(entriesCol, orderBy("createdAt", "desc"));
    onSnapshot(q, (snapshot) => {
      entriesEl.innerHTML = "";
      if (snapshot.empty) {
        emptyState.classList.remove("hidden");
        return;
      }
      emptyState.classList.add("hidden");
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        entriesEl.appendChild(renderEntry(docSnap.id, data));
      });
    });
  }

  function formatTimestamp(ts) {
    if (!ts) return "";
    const d = ts.toDate();
    return d.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  function renderEntry(id, data) {
    const isExpense = data.category === "expense";
    const el = document.createElement("div");
    const svc = isExpense ? "Expense" : (data.service || "Boarding");
    el.className = `entry service-${svc}`;

    const stampEmoji = isExpense ? "💸" : (data.service === "Boarding" ? "🏠" : "✂️");
    const amountText = (data.amount !== null && data.amount !== undefined && data.amount !== "")
      ? `฿${Number(data.amount).toLocaleString(undefined, {minimumFractionDigits: 0})}`
      : "";
    const dateStr = formatTimestamp(data.createdAt);

    if (isExpense) {
      const displayName = data.notes ? escapeHtml(data.notes) : "Expense";
      el.innerHTML = `
        <div class="stamp">${stampEmoji}</div>
        <div class="entry-body">
          <p class="entry-name">${displayName}</p>
          <div class="entry-meta">
            <span class="tag service-Expense">Expense</span>
          </div>
          ${dateStr ? `<div class="entry-timestamp">${dateStr}</div>` : ""}
        </div>
        ${amountText ? `<div class="entry-amount">${amountText}</div>` : ""}
        <button class="entry-remove" title="Remove entry">✕</button>
      `;
    } else {
      el.innerHTML = `
        <div class="stamp">${stampEmoji}</div>
        <div class="entry-body">
          <p class="entry-name">${escapeHtml(data.name)}</p>
          <div class="entry-meta">
            <span class="tag service-${data.service}">${data.service}</span>
            <span>${data.type}</span>
          </div>
          ${dateStr ? `<div class="entry-timestamp">${dateStr}</div>` : ""}
        </div>
        ${amountText ? `<div class="entry-amount">${amountText}</div>` : ""}
        <button class="entry-remove" title="Remove — recorded in ledger">✕</button>
      `;
    }

    el.querySelector(".entry-remove").addEventListener("click", async () => {
      if (!confirm("Remove this entry?")) return;
      try {
        await deleteDoc(doc(db, "payments", id));
      } catch (err) {
        showToast("Couldn't remove entry");
      }
    });
    return el;
  }

  // ---- Clear all ----
  document.getElementById("clear-all-btn").addEventListener("click", async () => {
    if (!confirm("Clear every entry in today's log? Make sure you've recorded them in your ledger first.")) return;
    try {
      const snapshot = await getDocs(entriesCol);
      const batch = writeBatch(db);
      snapshot.forEach((d) => batch.delete(d.ref));
      await batch.commit();
      showToast("Log cleared");
    } catch (err) {
      showToast("Couldn't clear log");
    }
  });

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  let toastTimer = null;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
  }
}