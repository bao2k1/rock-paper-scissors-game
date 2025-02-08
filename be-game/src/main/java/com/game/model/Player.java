package com.game.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Player {
    private String id;
    private String name;
    private PlayerStatus status = PlayerStatus.WAITING;
    private Move currentMove;
    private int score = 0;
} 