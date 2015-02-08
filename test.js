var path = require('path');
var LESScompiler = require('./index');
LESScompiler.compile('./less', './css', {ignoreList:['/ignoreThis', '**/ignoreFile.less', '**/aDir/dontTouchThis.less']});
