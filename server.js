import express from 'express';
import { nanoid } from 'nanoid';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

// Хранилище ключей в памяти
const keysStore = new Map();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// API для создания новых ключей
app.post('/api/keys', async (req, res) => {
  try {
    const { keys, instructions } = req.body;
    const results = [];
    
    for (const key of keys) {
      const shortId = nanoid(4); // Генерируем короткий ID из 4 символов
      keysStore.set(shortId, {
        key,
        instructions
      });
      results.push(shortId);
    }
    
    res.json({ shortIds: results });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// API для получения данных ключа
app.get('/api/keys/:shortId', async (req, res) => {
  try {
    const keyData = keysStore.get(req.params.shortId);
    if (!keyData) {
      return res.status(404).json({ error: 'Ключ не найден' });
    }
    res.json(keyData);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Маршрут для коротких ссылок
app.get('/:shortId', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'view.html'));
});

app.listen(3000, () => {
  console.log('Сервер запущен на порту 3000');
});