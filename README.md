# Realtime Option Chain

This project is a comprehensive implementation of a Realtime Option Chain using Vite, React, TailwindCSS for the frontend, and Node.js for the backend. The application displays a depth of 75 strikes and updates real-time data every 1 second through WebSockets.

## Project Structure

```
realtime-option-chain/
├── backend/
│   ├── controllers/
│   │   └── optionChainController.js
│   ├── models/
│   │   └── optionChainModel.js
│   ├── routes/
│   │   └── optionChainRoutes.js
│   ├── services/
│   │   └── webSocketService.js
│   └── index.js
|
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   └── breadCrumbs.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── OptionChain.jsx
│   │   │   └── RealtimeInspector.jsx
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

4. Open your browser and go to `http://localhost:5173`.

## Features

- **Option Chain Page (/option-chain)**:
  - Displays a depth of 75 strikes.
  - Shows strike, current price, percent change in price, and current real-time value of the underlying instrument.
  - Prices are higher for in-the-money (ITM) options and lower for out-of-the-money (OTM) options.
  - Uses a virtualized view to improve performance by only updating visible components in real-time.

- **Realtime Data Inspector Page (/realtime)**:
  - Subscribe and unsubscribe to given tokens/strikes.
  - Render real-time value and percent change.
  - Connect/Close the WebSocket connection.
  - Show the current state of the WebSocket connection.

## Optimization & Performance

- **Reconnect WebSocket**:
  - Automatically reconnect the WebSocket on lost connections.

- **UI Enhancements**:
  - Prevent layout shifts on the frontend.
  - Differentiate between positive and negative changes in price using colors.
  - Use different colors to differentiate between at-the-money, in-the-money, and out-of-the-money strikes.

- **Virtualized View**:
  - Improve performance by using a virtualized view to only render and update visible components in real-time.

## Future Improvements

- Implement data compression to further conserve bandwidth.
- The backend sends delta updates instead of the entire data set, conserving bandwidth.
- Throttling updates to 1-second intervals.
- Introduce more granular control over update intervals.
- Optimize WebSocket message handling for even better performance.
