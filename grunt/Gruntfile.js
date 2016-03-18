module.exports = function(grunt) {
   grunt.initConfig({
      jshint: {
         files: ['../public-angular/app/**/*.js', '../public-angular/config/**/*.js', '../public-angular/public/experiments/**/*.js'],
         options: {
            globals: {
               jQuery: true,
               angular: true,
               force: true,
               futurehostile: true
            }
         }
      },
      htmlangular: {
         options: {
            angular: true,
            charset: "utf-8",
            relaxerror: ['Start tag seen without seeing a doctype first. Expected e.g. “<!DOCTYPE html>”.', 'Element “head” is missing a required instance of child element “title”.',
               'A “select” element with a “required” attribute, and without a “multiple” attribute,',
               'The first child “option” element of a “select” element with a “required” attribute,',
               'Bad value “'
            ]
         },
         files: ['../public-angular/public/experiments/views/*.html']

      }
   });

   grunt.loadNpmTasks('grunt-contrib-jshint');
   grunt.loadNpmTasks('grunt-html-angular-validate');

   grunt.registerTask('default', ['jshint', 'htmlangular']);
};