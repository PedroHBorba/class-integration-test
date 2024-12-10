const express = require('express');
const router = express.Router();
let loans = [];

// Rota para realizar um empréstimo
router.post('/loans', (req, res) => {
    const { bookId, borrower } = req.body;
    const book = books.find(b => b.id === bookId);

    if (!book) {
        return res.status(404).json({ error: 'Book not found.' });
    }

    if (!book.available) {
        return res.status(400).json({ error: 'Book is already loaned out.' });
    }

    book.available = false;
    loans.push({ bookId, borrower, dateLoaned: new Date() });

    res.status(201).json({ bookId, borrower, dateLoaned: new Date() });
});

// Rota para realizar a devolução
router.post('/returns', (req, res) => {
    const { bookId } = req.body;
    const loanIndex = loans.findIndex(loan => loan.bookId === bookId);

    if (loanIndex === -1) {
        return res.status(404).json({ error: 'Loan record not found.' });
    }

    const loan = loans[loanIndex];
    const book = books.find(b => b.id === bookId);
    book.available = true;

    loans.splice(loanIndex, 1);
    res.status(200).json({ message: 'Book returned successfully.' });
});

module.exports = router;
