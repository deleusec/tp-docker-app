import express from 'express';
import cors from 'cors';
import todoRoutes from './routes/todo.routes';
import { initDb } from './config/database';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/todo', todoRoutes);

// Initialize database and start server
initDb()
    .then(() => {
        app.listen(port, '0.0.0.0', () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    })
    .catch((error) => {
        console.error('Failed to start server:', error);
        process.exit(1);
    }); 