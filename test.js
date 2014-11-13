var LESScompiler = require('./index');
LESScompiler.compile('./less', './css', {ignoreList:['/ignoreThis', 'ignoreFile.less']});
