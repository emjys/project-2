const mongoose = require ('mongoose');
const Schema = mongoose.Schema;


const dogSchema = new Schema ({
    name : {
              type: String,
              required: [true, "Required"]
    },

    breed : {
                type: String,
                required: [true, "Required"]
    },

    gender : {
            type: String,
            required: [true, "Required"]

    },

    dob: {
              type: Date,
              required: [true, "Required"]
    },

    size: {
              type: String,
              required: [true, "Required"]
    },

    temperament: {
                  type: String,
                  required: [true, "Required"]
    },

    user: {
       type: Schema.Types.ObjectId,
       ref: 'User'
    }
  });


const Dog = mongoose.model('Dog', dogSchema);

module.exports = Dog;
