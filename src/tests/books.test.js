const request = require('supertest');
const app = require('../app'); // Agora importando o app corretamente

describe('Books API', () => {
    let bookId;

    it('should add a new book', async () => {
        const res = await request(app)
            .post('/books')
            .send({ title: 'Book 1', author: 'Author 1' });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
        bookId = res.body.id; // Salva o ID para usar nos outros testes
    });

    it('should list all books', async () => {
        const res = await request(app).get('/books');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Array);
    });

    it('should update a book', async () => {
        const res = await request(app)
            .put(`/books/${bookId}`)
            .send({ title: 'Updated Book', author: 'Updated Author' });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('title', 'Updated Book');
    });

    it('should remove a book', async () => {
        const res = await request(app).delete(`/books/${bookId}`);
        expect(res.statusCode).toEqual(204);

        // Verifica se o livro foi removido
        const listRes = await request(app).get('/books');
        expect(listRes.body).not.toContainEqual(expect.objectContaining({ id: bookId }));
    });
});
