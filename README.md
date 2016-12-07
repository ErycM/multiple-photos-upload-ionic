## Multiple Photos Upload - Ionic and Cordova
-> This is centered Text <-
->![alt tag](http://i.imgur.com/dEmp8Fm.png)<-
* Create ionic project
* Install cordova-plugin-camera
  ```
  $ cordova plugin add cordova-plugin-camera
  ```
* Insert the tag: <multiple-photos-upload max-photos="MAX_PHOTOS_VALUE"></multiple-photos-upload> in your project. 
* The datas os the images are send per broadcast (photos-array): 
```javascript
  $scope.$on('photos-array', function(event, args){
      $scope.photos = args; //photos array
  });
 ```

