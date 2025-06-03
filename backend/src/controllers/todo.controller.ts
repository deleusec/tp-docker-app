import { Request, Response } from 'express';
import Todo from '../models/todo.model';
import { ITodoInput } from '../types/todo';

export const getAllTodos = async (req: Request, res: Response): Promise<void> => {
  try {
    const todos = await Todo.findAll();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const createTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const todoInput: ITodoInput = req.body;
    const todo = await Todo.create(todoInput);
    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const updateTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const todo = await Todo.findByPk(req.params.id);
    if (todo) {
      await todo.update(req.body);
      res.json(todo);
    } else {
      res.status(404).json({ error: 'Todo not found' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const deleteTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const todo = await Todo.findByPk(req.params.id);
    if (todo) {
      await todo.destroy();
      res.status(204).json({ message: 'Todo deleted' });
    } else {
      res.status(404).json({ error: 'Todo not found' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}; 