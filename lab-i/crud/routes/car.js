const express = require('express');
const router = express.Router();
const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');

const dbPath = path.resolve(__dirname, '..', 'data.db');
const db = new DatabaseSync(dbPath);

db.exec(`CREATE TABLE IF NOT EXISTS car (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject TEXT NOT NULL,
    content TEXT NOT NULL
)`);

router.get('/', (req, res) => {
    const query = db.prepare('SELECT * FROM car');
    const cars = query.all();
    res.render('car/index', { cars });
});

router.get('/new', (req, res) => {
    res.render('car/new');
});

router.post('/new', (req, res) => {
    const { subject, content } = req.body;
    const insert = db.prepare('INSERT INTO car (subject, content) VALUES (?, ?)');
    insert.run(subject, content);
    res.redirect('/car');
});

router.get('/:id', (req, res) => {
    const query = db.prepare('SELECT * FROM car WHERE id = ?');
    const car = query.get(req.params.id);
    if (!car) return res.status(404).send('Car not found');
    res.render('car/show', { car });
});

router.get('/:id/edit', (req, res) => {
    const query = db.prepare('SELECT * FROM car WHERE id = ?');
    const car = query.get(req.params.id);
    if (!car) return res.status(404).send('Car not found');
    res.render('car/edit', { car });
});

router.post('/:id/edit', (req, res) => {
    const { subject, content } = req.body;
    const update = db.prepare('UPDATE car SET subject = ?, content = ? WHERE id = ?');
    update.run(subject, content, req.params.id);
    res.redirect('/car');
});

router.post('/:id/delete', (req, res) => {
    const del = db.prepare('DELETE FROM car WHERE id = ?');
    del.run(req.params.id);
    res.redirect('/car');
});

module.exports = router;
