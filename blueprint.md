# Project: Paw Tally



## Files

### app.js
- Summary: All application logic: toggle handlers, form submission, Firestore CRUD, entry rendering, toast notifications
- Key elements: isConfigured, currentCategory, updateFormVisibility, listenForEntries, renderEntry, formatTimestamp, escapeHtml, showToast
- Depends on: ./firebase-config.js, firebase-firestore.js
- Notes: Imports db and entriesCol from firebase-config.js. If you add new Firestore fields in addDoc payloads, also update renderEntry() to display them.
- Lines: 230 | Tokens: ~1917
- Flagged: No
- Last updated: 2026-08-02T04:09:15

### firebase-config.js
- Summary: Firebase initialization and Firestore collection reference; single source of truth for project config
- Key elements: FIREBASE_CONFIG, isConfigured, app, db, entriesCol
- Depends on: firebase-app.js, firebase-firestore.js
- Notes: All other JS files import from here. If you change the Firestore collection name, update it here only. `db` and `entriesCol` are null when not configured.
- Lines: 31 | Tokens: ~298
- Flagged: No
- Last updated: 2026-08-02T04:09:15

### index.html
- Summary: Self-contained SPA shell with HTML structure only; links to styles.css and app.js
- Key elements: config-warning-wrap, app, category-toggle, service-fields, service-toggle, type-toggle, amount, notes-row, entries, empty-state, toast
- Depends on: styles.css, app.js, Google Fonts (Fraunces, Inter)
- Notes: No logic lives here. All JS is in app.js, all CSS in styles.css. If you add new DOM elements here, reference them from app.js.
- Lines: 93 | Tokens: ~884
- Flagged: No
- Last updated: 2026-08-02T04:09:15

### styles.css
- Summary: All visual styles for Paw Tally extracted from the original inline <style> block
- Key elements: --paper, --teal, --amber, --danger, .card, .toggle-pair, .entry, .tag, #toast
- Depends on: —
- Notes: Pure CSS, no logic. If you add new HTML elements in index.html, add matching styles here.
- Lines: 301 | Tokens: ~1823
- Flagged: No
- Last updated: 2026-08-02T04:09:15
