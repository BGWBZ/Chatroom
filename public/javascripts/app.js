/**
 * http://usejsdoc.org/
 */
angular.module('Chatroom', [])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.
    when('/', { templateUrl: 'partials/chat.html', controller: ChatCtrl }).
    when('/user', { templateUrl: 'partials/user.html', controller: UserCtrl }).
      otherwise({ redirectTo: '/' });
  }])
  .factory('Data', [function () {
	var data={
			username:'',
			users:0,
			onlookers:0,
			text:'',
			msg:[],
			scrolltimes:0,
			socket:io.connect(),
	};
	return data;
  }])
/*.directive("scroll", function ($window,Data) {
    return function(scope, element, attrs) {
        //angular.element($window).bind("scroll", function() {
    	angular.element( document.querySelector( '#msgbox' )).bind("scroll",function(){
            if (this.scrollTop<=0){
            	if (Data.scrolltimes==0)
            		Data.scrolltimes=Data.scrolltimes+1;
            	else{
            		console.log(Data.msg[0]);
            		Data.socket.emit('more', Data.msg[0]);
            	}
            }
            scope.$apply();
        });
    };
})*/
.directive('ngMouseWheelUp', function() {
        return function(scope, element, attrs) {
            element.bind("DOMMouseScroll mousewheel onmousewheel", function(event) {
                   
                        // cross-browser wheel delta
                        var event = window.event || event; // old IE support
                        var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
                        if(delta > 0) {
                            scope.$apply(function(){
                                scope.$eval(attrs.ngMouseWheelUp);
                            });

                        }
            });
        };
});
/*.directive('ngMouseWheelUp', ['$parse', function($parse){
    return {
      restrict: 'A, C',
        link: function(scope, element, attr) {
        var expr = $parse(attr['ngMouseWheelUp']),
            fn = function(event, delta, deltaX, deltaY){
              scope.$apply(function(){
                expr(scope, {
                  $event: event,
                  $delta: delta,
                  $deltaX: deltaX,
                  $deltaY: deltaY
                });
              });
            },
            hamster;
        if (typeof Hamster === 'undefined') {
        	console.log('test');
          // fallback to standard wheel event
          element.bind('wheel', function(event){
            scope.$apply(function() {
              expr(scope, {
                $event: event
              });
            });
            var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
            if(delta > 0) {
            	var o=angular.element( document.querySelector( '#msgbox' ));
            	console.log(o);
            	//Data.socket.emit('more', Data.msg[0]);
            	console.log('up');
            }
          });
          return;
        }

        // don't create multiple Hamster instances per element
        if (!(hamster = element.data('hamster'))) {
        	console.log('test2');
          hamster = Hamster(element[0]);
          element.data('hamster', hamster);
        }
        console.log('test3');
        // bind Hamster wheel event
        hamster.wheel(fn);

        // unbind Hamster wheel event
        scope.$on('$destroy', function(){
          hamster.unwheel(fn);
        });
      }
    };
  }]);*/