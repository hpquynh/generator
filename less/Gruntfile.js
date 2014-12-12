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
    ilu: {
      src: 'src',
      dist: 'dist',
      tmp: '.tmp',
      build: ['header.html', 'footer.html'],
      includes: '<%= ilu.src %>/includes',
      plugins: ['jquery.min.js', 'modernizr.min.js']
    },
    useminPrepare: {
      html: {
        src: '<%= ilu.build %>',
        cwd: '<%= ilu.includes %>',
        expand: true
      },
      options: {
        dest: '<%= ilu.dist %>',
        root: '<%= ilu.src %>',
        flow: {
          steps: {'js': ['concat', 'uglifyjs']},
          post: {}
        }
      }
    },
    usemin: {
      html: {
        src: '*.html',
        cwd: '<%= ilu.dist %>',
        expand: true
      }
    },
    clean: {
      tmp: '<%= ilu.tmp %>',
      dist: ['<%= ilu.dist %>']
    },
    copy: {
      plugins: {
        src: '<%= ilu.plugins %>',
        cwd: '<%= ilu.src %>/js',
        dest: '<%= ilu.dist %>/js',
        expand: true
      },
      js: {
        src: 'main.js',
        cwd: '<%= ilu.src %>/js',
        dest: '<%= ilu.dist %>/js',
        expand: true
      },
      assets: {
        files: [
          {
            src: ['**/*.*', '!remove.*'],
            cwd: '<%= ilu.src %>/img',
            dest: '<%= ilu.dist %>/img',
            expand: true
          },
          {
            src: ['**/*.*', '!remove.*'],
            cwd: '<%= ilu.src %>/font',
            dest: '<%= ilu.dist %>/font',
            expand: true
          },
          {
            src: ['**/*.css', '!remove.*'],
            cwd: '<%= ilu.src %>/css',
            dest: '<%= ilu.dist %>/css',
            expand: true
          }
        ]
      }
    },
    includereplace: {
      dist: {
        options: {
          includesDir: '<%= ilu.includes %>'
        },
        files: [
          {
            src: ['*.html', '!template.html'],
            cwd: '<%= ilu.src %>',
            dest: '<%= ilu.dist %>',
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
      js: '<%= ilu.dist %>/js/main.js'
    },
    cssbeautifier: {
      options : {
        indent: '  '
      },
      files: '<%= ilu.dist %>/css/main.css'
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
      files: ['<%= ilu.src %>/js/main.js']
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
            cwd: '<%= ilu.src %>/less/',
            dest: '<%= ilu.dist %>/css/',
            ext: '.css',
            expand: true
          }
        ]
      }
    },
    autoprefixer: {
      options: {
        browsers: ['last 10 versions']
      },
      main: {
        src: '<%= ilu.dist %>/css/main.css',
        dest: '<%= ilu.dist %>/css/main.css'
      }
    },
    watch: {
      options: {
        spawn: false
      },
      less: {
        files: '<%= ilu.src %>/less/**/*.less',
        tasks: ['build-less']
      },
      html: {
        files: '<%= ilu.src %>/**/*.html',
        tasks: ['build-html']
      },
      js: {
        files: '<%= ilu.src %>/js/main.js',
        tasks: ['build-js']
      },
      assets: {
        files: ['<%= ilu.src %>/{img,font,css}/*.*'],
        tasks: ['build-assets']
      }
    }
  });

  // Task
  grunt.registerTask('default', [
    'watch'
  ]);
  grunt.registerTask('build-assets', [
    'copy:plugins',
    'copy:assets'
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
    'cssbeautifier'
  ]);
  grunt.registerTask('build-js', [
    'copy:js',
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
