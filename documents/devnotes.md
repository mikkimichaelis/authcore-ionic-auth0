Use Zoom Cordova in Simulator build

https://www.npmjs.com/package/cordova.plugin.zoom#simulator-support

download zoom simulator build from (tar.gz)

https://github.com/zoom/zoom-sdk-ionic/tags

extract and replace contents of plugins/cordova-plugin-zoom

rm/addn ios platform (replace 5.1.1 w/ working platform version)

ionic cordova platform rm ios && ionic cordova platform add ios@^5.1.1   