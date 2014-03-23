function PlayerListCtrl($scope, $http, $timeout) {
    $scope.playerList = {};
    $scope.myInfo = {};

    $scope.updatePlayerList = function() {
        $timeout(function(){
            $http({method: 'GET', url: '/players'})
            .success(function(data, status, headers, config){
                var list = [];
                for(var i=0; i<data.players.length; i++){
                    if ($scope.myInfo['id'] == data.players[i]['id']){
                        var p = data.players[i];
                        p['isMe'] = true;
                        list.push(p);
                    }else{
                        list.push(data.players[i]);
                    }
                }
                $scope.playerList = list;
            });
            $scope.updatePlayerList();
        }, 5 * 1000);
    };
    $scope.updatePlayerList();

}