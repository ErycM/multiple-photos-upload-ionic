# multiple-photos-upload-ionic
1º Create ionic project
2º Install cordova-plugin-camera (cordova plugin add cordova-plugin-camera)
3º Insert the tag: <multiple-photos-upload max-photos="MAX_PHOTOS_VALUE"></multiple-photos-upload> in your project.
4º The datas os the images are send per broadcast (photos-array):
  $scope.$on('photos-array', function(event, args){
      $scope.photos = args;
  });

