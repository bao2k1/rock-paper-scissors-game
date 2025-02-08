package com.game.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GameRoom {
    private String id;
    private GameStatus status = GameStatus.WAITING;
    private List<Player> players = new ArrayList<>();
    private int currentRound = 0;
    private final int maxPlayers = 10;
    private final int maxRounds = 5;
} 