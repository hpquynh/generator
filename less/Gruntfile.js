module.exports = function(grunt) {
  'use strict';

  require('time-grunt')(grunt);
  require('jit-grunt')(grunt, {
    includereplace: 'grunt-include-replace',
    replace: 'grunt-text-replace'
  });

  // Config
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    base: {
      src: 'source',
      pub: 'public',
      tmp: ['files', 'csstoc.json'],
      template: '<%= base.src %>/template'
    },

    clean: {
      tmp: '<%= base.tmp %>',
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

    less: {
      dist: {
        options: {
          sourceMap: false,
          compress: false
        },
        files: [{
          src: 'main.less',
          cwd: '<%= base.src %>/less',
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
            browsers: ['last 5 versions', 'ie 9'],
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
        force: true
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
      less: {
        files: '<%= base.src %>/less/*.less',
        tasks: ['sass', 'postcss', 'csscomb', 'search', 'replace:css']
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
    },

    search: {
      imports: {
        files: {
          src: '<%= base.src %>/less/*.less'
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
                      if (i === 1) {
                        toc += i + '. ' + match;
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
          from: /\/\*/g,
          to: '\n/*'
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
    'includereplace',
    'copy:css', 'copy:font', 'copy:img',
    'less', 'postcss', 'csscomb',
    'search', 'replace:css',
    'jshint', 'copy:js',
    'clean:tmp'
  ]);

};
