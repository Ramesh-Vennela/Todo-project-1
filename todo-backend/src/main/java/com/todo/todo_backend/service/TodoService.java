
package com.todo.todo_backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.todo.todo_backend.entity.Todo;
import com.todo.todo_backend.exception.TodoNotFoundException;
import com.todo.todo_backend.repository.TodoRepository;

@Service
public class TodoService {

    private final TodoRepository todoRepository;

    public TodoService(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    public List<Todo> getAllTodos() {
        return todoRepository.findAll();
    }

    public Todo getTodoById(Long id) {

        return todoRepository.findById(id)
                .orElseThrow(() ->
                        new TodoNotFoundException(
                                "Todo not found with id: " + id
                        )
                );
    }

    public Todo createTodo(Todo todo) {

        todo.setCreatedAt(LocalDateTime.now());

        todo.setCompleted(false);

        todo.setCompletedAt(null);

        // Default priority
        if (todo.getPriority() == null ||
                todo.getPriority().trim().isEmpty()) {

            todo.setPriority("MEDIUM");
        }

        return todoRepository.save(todo);
    }

    public Todo updateTodo(Long id, Todo updatedTodo) {

        Todo existingTodo = todoRepository.findById(id)
                .orElseThrow(() ->
                        new TodoNotFoundException(
                                "Todo not found with id: " + id
                        )
                );

        existingTodo.setTitle(
                updatedTodo.getTitle()
        );

        existingTodo.setDescription(
                updatedTodo.getDescription()
        );

        existingTodo.setPriority(
                updatedTodo.getPriority()
        );

        existingTodo.setDueDate(
                updatedTodo.getDueDate()
        );

        boolean oldCompleted =
                existingTodo.isCompleted();

        boolean newCompleted =
                updatedTodo.isCompleted();

        existingTodo.setCompleted(newCompleted);

        if (!oldCompleted && newCompleted) {

            existingTodo.setCompletedAt(
                    LocalDateTime.now()
            );
        }

        if (oldCompleted && !newCompleted) {

            existingTodo.setCompletedAt(null);
        }

        return todoRepository.save(existingTodo);
    }

    public void deleteTodo(Long id) {

        Todo existingTodo = todoRepository.findById(id)
                .orElseThrow(() ->
                        new TodoNotFoundException(
                                "Todo not found with id: " + id
                        )
                );

        todoRepository.delete(existingTodo);
    }
}

