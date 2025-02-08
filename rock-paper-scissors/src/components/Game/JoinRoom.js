// src/components/Game/JoinRoom.js
import React, { useState } from 'react';
import styled from 'styled-components';

const JoinContainer = styled.div`
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
`;

const Title = styled.h1`
  text-align: center;
  color: #1a237e;
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
`;

const Button = styled.button`
  padding: 12px;
  background: #1a237e;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #283593;
  }
`;

const JoinRoom = ({ onJoin }) => {
  const [playerName, setPlayerName] = useState('');
  const [roomId, setRoomId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!playerName.trim()) {
      alert('Please enter your name');
      return;
    }
    const finalRoomId = roomId.trim() || `room-${Math.random().toString(36).substr(2, 9)}`;
    onJoin(playerName, finalRoomId);
  };

  return (
    <JoinContainer>
      <Title>Rock Paper Scissors</Title>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Enter your name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Room ID (optional)"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
        <Button type="submit">
          {roomId ? 'Join Room' : 'Create Room'}
        </Button>
      </Form>
    </JoinContainer>
  );
};

export default JoinRoom;