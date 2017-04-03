"use strit";

angular.module('myapp', ['idexDB.service'])
 .controller('mycontroller', ['$scope','Fty',function($scope,Fty){
 	//启动数据库
 	var init = Fty.initDb();
 	//获取数据
 	var getData = function(){
 		init.then(function(){
 			Fty.getAll().then(function(data){
 				$scope.data = data;
 				var imgs = data.map(function(val,index){
 					var url = window.URL.createObjectURL(val.file);
 					return url;
 				})
 				$scope.url = imgs;
 			});
 		})
 	}
 	getData();
 	$scope.fileChanged = function(ele){  
 	          $scope.files = ele.files;  
 	          $scope.$apply();  
 	    }
 	//添加数据  
 	$scope.add = function(){
 		var name = $scope.name,
 			age = $scope.age,
 			file = $scope.files[0];	
 		Fty.addDb(name,age,file).then(function(){
 			getData();
 		});
 	}
 	//删除数据
 	$scope.remove = function(){
 		var id = $scope.id;
 		Fty.removeDb(id).then(function(){
 			getData();
 		})
 	}
 }])