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

    }

  });



// Middleware - Hash Password =====================================================

userSchema.pre('save', function(next) {
    var user = this;

    // ------ Hash the password if it has been modified (or is new) -----
    if (!user.isModified('password')) return next();

    // ----- Generate salt -----
        bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
            if (err) return next(err);

    // ----- Hash the password using new salt -----
        bcrypt.hash(user.password, salt, function(err, hash) {
          if (err) return next(err);

    // ----- Override the cleartext password with the hashed one -----
        user.password = hash;
            next();
          });
      });
  });


// Bcrypt method comparison to return a boolean =============================================
  userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };


const User = mongoose.model('User', userSchema);

module.exports = User;
