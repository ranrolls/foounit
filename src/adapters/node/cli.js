var parser = require('nomnom')
  , _ = require('underscore')
  , fs = require('fsh')
  , pth = require('path');

var TEMPLATE_DIR = pth.join(__dirname, '../../../templates');

exports.generateSuite = function (options){
  // Trim and normalize.  Turns "node, browser" into "browser-node"
  var target = _(options.target.split(',').sort()).map(function (t){
    return t.replace(/^\s+|\s+$/, '');
  }).join('-');

  var templateDir = pth.join(TEMPLATE_DIR, target);

  if (!fs.isDirectorySync(templateDir)){
    throw new Error('Could not locate suite template for: "' + options.target +
      '". Run `foounit generate --help` to see a list of available targets.');
  }

  // Copy all template files


  console.log(target);
  //var templateDir = pth.join(TEMPLATE_DIR, '
}


// Run script if executed via the cmd line
exports.cli = function (){
  parser.command('generate')
    .help('Generate a foounit test suite')
    .opts({
      target: {
        string:   '-t ENV, --target=ENV',
        help:     'List of javascript host environments to target. Valid optons: browser,node',
        default:  'node',
      },
      dir: {
        string:   '-d dir, --dir=DIRECTORY',
        help:     'Directory where the suite shold be generated',
        default:  './spec'
      }
    });


  var options = parser.parseArgs()
    , cmd = options._[0];

  switch (cmd){
    case 'generate':
      exports.generateSuite(options);
      break;
    default:
      throw new Error('Unspecified command: "' + cmd +
        '".  Run `foounit --help` to see a list of available commands');
  }
}
