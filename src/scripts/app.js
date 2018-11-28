(function () {
    angular
        .module('BrowseAssist', [
            'ui.router',
            'treeControl',
            'ui.bootstrap'
        ])
        .config(configureApp)
        .controller("RootController", rootController)
        .controller('AssistController', assistController)
        .controller('KnowledgeCardController', knowledgeCardController);


    configureApp.$inject = ['$urlRouterProvider', '$stateProvider'];
    function configureApp($urlRouterProvider, $stateProvider) {
        console.log('configuration done');
        $urlRouterProvider.otherwise("/0");
        $stateProvider
            .state({
                name: 'home',
                url: '/:id',
                templateUrl: 'templates/home.html',
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
        vm.knowledgeCardModel = null;
        vm.treeOptions = {
            nodeChildren: "children",
            dirSelectable: true,
            injectClasses: {
                iExpanded: "fa fa-folder-open",
                iCollapsed: "fa fa-folder",
                iLeaf: "fa fa-file"
            }
        };
        $http.get('data/file.json').then(function (response) {
            if (response.data) {
                vm.selectedNode = response.data;
                response.data = { name: "", id: "#", children: [response.data] };
            }
            vm.treeModel = response.data;
        });

        $http.get('data/knowledge.json').then(response => {
            if (response.data) {
                vm.knowledgeCardModel = response.data.content;
            }
        })
        vm.nodeSelected = function (node, selected) {
            if (node.children) {
                vm.selectedNode = node;
                vm.rootId = node.id;
                transition();
            }
        }

        vm.changeView = function (stateName) {
            vm.currentState = stateName;
            transition();
        }

        vm.takeAction = function (node) {
            if (node.children) {
                drillTo(node.id);
            } else {
                // open the file.
            }
        }

        vm.back = function () {
            $window.history.back();
        }

        vm.getKnowledgeCardBy = function (id) {
            return vm.knowledgeCardModel.filter(item => {
                return item.id == id;
            });
        }
        drillTo = function (id) {
            vm.selectedNode = getNodeBy(id);
            vm.rootId = vm.selectedNode.id;
            transition();
        }


        transition = function () {
            $state.go(vm.currentState, { id: vm.rootId });
        }

        getNodeBy = function (id) {
            root = vm.treeModel;
            return getNode(root, id);
        }

        getNode = function (parent, id) {
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

    assistController.$inject = ['$element', '$scope', '$uibModal'];
    function assistController($element, $scope, $uibModal) {
        var vm = this,
            modalInstance = null,
            parentCtrl = $scope.$parent.rCtrl,
            tree = d3.tree()
                .size([2 * Math.PI, 180])
                .separation((a, b) => (a.parent == b.parent ? 1 : 2) / a.depth),
            root = tree(d3.hierarchy(parentCtrl.selectedNode)),
            svg = d3.select("svg"),
            zoom = d3.zoom()
                .scaleExtent([1, 40])
                .on("zoom", zoomed);
        svg.call(zoom).on("dblclick.zoom", null);

        vm.width = $element[0].clientWidth;
        vm.height = $element[0].clientHeight;
        vm.links = root.links();
        vm.descendants = root.descendants();

        vm.getD = function (data) {
            var link = d3.linkRadial()
                .angle(function (d) { return d.x; })
                .radius(function (d) { return d.y; })
            return link(data);
        }

        vm.isLinkMatching = function (d, keywords) {
            if (keywords == '') return false;
            return d.target.data.name.toLowerCase().startsWith(keywords.toLowerCase());
        }

        vm.positionTextX = function (d) {
            return d.x < Math.PI === !d.children ? 15 : -15;
        }

        vm.anchorText = function (d) {
            return d.x < Math.PI === !d.children ? "start" : "end";
        }

        vm.transformText = function (d) {
            return "rotate(" + (d.x < Math.PI ? d.x - Math.PI / 2 : d.x + Math.PI / 2) * 180 / Math.PI + ")";
        }
        vm.transformNode = function (d) {
            return "translate(" + radialPoint(d.x, d.y) + ")";
        }
        vm.transformImage = function (d) {
            return "rotate(" + (d.x < Math.PI ? d.x - Math.PI / 2 : d.x + Math.PI / 2) * 180 / Math.PI + ")";
        }

        vm.getIcon = function (d) {
            var ico;
            if (d.children) {
                ico = "folder"
            } else {
                switch (d.data.name.slice(-4)) {
                    case ".pdf":
                        ico = "pdf";
                        break;
                    case ".xlsx":
                        ico = "excel";
                        break;
                    case ".zip":
                        ico = "archive";
                        break;
                    case ".png":
                    case ".jpg":
                    case ".jpeg":
                        ico = "image";
                        break;
                    case ".ppt":
                        ico = "powerpoint";
                        break;
                    case ".txt":
                        ico = "text";
                    case ".doc":
                    case ".docx":
                        ico = "word";
                    default: ico = "file";
                }
            }
            return "img/icons/" + ico + ".ico";

        }

        vm.onNodeDblClick = function (d) {
            if (d.children) {
                parentCtrl.takeAction(d.data)
            }
        }

        vm.onNodeClick = function (d) {
            if (d.children) {
                return;
            }
            var id = d.data.id,
                info = parentCtrl.getKnowledgeCardBy(id);
            if (info.length == 0) {
                return;
            }
            modalInstance = $uibModal.open({
                templateUrl: 'templates/card.html',
                controller: 'KnowledgeCardController',
                controllerAs: 'kCtrl',
                size: 'sm',
                resolve: {
                    data: function () {
                        return info[0];
                    }
                }
            });
        }

        function radialPoint(x, y) {
            return [(y = +y) * Math.cos(x -= Math.PI / 2), y * Math.sin(x)];
        }

        function zoomed() {
            svg.select('g.main').attr("transform", d3.event.transform);
        }

    }

    knowledgeCardController.$inject = ['data'];
    function knowledgeCardController(data) {
        var vm = this;
        vm.data = data;
    }



}());