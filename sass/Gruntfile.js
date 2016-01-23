module.exports = function(grunt) {
  'use strict';

  require('time-grunt')(grunt);
  require('jit-grunt')(grunt, {
    includereplace: 'grunt-include-replace'
  });

  // Config
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    base: {
      src: 'src',
      dist: 'dist',
      temp: ['temp', 'files'],
      includes: '<%= base.src %>/includes'
    },

    clean: {
      tmp: '<%= base.temp %>',
      dist: '<%= base.dist %>'
    },

    copy: {
      css: {
        src: '**/*.*',
        cwd: '<%= base.src %>/css',
        dest: '<%= base.dist %>/css',
        expand: true
      },
      js: {
        src: '**/*.*',
        cwd: '<%= base.src %>/js',
        dest: '<%= base.dist %>/js',
        expand: true
      },
      font: {
        src: '**/*.*',
        cwd: '<%= base.src %>/font',
        dest: '<%= base.dist %>/font',
        expand: true
      },
      img: {
        src: '**/*.*',
        cwd: '<%= base.src %>/img',
        dest: '<%= base.dist %>/img',
        expand: true
      }
    },

    includereplace: {
      dist: {
        options: {
          includesDir: '<%= base.includes %>'
        },
        files: [{
          src: '*.html',
          cwd: '<%= base.src %>',
          dest: '<%= base.dist %>',
          expand: true
        }]
      }
    },

    sass: {
      dist: {
        options: {
          sourcemap: 'none',
          noCache: true,
          style: 'expanded'
        },
        files: [{
          src: 'main.scss',
          cwd: '<%= base.src %>/scss',
          dest: '<%= base.dist %>/css',
          ext: '.css',
          expand: true
        }]
      }
    },

    postcss: {
      options: {
        map: false,
        processors: [
          require('autoprefixer')({
            browsers: ['last 3 versions', 'ie 9'],
            cascade: false,
            remove: true
          })
        ]
      },
      main: {
        src: '<%= base.dist %>/css/main.css',
        dest: '<%= base.dist %>/css/main.css'
      }
    },

    csscomb: {
      options: {
        config: '.csscomb.json'
      },
      files: '<%= base.dist %>/css/main.css'
    },

    jshint: {
      options: {
        jshintrc: true,
        force: true
      },
      files: '<%= base.src %>/js/main.js'
    },

    watch: {
      options: {
        spawn: false
      },
      html: {
        files: ['<%= base.src %>/*.html', '<%= base.includes %>/*.html'],
        tasks: ['includereplace']
      },
      sass: {
        files: '<%= base.src %>/scss/*.scss',
        tasks: ['sass', 'postcss']
      },
      css: {
        files: '<%= base.src %>/css/*.css',
        tasks: ['copy:css']
      },
      js: {
        files: '<%= base.src %>/js/*.js',
        tasks: ['copy:js', 'jshint']
      },
      font: {
        files: '<%= base.src %>/font/*.*',
        tasks: ['copy:font']
      },
      img: {
        files: '<%= base.src %>/img/*.*',
        tasks: ['copy:img']
      }
    }
  });

  // Task
  grunt.registerTask('default', [
    'watch'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'includereplace',
    'copy:css', 'copy:font', 'copy:img',
    'sass', 'postcss', 'csscomb',
    'copy:js', 'jshint',
    'clean:tmp'
  ]);

};
