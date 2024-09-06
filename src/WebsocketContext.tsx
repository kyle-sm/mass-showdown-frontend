import React, { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { DisplayTextMessage, Message, MessageType, PSBattleRequest, UpdateResponseMessage } from './types';

interface WebSocketContextType {
  isReady: boolean;
  send: ((data: string) => void);
  pollState?: PSBattleRequest;
  active: boolean;
  voted: boolean;
  display_message: string;
  details: number;
  setDetails: React.Dispatch<React.SetStateAction<number>>;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

interface WebSocketProviderProps {
  children: ReactNode;
}

const WS_HOST = "ws://localhost:8080/ws";

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const [isReady, setIsReady] = useState<boolean>(false);
  const [pollState, setPollState] = useState<PSBattleRequest | undefined>(undefined);
  const [display_message, setDisplayMessage] = useState("");
  const [active, setActive] = useState(false);
  const [voted, setVoted] = useState(false);
  const [details, setDetails] = useState(-1)

  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket(WS_HOST);

    socket.onopen = () => setIsReady(true);
    socket.onclose = () => setIsReady(false);
    socket.onmessage = (event) => {
      const recv: Message = JSON.parse(event.data);
      console.log(recv);
      switch (recv.type) {
        case MessageType.VoteOk:
          console.log("vote confirmed");
          setVoted(true);
          break;
        case MessageType.DisplayText:
          console.log("showing text");
          let content: DisplayTextMessage = recv.content;
          if (content.clear) {
            setPollState(undefined);
            setActive(false);
            setVoted(false);
            setDetails(-1);
          }
          setDisplayMessage(content.message);
          break;
        case MessageType.UpdateResponse:
          console.log("updating");
          setDisplayMessage("");
          let update: UpdateResponseMessage = recv.content;
          setActive(true);
          setPollState(update.update);
          break;
      }
    };

    ws.current = socket;

    return () => {
      socket.close();
    };
  }, []);

  const send = (data: string) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(data);
    }
  };

  const contextValue: WebSocketContextType = {
    isReady,
    send,
    pollState,
    active,
    voted,
    display_message,
    details,
    setDetails
  };

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};
