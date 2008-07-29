#! /bin/sh

set -e  # terminate on error
ROOT="`pwd`"

# constants

SRC_DIR="$ROOT"/src
RELEASE_DIR="$ROOT"/downloads

BUILD_DIR="$ROOT"/_build
DIST_DIR="$ROOT"/_dist

# functions

build() {
    [ ! -e "$BUILD_DIR" ] || rm -Rf "$BUILD_DIR"
    cp -a "$SRC_DIR" "$BUILD_DIR"
    rm -Rf "$BUILD_DIR"/chrome/*
    ( cd "$SRC_DIR"/chrome && zip -qr "$BUILD_DIR"/chrome/tabinta.jar * -x 'CVS/*' '*/CVS/*' )
}

xpi() {
    [ ! -e "$DIST_DIR" ] || rm -Rf "$DIST_DIR"
    mkdir "$DIST_DIR"
    cd "$BUILD_DIR" && zip -qr "$DIST_DIR"/tabinta.xpi * -x 'CVS/*' '*/CVS/*'
}

# script code

build
xpi
