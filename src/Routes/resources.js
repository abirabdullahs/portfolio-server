const express = require('express');
const router = express.Router();
const Resource = require('../Models/Resource');
const Subject = require('../Models/Subject');
const Chapter = require('../Models/Chapter');
const EduResource = require('../Models/EduResource');

// General resources CRUD
router.get('/', async (req, res) => {
  try {
    const { type, tag, search } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (tag) filter.tags = tag;
    if (search) filter.title = { $regex: search, $options: 'i' };
    const items = await Resource.find(filter).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await Resource.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const body = req.body;
    const created = await Resource.create(body);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await Resource.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Resource.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Educational: subjects
router.get('/edu/subjects', async (req, res) => {
  try {
    const subs = await Subject.find().sort({ createdAt: -1 });
    res.json(subs);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/edu/subjects', async (req, res) => {
  try {
    const s = await Subject.create(req.body);
    res.status(201).json(s);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Chapters
router.get('/edu/subjects/:subjectId/chapters', async (req, res) => {
  try {
    const chapters = await Chapter.find({ subjectId: req.params.subjectId }).sort({ createdAt: -1 });
    res.json(chapters);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/edu/chapters', async (req, res) => {
  try {
    const { name, description, subjectId } = req.body;
    if(!name || !subjectId) return res.status(400).json({ error: 'name and subjectId required' });
    const c = await Chapter.create({ name, description, subjectId });
    res.status(201).json(c);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Educational resources under chapter + category
router.get('/edu/chapters/:chapterId/resources', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { chapterId: req.params.chapterId };
    if (category) filter.category = category;
    const items = await EduResource.find(filter).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
