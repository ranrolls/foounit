var fs = require('fs')
  , fsh = require('./build/fsh')
  , PacMan = require('./build/pacman').PacMan;

var generateBrowserSuite = function (){
  console.log('calling generateBrowserSuite');
  var files = [];

  files = files.concat(fsh.findSync(__dirname + '/spec/shared', /.*_spec.js$/));
  files = files.concat(fsh.findSync(__dirname + '/spec/browser', /.*_spec.js$/));

  var content = '';
  for (var i = 0; i < files.length; ++i){
    var file = files[i];
    file = ':test' + file.substr((__dirname + '/spec').length);
    content += "foounit.getSuite().addFile('" + file + "');\n";
  }

  fs.writeFileSync(__dirname + '/spec/browser/autogen_suite.js', content);
};

var restartLoaderService = function (){
  console.log('calling restartLoaderService');
};


desc('Run foounit node specs');
namespace('spec', function (){
  task('node', ['build:all'], function (){
    // Load the foounit node plugin
    var foounit = require('./dist/foounit-node');

    // This runs the suite.
    global.fsh = fsh;       //FIXME: Hack
    require('./spec/suite');

    //foounit.run(__dirname + '/spec',   __dirname + '/dist', /.*_spec.js$/);
  });

  task('browser', ['build:all'], function (){
    generateBrowserSuite();
    restartLoaderService();
  });
});


namespace('build', function (params) {
  var pacman = PacMan.create('./build/build.json')
    , resetDist = function (){
      if (!fsh.existsSync('dist')){
        fsh.mkdirpSync('dist', 0755);
      }
    };

  desc('Cleans the build');
  task('clean', [], function (params){
    console.log('--> Clean');
    var files = fsh.findSync('dist', '.*', { includeDirs: true });

    // Reverse order so files get deleted before directories
    for (var i = files.length - 1; i >= 0; --i){
      var file = files[i];
      if (fsh.isDirectorySync(file)){
        fs.rmdirSync(file);
      } else {
        fs.unlinkSync(file);
      }
    }
  });

  desc('Builds the core bundle');
  task('core', ['build:clean'], function (params){
    console.log('--> Building foounit.js');
    var concated = pacman.concat('foounit.js');
    fs.writeFileSync('dist/foounit.js', concated);
  });

  desc('Builds the core and the node adapter');
  task('node', ['build:core'], function (params){
    console.log('--> Building foounit-node.js');
    var concated = pacman.concat('foounit-node.js');
    fs.writeFileSync('dist/foounit-node.js', concated);
  });

  desc('Builds the browser adapter');
  task('browser', ['build:core'], function (params){
    console.log('--> Building foounit-browser.js');
    var concated = pacman.concat('foounit-browser.js');
    fs.writeFileSync('dist/foounit-browser.js', concated);
  });

  desc('Build the server bundle');
  task('server', ['build:core'], function (param){
    console.log('--> Building foounit-server.js');
    var concated = pacman.concat('foounit-server.js');
    fs.writeFileSync('dist/foounit-server.js', concated);
    
  });

  desc('Builds all adapter environments');
  task('all', ['build:core', 'build:node', 'build:browser', 'build:server'], function (){
    console.log('--> Built all adapters');
  });

});

