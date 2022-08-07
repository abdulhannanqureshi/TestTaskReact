/** @format */
import books from 'google-books-search';

var options = {
  // key: "YOUR API KEY",
  field: 'title',
  offset: 0,
  limit: 10,
  type: 'books',
  order: 'relevance',
  lang: 'en'
};

const getBooks = async (search = "") => {  
  return new Promise((resolve, reject) => {
    books.search(search, options, function(error, results) {
      if ( ! error ) {
        resolve(results);
      } else {
        reject(error);
      }
    });
  });
};


export {
  getBooks,
};