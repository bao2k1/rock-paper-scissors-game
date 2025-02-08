Rock Paper Scissors Game
A multiplayer Rock Paper Scissors game built with Spring Boot and React.

🎮 Features
Realtime multiplayer gaming (up to 10 players)
Realtime communication via WebSocket
Room management
Player status tracking
Scores and rankings
User-friendly interface
🛠 Tech Stack
Backend
Java 17
Spring Boot
WebSocket (STOMP)
Lombok
SLF4J
Frontend
React
WebSocket client (@stomp/stompjs)
Styled Components
SockJS-client
🚀 Getting Started
System Requirements
Java 17+
Node.js 14+
Maven 3.6+
Backend will run at http://localhost:8081

Frontend will run at http://localhost:3000

📡 WebSocket API
Send Channels (Client -> Server)
/app/join - Join room
/app/ready - Ready play
/app/move - Send a move
Subscribe Channels (Server -> Client)
/topic/room/{roomId}/players - Update player list
/topic/room/{roomId}/status - Update game status
/topic/room/{roomId}/result - Round result
🎯 Game rules
Players join the room
Press "Ready" to get ready
When enough players are ready, the game begins
Each round, players choose one of three moves:
✊ Rock
✋ Paper
✌️ Scissors
Results are calculated according to traditional rules:
Rock beats Scissors
Scissors beats Paper
Paper beats Rock
The player with the highest score after 5 rounds wins
🔧 Configuration
