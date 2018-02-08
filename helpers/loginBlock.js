module.exports = function (req, res, next) {
    if (!req.user) {
      req.flash("error", "You must log in to access page")
      res.redirect("/login")

    } else {
      next()
    }
  };
