(function () {
    angular
        .module('BrowseAssist', [
            'ui.router',
            'treeControl',
            'ui.bootstrap'
        ])
        .config(configureApp)
        .controller("RootController", rootController)
        .controller('AssistController', assistController);


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

    assistController.$inject = ['$element', '$scope'];
    function assistController($element, $scope) {
        var vm = this;
        var parentCtrl = $scope.$parent.rCtrl;

        let
            radialPoint = (x, y) => {
                return [(y = +y) * Math.cos(x -= Math.PI / 2), y * Math.sin(x)];
            },

            tree = d3.tree()
                .size([2 * Math.PI, 180])
                .separation((a, b) => (a.parent == b.parent ? 1 : 2) / a.depth),

            root = tree(d3.hierarchy(parentCtrl.selectedNode));


        var svg = d3.select("svg"),
            width = $element[0].clientWidth,
            height = $element[0].clientHeight;
        const g = svg.append("g")
            .attr("transform", `translate(${width / 2},${height / 2})`);
        const chart = g.append("g");
        var link = chart.selectAll(".link")
            .data(root.links())
            .enter().append("path")
            .attr("class", "link")
            .attr("d", d3.linkRadial()
                .angle(function (d) { return d.x; })
                .radius(function (d) { return d.y; }));

        var node = chart.selectAll(".node")
            .data(root.descendants())
            .enter().append("g")
            .attr("class", function (d) { return "node" + (d.children ? " node--internal" : " node--leaf"); })
            .attr("transform", function (d) { return "translate(" + radialPoint(d.x, d.y) + ")"; })
            .on("mouseover", function () {
                d3.select(this).classed("active", true);
            }).on("mouseout", function () {
                d3.select(this).classed("active", false);
            });
        
        node.append("image")
            .attr("x", -6)
            .attr("y", -6)
            .attr("width", 14)
            .attr("height", 14)
            .attr("transform", function (d) { return "rotate(" + (d.x < Math.PI ? d.x - Math.PI / 2 : d.x + Math.PI / 2) * 180 / Math.PI + ")"; })
            .attr("xlink:href", getIcon);

        node.append("text")
            .attr("dy", "0.31rem")
            .attr("x", function (d) { return d.x < Math.PI === !d.children ? 10 : -10; })
            .attr("text-anchor", function (d) { return d.x < Math.PI === !d.children ? "start" : "end"; })
            .attr("transform", function (d) { return "rotate(" + (d.x < Math.PI ? d.x - Math.PI / 2 : d.x + Math.PI / 2) * 180 / Math.PI + ")"; })
            .text(function (d) { return d.data.name; });

        var zoom = d3.zoom()
            .scaleExtent([1, 40])
            .translateExtent([[-100, -100], [width + 90, height + 100]])
            .on("zoom", zoomed);


        svg.call(zoom)
            .on("dblclick.zoom", null);

        function zoomed() {
            chart.attr("transform", d3.event.transform);
        }

        function getIcon(d) {
            var ico;
            if (d.children) {
                ico = "folder"
            } else {
                switch(d.data.name.slice(-4)) {
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

    }

}());