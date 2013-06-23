module.exports = function(grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        banner: '/*! <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today("mm-dd-yyyy") %> */\n',
        separator: ';'
      },
      dist: {
        src: ['src/js/**/*.js'],
        dest: 'build/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today("mm-dd-yyyy") %> */\n',
        report: 'gzip'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    cssmin: {
      compress: {
        files: {
          'dist/<%= pkg.name %>.css': ['src/css/**/*.css']
        }
      },
      with_banner: {
        options: {
          banner: '/*! <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today("mm-dd-yyyy") %> */\n'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  // Default task(s).
  grunt.registerTask('default', ['concat','uglify','cssmin']);
  

};