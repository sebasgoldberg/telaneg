'use strict';

module.exports = function(grunt) {

    grunt.initConfig({

        dir: {
            webapp: 'webapp',
            dist: 'dist',
            transp: 'transp',
            bower_components: 'bower_components'
        },

        connect: {
            options: {
                port: 8082,
                hostname: 'localhost'
            },
            src: {},
            dist: {
                options: {
                    port: 8081,
                    },
                },
            transp: {},
        },

        copy:{
            transp: {
              files:[ {
                  expand: true,
                  cwd: '<%= dir.webapp %>',
                  src: ['**/*', '!**/*.js', ],
                  dest: 'transp/',
              }]

            },
            dist: {
              files:[
                {
                  expand: true,
                  cwd: '<%= dir.transp %>',
                  src: ['**/*', ],
                  dest: 'dist/',
                },
              ],
            },
            bsp: {
              files:[
                {
                  expand: true,
                  cwd: '<%= dir.dist %>',
                  src: ['**/*', '!localService/**/*', '!test/**/*', ],
                  dest: 'bsp/',
                },
              ],
            },
         },

        babel: {
            options: {
                sourceMap: true
            },
            src: {
                files:[ {
                    expand: true,
                    cwd:  'webapp/',
                    src: ['**/*.js'],
                    dest: 'transp/',
                }]
            }
        },

        watch: {
            all:{
              files: ['webapp/**/*'],
              tasks: ['clean:transp', 'babel', 'copy:transp']
                }
        },

        openui5_connect: {
            options: {
                resources: [
                    "../"
                ]
            },
            transp: {
                options: {
                    appresources: 'transp'
                }
            },
            src: {
                options: {
                    appresources: 'webapp'
                }
            },
            dist: {
                options: {
                    appresources: '<%= dir.dist %>',
                }
            }
        },

        openui5_preload: {
            component: {
                options: {
                    resources: {
                        cwd: 'transp',
                        prefix: 'simplifique/telaneg'
                    },
                    dest: '<%= dir.dist %>'
                },
                components: true
            }
        },

        clean: {
            // @todo Verificar se funciona.
            dist: '<%= dir.dist %>/',
            transp: 'transp/',
            bsp: 'bsp/'
        },

        eslint: {
            webapp: ['<%= dir.webapp %>']
        }

    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-openui5');
    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Server task
    grunt.registerTask('serve', function(target) {
        grunt.task.run('openui5_connect:' + (target || 'src') + ':keepalive');
    });

    // Linting task
    grunt.registerTask('lint', ['eslint']);

    //grunt.registerTask('mybabel', ['babel']);

    // Build task
    grunt.registerTask('build', ['transp', 'clean:dist', 'openui5_preload', 'copy:dist', 'clean:bsp', 'copy:bsp']);

    grunt.registerTask('transp', ['clean:transp', 'babel', 'copy:transp']);

    // Default task
    grunt.registerTask('default', [
        'lint',
        'build',
        'serve:dist'
    ]);
};
