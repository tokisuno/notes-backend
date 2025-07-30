require('dotenv').config();

const express = require('express');
const Note = require('./models/note');
const app = express();

let notes = []

const reqLogger = (req, res, next) => {
  console.log(`Method: ${req.method}`);
  console.log(`Path: ${req.path}`);
  console.log(`Body: ${req.body}`);
  console.log('---');
  next();
}

app.use(express.json());
app.use(express.static('dist'));
app.use(reqLogger);

app.get('/', (req, res) => {
  res.send('<h1>Hello world!</h1>');
})

app.get('/api/notes', (req, res) => {
  Note.find({}).then((notes) => {
    res.json(notes);
  })
})

app.get('/api/notes/:id', (req, res) => {
  Note.findById(req.params.id).then((note) => {
    res.json(note);
  })
})

app.post('/api/notes', (req, res) => {
  const body = req.body

  if (!body.content) {
    return res.status(400).json({ error: 'content missing' })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save().then((savedNote) => {
    res.json(savedNote);
  })
})

app.delete('/api/notes/:id', (req, res) => {
  const id = req.params.id;
  notes = notes.filter(note => note.id !== id);
  res.status(204).end();
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "Unknown endpoint" })
}

app.use(unknownEndpoint);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})
