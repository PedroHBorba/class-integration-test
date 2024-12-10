// src/app.js
const express = require('express');
const app = express();

app.use(express.json()); // Middleware para analisar corpo da requisição JSON

// Defina as rotas para livros (semelhante ao empréstimo)
const books = [];
app.post('/books', (req, res) => {
    const { title, author } = req.body;
    const newBook = { id: books.length + 1, title, author, available: true };
    books.push(newBook);
    res.status(201).json(newBook);
});

app.get('/books', (req, res) => {
    res.json(books);
});

app.put('/books/:id', (req, res) => {
    const { id } = req.params;
    const { title, author } = req.body;
    const book = books.find((b) => b.id === parseInt(id));
    if (!book) return res.status(404).json({ error: 'Book not found.' });
    book.title = title || book.title;
    book.author = author || book.author;
    res.json(book);
});

app.delete('/books/:id', (req, res) => {
    const { id } = req.params;
    const index = books.findIndex((b) => b.id === parseInt(id));
    if (index === -1) return res.status(404).json({ error: 'Book not found.' });
    books.splice(index, 1);
    res.status(204).send();
});

// Empréstimos
const loans = [];
app.post('/loans', (req, res) => {
    const { bookId, borrower } = req.body;
    const book = books.find((b) => b.id === bookId);
    if (!book) return res.status(404).json({ error: 'Book not found.' });
    if (!book.available) return res.status(400).json({ error: 'Book is already loaned out.' });

    book.available = false;
    loans.push({ bookId, borrower });
    res.status(201).json({ bookId, borrower });
});

// Devoluções
app.post('/returns', (req, res) => {
    const { bookId } = req.body;
    const book = books.find((b) => b.id === bookId);
    if (!book) return res.status(404).json({ error: 'Book not found.' });
    if (book.available) return res.status(400).json({ error: 'Book was not loaned out.' });

    book.available = true;
    res.status(200).json({ message: 'Book returned successfully.' });
});

// Verifique se o servidor deve iniciar
if (process.env.NODE_ENV !== 'test') {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}

module.exports = app; // Exporta o app para os testes
