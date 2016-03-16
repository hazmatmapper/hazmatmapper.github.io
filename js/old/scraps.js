// code scraps

  var labelAttribute = "<h1>"+data.total_waste+
    "</h1><br><b> pounds of lead </b>"; //label content
  var labelName = data.name //html string for name to go in child div
  
  //create info label div
  var infolabel = d3.select("body")
    .append("div") //create the label div
    .attr("class", "infolabel")
    .attr("id", data.id+"label") //for styling label
    .html(labelAttribute) //add text
    .append("div") //add child div for feature name
    .attr("class", "labelname") //for styling name
    .html(labelName); //add feature name to label

  d3.select("#"+data.id+"label").remove(); //remove info label
function moveLabel() {

  //horizontal label coordinate based mouse position stored in d3.event
 // var x = d3.event.clientX < window.innerWidth - 245 ? d3.event.clientX+10 : d3.event.clientX-210; 
  //vertical label coordinate
 // var y = d3.event.clientY < window.innerHeight - 100 ? d3.event.clientY-75 : d3.event.clientY-175; 
  
  d3.select(".infolabel") //select the label div for moving
    .style("margin-left", "6px") //reposition label horizontal
    .style("margin-top", "6px"); //reposition label vertical
};


function brusher(data){
  var max = d3.max(data, function(d) {return d.total_waste}),
  min = d3.min(data, function(d) {return d.total_waste})
  var margin = {top: 10, bottom: 10, left: 10, right: 10},
      width = (screen.width)/3
      height = 100,
      duration = 500,
      formatNumber = d3.format(',d'),
      brush = d3.svg.brush();

  margin.left = formatNumber(d3.max(data, function(d) {return d.total_waste})).length * 20;
  var w = width - margin.left - margin.right,
      h = height - margin.top - margin.bottom;

  var x = d3.scale.ordinal()
              .rangeRoundBands([0, w], .01),
      y = d3.scale.log()
              .range([h, 0]);

  y.domain([min, max]);
  x.domain(data.map(function(d) { return d.name; }));


  var xAxis = d3.svg.axis()
                .scale(x)
                .orient('bottom'),
      yAxis = d3.svg.axis()
                .scale(y)
                .orient('left'),
      brush = d3.svg.brush()
                      .x(x)
                      .on('brushstart', brushstart)
                      .on('brush', brushmove)
                      .on('brushend', brushend);

  var Bsvg = d3.select('#chart').selectAll('svg').data([data]),
      svgEnter = Bsvg.enter().append('svg')
                              .append('g')
                                .attr('width', w)
                                .attr('height', h)
                                //.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
                                .classed('chart', true),
      chart = d3.select('.chart');

  svgEnter.append('g')
            .classed('x axis', true)
            .attr('transform', 'translate(' + 0 + ',' + h + ')')
  svgEnter.append('g')
            .classed('y axis', true)
  svgEnter.append('g').classed('barGroup', true);
  chart.selectAll('.brush').remove();
  chart.selectAll('.selected').classed('selected', false);
  chart.append('g')
            .classed('brush', true)
            .call(brush)
          .selectAll('rect')
            .attr('height', h);

  bars = chart.select('.barGroup').selectAll('.bar').data(data);

  bars.enter()
        .append('rect')
          .sort(function(a, b){console.log(a.total_waste); return a.total_waste - b.total_waste})
          .classed('bar', true)
          .attr('x', w) // start here for object constancy
          .attr('width', x.rangeBand())
          .attr('y', function(d, i) { return y(d.total_waste); })
          .attr('height', function(d, i) { return h - y(d.total_waste); })
          .attr("class", function(d){
            return "bar " + d.id;
          })
          .on("mouseover", highlight)
          .on("mouseout", dehighlight)
          .on("mousemove", moveLabel);

  bars.transition()
        .duration(duration)
          .attr('width', x.rangeBand())
          .attr('x', function(d, i) { return x(d.name); })
          .attr('y', function(d, i) { return y(d.total_waste); })
          .attr('height', function(d, i) { return h - y(d.total_waste); });


  chart.select('.x.axis')
        .transition()
            .duration(duration)
              .call(xAxis);
  chart.select('.y.axis')
        .transition()
            .duration(duration)
              .call(yAxis);

  function brushstart() {
    chart.classed("selecting", true);
  }

  function brushmove() {
    var extent = d3.event.target.extent();
    bars.classed("selected", function(d) { return extent[0] <= x(d.total_waste) && x(d.total_waste) + x.rangeBand() <= extent[1];});

    }
  function brushend() {
    chart.classed("selecting", !d3.event.target.empty());
    var extent = d3.event.target.extent();
    var filtered = data.filter(function(d) {
        return (x(d.total_waste) > extent[0] && x(d.total_waste) < extent[1])
      })
    console.log(filtered);
    var filterExit =[];
    for (var i=0; i<filtered.length; i++) {
      filterExit.push(filtered[i]["id"]);
    }
    var circle = d3.selectAll("circle")
    circle.remove();
    importers(filtered);

  }

};



