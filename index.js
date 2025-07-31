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

app.use(express.static('dist'));
app.use(express.json());
app.use(reqLogger);

app.get('/', (req, res) => {
  res.send('<h1>Hello world!</h1>');
})

app.get('/api/notes', (req, res) => {
  Note.find({}).then((notes) => {
    res.json(notes);
  })
})

app.get('/api/notes/:id', (req, res, next) => {
  Note.findById(req.params.id)
    .then((note) => {
      if (note) {
        res.json(note);
      } else {
        res.status(404).end();
      }
    })
    .catch(err => next(err));
})

app.post('/api/notes', (req, res, next) => {
  const body = req.body

  if (!body.content) {
    return res.status(400).json({ error: 'content missing' })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save()
    .then((savedNote) => {
      res.json(savedNote);
    })
    .catch(err => next(err));
})

app.delete('/api/notes/:id', (req, res) => {
  Note.findByIdAndDelete(request.params.id)
    .then((res) => {
      res.status(204).end();
    })
    .catch(err => next(err))
})

app.put('/api/notes/:id', (req, res, next) => {
  const { content, important } = request.body;

  Note.findById(req.params.id)
    .then((note) => {
      if (!note) {
        return res.status(404).end()
      }

      note.content = content
      note.important = important

      return note.save().then((updatedNote) => {
        res.json(updatedNote);
      })
    })
    .catch(err => next(err))
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "Unknown endpoint" })
}
app.use(unknownEndpoint);

const errorHandler = (err, req, res, next) => {
  console.log(err.message);

  if (err.name === "CastError") {
    return res.status(400).send({ error: "malformed id" })
  } else if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message })
  }

  next(err)
}
app.use(errorHandler)

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})
