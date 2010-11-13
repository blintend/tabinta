Tabinta README
--------------

This file is for developers. End-user info is at http://tabinta.mozdev.org/


BUILDING TABINTA

A unix shell script is provided to create the .xpi file:
$ ./build.sh
The result will be ./_dist/tabinta.xpi


INSTALLING FOR DEVELOPMENT

It is recommended to create a separate profile for development
If you have not done yet, create it:
$ firefox -no-remote -P   # -> create a profile with name e.g. xdev

You can then launch Firefox like this:
$ firefox -P xdev
Or, if you have an already running Fx instance with the default profile:
$ firefox -no-remote -P xdev

Actual installation of Tabinta is simply by opening the .xpi file as usual.

MAKING A RELEASE - CHECKLIST

* update version numbers in install.rdf and install.js
** (cvs commit -m "Update version number to X.Y.Z")
* develop & test...
** preferably make a unit test excercising the feature/bugfix
* smoke test in Firefox 3.0, Seamonkey and other "extreme" browsers
* commit changes
* upload xpi
** (cvs commit -m "Release X.Y.Z xpi"
* update web site (index.html, installation.html)
** (cvs commit -m "Website update for X.Y.Z")
* cvs tag release-X_Y_Z
** if we make late changes, the tags can be updated with the -F option:
** cvs tag -F release-X_Y_Z
* upload to addons.mozilla.org
