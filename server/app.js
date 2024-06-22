const express = require('express');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = express();
const mongoose = require('mongoose');
require('./Book');
app.use(express.json({ limit: '10kb' }));

const Book = mongoose.model('book');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('connected to mongo yeahhh');
});
mongoose.connection.on('error', (err) => {
  console.log('error', err);
});

app.get('/', (req, res) => {
  Book.find({})
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post('/send-data', (req, res) => {
  const book = new Book ({
    title: req.body.title,
    genre: req.body.genre,
    year: req.body.year,
  });
  book
    .save()
    .then((data) => {
      console.log(data);
      res.send(data);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post('/delete', (req, res) => {
  const bookId = req.body.id; // Verifique se o nome do campo corresponde ao enviado pelo frontend
  console.log("Deleting book with ID:", bookId);
  
  Book.findByIdAndRemove(bookId)
    .then((data) => {
      if (!data) {
        return res.status(404).send("Livro não encontrado");
      }
      console.log("Livro deletado:", data);
      res.send(data);
    })
    .catch((err) => {
      console.error("Erro ao deletar livro:", err);
      res.status(500).send("Erro ao deletar livro");
    });
});

app.post('/update', (req, res) => {
  Book.findByIdAndUpdate(req.body.id, {
    title: req.body.title,
    genre: req.body.genre,
    year: req.body.year,
  })
    .then((data) => {
      console.log(data);
      res.send(data);
    })
    .catch((err) => {
      console.log(err);
    });
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('server running');
});
