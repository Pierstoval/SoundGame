/**
 * @namespace HomeController
 */
module.exports = {
    index: function(req, res) {
        return res.view('front/homepage');
    }
};
