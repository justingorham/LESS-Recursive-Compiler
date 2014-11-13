var fs = require('fs'),
    recess = require('recess'),
    path = require('path'),
    getDirName = path.dirname,
    mkdirp = require('mkdirp'),
    _ = require('underscore');

var lessExt = /.*\.less$|.*\.css/;
var baseDir, ignoreList;

var shouldIgnoreFile = function (file) {
    var stFile = path.normalize(file.trim().toLowerCase());
    var index = stFile.indexOf(baseDir);
    if (index >= 0)
        stFile = stFile.substring(index + baseDir.length);
    if (stFile.charAt(0) === path.sep) {
        stFile = stFile.substring(1)
    }
    var stFileArgs = stFile.split(path.sep);
    for (var i = 0; i < ignoreList.length; i++) {
        var ignoreFile = ignoreList[i];
        if(path.basename(stFile) === ignoreFile) return true;
        var ignoreFileArgs = ignoreFile.split(path.sep);
        var startIndex = ignoreFileArgs.indexOf(stFileArgs[0]);
        if (startIndex > -1 && ignoreFileArgs.length >= stFileArgs.length + startIndex) {
            // possible math. lets try it
            var slice = ignoreFileArgs.slice(startIndex, ignoreFileArgs.length);

            if (_.isEqual(slice, stFileArgs))
                return true;
        }
    }
    return false;
};

var walk = function (dir, done) {
    var results = [];
    fs.readdir(dir, function (err, list) {
        if (err) return done(err);
        var i = 0;
        (function next() {
            var file = list[i++];
            if (!file) return done(null, results);
            file = dir + '/' + file;
            if (shouldIgnoreFile(file)) {
                next();
            } else {
                fs.stat(file, function (err, stat) {
                    if (stat && stat.isDirectory()) {
                        walk(file, function (err, res) {
                            results = results.concat(res);
                            next();
                        });
                    } else {
                        if (lessExt.test(file)) {
                            results.push(file);
                        }
                        next();
                    }
                });
            }
        })();
    });
};

var compileObject = {};

compileObject.compile = function (lessPath, compilePath, options) {
    var opt = options || {};
    opt.compile = true;
    ignoreList = opt.ignoreList || [];
    ignoreList.forEach(function (element, index, array) {
        var stFile = path.normalize(element.trim().toLowerCase());
        if (stFile.charAt(0) === path.sep) {
            stFile = stFile.substring(1)
        }
        array[index] = stFile;
    });
    var stdLessPath = baseDir = path.normalize(lessPath.trim().toLowerCase());
    var stdCompilePath = path.normalize(compilePath.trim().toLowerCase());
    walk(stdLessPath, function (err, results) {
        if (err) throw err;
        //Gennerate new file names
        results.forEach(function (result) {
            var newFile = path.normalize(result.replace(stdLessPath, stdCompilePath)
                .replace('.less', '.css'));
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
