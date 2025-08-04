const notesRouter = require('express').Router()
const Note = require('../models/note');

// notesRouter.get('/', (req, res) => {
//   res.send('<h1>Hello world!</h1>');
// })

notesRouter.get('/', (req, res) => {
  Note.find({}).then((notes) => {
    res.json(notes);
  })
})

notesRouter.get('/:id', (req, res, next) => {
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

notesRouter.post('/', (req, res, next) => {
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

notesRouter.delete('/:id', (req, res) => {
  Note.findByIdAndDelete(request.params.id)
    .then((res) => {
      res.status(204).end();
    })
    .catch(err => next(err))
})

notesRouter.put('/:id', (req, res, next) => {
  const { content, important } = req.body;

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

module.exports = notesRouter
