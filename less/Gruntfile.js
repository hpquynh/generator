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
        cwd: '<%= base.src %>/stylesheet',
        dest: '<%= base.pub %>/assets/stylesheet',
        expand: true
      },
      js: {
        src: '**/*.*',
        cwd: '<%= base.src %>/javascript',
        dest: '<%= base.pub %>/assets/javascript',
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
        cwd: '<%= base.src %>/image',
        dest: '<%= base.pub %>/assets/image',
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

    less: {
      dist: {
        options: {
          sourceMap: false,
          compress: false
        },
        files: [{
          src: 'main.less',
          cwd: '<%= base.src %>/less',
          dest: '<%= base.pub %>/assets/stylesheet',
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
        src: '<%= base.pub %>/assets/stylesheet/main.css',
        dest: '<%= base.pub %>/assets/stylesheet/main.css'
      }
    },

    csscomb: {
      options: {
        config: '.csscomb.json'
      },
      files: '<%= base.pub %>/assets/stylesheet/main.css'
    },

    jshint: {
      options: {
        jshintrc: true,
        force: true
      },
      files: '<%= base.src %>/assets/javascript/main.js'
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
        files: '<%= base.src %>/stylesheet/*.css',
        tasks: ['copy:css']
      },
      js: {
        files: '<%= base.src %>/javascript/*.js',
        tasks: ['copy:js', 'jshint']
      },
      font: {
        files: '<%= base.src %>/font/*.*',
        tasks: ['copy:font']
      },
      img: {
        files: '<%= base.src %>/image/*.*',
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
    'less', 'postcss', 'csscomb',
    'copy:js', 'jshint',
    'clean:tmp'
  ]);

};
