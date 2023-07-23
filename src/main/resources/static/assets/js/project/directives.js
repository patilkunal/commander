(function(){
	

function CronSchedule(name, desc, cronexpr) {
				this.name = name;
				this.description = desc;
				this.cronExpression = cronexpr;
};

var app = angular.module("app");

app.directive("quartzCronBuilder", function() {
	var schedules = [];
	schedules.push(new CronSchedule("HOURLY","Every Hour", "0 0 * * * ? *"));
	schedules.push(new CronSchedule("DAILY", "Once every Day", "0 0 0 * * ? *"));
	schedules.push(new CronSchedule("WEEKDAYS", "Every Day from Mon-Fri", "0 0 0 ? * 0-6 *"));
	schedules.push(new CronSchedule("MONTHLY", "Once every month", "0 0 0 0 * ? *"));
	schedules.push(new CronSchedule("YEARLY", "Once every year", "0 0 0 0 0 ? *"));						
	return {
		restrict: 'A',
		scope: {
			schedules: []
			//returnValue: '&cronExpression'
		},
		//schedules: ['123', '45'],
		link: function(scope, elem, attrs) {
		},
		template: '<div><select ng-repeat="sch in scope.schedules"><option>{{sch}}</option></select></div>'
	};
});

/**
 * 
 */
app.directive("jqPiechart", function() {
	return {
		restrict: 'A',
		scope: {
			mydata: '=',
			showlegend: '=',
			legendlocation: '='
		},
		link: function(scope, elem, attrs) {
			var plotoptions = {
					title: attrs.charttitle,
					gridPadding: {top:40, bottom:10, left:10, right:10},
					seriesDefaults:{
						renderer:$.jqplot.PieRenderer,
						rendererOptions: { padding: 8, showDataLabels: true }
					},
					legend:{
						show: scope.showlegend, 
						placement: 'inside', 
						rendererOptions: {
							numberCols: 1
						}, 
						location: scope.legendlocation,
						marginTop: '15px'
					}
				};
			
			scope.$watch('mydata', function() { jQuery.jqplot(elem[0].id, [scope.mydata], plotoptions); });
		}
	};
});

app.directive("jqBarchart", function() {
	return {
		restrict: 'A',
		scope: {
			data: '=',
			categories: '=',
			series: '=',
			showlegend: '=',
			legendlocation: '='
		},
		link: function(scope, elem, attrs) {
			var plotoptions = {
					title: attrs.title,
					gridPadding: {top:40 },					
					stackSeries: false,
					captureRightClick: true,
					
					series: scope.series,
					seriesDefaults:{
					  renderer:$.jqplot.BarRenderer,
					  rendererOptions: {
						  // Put a 30 pixel margin between bars.
						  barMargin: 30,
						  pointLabels: {show: true},
						  // Highlight bars when mouse button pressed.
						  // Disables default highlighting on mouse over.
						  highlightMouseDown: true   
					  },
					  pointLabels: {show: true}
					},
					axes: {
					  xaxis: {
						  renderer: $.jqplot.CategoryAxisRenderer,
						  ticks: scope.categories
					  },
					  yaxis: {
						// Don't pad out the bottom of the data range.  By default,
						// axes scaled as if data extended 10% above and below the
						// actual range to prevent data points right on grid boundaries.
						// Don't want to do that here.
						//padMin: 0
					  }
					},
					legend: {
					  show: true,
					  location: 'nw',
					  placement: 'outside'
					}     
				};
			
			//Add a watch on data to update the chart as data changes
			scope.$watch('data', function() { plotoptions.axes.xaxis.ticks = scope.categories; jQuery.jqplot(elem[0].id, scope.data, plotoptions).replot();});
		}
	};
});

app.directive('dispHostname', function() {
	return {
		restrict: 'A',
		scope: {
			host: '='
		},
		template: '<span ng-if="host.secureHttp">https://{{host.hostname}}:{{host.port}}</span>' +
				'<span ng-if="!(host.secureHttp)">http://{{host.hostname}}:{{host.port}}</span>'
	};
});


app.directive("checkList", [function () {
	return {
	    restrict: "A",
	    scope: {
	        selectedItemsArray: "=",
	        value: "@"
	    },
	    link: function (scope, elem) {
	        scope.$watchCollection("selectedItemsArray", function (newValue) {
	            if (_.contains(newValue, scope.value)) {
	                elem.prop("checked", true);
	            } else {
	                elem.prop("checked", false);
	            }
	        });
	        if (_.contains(scope.selectedItemsArray, scope.value)) {
	            elem.prop("checked", true);
	        }
	        elem.on("change", function () {
	            if (elem.prop("checked")) {
	                if (!_.contains(scope.selectedItemsArray, scope.value)) {
	                    scope.$apply(
	                        function () {
	                            scope.selectedItemsArray.push(scope.value);
	                        }
	                    );
	                }
	            } else {
	                if (_.contains(scope.selectedItemsArray, scope.value)) {
	                    var index = scope.selectedItemsArray.indexOf(scope.value);
	                    scope.$apply(
	                        function () {
	                            scope.selectedItemsArray.splice(index, 1);
	                        });
	                }
	            }
	            console.log(scope.selectedItemsArray);
	        });
	    }
	};
}]);

app.directive("d3Barchart", function() {
	return {
		restrict: 'A',
		scope: {
			mydata: '='
		},
		link: function(scope, element, attrs) {
			if(attrs.chartwidth == undefined) {
				attrs.chartwidth = 960;
			}
			
			if(attrs.chartheight == undefined) {
				attrs.chartheight = 500;
			}
			
			if( (attrs.barcolor == undefined) || (attrs.barcolor == '')) {
				attrs.barcolor = 'steelblue';
			}

			if( (attrs.ylabel == undefined) || (attrs.ylabel == '')) {
				attrs.ylabel = 'Y Values';
			}
			
			var margin = {top: 20, right: 20, bottom: 30, left: 40},
			width = attrs.chartwidth - margin.left - margin.right,
			height = attrs.chartheight - margin.top - margin.bottom;

			var x = d3.scale.ordinal()
    		.rangeRoundBands([0, width], .1);

			var y = d3.scale.linear()
		    		.range([height, 0]);
		
			var xAxis = d3.svg.axis()
					    .scale(x)
					    .orient("bottom");
		
			var yAxis = d3.svg.axis()
					    .scale(y)
					    .orient("left");
					    //.ticks(10);
			
			
			// set up initial svg object
		      var svg = d3.select(element[0])
		        .append("svg")
		          .attr("width", attrs.chartwidth) //width + margin.left + margin.right)
		          .attr("height", attrs.chartheight) //height + margin.top + margin.bottom)
		          .style("border", "1px solid steelblue")
		          .append("g")
		          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		      
		      if(attrs.resturl != undefined) {
			      d3.json(attrs.resturl, function(error, data) {
			    	  //Return test name for x axis
			    	  x.domain(data.map(function(d) {return d[attrs.xvaluefrom]; }));
			    	  y.domain([0, d3.max(data, function(d) { return d[attrs.yvaluefrom]; })]);
			    	  
			    	  svg.append("g")
			    	  	.attr("class", "x axis")
			    	  	.attr("transform", "translate(0, " + height + ")")
			    	  	.call(xAxis);
			    	  
			    	  svg.append("g")
			          	.attr("class", "y axis")
			          	.call(yAxis)
			            .append("text")
			            .attr("transform", "rotate(-90)")
			            .attr("y", -40)
			            .attr("dy", ".71em")
			            .style("text-anchor", "end")
			            .text(attrs.ylabel);
			    	  
			    	  svg.selectAll(".bar")
			          	.data(data)
			          	.enter().append("rect")
			          	.style("fill", attrs.barcolor)
			          	.attr("x", function(d) { return x(d[attrs.xvaluefrom]); })
			          	.attr("width", x.rangeBand())
			          	.attr("y", function(d) { return y(d[attrs.yvaluefrom]); })
			          	.attr("height", function(d) { return height - y(d[attrs.yvaluefrom]); });
			      });
		      }
		}
	};
		
});

app.directive("d3GroupedBarchart", function() {
	return {
		restrict: 'A',
		scope: {
			mydata: '=',
			yvaluefrom: '=',
			barcolors: '='
		},
		link: function(scope, element, attrs) {
			if(attrs.chartwidth === undefined) {
				attrs.chartwidth = 960;
			}
			
			if(attrs.chartheight === undefined) {
				attrs.chartheight = 500;
			}

			var margin = {top: 20, right: 20, bottom: 50, left: 40},
			width = attrs.chartwidth - margin.left - margin.right,
			height = attrs.chartheight - margin.top - margin.bottom;

			var x0 = d3.scale.ordinal()
		    .rangeRoundBands([0, width], .1);

			var x1 = d3.scale.ordinal();

			var y = d3.scale.linear()
		    		.range([height, 0]);
		
			var xAxis = d3.svg.axis()
		    			.scale(x0)
		    			.orient("bottom");
		
			var yAxis = d3.svg.axis()
					    .scale(y)
					    .orient("left");
						//.tickFormat(d3.format(".2s"));
			
			var color = d3.scale.ordinal()
		    	.range(scope.barcolors);
		    	//.range(["#98abc5", "#8a89a6"]);
			
			// set up initial svg object
		      var svg = d3.select(element[0])
		        .append("svg")
		          .attr("width", attrs.chartwidth) //width + margin.left + margin.right)
		          .attr("height", attrs.chartheight) //height + margin.top + margin.bottom)
		          .style("border", "1px solid steelblue")
		          .append("g")
		          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		      
		      if(attrs.resturl != undefined) {
			      d3.json(attrs.resturl, function(error, data) {
			    	  var keyNames = scope.yvaluefrom;
			    	  
			    	  data.forEach(function(d){
			    		 d.values = keyNames.map(function(name) { return {name: name, value: +d[name]}; }); 
			    	  });
			    	  
			    	  //Return test name for x axis
			    	  x0.domain(data.map(function(d) {return d[attrs.xvaluefrom]; }));
			    	  x1.domain(keyNames).rangeRoundBands([0, x0.rangeBand()]);
			    	  //y axis ranges from 0 to the max value calculated among all the key names
			    	  y.domain([0, d3.max(data, function(d) { return d3.max(d.values, function(d) { return d.value;}); })]);
			    	  
			    	  svg.append("g")
			    	  	.attr("class", "x axis")
			    	  	.attr("transform", "translate(0, " + height + ")")
			    	  	.call(xAxis)
			    	  	.selectAll("text")
					      .style("text-anchor", "end")
					      .attr("dx", "-.8em")
					      .attr("dy", "-.55em")
					      .attr("transform", "rotate(-30)" );
			    	  
			    	  svg.append("g")
			          	.attr("class", "y axis")
			          	.call(yAxis)
			            .append("text")
			            .attr("transform", "rotate(-90)")
			            .attr("y", -40)
			            .attr("dy", ".71em")
			            .style("text-anchor", "end")
			            .text(attrs.ylabel);

			    	  var state = svg.selectAll(".state")
			          .data(data)
			        .enter().append("g")
			          .attr("class", "g")
			          .attr("transform", function(d) { return "translate(" + x0(d[attrs.xvaluefrom]) + ",0)"; });
			    	  
			    	  state.selectAll("rect")
			          	.data(function(d) { return d.values;})
			          	.enter().append("rect")
			          	.attr("width", x1.rangeBand())
			          	.attr("x", function(d) { return x1(d.name); })
			          	.attr("y", function(d) { return y(d.value); })
			          	.attr("height", function(d) { return height - y(d.value); })
			          	.style("fill", function(d) { return color(d.name); });
			    	  
			    	  var legend = svg.selectAll(".legend")
			          			.data(keyNames)
			          			.enter().append("g")
			          			.attr("class", "legend")
			          			.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
			    	  
			    	  legend.append("rect")
			          .attr("x", width - 18)
			          .attr("width", 18)
			          .attr("height", 18)
			          .style("fill", color);
			    	  
			    	  legend.append("text")
			          .attr("x", width - 24)
			          .attr("y", 9)
			          .attr("dy", ".35em")
			          .style("text-anchor", "end")
			          .text(function(d) { return d; });

			      });
		      }
		}
	};
		
});


app.directive("d3Piechart", function() {
	return {
		restrict: 'A',
		scope: {
			mydata: '=',
			yvaluefrom: '=',
			barcolors: '='
		},
		link: function(scope, element, attrs) {
			var color = d3.scale.category20c();
			
			if(attrs.chartsize === undefined) {
				attrs.chartsize = 400;
			}
			
			var radius = attrs.chartsize/2;

			if(attrs.resturl != undefined) {
			      d3.json(attrs.resturl, function(error, data) {
				var vis = d3.select(element[0])
					.append("svg:svg")
					.data([data])
					.attr("width", attrs.chartsize)
					.attr("height", attrs.chartsize)
					.append("svg:g")
					.attr("transform", "translate(" + radius + "," + radius + ")");
				
				var pie = d3.layout.pie().value(function(d){return d[attrs.pieValue];});
				
				// declare an arc generator function
				var arc = d3.svg.arc().outerRadius(radius);
	
				// select paths, use arc generator to draw
				var arcs = vis.selectAll("g.slice").data(pie).enter().append("svg:g").attr("class", "slice");
				arcs.append("svg:path")
				    .attr("fill", function(d, i){
				        return color(i);
				    })
				    .attr("d", function (d) {
				        // log the result of the arc generator to show how cool it is :)
				        //console.log(arc(d));
				        return arc(d);
				    });
	
				// add the text
				arcs.append("svg:text").attr("transform", function(d){
							d.innerRadius = 0;
							d.outerRadius = radius;
				    return "translate(" + arc.centroid(d) + ")";})
				    		.attr("text-anchor", "middle")
				    		.attr("font-size", "10px")
				    		.text( function(d, i) {
				    			return data[i][attrs.pieLabel];
				    		});
			    });
			}
		}
	};
});

})();
