package com.game.service;

import com.game.model.*;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class GameService {
    private final Map<String, GameRoom> rooms = new ConcurrentHashMap<>();
    private final SimpMessagingTemplate messagingTemplate;

    public GameService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public GameRoom createRoom() {
        GameRoom room = new GameRoom();
        room.setId(UUID.randomUUID().toString());
        rooms.put(room.getId(), room);
        return room;
    }

    public GameRoom joinRoom(String roomId, String playerName) {
        GameRoom room = rooms.get(roomId);
        if (room == null) {
            room = new GameRoom();
            room.setId(roomId);
            rooms.put(roomId, room);
        }

        if (room.getPlayers().size() >= room.getMaxPlayers()) {
            throw new RuntimeException("Room is full");
        }

        Player player = new Player();
        player.setId(UUID.randomUUID().toString());
        player.setName(playerName);
        room.getPlayers().add(player);

        notifyRoomUpdate(room);
        return room;
    }

    public void playerReady(String roomId, String playerId) {
        GameRoom room = rooms.get(roomId);
        if (room == null) return;

        room.getPlayers().stream()
            .filter(p -> p.getId().equals(playerId))
            .findFirst()
            .ifPresent(player -> {
                player.setStatus(PlayerStatus.READY);
                notifyRoomUpdate(room);
                checkGameStart(room);
            });
    }

    public void submitMove(String roomId, String playerId, Move move) {
        GameRoom room = rooms.get(roomId);
        if (room == null || room.getStatus() != GameStatus.PLAYING) {
            log.debug("Invalid room or game status: {}", room);
            return;
        }

        log.debug("Player {} submitting move {} in room {}", playerId, move, roomId);
        
        room.getPlayers().stream()
                .filter(p -> p.getId().equals(playerId))
                .findFirst()
                .ifPresent(player -> {
                    player.setCurrentMove(move);
                    notifyRoomUpdate(room);
                    
                    boolean allPlayersMovedOrWaiting = room.getPlayers().stream()
                        .filter(p -> p.getStatus() == PlayerStatus.PLAYING)
                        .allMatch(p -> p.getCurrentMove() != null);
                    
                    log.debug("All players moved: {}", allPlayersMovedOrWaiting);
                    
                    if (allPlayersMovedOrWaiting) {
                        calculateRoundResult(room);
                    }
                });
    }

    private void checkGameStart(GameRoom room) {
        long readyPlayers = room.getPlayers().stream()
            .filter(p -> p.getStatus() == PlayerStatus.READY)
            .count();

        if (readyPlayers >= 2) {
            room.setStatus(GameStatus.PLAYING);
            room.setCurrentRound(1);
            
            room.getPlayers().stream()
                .filter(p -> p.getStatus() == PlayerStatus.READY)
                .forEach(p -> {
                    p.setStatus(PlayerStatus.PLAYING);
                    p.setScore(0);
                    p.setCurrentMove(null);
                });
            
            notifyGameStart(room);
            notifyRoomUpdate(room);
        }
    }

    private void calculateRoundResult(GameRoom room) {
        // Tính điểm cho round
        for (Player p1 : room.getPlayers()) {
            if (p1.getStatus() != PlayerStatus.PLAYING) continue;
            
            for (Player p2 : room.getPlayers()) {
                if (p2.getStatus() != PlayerStatus.PLAYING || p1 == p2) continue;
                
                if (isWinning(p1.getCurrentMove(), p2.getCurrentMove())) {
                    p1.setScore(p1.getScore() + 1);
                }
            }
        }

        // Tạo message kết quả
        StringBuilder resultMessage = new StringBuilder("Round " + room.getCurrentRound() + " result: ");
        room.getPlayers().stream()
            .filter(p -> p.getStatus() == PlayerStatus.PLAYING)
            .forEach(p -> resultMessage.append(p.getName())
                .append("(")
                .append(p.getCurrentMove())
                .append(") - Score: ")
                .append(p.getScore())
                .append(", "));

        // Gửi kết quả
        messagingTemplate.convertAndSend(
            "/topic/room/" + room.getId() + "/result",
            Map.of(
                "message", resultMessage.toString(),
                "round", room.getCurrentRound(),
                "players", room.getPlayers()
            )
        );

        // Chuẩn bị round tiếp theo
        prepareNextRound(room);
    }

    private boolean isWinning(Move move1, Move move2) {
        if (move1 == null || move2 == null) return false;
        return (move1 == Move.ROCK && move2 == Move.SCISSORS) ||
               (move1 == Move.SCISSORS && move2 == Move.PAPER) ||
               (move1 == Move.PAPER && move2 == Move.ROCK);
    }

    private void prepareNextRound(GameRoom room) {
        // Kiểm tra kết thúc game trước
        if (room.getCurrentRound() >= room.getMaxRounds()) {
            endGame(room);
            return;
        }
        
        // Tăng round và reset moves
        room.setCurrentRound(room.getCurrentRound() + 1);
        room.getPlayers().forEach(p -> p.setCurrentMove(null));
        
        // Thông báo round mới
        messagingTemplate.convertAndSend(
            "/topic/room/" + room.getId() + "/status",
            Map.of("status", GameStatus.PLAYING.name(), 
                   "message", "Round " + room.getCurrentRound() + " started!")
        );
        
        notifyRoomUpdate(room);
    }

    private void endGame(GameRoom room) {
        room.setStatus(GameStatus.FINISHED);
        notifyGameEnd(room);
    }

    private void notifyRoomUpdate(GameRoom room) {
        messagingTemplate.convertAndSend(
                "/topic/room/" + room.getId() + "/players",
                room.getPlayers()
        );
    }

    private void notifyGameStart(GameRoom room) {
        messagingTemplate.convertAndSend(
                "/topic/room/" + room.getId() + "/status",
                Map.of("status", GameStatus.PLAYING.name(), "message", "Game started!")
        );
    }

    private void notifyRoundResult(GameRoom room) {
        messagingTemplate.convertAndSend(
                "/topic/room/" + room.getId() + "/result",
                Map.of(
                    "round", room.getCurrentRound(),
                    "players", room.getPlayers()
                )
        );
    }

    private void notifyGameEnd(GameRoom room) {
        // Tạo message với người thắng
        Player winner = room.getPlayers().stream()
            .filter(p -> p.getStatus() == PlayerStatus.PLAYING)
            .max((p1, p2) -> Integer.compare(p1.getScore(), p2.getScore()))
            .orElse(null);
        
        String message = winner != null ? 
            "Game Over! Winner: " + winner.getName() + " with score: " + winner.getScore() :
            "Game Over!";
        
        messagingTemplate.convertAndSend(
            "/topic/room/" + room.getId() + "/status",
            Map.of("status", GameStatus.FINISHED.name(), 
                   "message", message)
        );
    }
} 