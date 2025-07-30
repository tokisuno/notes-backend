require('dotenv').config()
const mongoose = require('mongoose');

const password = process.env.MONGO_PW;

const url = `mongodb+srv://lucasmei:${password}@cluster0.py2jrrm.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false);

mongoose.connect(url);

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Notes', noteSchema);

// const note = new Note({
//   content: "Mongoose makes this easy!",
//   important: true,
// })

// note.save().then((result) => {
//   console.log('note saved!')
//   mongoose.connection.close();
// })

Note.find({}).then((result) => {
  result.forEach((note) => {
    console.log(note)
  })
  mongoose.connection.close()
})
