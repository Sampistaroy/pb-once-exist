var passport = require('passport');

module.exports = function (app){


/*
 * GET home page.
 */
	app.get('/', function (req, res){
		res.render('index', { user : req.user, title : 'Galaxy War' });
	});


/*
 * GET login page.
 */
	app.get('/login', function (req, res){
		res.render('login', { 
			user : req.user,
			title : 'Galaxy War Login',
			message: req.session.messages 
		});
	});


/*
 * POST /login
 ***** This version has a problem with flash messages
	app.post('/login', 
	  passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
	  function(req, res) {
	    res.redirect('/');
	  });
	*/
	  
	// POST /login
	//   acheive the same functionality.
	app.post('/login', function(req, res, next) {
	  passport.authenticate('local', function(err, user, info) {
	    if (err) { return next(err) }
	    if (!user) {
	      req.session.messages =  [info.message];
	      return res.redirect('/login')
	    }
	    req.logIn(user, function(err) {
	      if (err) { return next(err); }
	      return res.redirect('/');
	    });
	  })(req, res, next);
	});

/*
 * GET LOGOUT
 */
	app.get('/logout', function(req, res){
	  req.logout();
	  res.redirect('/');
	});


/*
 * GET PROFIL
 */
    app.get('/profil', function(req, res){
    	res.render('profil', {
    		user: req.user,
    		title: 'GW profil'
    	})
    });

/*
 * GET REGISTER
 */
    app.get('/register', function(req, res){
    	res.render('register', {
    		user: req.user,
    		title: 'GW Inscription',
			message: req.session.messages
    	})
    });

/*
 * POST REGISTER
 */
    app.post('/register', function(req, res){
    	
    	var user = new User({ 
    		username:req.body.username,
    		email: req.body.email,
    		password: req.body.password
    	});
        user.save(function(err) {
	        if(err) {
	           console.log(err);
	        } else {
	           console.log('user: ' + user.username + " saved.");
	        }
        });
    });



};