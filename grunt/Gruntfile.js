module.exports = function (grunt) {
  grunt.initConfig({
    jshint: {
      files: ['../public-server/*.js', '../public-server/bin/*', '../public-server/models/*.js', '../public-server/routes/*.js', '../public-server/public/js/main.js']
    },
    jade: {
      files: ['../public-server/views/**/*.jade']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint')
  grunt.loadNpmTasks('grunt-contrib-jade')

  grunt.registerTask('default', ['jshint', 'jade'])
}
