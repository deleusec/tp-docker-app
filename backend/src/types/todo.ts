export interface ITodo {
  id?: number;
  title: string;
  description?: string;
  completed: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITodoInput extends Omit<ITodo, 'id' | 'createdAt' | 'updatedAt'> {} 