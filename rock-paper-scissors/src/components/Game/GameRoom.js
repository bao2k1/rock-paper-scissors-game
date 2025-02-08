// src/components/Game/GameRoom.js
import React, { useState, useEffect } from "react";
import WebSocketService from "../../services/websocket";
import {
  RoomContainer,
  Sidebar,
  GameArea,
  MovesContainer,
  MoveButton,
  RoomInfo,
  PlayerList,
  PlayerItem,
  StatusBadge,
  GameMessage,
  LoadingOverlay,
} from "./GameRoom.styles";

const GameRoom = ({ playerName, roomId }) => {
  const [selectedMove, setSelectedMove] = useState(null);
  const [players, setPlayers] = useState([]);
  const [gameStatus, setGameStatus] = useState("waiting");
  const [message, setMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  const moves = [
    { id: "ROCK", emoji: "✊" },
    { id: "PAPER", emoji: "✋" },
    { id: "SCISSORS", emoji: "✌️" },
  ];

  useEffect(() => {
    // Kết nối WebSocket khi component mount
    connectWebSocket();

    // Cleanup khi unmount
    return () => {
      WebSocketService.disconnect();
    };
  }, []);

  const connectWebSocket = () => {
    WebSocketService.connect(() => {
      setIsConnected(true);
      subscribeToRoom();
      joinRoom();
    });
  };

  const subscribeToRoom = () => {
    // Subscribe to player updates
    WebSocketService.subscribe(`/topic/room/${roomId}/players`, (data) => {
      console.log("Received players data:", data);
      setPlayers(data);
    });

    // Subscribe to game status
    WebSocketService.subscribe(`/topic/room/${roomId}/status`, (data) => {
      setGameStatus(data.status);
      setMessage(data.message || "");
    });

    // Subscribe to game results
    WebSocketService.subscribe(`/topic/room/${roomId}/result`, (data) => {
      setMessage(data.message);
      setSelectedMove(null);
      setTimeout(() => setMessage(""), 3000);
    });
  };

  const joinRoom = () => {
    WebSocketService.send("/app/join", {
      roomId,
      playerName,
    });
  };

  const handleMove = (moveId) => {
    const currentPlayer = players.find((p) => p.name === playerName);
    if (!currentPlayer) return;

    setSelectedMove(moveId);
    WebSocketService.send("/app/move", {
      roomId,
      playerId: currentPlayer.id,
      move: moveId,
    });
  };

  const handleReady = () => {
    if (!players || players.length === 0) {
      console.log("Waiting for player data...");
      return;
    }

    const currentPlayer = players.find((p) => p.name === playerName);
    if (currentPlayer) {
      WebSocketService.send("/app/ready", {
        roomId,
        playerId: currentPlayer.id,
      });
    }
  };

  const canPlay = () => {
    const currentPlayer = players.find(p => p.name === playerName);
    return currentPlayer && currentPlayer.status === 'PLAYING' && !selectedMove;
  };

  const renderGameControls = () => {
    const currentPlayer = players.find(p => p.name === playerName);
    if (!currentPlayer) return null;

    // Hiển thị nút Ready cho người đang WAITING
    if (currentPlayer.status === 'WAITING') {
      return (
        <button onClick={handleReady}>
          Ready
        </button>
      );
    }

    // Hiển thị nút đánh cho người đang PLAYING và chưa chọn nước đi
    if (currentPlayer.status === 'PLAYING' && !selectedMove) {
      return (
        <MovesContainer>
          {moves.map(move => (
            <MoveButton
              key={move.id}
              selected={selectedMove === move.id}
              onClick={() => handleMove(move.id)}
              disabled={selectedMove !== null}
            >
              {move.emoji}
            </MoveButton>
          ))}
        </MovesContainer>
      );
    }

    return null;
  };

  if (!isConnected) {
    return <LoadingOverlay>Connecting to game server...</LoadingOverlay>;
  }

  return (
    <RoomContainer>
      <Sidebar>
        <RoomInfo>
          <h2>Room: {roomId}</h2>
          <p>Status: {gameStatus}</p>
          <p>Players: {players.length}/10</p>
        </RoomInfo>
        <PlayerList>
          {players.map(player => (
            <PlayerItem key={player.id}>
              {player.name}
              <StatusBadge status={player.status.toLowerCase()}>
                {player.status}
              </StatusBadge>
              Score: {player.score}
            </PlayerItem>
          ))}
        </PlayerList>
      </Sidebar>
      <GameArea>
        <h2>Make Your Move</h2>
        {message && <GameMessage>{message}</GameMessage>}
        {renderGameControls()}
      </GameArea>
    </RoomContainer>
  );
};

export default GameRoom;
