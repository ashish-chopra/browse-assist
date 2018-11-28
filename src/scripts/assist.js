
        // const g = svg.append("g")
        //     .attr("transform", `translate(${width / 2},${height / 2})`);
        // const chart = g.append("g");
        // var link = chart.selectAll(".link")
        //     .data(root.links())
        //     .enter().append("path")
        //     .attr("class", "link")
        //     .attr("d", d3.linkRadial()
        //         .angle(function (d) { return d.x; })
        //         .radius(function (d) { return d.y; }));

        // var node = chart.selectAll(".node")
        //     .data(root.descendants())
        //     .enter().append("g")
        //     .attr("class", function (d) { return "node" + (d.children ? " node--internal" : " node--leaf"); })
        //     .attr("transform", function (d) { return "translate(" + radialPoint(d.x, d.y) + ")"; })
        //     .on("mouseover", function () {
        //         d3.select(this).classed("active", true);
        //     }).on("mouseout", function () {
        //         d3.select(this).classed("active", false);
        //     }).on("dblclick", function (d) {
        //         console.log('item doubleclicked');
        //         if (d.children) {
        //             parentCtrl.takeAction(d.data)
        //         }
        //     }).on("click", function (d) {
        //         if (d.children) {
        //             return;
        //         }
        //         var id = d.data.id,
        //             info = parentCtrl.getKnowledgeCardBy(id);
        //         console.log(id, info);
        //         if (info.length == 0) {
        //             return;
        //         }
        //         modalInstance = $uibModal.open({
        //             templateUrl: 'templates/card.html',
        //             controller: 'KnowledgeCardController',
        //             controllerAs: 'kCtrl',
        //             size: 'sm',
        //             resolve: {
        //                 data: function () {
        //                     return info[0];
        //                 }
        //             }
        //         });
        //     });

        // node.append("image")
        //     .attr("x", -6)
        //     .attr("y", -6)
        //     .attr("width", 14)
        //     .attr("height", 14)
        //     .attr("transform", function (d) { return "rotate(" + (d.x < Math.PI ? d.x - Math.PI / 2 : d.x + Math.PI / 2) * 180 / Math.PI + ")"; })
        //     .attr("xlink:href", getIcon);

        // node.append("text")
        //     .attr("dy", "0.31rem")
        //     .attr("x", function (d) { return d.x < Math.PI === !d.children ? 10 : -10; })
        //     .attr("text-anchor", function (d) { return d.x < Math.PI === !d.children ? "start" : "end"; })
        //     .attr("transform", function (d) { return "rotate(" + (d.x < Math.PI ? d.x - Math.PI / 2 : d.x + Math.PI / 2) * 180 / Math.PI + ")"; })
        //     .text(function (d) { return d.data.name; });