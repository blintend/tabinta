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
$ firefox -ProfileManager   # -> create a profile with name e.g. xdev

You can then launch Firefox like this:
$ firefox -P xdev

Actual installation of Tabinta is simply by opening the .xpi file as usual.

MAKING A RELEASE - CHECKLIST

* smoke test in Firefox 1.0, Seamonkey and other "extreme" browsers
* update version numbers in install.rdf and install.js
* upload xpi
* update web site (index.html, installation.html)
* cvs tag release-X_Y_Z
* upload to addons.mozilla.org
