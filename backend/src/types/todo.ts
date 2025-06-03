export interface ITodo {
  id?: number;
  title: string;
  description?: string;
  completed: boolean;
  images?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITodoInput extends Omit<ITodo, 'id' | 'createdAt' | 'updatedAt'> {}

export interface IImageUploadResponse {
  url: string;
  filename: string;
} 