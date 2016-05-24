#!/bin/sh
NAME="pathact"
ELEMENT="pathact-element"
BP=build

rm -rf $BP
mkdir -p $BP
mkdir -p $BP/fontawesome
mkdir -p $BP/webcomponentsjs

vulcanize --inline-scripts --inline-css --strip-comments $ELEMENT.html > $BP/$ELEMENT.html

cp -r $NAME-index.html $BP/index.html
cp -r conf/ $BP/
cp -r bower_components/stevia-elements/fonts/ $BP/
cp -r bower_components/stevia-elements/css/ $BP/
cp -r bower_components/fontawesome/css $BP/fontawesome/
cp -r bower_components/fontawesome/fonts $BP/fontawesome/
cp -r bower_components/webcomponentsjs/*.min.js $BP/webcomponentsjs/

#
# fix index.html css paths
#
sed -i s@'bower_components/stevia-elements/'@@g $BP/index.html
sed -i s@'bower_components/'@@g $BP/index.html
## end fix paths