//http://bl.ocks.org/mbostock/3886208
//figuring out that bar chart...
function barChart(){
var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 500,
    height = 100;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .rangeRound([height, 0]);

var color = d3.scale.ordinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(d3.format(".2s"));

var x1 = 400, y1 = 400;

var Csvg = d3.select(".barWrap").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
//    .attr("transform", "translate(" + x1 + "," + y1 + ")")


  var typedump=[];
  for (var i =0; i<typeSum.length; i++){
      var barWidth = (typeSum[i]["values"]["total_waste"]/sum)*width //set width ratio
      if (i>=1){
        var prevBarWidth = d3.sum(typedump, function(d) {return d.barWidth})
      }
      else {
        var prevBarWidth = 0;
      }
      typedump.push({"unit": "lead", "total_waste": typeSum[i]["values"]["total_waste"], "id": typeSum[i]["key"], "barWidth": barWidth, "prevBarWidth": prevBarWidth})
    };
  console.log(typedump);

/*
  color.domain(d3.keys(typedump.type));
  typedump.forEach(function(d) {
    console.log(d)
    var y0 = 0;
    d.cat = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
    d.total = d.cat[d.cat.length - 1].y1;
  });
*/

  x.domain(typedump.map(function(d) { return d.unit; }));
  y.domain([0, d3.max(typedump, function(d) { return d.total; })]);

  Csvg.append("g")
      .attr("class", "x axis")
      .attr("y", 105)
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

/*
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Population");


  var state = svg.selectAll(".unit")
      .data(typedump)
    .enter().append("g")
      .attr("class", "g")
      .attr("transform", function(d) { return "translate(" + x(d.unit) + ",0)"; });
*/
  Csvg.selectAll("rect")
      .data(typedump)
    .enter().append("rect")
      .sort(function(a, b) { return b.barWidth - a.barWidth; })
      .attr("class", function(d){
       return d.id;
      })
      .attr("x", function(d) { return d.prevBarWidth; })
      .attr("y", 0)
      .attr("width", function(d){ return d.barWidth})
      .attr("height", height)
      .style("fill", "blue")
      //.on("mouseover", highlight)
      //.on("mouseout", dehighlight);


};




/*
  //load state map here
  var width = 500;
  var height = 500;
  var stateObject = data.properties.NAME_1;
  var svgViewer = d3.select(".viewer").append("svg")
    .attr("width", width)
    .attr("height", height);
  d3.json("data/"+stateObject+".json", function(error, state) {
    // adapted from: http://bl.ocks.org/mbostock/4707858

    var stateFeature = topojson.feature(state, state.objects[stateObject]);
    // Create a unit projection.
    projectionV = d3.geo.mercator()
        .scale(1)
        .translate([0, 0]);

    // Create a path generator.
    pathV = d3.geo.path()
        .projection(projectionV);

    // Compute the bounds of a feature of interest, then derive scale & translate.
    var b = pathV.bounds(stateFeature),
        s = .5 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
        t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

    // Update the projection to use computed scale & translate.
    projectionV
        .scale(s)
        .translate(t);
      
    svgViewer.append("path")
          .datum(stateFeature)
          .attr("class", "land")
          .attr("d", pathV);

  });

  //do work here getting counties...

  //implement county filler here
  d3.json("data/"+stateObject+"County.json", function(error, counties) {
  var countyObject = ""+stateObject+"County";
  var countyFeature = topojson.feature(counties, counties.objects[countyObject]).features;

  svgViewer.selectAll(".counties")
      .data(countyFeature)
    .enter()
      .append("g")
      .attr("class", "counties")
      .append("path")
      .attr("class", function(d) { return d.properties.COUNTYFP })
      .attr("d", pathV)
      .attr("fill", function(d) { return parseFloat(countydump[0][0]) == parseFloat(d.properties.COUNTYFP) ? "#ccc" : "#fff"}); // may need to do loop here if countydump > 1, if there are more than one counties in a state importing...
  });*/