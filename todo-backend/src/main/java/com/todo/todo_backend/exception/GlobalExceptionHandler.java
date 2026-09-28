
package com.todo.todo_backend.exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public Map<String, String> handleRuntimeException(
            RuntimeException exception) {

        Map<String, String> response = new HashMap<>();

        response.put("message", exception.getMessage());

        return response;
    }
}

