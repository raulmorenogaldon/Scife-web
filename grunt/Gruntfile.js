module.exports = function (grunt) {
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
				customtags: ['file-model'],
            relaxerror: ['Start tag seen without seeing a doctype first. Expected e.g. "<!DOCTYPE html>".',
					"Element 'head' is missing a required instance of child element 'title'.",

               'A "select" element with a "required" attribute, and without a "multiple" attribute,',

               'The first child "option" element of a "select" element with a "required" attribute,',

               'Bad value "'
            ],
				reportPath:'html-angular-log.json'
         },
         files: ['../public-angular/public/experiments/views/*.html']
      },
		csslint: {
			strict: {
				options: {
					import: 2
				},
				src: ['../public-angular/public/css/**/*.css','../public-angular/public/experiment/css/**/*.css']
			},
		}
   });

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-html-angular-validate');
	grunt.loadNpmTasks('grunt-contrib-csslint');

	grunt.registerTask('default', ['jshint', /*'htmlangular',*/ 'csslint']);
};