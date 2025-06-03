import { Request, Response } from 'express';
import minioClient, { BUCKET_NAME } from '../config/minio';
import { IImageUploadResponse } from '../types/todo';
import Todo from '../models/todo.model';

export const uploadImage = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const todoId = req.params.id;
    const todo = await Todo.findByPk(todoId);

    if (!todo) {
      res.status(404).json({ error: 'Todo not found' });
      return;
    }

    const filename = `${Date.now()}-${req.file.originalname}`;
    await minioClient.putObject(
      BUCKET_NAME,
      filename,
      req.file.buffer,
      req.file.size,
      { 'Content-Type': req.file.mimetype }
    );

    const imageUrl = `http://localhost:9000/${BUCKET_NAME}/${filename}`;
    
    const updatedImages = [...(todo.images || []), imageUrl];
    await todo.update({ images: updatedImages });

    const response: IImageUploadResponse = {
      url: imageUrl,
      filename
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: (error as Error).message });
  }
};

export const deleteImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, filename } = req.params;
    const todo = await Todo.findByPk(id);

    if (!todo) {
      res.status(404).json({ error: 'Todo not found' });
      return;
    }

    await minioClient.removeObject(BUCKET_NAME, filename);

    const updatedImages = (todo.images || []).filter(
      url => !url.includes(filename)
    );
    await todo.update({ images: updatedImages });

    res.status(204).send();
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: (error as Error).message });
  }
}; 