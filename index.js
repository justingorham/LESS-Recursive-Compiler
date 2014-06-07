var fs = require('fs'),
    recess = require('recess'),
    getDirName = require("path").dirname,
    mkdirp = require('mkdirp');

var walk = function (dir, done) {
    var results = [];
    fs.readdir(dir, function (err, list) {
        if (err) return done(err);
        var i = 0;
        (function next() {
            var file = list[i++];
            if (!file) return done(null, results);
            file = dir + '/' + file;
            fs.stat(file, function (err, stat) {
                if (stat && stat.isDirectory()) {
                    walk(file, function (err, res) {
                        results = results.concat(res);
                        next();
                    });
                } else {
                    var lessExt = /.*\.less$|.*\.css/;
                    if (lessExt.test(file)) {
                        results.push(file);
                    }
                    next();
                }
            });
        })();
    });
};

var compileObject = {};

compileObject.compile = function (lessPath, compilePath, options) {
    var opt = options || {};
    opt.compile = true;
    walk(lessPath, function (err, results) {
        if (err) throw err;
        //console.log(results);
        var transForms = {};
        //Gennerate new file names
        results.forEach(function (result) {
            var newFile = result.replace(lessPath, compilePath)
                .replace('.less', '.css');
            mkdirp.sync(getDirName(newFile));
            recess(result, opt, function (err, obj) {
                if (err) {
                    console.error(err);
                } else {
                    fs.writeFile(newFile, obj[0].output, function (err) {
                        if (err) {
                            console.error(err);
                        } else {
                            console.log('saved: ' + newFile);
                        }
                    });
                }
            });
        });


    });
};

module.exports = compileObject;
