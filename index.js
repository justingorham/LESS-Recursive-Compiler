var fs = require('fs'),
    recess = require('recess'),
    path = require('path'),
    getDirName = path.dirname,
    mkdirp = require('mkdirp');

var lessExt = /.*\.less$|.*\.css/;
var baseDir, ignoreList;

var shouldIgnoreFile = function(file){
    var stFile = path.normalize(file.trim().toLowerCase());
    var index = stFile.indexOf(baseDir);
    if(index >=0 )
        stFile = stFile.substring(index + baseDir.length);
    if(stFile.charAt(0) === path.sep){
        stFile = stFile.substring(1)
    }
    var basename = path.basename(stFile);
    return ignoreList.indexOf(stFile) > -1 || ignoreList.indexOf(basename) > -1;
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
            if(shouldIgnoreFile(file)){
                next();
            }else{
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
            });}
        })();
    });
};

var compileObject = {};

compileObject.compile = function (lessPath, compilePath, options) {
    var opt = options || {};
    opt.compile = true;
    ignoreList = opt.ignoreList || [];
    ignoreList.forEach(function(element, index, array){
        var stFile = path.normalize(element.trim().toLowerCase());
        if(stFile.charAt(0) === path.sep){
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
