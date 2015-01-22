module.exports = function (grunt) {
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
    grunt.registerTask('default', ['build']);
    grunt.registerTask('build', ['concat', 'html2js']);
    grunt.initConfig({
        src: {
            jsFiles:  ['src/app/**/*.js'],
            templateFiles:  ['src/templates/**/*.tpl.html'],
            vendorJSFiles: ['src/vendor/**/*.js'],
            vendorCSSFiles: ['src/vendor/**/*.css']
        },
        concat: {
            options: {
                stripBanners: true,
                separator: ''
            },
            app: {
                src: [
                    'src/app/services/*.js',
                    'src/app/*.js',
                    'src/app/directives/*.js'
                ],
                dest: 'static/js/app.js'
            },
            vendorJS: {
                src: [
                    ['<%= src.vendorJSFiles %>']
                ],
                dest: 'static/js/vendor.js'
            },
            vendorCSS: {
                src: [
                    ['<%= src.vendorCSSFiles %>']
                ],
                dest: 'static/css/vendor.css'
            }
        },
        html2js: {
            templates: {
                options: {
                    base: 'src/templates'
                },
                src: ['<%= src.templateFiles %>'],
                dest: 'static/js/templates.js',
                module: 'app.templates'
            }
        },
        watch: {
            files: ['<%= src.jsFiles %>', '<%= src.templateFiles %>', '<%= src.vendorJSFiles %>', '<%= src.vendorCSSFiles %>'],
            tasks: ['concat', 'html2js'],
            options: {
                spawn: false,
                interrupt: true,
                debounceDelay: 250
            }
        }
    });
}