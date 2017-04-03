
angular.module('idexDB.service', [])
	.factory('Fty', ['$q',function($q){
		const DB_NAME = 'person';
		const DB_VERSION = 1; 
		const DB_STORE_NAME = 'publications';
		var db;
		return{
			//启动数据库
			initDb: function(){
				//打开数据库，返回一个IDBOpenDBRequest对象
				var req = indexedDB.open(DB_NAME,DB_VERSION);
				var defer = $q.defer();
				//成功执行函数
				req.onsuccess = function(evt){
					//this.redult 是一个数据库实例,赋值给变量db，方便操作数据库。
					db = this.result;
					defer.resolve();
				}
				//失败执行函数
				req.onerror = function(){
					console.error("启动失败");
				}
				//创建集合对象存储数据
				req.onupgradeneeded = function(evt){
					var store = evt.currentTarget.result.createObjectStore( DB_STORE_NAME,
						{ keyPath: 'id', autoIncrement: true });
					//创建索引
					store.createIndex('name','name',{ unique: true });
					store.createIndex('age','age',{ unique: true });
				}
				return defer.promise;
			},
			//添加数据
			addDb: function(name,age,file){
				//判断数据库是否打开成功
				if(!db){
					console.error("没有开启数据库");
					return;
				}
				//创建事务，操作数据库
				var tx = db.transaction(DB_STORE_NAME,'readwrite'),
					store = tx.objectStore(DB_STORE_NAME),//操作哪个集合对象
					req = store.add({name:name,age:age,file:file}),//添加数据
					defer = $q.defer();
				console.log("这里啊");
				req.onsuccess = function(){
					defer.resolve();
					alert('添加成功！');
				}
				req.onerror = function(){
					alert('添加失败！');
				}
				return defer.promise;
			},
			//获取数据
			getAll: function(){
				var data = [],
					defer = $q.defer();
				var Store = db.transaction(DB_STORE_NAME).objectStore(DB_STORE_NAME);
				var req = Store.openCursor();
				req.onsuccess = function(evt){
					var cursor = evt.target.result;
					if(cursor){
						data.push(cursor.value);
						cursor.continue();
					}else{
						defer.resolve(data);
					}
				}
				return defer.promise;
			},
			//删除数据
			removeDb: function(id){
				var id = Number(id),
					defer = $q.defer(),
					tx = db.transaction(DB_STORE_NAME,'readwrite'),
					store = tx.objectStore(DB_STORE_NAME),
					req = store.get(id);
					req.onsuccess = function(evt){
						var record = evt.target.result;
						if(record){
							req = store.delete(id);
							req.onsuccess = function(){
								defer.resolve();
								alert("删除成功！");
							}
							req.onerror = function(){
								alert('删除失败！');
							}
						}else{
							alert('没找到这条数据！')
							
						}
					}
					return defer.promise;
			}
		} 
			
	}])