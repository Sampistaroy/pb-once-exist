var mongoose = require('mongoose')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , bcrypt = require('bcrypt')
  , SALT_WORK_FACTOR = 10;

module.exports = function (app){
  // User Schema
  var userSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true},
  });

  // Bcrypt middleware
  userSchema.pre('save', function(next) {
  	var user = this;

  	if(!user.isModified('password')) return next();

  	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
  		if(err) return next(err);

  		bcrypt.hash(user.password, salt, function(err, hash) {
  			if(err) return next(err);
  			user.password = hash;
  			next();
  		});
  	});
  });

  // Password verification
  userSchema.methods.comparePassword = function(candidatePassword, cb) {
  	bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
  		if(err) return cb(err);
  		cb(null, isMatch);
  	});
  };

  // Seed a user
  var User = mongoose.model('User', userSchema);


  // Passport session setup.
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });


  // Use the LocalStrategy within Passport.
  //   Strategies in passport require a `verify` function, which accept
  //   credentials (in this case, a username and password), and invoke a callback
  //   with a user object.  In the real world, this would query a database;
  //   however, in this example we are using a baked-in set of users.
  passport.use(new LocalStrategy(function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
      user.comparePassword(password, function(err, isMatch) {
        if (err) return done(err);
        if(isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Invalid password' });
        }
      });
    });
  }));
};