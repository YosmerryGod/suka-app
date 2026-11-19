# SUKA Messenger

Frontend prototype for a modern messaging workspace, built with vanilla HTML, CSS, and JavaScript.

## Scope

This repository currently contains the **frontend only**. The interface uses sample conversations and local browser state.

- Responsive desktop and mobile messaging layout
- Conversation list with search and filters
- Message thread with local send interaction
- Local theme toggle
- Native accessible information dialog
- Local file selection preview (no upload)

## Run locally

No build step or dependency installation is required.

1. Clone the repository.
2. Open `index.html` in a browser, or use a local static server.
3. Select a conversation and send a local preview message.

## Important limitations

- Messages are not sent to WhatsApp or any external service.
- No backend, API, database, authentication, or WhatsApp connection is included.
- Conversation data resets when the page is refreshed.
- Sample names and messages are demonstration content.

## Files

- `index.html` — semantic application structure
- `styles.css` — visual system and responsive layout
- `app.js` — sample data and browser-side interactions

## Design notes

The visual identity uses SUKA's purple direction with a calm, neutral workspace. The layout borrows familiar messaging conventions without using WhatsApp branding or proprietary assets.

## License

No license has been added yet.