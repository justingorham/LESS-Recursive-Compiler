var fs = require('fs'),
    globby = require('globby'),
    recess = require('recess'),
    path = require('path'),
    getDirName = path.dirname,
    mkdirp = require('mkdirp'),
    S = require('string');
_ = require('underscore');

var lessExt = /.*\.less$|.*\.css/;
var baseDir, ignoreList;

var shouldIgnoreFile = function (file) {
    var stFile = file.trim().toLowerCase();
    stFile = S(stFile.trim().toLowerCase()).replaceAll(path.sep, '/').toString();
    return ignoreList.indexOf(stFile) > -1;
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

    var stdLessPath = baseDir = path.normalize(lessPath.trim().toLowerCase());
    var stdCompilePath = path.normalize(compilePath.trim().toLowerCase());

    var tempIgnoreList = opt.ignoreList || [];
    tempIgnoreList.forEach(function (element, index, array) {
        var stFile = S(path.normalize(element.trim().toLowerCase())).replaceAll(path.sep, '/').toString();
        if (stFile.indexOf('/') === 0)
            stFile = stFile.substring(1);
        console.log(stFile);
        array[index] = stFile;
    });

    var standardizedLessPath = S(stdLessPath).replaceAll(path.sep, '/').toString();

    globby(tempIgnoreList, {
        cwd: standardizedLessPath
    }, function (err, paths) {
        if (err) {
            throw err;
        } else {
            ignoreList = paths.slice(0);
            ignoreList.forEach(function (element, index, array) {
                var stFile = S(path.join(standardizedLessPath, element)).replaceAll(path.sep, '/').toString();
                array[index] = stFile;
            });
            console.log(ignoreList);
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
        }
    });
};

module.exports = compileObject;
