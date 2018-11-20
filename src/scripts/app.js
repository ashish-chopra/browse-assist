(function () {
    angular
        .module('BrowseAssist', [
            'ui.router',
            'treeControl'
        ])
        .config(configureApp)
        .controller("RootController", rootController)
        .controller('AssistController', assistController)
        .controller('ThumbnailController', thumbnailController);


    configureApp.$inject = ['$urlRouterProvider', '$stateProvider'];
    function configureApp($urlRouterProvider, $stateProvider) {
        console.log('configuration done');
        $urlRouterProvider.otherwise("/");
        $stateProvider
            .state({
                name: 'home',
                url: '/',
                templateUrl: 'templates/home.html',
                controller: thumbnailController,
                controllerAs: "thumbCtrl"

            })
            .state({
                name: 'assist', 
                url: "/assist",
                templateUrl: "templates/assist.html"
            });
    }


    rootController.$inject = ['$http'];
    function rootController($http) {
        var vm = this;
        vm.treeOptions = {
            nodeChildren: "children",
            dirSelectable: true,
            injectClasses: {
                iExpanded: "fas fa-folder-open",
                iCollapsed: "fas fa-folder",
                iLeaf: "far fa-file"
            }
        };
        $http.get('data/file.json').then(function(response) {
            vm.treeModel = response.data;
            console.log('data received', vm.treeModel);
        });

        vm.nodeSelected = function(node, selected) {
            console.log(node, selected);
        }
    }

    assistController.$inject = [];
    function assistController() {
        var vm = this;
    }


    thumbnailController.$inject = ['$http'];
    function thumbnailController($http) {
        var vm = this;

        $http.get('data/file.json').then(function(data) {
            vm.data = data.data;
        });
    }

}());