module.exports = (grunt)->
  grunt.initConfig 
    pkg: grunt.file.readJSON('package.json')
    coco:
      'backbone.joint':
        options:
          bare: true
          join: true
        files:
          'backbone.joint.js': ['src/**/*.co']
    wrap:
      'backbone.joint':
        wrapper: ["""
        ;(function(root, factory) {
          if (typeof define === 'function' && define.amd) {
            define(factory);
          } else {
            factory();
          }
        })(this, function() {\n""", """
        return Backbone.Joint;
        });"""]
        src: ['backbone.joint.js']
        dest: '.'

    watch:
      files: ['src/**/*.co']
      tasks: ['build']

  grunt.loadNpmTasks 'grunt-coco'
  grunt.loadNpmTasks 'grunt-wrap'
  grunt.loadNpmTasks 'grunt-beep'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-watch'

  grunt.registerTask 'build', ['coco', 'wrap', 'beep:*-*']
  grunt.registerTask 'default', ['coco']
