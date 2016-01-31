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
      src: 'source',
      pub: 'public',
      temp: ['temp', 'files'],
      template: '<%= base.src %>/template'
    },

    clean: {
      tmp: '<%= base.temp %>',
      pub: '<%= base.pub %>'
    },

    copy: {
      css: {
        src: '**/*.*',
        cwd: '<%= base.src %>/css',
        dest: '<%= base.pub %>/assets/css',
        expand: true
      },
      js: {
        src: '**/*.*',
        cwd: '<%= base.src %>/js',
        dest: '<%= base.pub %>/assets/js',
        expand: true
      },
      font: {
        src: '**/*.*',
        cwd: '<%= base.src %>/font',
        dest: '<%= base.pub %>/assets/font',
        expand: true
      },
      img: {
        src: '**/*.*',
        cwd: '<%= base.src %>/img',
        dest: '<%= base.pub %>/assets/img',
        expand: true
      }
    },

    includereplace: {
      dist: {
        options: {
          includesDir: '<%= base.template %>'
        },
        files: [{
          src: '*.html',
          cwd: '<%= base.src %>',
          dest: '<%= base.pub %>',
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
          dest: '<%= base.pub %>/assets/css',
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
            browsers: ['last 2 versions', 'ie 9'],
            cascade: false,
            remove: true
          })
        ]
      },
      main: {
        src: '<%= base.pub %>/assets/css/main.css',
        dest: '<%= base.pub %>/assets/css/main.css'
      }
    },

    csscomb: {
      options: {
        config: '.csscomb.json'
      },
      files: '<%= base.pub %>/assets/css/main.css'
    },

    jshint: {
      options: {
        jshintrc: true,
        force: false
      },
      files: '<%= base.src %>/js/main.js'
    },

    watch: {
      options: {
        spawn: false
      },
      html: {
        files: ['<%= base.src %>/*.html', '<%= base.template %>/*.html'],
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
    'clean:pub',
    'includereplace',
    'copy:css', 'copy:font', 'copy:img',
    'sass', 'postcss', 'csscomb',
    'jshint', 'copy:js',
    'clean:tmp'
  ]);

};
