module.exports = function(grunt) {
  'use strict';

  require('time-grunt')(grunt);
  require('jit-grunt')(grunt, {
    includereplace: 'grunt-include-replace',
    replace: 'grunt-text-replace'
  });

  // Init
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    base: {
      src: 'source',
      pub: 'public',
      tmp: ['files', 'csstoc.json'],
      include: '<%= base.src %>/include'
    },
    clean: {
      tmp: '<%= base.tmp %>',
      pub: '<%= base.pub %>'
    },
    includereplace: {
      dist: {
        options: {
          includesDir: '<%= base.include %>'
        },
        files: [{
          src: '*.html',
          cwd: '<%= base.src %>',
          dest: '<%= base.pub %>',
          expand: true
        }]
      }
    },
    jshint: {
      options: {
        jshintrc: true,
        force: false
      },
      files: '<%= base.src %>/js/main.js'
    },
    copy: {
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
      },
      js: {
        src: '**/*.*',
        cwd: '<%= base.src %>/js',
        dest: '<%= base.pub %>/assets/js',
        expand: true
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
            browsers: ['last 3 versions', 'ie 9'],
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
    watch: {
      options: {
        spawn: false
      },
      html: {
        files: ['<%= base.src %>/*.html', '<%= base.include %>/*.html'],
        tasks: ['includereplace']
      },
      sass: {
        files: '<%= base.src %>/scss/**/*.scss',
        tasks: ['sass', 'postcss', 'csscomb', 'search', 'replace:css']
      },
      js: {
        files: '<%= base.src %>/js/**/*.js',
        tasks: ['copy:js', 'jshint']
      },
      font: {
        files: '<%= base.src %>/font/**/*.*',
        tasks: ['copy:font']
      },
      img: {
        files: '<%= base.src %>/img/**/*.*',
        tasks: ['copy:img']
      }
    },
    search: {
      imports: {
        files: {
          src: '<%= base.src %>/scss/*.scss'
        },
        options: {
          searchString: /@import[ \("']*([^;]+)[;\)"']*/g,
          logFormat: 'json',
          logFile: 'csstoc.json'
        }
      }
    },
    replace: {
      css: {
        src: ['<%= base.pub %>/assets/css/main.css'],
        overwrite: true,
        replacements: [{
          from: '@@toc',
          to: function () {
            if (!grunt.file.exists('csstoc.json')) {
              return '';
            }

            var tocFile = grunt.file.readJSON('csstoc.json'), files = tocFile.results, toc = '', i = 1, match;

            function capitalize(s) {
              var s = s.toLowerCase().split(' ');
              for (var i = 0; i < s.length; i++) {
                s[i] = s[i].split('');
                s[i][0] = s[i][0].toUpperCase();
                s[i] = s[i].join('');
              }
              return s.join(' ');
            }

            for (var file in files) {
              if (files.hasOwnProperty(file)) {
                var results = files[file];
                for (var res in results) {
                  if (results.hasOwnProperty(res)) {
                    match = results[res].match;
                    match = match.replace(/"|'|@import|;|.scss/gi, '').trim();
                    match = match.replace('-', ' ').trim();
                    match = match.split('/').pop();
                    match = capitalize(match);
                    if (['Variables', 'Mixins'].indexOf(match) === -1) {
                      if (i < 10) {
                        toc += '\n  0' + i + '. ' + match;
                      } else {
                        toc += '\n  ' + i + '. ' + match;
                      }
                      i++;
                    }
                  }
                }
              }
            }
            return toc;
          }
        },
        {
          from: '/*',
          to: '\n/*'
        },
        {
          from: '\n\n\n/*',
          to: '\n\n/*'
        }]
      }
    }
  });

  // Task
  grunt.registerTask('default', [
    'watch'
  ]);
  grunt.registerTask('build', [
    'clean:pub',
    'includereplace', 'copy:font', 'copy:img',
    'jshint', 'copy:js',
    'sass', 'postcss', 'csscomb',
    'search', 'replace:css',
    'clean:tmp'
  ]);

};
