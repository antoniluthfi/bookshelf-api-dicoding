const {
  postNewBook,
  getAllBooks,
  getBookDetails,
  editBookDetails,
  deleteBook,
} = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: postNewBook,
  },
  {
    method: 'GET',
    path: '/books',
    handler: getAllBooks,
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: getBookDetails,
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: editBookDetails,
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteBook,
  },
];

module.exports = routes;
