LESS-Recursive-Compiler
=========

LESS-Recursive-Compiler is a node module that programatically compiles all of the LESS or CSS files in a specified directory and places them all in another specified directory with the same strucutre as the source direcotry.


Version
----

0.0.5

Updates
-----------
0.0.5
* Improving the buggy ignore file/dir functionality

0.0.4
* added functionality to exclude some directories and files in the lessDirPath directory.

Tech
-----------

LESS-Recursive-Compiler uses the following npm modules

* [recess] - Twitter's CSS Hinter
* [mkdirp] - Recursively mkdir, like `mkdir -p` for node.js


Installation
--------------

```sh
npm install LESS-Recursive-Compiler
```

How to use
--------------

```sh
require('less-recursive-compiler').compile(lessDirPath, compiledDirPath, [options])
```
The options are very similar to the [Recess] programatic api options.


Available options and their defaults:

- compress - false
- includePath - []
- noIDs - true
- noJSPrefix - true
- noOverqualifying - true
- noUnderscores - true
- noUniversalSelectors - true
- strictPropertyOrder - true
- zeroUnits - true
- ignoreList - []


License
----

MIT


**Free Software, Hell Yeah!**

Written at [Dillinger]

[recess]:http://twitter.github.io/recess/
[mkdirp]:https://www.npmjs.org/package/mkdirp
[dillinger]:http://dillinger.io/

