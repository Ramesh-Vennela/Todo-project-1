
package com.todo.todo_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.todo.todo_backend.entity.Todo;

public interface TodoRepository extends JpaRepository<Todo, Long> {

}




