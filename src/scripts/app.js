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
        $urlRouterProvider.otherwise("/0");
        $stateProvider
            .state({
                name: 'home',
                url: '/:id',
                templateUrl: 'templates/home.html',
                controller: thumbnailController,
                controllerAs: "thumbCtrl"

            })
            .state({
                name: 'assist', 
                url: "/assist/:id",
                templateUrl: "templates/assist.html"
            });
    }


    rootController.$inject = ['$http', '$state'];
    function rootController($http, $state) {
        var vm = this;
        vm.rootId = 0;
        vm.selectedNode = null;
        vm.treeModel = null;
        vm.currentState = 'home';
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
            if (response.data) {
                response.data = { name: "", id: "#", children: [response.data]};
            }
            vm.treeModel = vm.selectedNode = response.data;
            console.log(vm.treeModel);
        });

        vm.nodeSelected = function(node, selected) {
            if (node.children) {
                this.selectedNode = node;
                $state.reload();
            }
        }

        vm.changeView = function(stateName) {
            vm.currentState = stateName;
            $state.go(stateName, {id: vm.rootId});
        }
    }

    assistController.$inject = [];
    function assistController() {
        var vm = this;
    }


    thumbnailController.$inject = ['$http', '$stateParams'];
    function thumbnailController($http, $stateParams) {
        var vm = this;
        console.log($stateParams.id);
        // $http.get('data/file.json').then(function(response) {
        //     //vm.data = response.data;
        //     vm.data = response.data[$stateParams.id];
        // });
    }

}());