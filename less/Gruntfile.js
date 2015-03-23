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
      temp: 'temp',
      includes: '<%= base.src %>/includes'
    },

    clean: {
      tmp: '<%= base.temp %>',
      dist: '<%= base.dist %>'
    },

    copy: {
      font: {
        src: ['**/*.*', '!remove.*'],
        cwd: '<%= base.src %>/font',
        dest: '<%= base.dist %>/font',
        expand: true
      },
      img: {
        src: ['**/*.*', '!remove.*'],
        cwd: '<%= base.src %>/img',
        dest: '<%= base.dist %>/img',
        expand: true
      },
      css: {
        src: ['**/*.*', '!remove.*'],
        cwd: '<%= base.src %>/css',
        dest: '<%= base.dist %>/css',
        expand: true
      },
      js: {
        src: ['**/*.*', '!remove.*'],
        cwd: '<%= base.src %>/js',
        dest: '<%= base.dist %>/js',
        expand: true
      }
    },

    includereplace: {
      dist: {
        options: {
          includesDir: '<%= base.includes %>'
        },
        files: [{
          src: ['*.html', '!template.html'],
          cwd: '<%= base.src %>',
          dest: '<%= base.dist %>',
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
          dest: '<%= base.dist %>/css',
          ext: '.css',
          expand: true
        }]
      }
    },

    autoprefixer: {
      options: {
        browsers: 'last 2 versions'
      },
      main: {
        src: '<%= base.dist %>/css/main.css',
        dest: '<%= base.dist %>/css/main.css'
      }
    },

    csscomb: {
      options: {
        config: 'csscomb.json'
      },
      dist: {
        files: {
          '<%= base.dist %>/css/main.css': ['<%= base.dist %>/css/main.css']
        }
      }
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
        files: '<%= base.src %>/**/*.html',
        tasks: ['build-html']
      },
      less: {
        files: '<%= base.src %>/less/**/*.less',
        tasks: ['build-less']
      },
      js: {
        files: '<%= base.src %>/js/*.js',
        tasks: ['build-js']
      },
      assets: {
        files: '<%= base.src %>/{font,img,css}/*.*',
        tasks: ['build-assets']
      }
    }
  });

  // Task
  grunt.registerTask('default', [
    'watch'
  ]);

  grunt.registerTask('build-html', [
    'includereplace'
  ]);

  grunt.registerTask('build-less', [
    'less',
    'autoprefixer',
    'csscomb'
  ]);

  grunt.registerTask('build-js', [
    'copy:js',
    'jshint'
  ]);

  grunt.registerTask('build-assets', [
    'copy:font',
    'copy:img',
    'copy:css'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'build-html',
    'build-assets',
    'build-less',
    'build-js',
    'clean:tmp'
  ]);

};
