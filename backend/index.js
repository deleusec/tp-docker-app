import express, { json } from 'express';
import cors from 'cors';
import { Sequelize, DataTypes } from 'sequelize';

const app = express();
const port = 3000;

// Database configuration
const sequelize = new Sequelize('postgres', 'postgres', 'postgres', {
  host: 'db',
  dialect: 'postgres',
  port: 5432
});

// Todo model
const Todo = sequelize.define('Todo', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'todo'
});

app.use(cors());
app.use(json());

// Initialize database
async function waitForDb(retries = 5, delay = 2000) {
  while (retries > 0) {
    try {
      await sequelize.authenticate();
      console.log('✅ Database connection established.');
      return;
    } catch (err) {
      retries--;
      console.warn(`⏳ Retrying DB connection (${retries} tries left)...`);
      await new Promise(res => setTimeout(res, delay));
    }
  }
  throw new Error('❌ Unable to connect to the database after several attempts.');
}

async function initDb() {
  try {
    await waitForDb();
    await sequelize.sync({ alter: true });
    console.log('✅ Database synchronized.');
  } catch (error) {
    console.error('❌ DB Init Error:', error);
  }
}

// Routes
app.get('/todo', async (req, res) => {
  try {
    const todos = await Todo.findAll();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/todo', async (req, res) => {
  try {
    const todo = await Todo.create(req.body);
    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/todo/:id', async (req, res) => {
  try {
    const todo = await Todo.findByPk(req.params.id);
    if (todo) {
      await todo.update(req.body);
      res.json(todo);
    } else {
      res.status(404).json({ error: 'Todo not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/todo/:id', async (req, res) => {
  try {
    const todo = await Todo.findByPk(req.params.id);
    if (todo) {
      await todo.destroy();
      res.status(204).json({ message: 'Todo deleted' });
    } else {
      res.status(404).json({ error: 'Todo not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Initialize database and start server
initDb().then(() => {
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}); 