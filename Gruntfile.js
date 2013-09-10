module.exports = function(grunt) {
    grunt.initConfig({
        'pkg': grunt.file.readJSON('package.json'),
        'watch': {
            files: '<%= jshint.all %>',
            tasks: 'lint'
        },
        'jshint': {
            options: {
                '-W069': true // ignore jshint suggestion to use dot notation
            },
            all: ['stackmob.js']
        },
        'uglify': {
            options: {
                banner: '/*! <%= pkg.name %> <%= pkg.version %> */',
                preserveComments: 'some'
            },
            bundled: {
                src: [
                    'node_modules/json2/lib/JSON2/static/json2.js',
                    'node_modules/underscore/underscore.js',
                    'node_modules/backbone/backbone.js',
                    'stackmob.js',
                    'node_modules/crypto-js/hmac-sha1.js',
                    'node_modules/crypto-js/enc-base64-min.js'
                ],
                dest: 'dist/stackmob-<%= pkg.version %>-bundled-min.js'
            },
            min: {
                src: [
                    'stackmob.js',
                    'node_modules/crypto-js/hmac-sha1.js',
                    'node_modules/crypto-js/enc-base64-min.js'
                ],
                dest: 'dist/stackmob-<%= pkg.version %>-min.js'
            }
        },
        'concat': {
            dev: {
                src: [
                    'stackmob.js',
                    'node_modules/crypto-js/hmac-sha1.js',
                    'node_modules/crypto-js/enc-base64-min.js'
                ],
                dest: 'dist/stackmob-<%= pkg.version %>.js'
            }
        },
        'regex-replace': {
            version: {
                src: ['stackmob.js'],
                actions: [
                    {
                        name: 'version',
                        search: 'sdkVersion[ ]?:.*',
                        replace: 'sdkVersion : \"<%= pkg.version %>\",',
                        flags: ''
                    }, {
                        name: 'version',
                        search: 'StackMob JS SDK Version.*',
                        replace: 'StackMob JS SDK Version <%= pkg.version %>',
                        flags: ''
                    }
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-regex-replace');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default use from command line
    grunt.registerTask('default', ['regex-replace', 'lint', 'uglify', 'concat']);

    grunt.registerTask('lint', ['jshint']);

    // Default task for Travis CI
    grunt.registerTask('travis', ['default']);
};