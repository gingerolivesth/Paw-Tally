# Project: Paw Tally



## Files

### BLUEPRINT.md
- Summary: Project blueprint documenting structure, schema, design tokens, and editing guide
- Key elements: FIREBASE_CONFIG schema, payments collection schema, Design tokens, Editing guide
- Depends on: index.html
- Notes: Keep this file in sync whenever index.html's Firestore schema, UI, or behavior changes.
- Lines: 68 | Tokens: ~1055
- Flagged: No
- Last updated: 2026-08-02T03:30:08

### index.html
- Summary: Self-contained SPA — entry form, real-time Firestore list with date/time display, clear-all
- Key elements: FIREBASE_CONFIG, entriesCol, addDoc, onSnapshot, renderEntry, formatTimestamp, listenForEntries
- Depends on: firebase-app.js, firebase-firestore.js, Google Fonts (Fraunces, Inter), BLUEPRINT.md
- Notes: If you change the Firestore document fields (addDoc payload), also update renderEntry() and BLUEPRINT.md schema table. The createdAt field uses serverTimestamp() which resolves server-side; formatTimestamp() converts it to a human-readable locale string via .toDate().
- Lines: 514 | Tokens: ~3987
- Flagged: No
- Last updated: 2026-08-02T03:30:08
