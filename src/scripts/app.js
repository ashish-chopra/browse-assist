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


    rootController.$inject = ['$http', '$state', '$window'];
    function rootController($http, $state, $window) {
        var vm = this;
        vm.rootId = 0;
        vm.currentState = 'home';
        vm.selectedNode = null;
        vm.treeModel = null;
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
                vm.selectedNode = response.data;
                response.data = { name: "", id: "#", children: [response.data]};
            }
            vm.treeModel = response.data;
        });

        vm.nodeSelected = function(node, selected) {
            if (node.children) {
                vm.selectedNode = node;
                vm.rootId = node.id;
                transition();
            }
        }

        vm.changeView = function(stateName) {
            vm.currentState = stateName;
            transition();
        }

        vm.takeAction = function(node) {
            if (node.children) {
                drillTo(node.id);
            } else {
                // open the file.
            }
        }

        vm.back = function() {
            $window.history.back();
        }
        drillTo = function(id) {
            vm.selectedNode = getNodeBy(id);
            vm.rootId = vm.selectedNode.id;
            transition();
        }

        
        transition = function() {
            $state.go(vm.currentState, {id: vm.rootId});
        }

        getNodeBy = function(id) {
            root = vm.treeModel;
            return getNode(root, id);
        }
        
        getNode = function(parent, id) {
            let result = null;
            if (parent) {
                if (parent.id == id) {
                    result = parent;
                }
                else {
                    if (parent.children) {
                        for (let i = 0; i < parent.children.length; i++) {
                            let node = parent.children[i];
                            result = node.children ? getNode(node, id) : null;
                            if (result) break;
                        }
                    }
                    
                }
            }
            return result;
        }
    }

    assistController.$inject = [];
    function assistController() {
        var vm = this;
    }


    thumbnailController.$inject = ['$http', '$stateParams'];
    function thumbnailController($http, $stateParams) {
       
    }

}());