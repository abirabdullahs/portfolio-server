const express = require('express');
const router = express.Router();
const Subject = require('../Models/Subject');
const Chapter = require('../Models/Chapter');
const EduResource = require('../Models/EduResource');

// Subjects
router.get('/subjects', async (req, res) => {
  try {
    const subs = await Subject.find().sort({ createdAt: -1 });
    res.json(subs);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/subjects', async (req, res) => {
  try {
    const { name, description } = req.body;
    if(!name) return res.status(400).json({ error: 'name required' });
    const s = await Subject.create({ name, description });
    res.status(201).json(s);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/subjects/:id', async (req, res) => {
  try {
    const updated = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/subjects/:id', async (req, res) => {
  try {
    const subjectId = req.params.id;
    // delete chapters
    const chapters = await Chapter.find({ subjectId });
    const chapterIds = chapters.map(c=>c._id);
    // delete edu resources under those chapters
    await EduResource.deleteMany({ chapterId: { $in: chapterIds } });
    await Chapter.deleteMany({ subjectId });
    await Subject.findByIdAndDelete(subjectId);
    res.json({ message: 'Subject and all related data deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Chapters
router.get('/chapters', async (req, res) => {
  try {
    const { subjectId } = req.query;
    const filter = {};
    if(subjectId) filter.subjectId = subjectId;
    const chapters = await Chapter.find(filter).sort({ createdAt: -1 });
    res.json(chapters);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/chapters', async (req, res) => {
  try {
    const { name, description, subjectId } = req.body;
    if(!name || !subjectId) return res.status(400).json({ error: 'name and subjectId required' });
    const c = await Chapter.create({ name, description, subjectId });
    res.status(201).json(c);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/chapters/:id', async (req, res) => {
  try {
    const updated = await Chapter.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/chapters/:id', async (req, res) => {
  try {
    const chapterId = req.params.id;
    await EduResource.deleteMany({ chapterId });
    await Chapter.findByIdAndDelete(chapterId);
    res.json({ message: 'Chapter and all related resources deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Edu resources
router.get('/resources', async (req, res) => {
  try {
    const { chapterId, category, subjectId } = req.query;
    const filter = {};
    if(chapterId) filter.chapterId = chapterId;
    if(subjectId) filter.subjectId = subjectId;
    if(category) filter.category = category;
    const items = await EduResource.find(filter).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/resources', async (req, res) => {
  try {
    const { title, chapterId, subjectId, category } = req.body;
    if(!title || !chapterId || !subjectId || !category) return res.status(400).json({ error: 'title, chapterId, subjectId and category required' });
    const created = await EduResource.create(req.body);
    res.status(201).json(created);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/resources/:id', async (req, res) => {
  try {
    const updated = await EduResource.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/resources/:id', async (req, res) => {
  try {
    await EduResource.findByIdAndDelete(req.params.id);
    res.json({ message: 'Resource deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
