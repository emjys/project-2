const User = require('../models/user');

// ----- Home -----
exports.index = (req, res) => {
    res.render('home')
}
