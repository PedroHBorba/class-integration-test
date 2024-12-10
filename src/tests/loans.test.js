const request = require('supertest');
const app = require('../app'); // Agora importando o app corretamente

describe('Loans API', () => {
    let bookId;

    beforeAll(async () => {
        // Criar um livro para os testes
        const res = await request(app)
            .post('/books')
            .send({ title: 'Book 1', author: 'Author 1' });
        bookId = res.body.id;
    });

    it('should loan a book', async () => {
        const res = await request(app)
            .post('/loans')
            .send({ bookId, borrower: 'John Doe' });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('bookId', bookId);
    });

    it('should return an error when trying to loan an unavailable book', async () => {
        // Realizar outro empréstimo
        await request(app)
            .post('/loans')
            .send({ bookId, borrower: 'Jane Doe' });

        // Tentando emprestar o livro novamente
        const res = await request(app)
            .post('/loans')
            .send({ bookId, borrower: 'Jack Doe' });

        expect(res.statusCode).toEqual(400);
        expect(res.body.error).toEqual('Book is already loaned out.');
    });

    it('should return a book', async () => {
        const res = await request(app)
            .post('/returns')
            .send({ bookId });

        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual('Book returned successfully.');
    });

    it('should return an error when trying to return a book that was not loaned', async () => {
        const res = await request(app)
            .post('/returns')
            .send({ bookId });

        expect(res.statusCode).toEqual(400);
        expect(res.body.error).toEqual('Book was not loaned out.');
    });
});
