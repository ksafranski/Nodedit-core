module.exports = function(grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    templates: {
      main: {
        header: '\n<!-- {{tplbasename}} -->\n<script id="{{tplbasename}}" type="text/x-handlebars-template">\n',
        footer: '\n</script>\n',
        src: ['src/templates/*.tpl'],
        dest: 'dist/templates/system.tpl'
      }
    },
    concat: {
      options: {
        banner: '/*!\n <%= pkg.name %> is free software released without warranty under the MIT license by Kent Safranski\n Build version <%= pkg.version %>, <%= grunt.template.today("mm-dd-yyyy") %>\n*/\n',
        separator: ''
      },
      js: {
        src: [
            'src/js/nodedit.js',
            'src/js/nodedit.keybind.js',
            'src/js/nodedit.message.js',
            'src/js/nodedit.template.js',
            'src/js/nodedit.fsapi.js',
            'src/js/nodedit.session.js',
            'src/js/nodedit.store.js',
            'src/js/nodedit.connect.js',
            'src/js/nodedit.observer.js',
            'src/js/nodedit.modal.js',
            'src/js/nodedit.settings.js',
            'src/js/nodedit.workspace.js',
            'src/js/nodedit.tabs.js',
            'src/js/nodedit.bookmarks.js',
            'src/js/nodedit.filemanager.js',
            'src/js/nodedit.editor.js',
            'src/js/nodedit.plugins.js'
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
        banner: '/*!\n <%= pkg.name %> is free software released without warranty under the MIT license by Kent Safranski\n Build version <%= pkg.version %>, <%= grunt.template.today("mm-dd-yyyy") %>\n*/\n',
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
  
  grunt.registerMultiTask('templates', 'Wraps templates with header and footer, then concats into single file', function() {
        var data = this.data,
            path = require('path'),
            dest = grunt.template.process(data.dest),
            files = grunt.file.expand(data.src),
            header = data.header,
            footer = data.footer,
            contents = '';

        files.forEach(function(f) {
            contents += header.replace(/\{\{tplbasename\}\}/g, path.basename(f)) + grunt.file.read(f) + footer;
        });
        
        grunt.file.write(dest, contents);
        grunt.log.writeln('Template created');
  });
  
  // Default task(s).
  grunt.registerTask('default', ['templates','concat','uglify','cssmin']);

};