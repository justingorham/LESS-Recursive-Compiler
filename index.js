var fs = require('fs'),
    globby = require('globby'),
    less = require('less'),
    path = require('path'),
    getDirName = path.dirname,
    mkdirp = require('mkdirp'),
    S = require('string'),
    _ = require('lodash');

var lessExt = /.*\.less$|.*\.css/;

var shouldIgnoreFile = function (file, ignoreList) {
    var stFile = file.trim();
    stFile = S(stFile.trim()).replaceAll(path.sep, '/').toString();
    return ignoreList.indexOf(stFile) > -1;
};

var walk = function (dir, ignoreList, done) {
    var results = [];
    fs.readdir(dir, function (err, list) {
        if (err) return done(err);
        var i = 0;
        (function next() {
            var file = list[i++];
            if (!file) return done(null, results);
            file = dir + '/' + file;
            if (shouldIgnoreFile(file, ignoreList)) {
                next();
            } else {
                fs.stat(file, function (err, stat) {
                    if (stat && stat.isDirectory()) {
                        walk(file, ignoreList, function (err, res) {
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
    if (opt.paths) {
        delete opt.paths;
    }

    var stdLessPath = path.normalize(lessPath.trim());
    var stdCompilePath = path.normalize(compilePath.trim());

    var tempIgnoreList = opt.ignoreList || [];
    tempIgnoreList.forEach(function (element, index, array) {
        var stFile = S(path.normalize(element.trim())).replaceAll(path.sep, '/').toString();
        if (stFile.indexOf('/') === 0)
            stFile = stFile.substring(1);
        array[index] = stFile;
    });

    var standardizedLessPath = S(stdLessPath).replaceAll(path.sep, '/').toString();

    globby(tempIgnoreList, {
        cwd: standardizedLessPath
    }, function (err, paths) {
        if (err) {
            throw err;
        } else {
            var ignoreList = paths.slice(0);
            ignoreList.forEach(function (element, index, array) {
                array[index] = S(path.join(standardizedLessPath, element)).replaceAll(path.sep, '/').toString();
            });
            walk(stdLessPath, ignoreList, function (err, results) {
                if (err) throw err;
                //Gennerate new file names
                results.forEach(function (result) {
                    var newFile = path.normalize(result.replace(stdLessPath, stdCompilePath)
                        .replace('.less', '.css'));
                    var dirName = getDirName(newFile);
                    mkdirp.sync(dirName);
                    fs.readFile(result, 'utf8', function (err, data) {
                        if (!err) {
                            var thisOpts = _.extend({paths: [getDirName(result)]}, opt);
                            less.render(data, thisOpts)
                                .then(function (output) {
                                    fs.writeFile(newFile, output.css, function (err) {
                                        console.log(err || 'Created: ' + newFile)
                                    });
                                },
                                function (error) {
                                    console.log(error);
                                });
                        }
                    });
                });
            });
        }
    });
};

module.exports = compileObject;
