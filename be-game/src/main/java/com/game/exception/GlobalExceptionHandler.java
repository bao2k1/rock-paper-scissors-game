package com.game.exception;

import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.web.bind.annotation.ControllerAdvice;

import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @MessageExceptionHandler
    @SendToUser("/queue/errors")
    public Map<String, String> handleException(GameException ex) {
        return Map.of("error", ex.getMessage());
    }
} 