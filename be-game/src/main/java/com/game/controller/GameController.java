package com.game.controller;

import com.game.model.GameRoom;
import com.game.model.Move;
import com.game.service.GameService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

import java.util.Map;

@Controller
@Slf4j
public class GameController {
    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    @MessageMapping("/join")
    public void joinRoom(@Payload Map<String, String> request) {
        String roomId = request.get("roomId");
        String playerName = request.get("playerName");
        gameService.joinRoom(roomId, playerName);
    }

    @MessageMapping("/ready")
    public void playerReady(@Payload Map<String, String> request) {
        String roomId = request.get("roomId");
        String playerId = request.get("playerId");
        gameService.playerReady(roomId, playerId);
    }

    @MessageMapping("/move")
    public void submitMove(@Payload Map<String, String> request) {
        String roomId = request.get("roomId");
        String playerId = request.get("playerId");
        Move move = Move.valueOf(request.get("move"));
        gameService.submitMove(roomId, playerId, move);
    }
} 