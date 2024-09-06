import "./App.css";
import React  from "react";
import {  WebSocketProvider } from "./WebsocketContext";
import { Poll} from "./Poll";

function App() {
  return (
    <WebSocketProvider>
    <div className="App">
      <Poll></Poll>
    </div>
    </WebSocketProvider>
  );
}

export default App;
