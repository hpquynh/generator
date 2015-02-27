module.exports = function(grunt) {
  'use strict';

  require('time-grunt')(grunt);
  require('jit-grunt')(grunt, {
    includereplace: 'grunt-include-replace',
    useminPrepare: 'grunt-usemin'
  });

  // Config
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    base: {
      src: 'src',
      dist: 'dist',
      tmp: '.tmp',
      build: ['head.html', 'script.html'],
      includes: '<%= base.src %>/includes',
      plugins: [
        'jquery.min.js',
        'modernizr.min.js',
        'oldie.min.js'
      ]
    },

    useminPrepare: {
      html: {
        src: '<%= base.build %>',
        cwd: '<%= base.includes %>',
        expand: true
      },
      options: {
        dest: '<%= base.dist %>',
        root: '<%= base.src %>',
        flow: {
          steps: {'js': ['concat', 'uglifyjs']},
          post: {}
        }
      }
    },

    usemin: {
      html: {
        src: '*.html',
        cwd: '<%= base.dist %>',
        expand: true
      }
    },

    clean: {
      tmp: '<%= base.tmp %>',
      dist: ['<%= base.dist %>']
    },

    copy: {
      plugins: {
        src: '<%= base.plugins %>',
        cwd: '<%= base.src %>/js',
        dest: '<%= base.dist %>/js',
        expand: true
      },
      js: {
        src: 'main.js',
        cwd: '<%= base.src %>/js',
        dest: '<%= base.dist %>/js',
        expand: true
      },
      alljs: {
        src: '*.*',
        cwd: '<%= base.src %>/js',
        dest: '<%= base.dist %>/js',
        expand: true
      },
      assets: {
        files: [
          {
            src: ['**/*.*', '!remove.*'],
            cwd: '<%= base.src %>/img',
            dest: '<%= base.dist %>/img',
            expand: true
          },
          {
            src: ['**/*.*', '!remove.*'],
            cwd: '<%= base.src %>/font',
            dest: '<%= base.dist %>/font',
            expand: true
          },
          {
            src: ['**/*.css', '!remove.*'],
            cwd: '<%= base.src %>/css',
            dest: '<%= base.dist %>/css',
            expand: true
          }
        ]
      }
    },

    includereplace: {
      dist: {
        options: {
          includesDir: '<%= base.includes %>'
        },
        files: [
          {
            src: ['*.html', '!template.html'],
            cwd: '<%= base.src %>',
            dest: '<%= base.dist %>',
            expand: true
          }
        ]
      }
    },

    jsbeautifier: {
      options : {
        js: {
          indentSize: 2
        }
      },
      js: '<%= base.dist %>/js/main.js'
    },

    csscomb: {
      options : {
        config: 'csscomb.json'
      },
      files: '<%= base.dist %>/css/main.css'
    },

    uglify: {
      options: {
        preserveComments: 'some'
      }
    },

    jshint: {
      options: {
        jshintrc: true,
        force: true
      },
      files: ['<%= base.src %>/js/main.js']
    },

    less: {
      dist: {
        options: {
          sourceMap: false,
          compress: false
        },
        files: [
          {
            src: 'main.less',
            cwd: '<%= base.src %>/less/',
            dest: '<%= base.dist %>/css/',
            ext: '.css',
            expand: true
          }
        ]
      }
    },

    autoprefixer: {
      options: {
        browsers: ['last 2 versions']
      },
      main: {
        src: '<%= base.dist %>/css/main.css',
        dest: '<%= base.dist %>/css/main.css'
      }
    },

    watch: {
      options: {
        spawn: false
      },
      less: {
        files: '<%= base.src %>/less/**/*.less',
        tasks: ['build-less']
      },
      html: {
        files: '<%= base.src %>/**/*.html',
        tasks: ['build-allhtml']
      },
      js: {
        files: '<%= base.src %>/js/*.js',
        tasks: ['build-alljs']
      },
      assets: {
        files: '<%= base.src %>/{img,font,css}/*.*',
        tasks: ['build-assets']
      }
    }
  });

  // Task
  grunt.registerTask('default', [
    'watch'
  ]);

  grunt.registerTask('build-assets', [
    'copy:assets'
  ]);

  grunt.registerTask('build-allhtml', [
    'includereplace'
  ]);


  grunt.registerTask('build-html', [
    'includereplace',
    'useminPrepare',
    'concat:generated',
    'uglify:generated',
    'usemin'
  ]);

  grunt.registerTask('build-less', [
    'less',
    'autoprefixer',
    'csscomb'
  ]);

  grunt.registerTask('build-js', [
    'copy:plugins',
    'copy:js',
    'jsbeautifier',
    'jshint'
  ]);

  grunt.registerTask('build-alljs', [
    'copy:alljs',
    'jsbeautifier',
    'jshint'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'build-assets',
    'build-html',
    'build-less',
    'build-js',
    'clean:tmp'
  ]);

};
