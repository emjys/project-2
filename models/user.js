const mongoose = require ('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

var SALT_WORK_FACTOR = 10;

const userSchema = new Schema ({
    firstname : {
              type: String,
              required: [true, "Required"]
    },
  
    lastname : {
                type: String,
                required: [true, "Required"]
    },
  
    email : {
            type: String,
            required: [true, "Required"]
  
    },
  
    password: {
              type: String,
              required: [true, "Required"]
  
    },
  
  });


userSchema.pre('save', function(next) {
    var user = this;
  
    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();
  
    // generate a salt
        bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
            if (err) return next(err);
  
    // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
          if (err) return next(err);
  
    // override the cleartext password with the hashed one
        user.password = hash;
            next();
          });
      });
  });
  
  
// Compare is a bcrypt method that will return a boolean
  userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };
  

  const User = mongoose.model('User', userSchema)

module.exports = User