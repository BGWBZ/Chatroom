/**
 * http://usejsdoc.org/
 */

function ChatroomCtrl($scope,Data){
	
}
function ChatCtrl($scope,Data,$timeout){
	$scope.data=Data;
	$scope.scroll = angular.element( document.querySelector( '#msgbox' ));
	$scope.wheelup=function(){
		if ($scope.scroll[0].scrollTop<=0){
			if (typeof(Data.msg[0])!='undefined')
				Data.socket.emit('more', Data.msg[0]);
			else{
				var d={
					Time:1999999999999,
				}
				Data.socket.emit('more', d);
			}	
		}
	}
	$scope.distype=function(d){
		switch (d){
		case 'System':
			return 'color:red';
			break;
		case $scope.data.username:
			return 'color:blue';
			break;
		default:
			return 'color:black';
	}
	}
	$scope.disuser=function(d){
		if (d==$scope.data.username)
			return 'Me';
		else
			return d;
	}
	$scope.distime=function(d){
		if (typeof(d)=='number')
			return new Date(d).toTimeString().substr(0, 8);
		if (typeof(d)=='string')
			return new Date(parseInt(d)).toTimeString().substr(0, 8);
	}
	$scope.send=function(){
		Data.socket.emit('msg', $scope.data.text);
		$scope.data.text='';
	}
	$scope.users=function(data){
		$timeout(function () {
			$scope.data.users=data[0];
			$scope.data.onlookers=data[1];
		},0);
	}
	$scope.change=function(data){
		var p=$scope.scroll[0].scrollTop+$scope.scroll[0].clientHeight>=$scope.scroll[0].scrollHeight;
		$timeout(function () {
			$scope.data.users=data[0];
			$scope.data.onlookers=data[1];
			var obj={
				User:'System',
				Time:data[4],
				Msg:data[2]+' has changed username to '+data[3]+'!',
				//Type:'color:red',
			}
			$scope.data.msg.push(obj);
			console.log($scope.data.msg);
			if (p){
				$timeout(function(){
					$scope.scroll[0].scrollTop=$scope.scroll[0].scrollHeight;
				},0);
			}
		},0);
	}
	$scope.join=function(data){
		var p=$scope.scroll[0].scrollTop+$scope.scroll[0].clientHeight>=$scope.scroll[0].scrollHeight;
		$timeout(function () {
			$scope.data.users=data[0];
			$scope.data.onlookers=data[1];
			var obj={
				User:'System',
				Time:data[3],
				Msg:data[2]+' has joined!',
				//Type:'color:red',
			}
			$scope.data.msg.push(obj);
			console.log($scope.data.msg);
			if (p){
				$timeout(function(){
					$scope.scroll[0].scrollTop=$scope.scroll[0].scrollHeight;
				},0);
			}
		},0);
	}
	$scope.leave=function(data){
		var p=$scope.scroll[0].scrollTop+$scope.scroll[0].clientHeight>=$scope.scroll[0].scrollHeight;
		$timeout(function () {
			$scope.data.users=data[0];
			$scope.data.onlookers=data[1];
			var obj={
				User:'System',
				Time:data[3],
				Msg:data[2]+' has left!',
				//Type:'color:red',
			}
			$scope.data.msg.push(obj);
			console.log($scope.data.msg);
			if (p){
				$timeout(function(){
					$scope.scroll[0].scrollTop=$scope.scroll[0].scrollHeight;
				},0);
			}
		},0);
	}
	$scope.msg=function(data){
		var p=$scope.scroll[0].scrollTop+$scope.scroll[0].clientHeight>=$scope.scroll[0].scrollHeight;
		console.log($scope.scroll);
		$timeout(function () {
			$scope.data.users=data[0];
			$scope.data.onlookers=data[1];
			var obj={
				User:data[2],
				Time:data[3],
				Msg:data[4],
				//Type:'color:black',
			}
			$scope.data.msg.push(obj);
			if (p){
				$timeout(function(){
					$scope.scroll[0].scrollTop=$scope.scroll[0].scrollHeight;
					//$scope.scroll[0].animate({ scrollTop: $scope.scroll[0].scrollHeight}, 100	0);
				},0);
			}
				
		},0);
	}
	$scope.more=function(data){
		var p=$scope.scroll[0].scrollHeight;
		$timeout(function () {
			$scope.data.users=data[0];
			$scope.data.onlookers=data[1];
			//console.log(data[2]);
			res=data[2];
			for (i=0;i<res.length;i=i+1){
				$scope.data.msg.unshift(res[i]);
			}
			$timeout(function(){
				$scope.scroll[0].scrollTop=$scope.scroll[0].scrollHeight-p;
			},0);
		},0);
	}
	Data.socket.on('system',function(act, data){
		console.log(act, data);
		switch(act){
			case 'users':
				$scope.users(data);
				break;
			case 'change':
				$scope.change(data);
				break;
			case 'join':
				$scope.join(data);
				break;
			case 'leave':
				$scope.leave(data);
				break;
			case 'msg':
				$scope.msg(data);
				break;
			case 'more':
				$scope.more(data);
				break;
		}
	});
}
function UserCtrl($scope,Data,$timeout){
	$scope.data=Data;
	Data.socket.emit('new-onlookers','1');
	$scope.isused=false;
	$scope.issubmit=false;
	$scope.username=Data.username;
	$scope.submit=function(){
		if ($scope.issubmit){
			$scope.issubmit=false;
			return;
		}
		$scope.issubmit=true;
		console.log('test');
		namedata={
			old:Data.username,
			new:$scope.username,
		}
		console.log(namedata);
		Data.socket.on('namesuccess', function() {
			$timeout(function () {
				$scope.isused=false;
				Data.username=$scope.username;
		    }, 0);
		});
		Data.socket.on('nameexisted', function() {
			$timeout(function () {
				$scope.isused=true;
		    }, 0);
		});
		Data.socket.emit('new-name', namedata);
	}
	//$scope.submit();
}