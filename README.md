# Rock Paper Scissors Game

Một trò chơi Oẳn tù tì nhiều người chơi được xây dựng bằng Spring Boot và React.

## 🎮 Tính năng

- Chơi game realtime với nhiều người chơi (tối đa 10 người)
- Giao tiếp realtime qua WebSocket
- Quản lý phòng chơi
- Theo dõi trạng thái người chơi
- Tính điểm và xếp hạng
- Giao diện người dùng thân thiện

## 🛠 Tech Stack

### Backend
- Java 17
- Spring Boot
- WebSocket (STOMP)
- Lombok
- SLF4J

### Frontend
- React
- WebSocket client (@stomp/stompjs)
- Styled Components
- SockJS-client

## 🚀 Bắt đầu

### Yêu cầu hệ thống
- Java 17+
- Node.js 14+
- Maven 3.6+

Backend sẽ chạy tại `http://localhost:8081`

Frontend sẽ chạy tại `http://localhost:3000`

## 📡 WebSocket API

### Send Channels (Client -> Server)
- `/app/join` - Tham gia phòng
- `/app/ready` - Sẵn sàng chơi
- `/app/move` - Gửi nước đi

### Subscribe Channels (Server -> Client)
- `/topic/room/{roomId}/players` - Cập nhật danh sách người chơi
- `/topic/room/{roomId}/status` - Cập nhật trạng thái game
- `/topic/room/{roomId}/result` - Kết quả round

## 🎯 Luật chơi

1. Người chơi tham gia phòng
2. Nhấn "Ready" để sẵn sàng
3. Khi đủ người chơi và sẵn sàng, game bắt đầu
4. Mỗi round, người chơi chọn một trong ba nước đi:
   - ✊ Búa
   - ✋ Bao
   - ✌️ Kéo
5. Kết quả được tính theo luật truyền thống:
   - Búa thắng Kéo
   - Kéo thắng Bao
   - Bao thắng Búa
6. Người chơi có điểm cao nhất sau 5 rounds là người thắng

## 🔧 Cấu hình

### Backend Configuration (application.properties)
