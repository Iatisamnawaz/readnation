/**
 * These are example routes for user management
 * This shows how to correctly structure your routes for the project
 */

const express = require('express');
const router = express.Router();
const assert = require('assert');
router.use(express.urlencoded({ extended: true }));


/* Use  */
/* -----------------Routes For Article Page----------------- */
/**
 * @desc retrieves the article
 */
router.get('/viewArticle/:id', (req, res, next) => {
  // Store the id from the page in a constant
	const id = req.params.id;
  // sends a query to bring the article with the id passed 
	global.db.all('SELECT * FROM articles WHERE id = ?', [ id ], function(err, rows) {
		if (err) {
			next(err); //send the error on to the error handler
		} else {
      // renders the view article page with the row that has been recieved
      // articles takes the first row 
			res.render('viewArticle', { articles: rows[0] });
		}
	});
});
/* ----------increment likes------------ */
router.post('/addLike/:id', (req, res, next) => {
	const id = req.params.id;
  // the query updates the row of the artcl by incrementing the ike button everytime it is clicked
	global.db.run('UPDATE articles SET likes = likes + 1 WHERE id = ?', [ id ], function(err) {
		if (err) {
			next(err); //send the error on to the error handler
		} else {
      // renders the page again for the article
			res.redirect(`/user/viewArticle/${id}`);
		}
	});
});
router.get('/getLikes/:id', (req, res) => {
	const id = req.params.id;
	global.db.all('SELECT * FROM articles WHERE id = ?', [ id ], (err, row) => {
		if (err) {
			return next(err);
		}
		res.render('viewArticle', { articles: row });
	});
});

/* Add Comment */
router.post('/viewArticle/addComments/:id', (req, res, next) => {
	const id = req.params.id;
	const comments = req.body.comment;
	global.db.run(
		'INSERT INTO comments (comment, article_id) VALUES( ?, ?);',
		[ comments, id ],
		function(err) {
			if (err) {
				next(err); //send the error on to the error handler
			} else {
				res.redirect(`/user/viewArticle/${id}`);
				next();
			}
		}
	);
});

router.get('/viewArticle/:id', (req, res) => {
	const id = req.params.id;
	global.db.all('SELECT * FROM comments WHERE article_id = ?', [ id ], (err, row) => {
		if (err) {
			return next(err);
		}
		res.render('viewArticle', { action: 'list', comments: row });
	});
});
/* --------------------------------------------------------------------------------- */
/* -----------------routes for Author Page----------------- */
/**
 * @desc retrieves the published and draft articles 
 */
router.get('/author', (req, res, next) => {
  // the first query brngs values from articles 
	global.db.all('SELECT * FROM articles', function(err, row) {
		if (err) {
			next(err);
		} else {
        // the second query brings values from blog
			global.db.all('SELECT * FROM blog', function(err, blog) {
				if (err) {
					next(err);
				} else {
          // page renders information from both tables 
					res.render('author', { action: 'list', articles: row, blog });
				}
			});
		}
	});
});
/* -----------it renders the edit article page --------------- */
router.get('/editArticle', (req, res) => {
	res.render('editArticle', { articles: null, isUpdate: false });
});
/* ------------Adds new Article----------------- */
router.post('/addArticle', (req, res, next) => {
  // storing the data in constants to pass in the query 
	const title = req.body.title;
	const subtitle = req.body.subtitle;
	const body = req.body.body;
  // usin the Date() method to store current date and converts it into a string 
	const currentDate = new Date().toString();
	global.db.run(
    // inserts the values stored in the constants and passes them in the query 
		"INSERT INTO articles ('title', 'subtitle', 'body', 'date_created', 'status') VALUES( ?, ?, ?,?, ?);",
		[ title, subtitle, body, currentDate, false ],
		function(err) {
			if (err) {
				next(err); //send the error on to the error handler
			} else {
        // when the query has been made it renders the page on success
				res.redirect('/user/author');
				next();
			}
		}
	);
});
/*------------------- opens the artcle to edit --------- */
router.get('/author/edit/:id', (req, res, next) => {
	const id = req.params.id;
  // query brings the article with the id passed
	global.db.all('SELECT * FROM articles WHERE id = ?', [ id ], function(err, row) {
		if (err) {
			next(err);
		} else {
      // the value isUpdate allows the ebedded javascript in the main page to render forms 
			res.render('editArticle', { articles: row[0], isUpdate: true });
			next();
		}
	});
});
/* --------------Update existing article----------------------- */
// updates the article using post method
router.post('/updateArticle/:id', (req, res, next) => {
	const id = req.params.id;
	const title = req.body.title;
	const subtitle = req.body.subtitle;
	const body = req.body.body;
	const currentDate = new Date().toString();
	global.db.run(
    // passes the new values in the query
		'UPDATE articles SET title = ? , subtitle = ?, body = ?, last_modified = ? WHERE id = ?',
		[ title, subtitle, body, currentDate, id ],
		function(err) {
			if (err) {
				next(err); //send the error on to the error handler
			} else {
				res.redirect('/user/author');
				next();
			}
		}
	);
});
/* ---------------------------------------------------------------- */

/* ------------delete--------------------- */
router.get('/author/delete/:id', (req, res, next) => {
	const id = req.params.id;
  // deletes the row at the id that is passed from the button delete 
	global.db.all('DELETE FROM articles WHERE id = ?', [ id ], function(err, rows) {
		if (err) {
			next(err); //send the error on to the error handler
		} else {
			res.redirect('/user/author');
		}
	});
});

/* ---------------------publish---------- */
router.post('/author/publish/:id', (req, res, next) => {
	const id = req.params.id;
	const currentDate = new Date().toString();
	global.db.run('UPDATE articles SET status = ?, date_posted = ? WHERE id = ?', [ true, currentDate, id ], function(
		err
	) {
		if (err) {
			next(err); //send the error on to the error handler
		} else {
			res.redirect('/user/author');
		}
	});
});

/* Author Settings  */
router.get('/author/settings', (req, res, next) => {
  // brings the data from the settings to be populated 
	global.db.all('SELECT * FROM blog', function(err, row) {
		if (err) {
			next(err);
		} else {
      // renders the settings page and displays the data that is fetched
			res.render('settings', { blog: row[0] });
			next();
		}
	});
});

/* change settings */
router.post('/updateSettings', (req, res, next) => {
  // creates new constants for the values of settings 
	const title = req.body.blog_title;
	const subtitle = req.body.blog_subtitle;
	const author = req.body.author;
	global.db.run(
    // the values are updated in the table 
		'UPDATE blog SET blog_title = ? , blog_subtitle = ?, author = ?',
		[ title, subtitle, author ],
		function(err) {
			if (err) {
				next(err); //send the error on to the error handler
			} else {
				res.redirect('/user/author');
				next();
			}
		}
	);
});
/* -----------------End----------------- */

/* -----------Render Reading Page-------------- */
router.get('/reader', (req, res, next) => {
	global.db.all('SELECT * FROM articles', function(err, row) {
		if (err) {
			next(err);
		} else {
			global.db.all('SELECT * FROM blog', function(err, blog) {
				if (err) {
					next(err);
				} else {
					res.render('reader', { action: 'list', articles: row, blog });
				}
			});
		}
	});
});
/* -------------------------------------------------------------- */

module.exports = router;
