module.exports = function(grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        banner: '/*! <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today("mm-dd-yyyy") %> */\n',
        separator: ''
      },
      js: {
        src: [
            'src/js/dist.nodedit.js',
            'src/js/nodedit.keybind.js',
            'src/js/nodedit.message.js',
            'src/js/nodedit.template.js',
            'src/js/nodedit.fsapi.js',
            'src/js/nodedit.session.js',
            'src/js/nodedit.store.js',
            'src/js/nodedit.connect.js',
            'src/js/nodedit.modal.js',
            'src/js/nodedit.workspace.js',
            'src/js/nodedit.tabs.js',
            'src/js/nodedit.filemanager.js',
            'src/js/nodedit.editor.js'
            ],
        dest: 'dist/js/<%= pkg.name %>.js'
      },
      css: {
        src: ['src/css/reset.css','src/css/base.css','src/css/icons.css'],
        dest: 'dist/css/screen.css'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today("mm-dd-yyyy") %> */\n',
        report: 'gzip'
      },
      dist: {
        files: {
          'dist/js/<%= pkg.name %>.min.js': ['<%= concat.js.dest %>']
        }
      }
    },
    cssmin: {
      css:{
        src: '<%= concat.css.dest %>',
        dest: 'dist/css/screen.min.css'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  // Default task(s).
  grunt.registerTask('default', ['concat','uglify','cssmin']);
  

};