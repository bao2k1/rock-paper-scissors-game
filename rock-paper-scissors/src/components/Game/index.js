// src/components/Game/index.js
import React, { useState } from 'react';
import styled from 'styled-components';
import JoinRoom from './JoinRoom';
import GameRoom from './GameRoom';

const GameContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Game = () => {
  const [gameState, setGameState] = useState({
    isJoined: false,
    playerName: '',
    roomId: '',
  });

  const handleJoinGame = (playerName, roomId) => {
    setGameState({
      isJoined: true,
      playerName,
      roomId,
    });
  };

  return (
    <GameContainer>
      {!gameState.isJoined ? (
        <JoinRoom onJoin={handleJoinGame} />
      ) : (
        <GameRoom 
          playerName={gameState.playerName} 
          roomId={gameState.roomId} 
        />
      )}
    </GameContainer>
  );
};

export default Game;