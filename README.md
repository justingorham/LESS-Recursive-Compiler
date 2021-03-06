LESS-Recursive-Compiler
=========

LESS-Recursive-Compiler is a node module that programatically compiles all of the LESS or CSS files in a specified directory and places them all in another specified directory with the same strucutre as the source direcotry.


Version
----

1.0.2

Updates
-----------
1.0.3
* bug fixes and dependency updates

1.0.2
* now using less directly instead of recess 

0.0.8
* got rid of "toLowerCase()" calls since directories and files in *nix systems are case sensitive.

0.0.7
* ignoreFile list items are now in the form of glob patterns

0.0.6
* Fixed ignore file/dir bug that would have erroneously ignored the wrong files in certain situations

0.0.5
* Improving the buggy ignore file/dir functionality

0.0.4
* added functionality to exclude some directories and files in the lessDirPath directory.

Tech
-----------

LESS-Recursive-Compiler uses the following npm modules

* [globby] - Used for matching files
* [LESS] - CSS pre-processor
* [mkdirp] - Recursively mkdir, like `mkdir -p` for node.js
* [string] - nice string utility
* [lodash] - A JavaScript utility library delivering consistency, modularity, performance, & extras.



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
The options are very the same as the [LESS] programatic api options.


Available options and their defaults:

- compress - false
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

[LESS]:http://lesscss.org/usage/#programmatic-usage
[globby]:https://www.npmjs.org/search?q=globby
[recess]:http://twitter.github.io/recess/
[mkdirp]:https://www.npmjs.org/package/mkdirp
[string]:https://www.npmjs.org/package/string
[lodash]:https://lodash.com/
[dillinger]:http://dillinger.io/

