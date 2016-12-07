# multiple-photos-upload-ionic
1º Create ionic project \n
2º Install cordova-plugin-camera (cordova plugin add cordova-plugin-camera) \n
3º Insert the tag: <multiple-photos-upload max-photos="MAX_PHOTOS_VALUE"></multiple-photos-upload> in your project. \n
4º The datas os the images are send per broadcast (photos-array): \n
  $scope.$on('photos-array', function(event, args){
      $scope.photos = args;
  });

