import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import { ITodo } from '../types/todo';

class Todo extends Model<ITodo> implements ITodo {
  public id!: number;
  public title!: string;
  public description!: string;
  public completed!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Todo.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'todo',
    timestamps: true,
  }
);

export default Todo; 