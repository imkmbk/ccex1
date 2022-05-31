// require express and other modules
const express = require('express');
const app = express();
// Express Body Parser
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Set Static File Directory
app.use(express.static(__dirname + '/public'));


/************
 * DATABASE *
 ************/

const db = require('./models');

/**********
 * ROUTES *
 **********/

/*
 * HTML Endpoints
 */

app.get('/', function homepage(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


/*
 * JSON API Endpoints
 */

app.get('/api', (req, res) => {
  // TODO: Document all your api endpoints below as a simple hardcoded JSON object.
  res.json({
    message: 'Welcome to my app api!',
    documentationUrl: '', //leave this also blank for the first exercise
    baseUrl: '', //leave this blank for the first exercise
    endpoints: [
      {method: 'GET', path: '/api', description: 'Describes all available endpoints'},
      {method: 'GET', path: '/api/profile', description: 'Data about me'},
      {method: 'GET', path: '/api/books/', description: 'Get All books information'},
      {method: 'PUT', path: '/api/books/:id', description: 'Update book'},
      {method: 'DEL', path: '/api/books/:id', description: 'Delete book'},


      // TODO: Write other API end-points description here like above
    ]
  })
});
// TODO:  Fill the values
app.get('/api/profile', (req, res) => {
  res.json({
    'name': 'Kai',
    'homeCountry': 'GER',
    'degreeProgram': 'TUM BWL',//informatics or CSE.. etc
    'email': 'kai@test.de',
    'deployedURLLink': '',//leave this blank for the first exercise
    'apiDocumentationURL': 'localhost:80/api', //leave this also blank for the first exercise
    'currentCity': 'MUC',
    'hobbies': ["programming"]

  })
});
/*
 * Get All books information
 */
app.get('/api/books/', (req, res) => {
  /*
   * use the books model and query to mongo database to get all objects
   */
  db.books.find({}, function (err, books) {
    if (err) throw err;
    /*
     * return the object as array of json values
     */
    res.json(books);
  });
});
/*
 * Add a book information into database
 */


app.post('/api/books/', (req, res) => {

  /*
   * New Book information in req.body
   */
  console.log(req.body);
  /*
   * TODO: use the books model and create a new object
   * with the information in req.body
   */
  /*
   * return the new book information object as json
   */
  var newBook = {
    title: req.body.title, // title of the book
    author: req.body.author, // name of the first author
    releaseDate:req.body.releaseDate, // release date of the book
    genre: req.body.genre, //like fiction or non fiction
    rating: req.body.rating, // rating if you have read it out of 5
    language: req.body.language 
  };
  db.books.insertMany([newBook])

  res.json(newBook);
});

/*
 * Update a book information based upon the specified ID
 */
app.put('/api/books/:id', async (req, res) => {
  /*
   * Get the book ID and new information of book from the request parameters
   */
  const bookId = req.params.id;
  const bookNewData = req.body;
  console.log(`book ID = ${bookId} \n Book Data = ${bookNewData}`);

  var updatedBookInfo = {
    title: bookNewData.title, // title of the book
    author: bookNewData.author, // name of the first author
    releaseDate:bookNewData.releaseDate, // release date of the book
    genre: bookNewData.genre, //like fiction or non fiction
    rating: bookNewData.rating, // rating if you have read it out of 5
    language: bookNewData.language 
  };

  console.log(bookNewData)
  var tmp = await db.books.updateOne(
    {_id:bookId},
    updatedBookInfo,

  )

 // db.books.replaceOne({_id: bookId}, {updatedBookInfo})


  /*
   * TODO: use the books model and find using the bookId and update the book information
   */
  /*
   * Send the updated book information as a JSON object
   */
  res.json(updatedBookInfo);
});
/*
 * Delete a book based upon the specified ID
 */
app.delete('/api/books/:id', async (req, res) => {
  /*
   * Get the book ID of book from the request parameters
   */
  const bookId = req.params.id;
  /*
   * TODO: use the books model and find using
   * the bookId and delete the book
   */
  /*
   * Send the deleted book information as a JSON object
   */
  var deletedBook = await db.books.findById(bookId)


  var bla = await db.books.deleteOne({_id:bookId})
  console.log("deletedBook")

  console.log(deletedBook)
  res.json(deletedBook);
});


/**********
 * SERVER *
 **********/

// listen on the port 3000
app.listen(process.env.PORT || 80, () => {
  console.log('Express server is up and running on http://localhost:80/');
});
