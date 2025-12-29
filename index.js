require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const resourcesRouter = require('./src/Routes/resources');
const eduRouter = require('./src/Routes/edu');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || process.env.MONGO_URL || process.env.DB_URL;

async function start() {
  if (!MONGO_URI) {
    console.error('MONGO_URI not set in environment');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    app.use('/api/resources', resourcesRouter);
    app.use('/api/edu', eduRouter);

    app.get('/', (req, res) => res.send({ ok: true }));

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();
