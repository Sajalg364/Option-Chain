# Realtime Option Chain

This project is a complete implementation of a Realtime Option Chain using Vite, React, TailwindCSS for the frontend, and Node.js for the backend. The application displays a depth of 75 strikes and updates real-time data every 200ms through WebSockets.

## Project Structure

```
realtime-option-chain/
├── backend/
│   ├── index.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── OptionChain.js
│   │   │   ├── RealtimeInspector.js
│   │   │   └── WebSocketProvider.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── main.jsx
│   │   └── vite.config.js
│   ├── index.html
│   └── package.json
└── README.md
```

## How to Run

### Backend

1. Navigate to the `backend` directory:
   ```sh
   cd backend
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Start the backend server:
   ```sh
   npm start
   ```

### Frontend

1. Navigate to the `frontend` directory:
   ```sh
   cd frontend
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Start the frontend server:
   ```sh
   npm run dev
   ```

4. Open your browser and go to `http://localhost:3000`.

## Features

- **Option Chain Page (/option-chain)**:
  - Displays a depth of 75 strikes.
  - Shows strike, current price, percent change in price, and current real-time value of the underlying instrument.

- **Realtime Data Inspector Page (/realtime)**:
  - Subscribe and unsubscribe to given tokens/strikes.
  - Render real-time value and percent change.
  - Connect/Close the WebSocket connection.
  - Show the current state of the WebSocket connection.

## Recommended for Stronger Submission

- Reconnect WebSocket on lost connections.
- Prevent layout shifts on the frontend.
- Differentiate between positive and negative changes in price.
- Incorporate color to differentiate between at-the-money, in-the-money, and out-of-the-money strikes.
- Run WebSocket as a Web Worker to improve performance.
- Improve performance via creating a virtualized view.
- Conserve network bandwidth used by the real-time connection.

## License

This project is licensed under the MIT License.