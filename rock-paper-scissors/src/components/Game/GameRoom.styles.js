import styled from 'styled-components';

export const RoomContainer = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

export const Sidebar = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  height: fit-content;
`;

export const GameArea = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  text-align: center;

  h2 {
    color: #1a237e;
    margin-bottom: 20px;
  }
`;

export const MovesContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
`;

export const MoveButton = styled.button`
  width: 100px;
  height: 100px;
  border: none;
  border-radius: 50%;
  background: ${props => props.selected ? '#1a237e' : '#f5f5f5'};
  color: ${props => props.selected ? 'white' : '#333'};
  font-size: 40px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.7 : 1};
  transition: all 0.3s;

  &:hover {
    transform: ${props => props.disabled ? 'none' : 'scale(1.1)'};
    background: ${props => props.selected ? '#1a237e' : '#e0e0e0'};
  }
`;

export const RoomInfo = styled.div`
  margin-bottom: 20px;
  
  h2 {
    color: #1a237e;
    margin-bottom: 10px;
    font-size: 1.5rem;
  }

  p {
    color: #666;
    margin: 5px 0;
  }
`;

export const PlayerList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const PlayerItem = styled.div`
  padding: 12px;
  background: #f5f5f5;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.9rem;
`;

export const StatusBadge = styled.span`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  background-color: ${props => {
    switch (props.status) {
      case 'ready': return '#4caf50';
      case 'playing': return '#2196f3';
      case 'waiting': return '#ff9800';
      default: return '#9e9e9e';
    }
  }};
  color: white;
  margin-left: 8px;
`;

export const GameMessage = styled.div`
  margin: 20px 0;
  padding: 15px;
  background: #e3f2fd;
  border-radius: 8px;
  text-align: center;
  color: #1565c0;
  font-size: 1.1rem;
  animation: fadeIn 0.3s ease-in;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

export const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: #1a237e;
`;

export const Button = styled.button`
  padding: 12px 24px;
  background: #1a237e;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #283593;
  }

  &:disabled {
    background: #9e9e9e;
    cursor: not-allowed;
  }
`;

export const ScoreDisplay = styled.span`
  background: #1a237e;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  margin-left: 8px;
`;

export const ResultAnimation = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.95);
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
  text-align: center;
  animation: popIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);

  @keyframes popIn {
    from { transform: translate(-50%, -50%) scale(0); }
    to { transform: translate(-50%, -50%) scale(1); }
  }

  h3 {
    color: #1a237e;
    margin-bottom: 15px;
    font-size: 1.5rem;
  }

  p {
    font-size: 1.2rem;
    color: #333;
  }
`;
