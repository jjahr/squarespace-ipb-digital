var uglify_input = [
  // Include bower compnents:
  'bower_components/fastclick/lib/fastclick.js',
  'src/js/shadowbox/shadowbox.js',
  'bower_components/jquery/dist/jquery.js',
  'bower_components/jquery-waypoints/waypoints.js',
  // 'bower_components/foundation/js/foundation.js',
  // 'bower_components/foundation/js/foundation/foundation.interchange.js',
  'src/js/*.js'
]

function syncfiles(dir) {
  var files = [
    {cwd:'src/www/', src:'**', dest:dir}, // HTML
    {cwd:'src/img/', src:'**', dest:dir+'/img'}, // Images
    {cwd:'src/extra/', src:'**', dest:dir} // Extra
  ];
  return files;
}

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),


    sass: {
      options: {
        // includePaths: [
        //   require('node-bourbon').with(
        //     'bower_components/neat/app/assets/stylesheets'
        //   )
        // ] 
        includePaths: require('node-bourbon').includePaths
        // includePaths: require('node-bourbon').with('other/path', 'another/path') 
        // - or - 
        // includePaths: require('node-bourbon').includePaths
      },
      dev: {
        files: {
          // Compile to app.css
          // Test line
          'dev/css/app.css': 'src/scss/app.scss'
        },
        options: {
          // Values: nested, compressed
          outputStyle: 'compressed'
        }
      },
      // Target: Dist (usage: sass:dist)
      dist: {
        files: {
          // Compile to app.css
          'dist/css/app.css': 'src/scss/app.scss'
        },
        options: {
          // Values: nested, compressed
          outputStyle: 'compressed'
        }
      }
    },


    uglify: {
      dev: {
        files: [
          { 'dev/js/app.min.js': uglify_input },
          { 'dev/js/modernizr.js': 'bower_components/modernizr/modernizr.js' },
          
        ],
        options: {
          beautify: true
        }
      },
      dist: {
        files: [
          { 'dist/js/app.min.js': uglify_input },
          { 'dist/js/modernizr.js': 'bower_components/modernizr/modernizr.js' },
        ],
        options: {
          compress: {
            drop_console: true
          }
        }
      }
    },


    watch: {
      // Trigger livereload for all matches.
      options: {
        livereload: 1337
      },
      // When gruntfile changes, build everything.
      grunt: { 
        files: ['Gruntfile.js'],
        tasks: ['build'],
      },
      html: {
        files: ['src/www/*.html', 'src/include/*.html'],
        tasks: ['sync:dev']
      },
      sass: {
        files: 'src/scss/**/*.scss',
        tasks: ['sass:dev']
      },
      js: {
        files: 'src/js/**/*.js',
        tasks: ['uglify:dev']
      },
      syncfiles: {
        files: ['src/extra/**', 'src/img/**'],
        tasks: ['sync:dev']
      }
    },


    sync: {
      dev: {
        files: syncfiles('dev'),
        verbose: true // Display log messages when copying files
      },
      dist: {
        files: syncfiles('dist')
      }
    },


  });


  // Register Tasks
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-sync');


  // Custom Tasks
  grunt.registerTask('build', ['sass:dev','uglify:dev','sync:dev']);
  grunt.registerTask('default', ['build','watch']);
  grunt.registerTask('dist', ['sass:dist','uglify:dist','sync:dist']);
}