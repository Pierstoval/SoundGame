
module.exports = {
    register: function(req, res){
        return res.view('auth/register');
    },

    login: function(req, res){
        return res.view('auth/login');
    },

    logout: function(req, res){
        return res.redirect('/');
    },
};
