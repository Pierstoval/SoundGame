/**
 * `copy`
 *
 * ---------------------------------------------------------------
 *
 * Copy files and/or folders from your `assets/` directory into
 * the web root (`.tmp/public`) so they can be served via HTTP,
 * and also for further pre-processing by other Grunt tasks.
 *
 * #### Normal usage (`sails lift`)
 * Copies all directories and files (except CoffeeScript and LESS)
 * from the `assets/` folder into the web root -- conventionally a
 * hidden directory located `.tmp/public`.
 *
 * #### Via the `build` tasklist (`sails www`)
 * Copies all directories and files from the .tmp/public directory into a www directory.
 *
 * For usage docs see:
 *   https://github.com/gruntjs/grunt-contrib-copy
 *
 */
module.exports = function (grunt) {

    grunt.config.set('copy', {
        dev:   {
            files: [
                {
                    expand: true,
                    cwd:    './assets',
                    src:    ['**/*.!(coffee|less)'],
                    dest:   '.tmp/public'
                },
                { // Materialize JS
                    expand: true,
                    cwd:    './node_modules/materialize-css/dist/js/',
                    src:    ['materialize.min.js'],
                    dest:   '.tmp/public/js/dependencies/'
                },
                { // Materialize Fonts
                    expand: true,
                    cwd:    './node_modules/materialize-css/dist/fonts/',
                    src:    ['**'],
                    dest:   '.tmp/public/fonts/'
                },
                { // Materialize CSS
                    expand: true,
                    cwd:    './node_modules/materialize-css/dist/css/',
                    src:    ['materialize.min.css'],
                    dest:   '.tmp/public/styles/'
                },
                { // jQuery
                    expand: true,
                    cwd:    './node_modules/jquery/dist/',
                    src:    ['jquery.min.js'],
                    dest:   '.tmp/public/js/dependencies/'
                },
            ]
        },
        build: {
            files: [{
                expand: true,
                cwd:    '.tmp/public',
                src:    ['**/*'],
                dest:   'www'
            }]
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
};
