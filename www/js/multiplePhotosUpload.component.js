(function() {

    angular
        .module('starter')

    .component('multiplePhotosUpload', {
        bindings: {
            maxPhotos: '@'
        },

        template: '<div id="multiple-upload" >'+
                        '<div class="extern-box row" ng-click="pu.inputNumber()">'+
                            '<div class="col">'+
                               '<i ng-show="pu.ionIconUpload" class="ion ion-images"></i>'+
                               '<i ng-hide="pu.ionIconUpload" class="ion ion-checkmark-circled"></i>'+
                            '</div>'+
                         '</div class="extern-box">'+
                        '<div class="box" >'+
                            '<div data-ng-repeat="file in pu.picture track by $index" class="photo-box col col-50" ng-click="pu.openActionSheet($index)" >'+
                                '<input type="file" index="{{$index}}" >'+
                                '<div class="item-photo">'+
                                    '<i ng-show="file.icon" class="ion ion-image"></i>'+
                                    '<img ng-hide="file.icon"  ng-src="{{ file.img }}" class="picture"/>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                   '</div>',
        controllerAs: 'pu',
        controller: function($scope, $element, $attrs, $rootScope, $timeout, $ionicActionSheet, $ionicLoading, $q) {
            var vm = this;
            vm.picture = [];
            vm.allPhotos = [];
            vm.openActionSheet = openActionSheet;
            vm.inputNumber = inputNumber;
            vm.numbersPhotos = 0;
            vm.ionIconUpload = true;
            // vm.ionCheckmark = false;
            
            // vm.ionImage = [];
            // for(var i=0; i < $attrs.maxPhotos; i++){
            //     var obj = {};
            //     obj.icon = true;
            //     obj.img = "";
            //     vm.picture[0] = obj;
            // };

            //Insere ou remove fotos do array
            function InsertOrRemovePictures(number){
                return $q(function(resolve, reject){
                    if(vm.picture.length > number){
                        vm.picture.splice(number,1);
                        vm.numbersPhotos = vm.picture.length;
                        vm.ionIconUpload = true;
                    }else{
                        for(var i=0; i < number; i++){
                            if(vm.picture[i] != undefined){
                                vm.picture[i] = vm.picture[i];
                            }else{
                                var obj = {};
                                obj.img = "";
                                obj.icon = true;
                                vm.picture[i] = obj;
                                // vm.picture[i] = "";
                                // vm.ionImage[i] = true;
                            }
                        }
                    }
                    resolve();
                });
            }


            //Verifica photos-number e insere/remove arquivos
            function inputNumber(){
                vm.numbersPhotos = ++vm.numbersPhotos;
                if(vm.numbersPhotos < (parseInt($attrs.maxPhotos)+1)){
                    if(vm.numbersPhotos > 0 && vm.numbersPhotos != ""){
                        
                        // if(!(vm.picture[vm.numbersPhotos].img != undefined)){
                            $timeout(function(){
                                vm.numbersPhotos = ++vm.numbersPhotos;
                                InsertOrRemovePictures(vm.numbersPhotos);
                            },10);
                        // }

                        vm.numbersPhotos = --vm.numbersPhotos;
                        openActionSheet(vm.numbersPhotos);
                    }

                    if(parseInt(vm.numbersPhotos)+1 == parseInt($attrs.maxPhotos)){
                        // vm.picture[vm.numbersPhotos].icon = false;
                        vm.ionIconUpload = false;
                    }
                }
            }

            function loading(){
                $ionicLoading.show({
                    template: 'Carregando...',
                    duration: 3000
                    }).then(function(){});
            }
            //Selecionar opção de tirar foto ou galeria de fotos
            function openActionSheet(valueIndex){
                
                // Show the action sheet
                $ionicActionSheet.show({
                buttons: [
                { text: ' <i class="icon ion-camera"></i> Câmera' },
                { text: ' <i class="icon ion-images"></i> Galeria' }
                ],
                titleText: 'Foto do Grupo',
                cancelText: 'Cancelar',
                destructiveText: ' <i class="icon ion-ios-close-outline"></i> Remover',
                cancel: function() {
                    if(vm.picture[valueIndex].img == ""){
                        InsertOrRemovePictures(valueIndex);
                    }
                    return true;
                },
                buttonClicked: function(index){
                switch(index){
                    case 0:
                        var promise = openCamera(valueIndex);
                        loading();
                        promise.then(function(result){
                            $ionicLoading.hide();
                        }), function(error){
                            $ionicLoading.hide().then(function(){
                                alert("Erro ao abrir câmera");
                            });
                        }
                        break;
                    case 1:
                        var promise = openGallery(valueIndex);
                        loading();
                        promise.then(function(result){
                            $ionicLoading.hide();
                        }), function(error){
                            $ionicLoading.hide().then(function(){
                                alert("Erro ao abrir galeria");
                            });
                        }
                        //openGallery(valueIndex);
                        break;
                }
                    return true;
                },
                destructiveButtonClicked: function(){
                    vm.picture[valueIndex].icon = true;
                    var promise = InsertOrRemovePictures(valueIndex);
                    loading();
                    promise.then(function(result){
                            $ionicLoading.hide();
                        }), function(error){
                            $ionicLoading.hide().then(function(){
                                alert("Erro ao abrir galeria");
                            });
                        }
                    return true;
                    }                    
                }); 

                
            }

            function setOptions(srcType) {
                var options = {
                    // Some common settings are 20, 50, and 100
                    quality: 80,
                    destinationType: Camera.DestinationType.DATA_URL,
                    // In this app, dynamically set the picture source, Camera or photo gallery
                    sourceType: srcType,
                    encodingType: Camera.EncodingType.JPEG,
                    mediaType: Camera.MediaType.PICTURE,
                    allowEdit: true,
                    correctOrientation: true  //Corrects Android orientation quirks
                }
                return options;
            }

            //Abrir Camera
            function openCamera(index){
                return $q(function(resolve, reject){
                    var srcType = Camera.PictureSourceType.CAMERA;
                    var options = setOptions(srcType);
                    $timeout(function(){
                        navigator.camera.getPicture(function cameraSuccess(imageUri) {
                            var promise = displayImage(imageUri, index);
                                promise.then(function(result) {
                                    resolve();
                                }, function(error) {
                                    reject();
                                });

                        }, function cameraError(error) {
                            reject();
                        }, options);
                    });
                });
            }

            //Abrir Galeria
            function openGallery(index){
                return $q(function(resolve, reject){
                    var srcType = Camera.PictureSourceType.SAVEDPHOTOALBUM;
                    var options = setOptions(srcType);

                    navigator.camera.getPicture(function cameraSuccess(imageUri) {
                        var promise = displayImage(imageUri, index);
                            promise.then(function(result) {
                                resolve();
                            }, function(error) {
                                reject();
                            });
                    }, function cameraError(error) {
                        alert("Foto não encontrada");
                         reject();
                    }, options);
                });
            }

            //Carregar Imagem
            function displayImage(imgUri, index){
                return $q(function(resolve,reject){
                    if(imgUri != ""){
                        $timeout(function() {
                            vm.picture[index].img = "data:image/jpeg;base64," + imgUri;
                            vm.picture[index].icon = false;
                            vm.allPhotos[index] = imgUri;
                        });
                        //Envia o array de fotos atualizado
                        $rootScope.$broadcast('photos-array',{ 
                            photos:  vm.allPhotos });

                        resolve();
                    }else{
                        reject();
                    }
                }, 40);
            }
        }
    });

})();
