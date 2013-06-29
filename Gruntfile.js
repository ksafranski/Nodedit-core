module.exports = function(grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concatjs: {
      options: {
        banner: '/*! <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today("mm-dd-yyyy") %> */\n',
        separator: ';'
      },
      dist: {
        src: ['src/js/*.js'],
        dest: 'build/js/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today("mm-dd-yyyy") %> */\n',
        report: 'gzip'
      },
      dist: {
        files: {
          'build/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    concatcss: {
      options: {
        banner: '/*! <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today("mm-dd-yyyy") %> */\n',
        separator: ';'
      },
      dist: {
        src: ['src/css/**/*.css'],
        dest: 'build/css/<%= pkg.name %>.js'
      }
    },
    cssmin: {
      compress: {
        files: {
          'build/<%= pkg.name %>.css': ['src/css/**/*.css']
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
  grunt.registerTask('default', ['concatjs','uglify','concatcss','cssmin']);
  

};