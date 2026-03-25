import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Content from './models/Content.js';

dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '.env') });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    await seedDatabase();
  })
  .catch((err) => console.error('MongoDB connection error:', err));

// Auto-seed database if empty
const seedDatabase = async () => {
  try {
    const count = await Content.countDocuments();
    if (count === 0) {
      console.log('Database is empty, seeding from content.json...');
      const dataPath = path.join(__dirname, '../src/data/content.json');
      if (fs.existsSync(dataPath)) {
        const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
        await Content.create(data);
        console.log('Database seeded successfully.');
      }
    }
  } catch (err) {
    console.error('Error seeding database:', err);
  }
};

// --- API Endpoints ---

// Get content
app.get('/api/content', async (req, res) => {
  try {
    const content = await Content.findOne();
    if (!content) {
      return res.status(404).json({ message: 'Content not found.' });
    }
    res.json(content);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update content
app.put('/api/content', async (req, res) => {
  try {
    let content = await Content.findOne();
    if (!content) {
      content = new Content(req.body);
      await content.save();
    } else {
      content = await Content.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    }
    res.json({ message: 'Content updated successfully', content });
  } catch (err) {
    res.status(500).json({ message: 'Server error updating content' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
