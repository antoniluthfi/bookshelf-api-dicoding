/* eslint-disable max-len */
const {nanoid} = require('nanoid');
const books = require('./books');

// kriteria 1 : API dapat menyimpan buku
const postNewBook = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = nanoid(16);
  const finished = pageCount === readPage ? true : false;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBooks = {
    finished,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    id,
    insertedAt,
    updatedAt,
  };

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });

    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });

    response.code(400);
    return response;
  }

  books.push(newBooks);
  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });

    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });

  response.code(500);
  return response;
};

// Kriteria 2 : API dapat menampilkan seluruh buku
const getAllBooks = (request, h) => {
  const requestQuery = Object.keys(request.query);
  const {name, reading, finished} = request.query;
  const newShownBooks = [];

  if (requestQuery.length > 0) {
    const filteredBooks = books.filter((book) => {
      if (name) {
        return book.name.toLowerCase().includes(name.toLowerCase());
      } else if (reading) {
        const status = reading == 1 ? true : false;
        return book.reading === status;
      } else if (finished) {
        const status = finished == 1 ? true : false;
        return book.finished === status;
      }
    });

    filteredBooks.map((book) => {
      const bookList = {
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      };

      newShownBooks.push(bookList);
    });
  } else {
    books.map((book) => {
      const bookList = {
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      };

      newShownBooks.push(bookList);
    });
  }

  const response = h.response({
    status: 'success',
    data: {
      books: newShownBooks,
    },
  });

  response.code(200);
  return response;
};

// Kriteria 3 : API dapat menampilkan detail buku
const getBookDetails = (request, h) => {
  const {bookId} = request.params;
  const book = books.filter((n) => n.id === bookId)[0];

  if (book !== undefined) {
    const book = books.filter((n) => n.id === bookId)[0];

    if (book !== undefined) {
      return {
        status: 'success',
        data: {
          book,
        },
      };
    }

    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

// Kriteria 4 : API dapat mengubah data buku
const editBookDetails = (request, h) => {
  const {bookId} = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const finished = pageCount === readPage ? true : false;
  const updatedAt = new Date().toISOString();

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });

    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });

    response.code(400);
    return response;
  }

  const index = books.findIndex((book) => book.id === bookId);
  if (index !== -1) {
    books[index] = {
      ...books[index],
      finished,
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });

    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });

  response.code(404);
  return response;
};

// Kriteria 5 : API dapat menghapus buku
const deleteBook = (request, h) => {
  const {bookId} = request.params;
  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });

    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });

  response.code(404);
  return response;
};

module.exports = {
  postNewBook,
  getAllBooks,
  getBookDetails,
  editBookDetails,
  deleteBook,
};
