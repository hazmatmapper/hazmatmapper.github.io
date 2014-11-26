//global variables

var latlongs;
var svg;
var projection;
var projectionV;
var pathV;
var latlongsR;
var valueById;
var latlongRdump = [];
var facilitySum;
var exporterSum;
var typeSum;
var sum;
var bigNest;
var latlongReset;
var Isvg;

//begin script when window loads 
window.onload = initialize(); 

//the first function called once the html is loaded 
function initialize(){
  d3.select("body")
    .append("div")
    .classed("viewer", true)
    .style("display", "inline-block");
  d3.select(".viewer")
    .append("div")
    .attr("class", "viewerText")
    .style({"background-color": "#555", "color": "white", "font-size": "24px"})
    .text("Welcome to the HazMatMapper");
  d3.select("body")
    .append("div")
    .attr("class", "barWrap");
  d3.select("body")
    .append("div")
    .text("Filter by:")
    .attr("class", "filterSelector");
  d3.select(".filterSelector")
    .append("div")
    .text("Site")
    .attr("class", "bySite")
    .on("click", function(){
      Isvg.remove();
      icicle(bigNest)
    });
  d3.select(".filterSelector")
    .append("div")
    .text("Disposal")
    .attr("class", "byDisposal")
    .on("click", function(){
      Isvg.remove();
      icicle(bigNest2)
    });
  setData(); 
  
}; 

function setData(){
valueById = new Array (50); 
for (var i = 0; i < 50; i++) valueById[i] = 0;

d3.csv("data/leadTest.csv", function(data) {
  data.forEach(function(d){
    d.totalQuantityinShipment = +d.totalQuantityinShipment // convert the quantity of waste from string to number
    d.exporterLAT = +d.exporterLAT
    d.exporterLONG = +d.exporterLONG 
    d.receivingLat = +d.receivingLat
    d.receivingLong = +d.receivingLong
    d.hazWasteDesc.indexOf("LEAD") > -1 ? d.hazWasteDesc = "lead" : d.hazWasteDesc = d.hazWasteDesc; //convert everything with lead to lead in waste description; // this is where we can do work creating waste categories...
  });

  sum = d3.sum(data, function(d) { return d.totalQuantityinShipment; }); // sums quantity of waste in shipment for entire set
  var nested_data = d3.nest() //d3.nest allows us to sum only parts of a column of data, in this case, sum total waste by state, creating a new array called netsted_data to do so. code adapted from: http://bl.ocks.org/phoebebright/raw/3176159/
  .key(function(d) { return d.receivingStateCode; }) // set state code as key
  .rollup(function(leaves) { return {"total_waste": d3.sum(leaves, function(d) {return d.totalQuantityinShipment;})} }) // sum by state code
  .entries(data);
  delete nested_data[10]["key"]; //removes "" key for the waste that had no state listed - will need to rework to make flexible to any kind of waste
  for (var i=0; i<nested_data.length-1; i++) {
       valueById[nested_data[i]["key"]] = nested_data[i]["values"]["total_waste"];
      };

  bigNest = d3.nest()
  .key(function(d) { return d.ReceivingFacilityEPAIDNumber; })
  .key(function(d) { return d.hazWasteDesc; })
  .key(function(d) { return d.ExpectedManagementMethod; })
  .rollup(function(leaves) { return d3.sum(leaves, function(d) {return d.totalQuantityinShipment;})})
  .entries(data);
  bigNest={"key": "total", "values": bigNest};

  bigNest2 = d3.nest()  
  .key(function(d) { return d.ExpectedManagementMethod; })
  .key(function(d) { return d.hazWasteDesc; })
  .key(function(d) { return d.ReceivingFacilityEPAIDNumber; })
  .rollup(function(leaves) { return d3.sum(leaves, function(d) {return d.totalQuantityinShipment;})})
  .entries(data);
  bigNest2={"key": "total", "values": bigNest2};

  renameStuff(bigNest);
  renameStuff(bigNest2);
  function renameStuff(d) {
    d.name = d.key; delete d.key;
    if (typeof d.values === "number") d.size = d.values;
    else d.values.forEach(renameStuff), d.children = d.values;
    delete d.values;
  }
  
  typeSum = d3.nest()
  .key(function(d) { return d.hazWasteDesc; }) // set type as key
  .rollup(function(leaves) { return {"total_waste": d3.sum(leaves, function(d) {return d.totalQuantityinShipment;})} }) // sum by receiving facility code
  .entries(data);
  console.log(typeSum);

  facilitySum = d3.nest()
  .key(function(d) { return d.ReceivingFacilityEPAIDNumber; }) // set state code as key
  .rollup(function(leaves) { return {"total_waste": d3.sum(leaves, function(d) {return d.totalQuantityinShipment;})} }) // sum by receiving facility code
  .entries(data);

  exporterSum = d3.nest()
  .key(function(d) {return d.exporterLONG;})
  .rollup(function(leaves) { return {"total_waste": d3.sum(leaves, function(d) {return d.totalQuantityinShipment;})} }) // sum by state code
  .entries(data);
  console.log(exporterSum);

  latlongs = d3.nest() //rollup unique exportlatlongs
  .key(function(d) {return d.receivingStateCode;})
  .key(function(d) {return d.exporterLONG;})
  .entries(data);

  latlongsR = d3.nest() //rollup unique receivinglatlongs by state
  .key(function(d) { return d.ReceivingFacilityEPAIDNumber; }) // set state code as key
  .key(function(d) {return d.receivingLong;})
  .entries(data);

  icicle(bigNest);
  //barChart();
  setMap(data);
  

});
}

function icicle(data){

var width =  .66 * Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
var height = .3 * Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([0, height]);

var color = d3.scale.category20();

Isvg = d3.select(".barWrap").append("svg")
    .attr("width", width)
    .attr("height", height);

var partition = d3.layout.partition()
    //.size([width, height])
    .value(function(d) { return d.size; });

//d3.json("/js/thing.json", function(error, root) {
//  var nodes = partition.nodes(root);
var nodes = partition.nodes(data);

var rect = Isvg.selectAll("rect")
    .data(nodes)
  .enter().append("rect")
    //.attr("class", "node")
    .attr ("class",  function(d) { return d.name; } ) //change so that class = name + parent name
    .attr("x", function(d) { return x(d.x); })
    .attr("y", function(d) { return y(d.y); })
    .attr("width", function(d) { return x(d.dx); })
    .attr("height", function(d) { return y(d.dy); })
    .style("fill", function(d) { return color((d.children ? d : d.parent).name); })
    .on("mouseover", icicleHighlight)
    .on("mouseout", icicleDehighlight)
    .on('click', function(d){
      clicked(d);
      icicleImporters(d);
    });
    //.on('click', icicleImporters);
    //call node highlighter here
    //call node clicker here

Isvg.selectAll(".label")
      .data(nodes.filter(function(d) { console.log(x(d.dx)); return x(d.dx) > 50; }))
    .enter().append("text")
      .attr("class", "label")
      .attr("dy", ".35em")
      .attr("transform", function(d) { return "translate(" + x((d.x + d.dx / 2)) + "," + y((d.y + d.dy / 2)) + ")rotate(0)"; })
      .text(function(d) { return d.name; });

function clicked(d) {
  x.domain([d.x, d.x + d.dx]);
  y.domain([d.y, 1]).range([d.y ? 20 : 0, height]);

  rect.transition()
      .duration(750)
      .attr("x", function(d) { return x(d.x); })
      .attr("y", function(d) { return y(d.y); })
      .attr("width", function(d) { console.log(x(d.x + d.dx) - x(d.x)); return x(d.x + d.dx) - x(d.x); })
      .attr("height", function(d) { return y(d.y + d.dy) - y(d.y); });
}
}

function icicleHighlight(data){
  console.log(data);
  d3.selectAll("."+data.name) //select the current id
    .style({"stroke": "black", "stroke-width": "5px"}); //yellow outline
  if (data.parent.parent.parent) {
    d3.selectAll("."+data.parent.parent.parent.name).style({"stroke": "black", "stroke-width": "1px"})
    d3.selectAll("."+data.parent.parent.name).style({"stroke": "black", "stroke-width": "1px"})
    d3.selectAll("."+data.parent.name).style({"stroke": "black", "stroke-width": "1px"})
    d3.selectAll("."+data.name).style({"stroke": "black", "stroke-width": "1px"})
    }
  else if (data.parent.parent) {
    d3.selectAll("."+data.parent.parent.name).style({"stroke": "black", "stroke-width": "1px"})
    d3.selectAll("."+data.parent.name).style({"stroke": "black", "stroke-width": "1px"})
    d3.selectAll("."+data.name).style({"stroke": "black", "stroke-width": "1px"})
  }
  else if (data.parent) {
    d3.selectAll("."+data.parent.name).style({"stroke": "black", "stroke-width": "1px"})
    d3.selectAll("."+data.name).style({"stroke": "black", "stroke-width": "1px"})
  }
  else if (data.name) {
    d3.selectAll("."+data.name).style({"stroke": "black", "stroke-width": "1px"})
  }
}; 

function icicleDehighlight(data){
  d3.selectAll("."+data.name) //designate selector variable for brevity
    .style({"stroke": "#000", "stroke-width": "0px"}); //reset enumeration unit to orginal color
  d3.selectAll("."+data.parent.name) //select the current id
    .style({"stroke": "#000", "stroke-width": "0px"});
   d3.selectAll("."+data.parent.parent.name) //select the current id
    .style({"stroke": "#000", "stroke-width": "0px"});
   d3.selectAll("."+data.parent.parent.parent.name) //select the current id
    .style({"stroke": "#000", "stroke-width": "0px"});

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

function setMap(data) {
var width = .66 * Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
var height = .66 * Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

projection = d3.geo.albers();
var path = d3.geo.path()
  .projection(projection);


queue()
  .defer(d3.json, "data/us.json")
  .defer(d3.json, "data/can.json")
  .defer(d3.json, "data/mex.json")
  .defer(d3.json, "data/lakes.json")
  .await(callback);

function callback(error, us, can, mex, lakes){
  var us = svg.append("path")
    .datum(topojson.feature(us, us.objects.usa))
    .attr("class", "land")
    .attr("d", path);

  var can = svg.append("path")
    .datum(topojson.feature(can, can.objects.can))
    .attr("class", "land")
    .attr("d", path);

  var mex = svg.append("path")
    .datum(topojson.feature(mex, mex.objects.mex))
    .attr("class", "land")
    .attr("d", path);

  var lakes =  svg.append("path")
    .datum(topojson.feature(lakes, lakes.objects.lakes))
    .attr("class", "land")
    .attr("d", path);

    //call data crunch instead
  dataCrunch();

  };
};

function dataCrunch(data){
  //get facility data ready to project
 for (var i=0; i<latlongsR.length-1; i++) {
    for (var j=0; j<latlongsR[i]["values"].length; j++) {
      if( parseFloat(latlongsR[i]["values"][j]["key"]) != 0) {
          latlongRdump.push({"long": latlongsR[i]["values"][j]["values"][0]["receivingLong"], "lat": latlongsR[i]["values"][j]["values"][0]["receivingLat"], "id": latlongsR[i]["values"][j]["values"][0]["ReceivingFacilityEPAIDNumber"], "name": latlongsR[i]["values"][j]["values"][0]["ReceivingFacilityName"]})
      };     
    };
  };

for (var i =0; i<facilitySum.length-1; i++){
  for (var j=0; j<latlongRdump.length; j++){
    if (facilitySum[i]["key"] == latlongRdump[j].id){
      latlongRdump[j].total_waste = facilitySum[i]["values"]["total_waste"]
    };
  }; 
};

latlongReset = latlongRdump;
importers(latlongRdump);
}

function icicleImporters(data){
  for (var j=0; j<latlongRdump.length; j++){
    if (data.name == latlongRdump[j].id){
      latlongRdump = latlongRdump.slice([j], [j+1])
    };
  };
  if (data.name == "total") {
      latlongRdump = latlongReset;
  };

  var circle = d3.selectAll("circle") //reset map
    circle.remove();
  importers(latlongRdump); //project filtered lat/longs
};

function importers(data){
  var max = d3.max(latlongReset, function(d) {return d.total_waste}),
  min = d3.min(latlongReset, function(d) {return d.total_waste})
  var radius = d3.scale.log()
    .domain([min, max])
    .range([10, 30]);
  

  svg.selectAll(".facility")
    .data(data)
    .enter().append("circle", ".facility")
    .attr("class", function(d) {return d.id})
    .style({"fill": "yellow", "fill-opacity": ".75"})
    .attr("r", function(d) { return radius(d.total_waste); })
    .attr("cx", function(d) { return projection([d.long, d.lat])[0]; }) 
    .attr("cy", function(d) { return projection([d.long, d.lat])[1]; })
    .on("mouseover", highlight)
    .on("mouseout", dehighlight)
    .on("mousemove", moveLabel)
    .on("click", viewer);
    /*.append("desc") //append the current color
          .text(function(d) {
            return choropleth(d, colorize);
          });*/
      //scaling algorithm
      /*.attr("transform", function(d) {
        var centroid = path.centroid(d),
            x = centroid[0],
            y = centroid[1];
        return "translate(" + x + "," + y + ")"
            + "scale(" + 100/Math.sqrt(valueById[d.properties.ID_1] || 0) + ")" //need to work on the proper scaling, esp. how to make scaling flexible to other toxics
            + "translate(" + -x + "," + -y + ")";
      })*/

      //color by attribute algorithm
      //.attr("fill", function(d) {return (valueById[d.properties.ID_1] > 0 ? "#ccc" : "#fff")}) // if state is one actually importing, fill it gray. if not, white
     
      //stroke-width by attribute algorithm
      /*.style("stroke-width", function(d) {
        return .1/Math.sqrt(valueById[d.properties.ID_1] || .01)
      })*/
  //brusher(latlongRdump);

};

function highlight(data){
  d3.selectAll("."+data.id) //select the current province in the DOM
    .style({"stroke": "black", "stroke-width": "5px"}); //yellow outline

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

};

function dehighlight(data){
  //json or csv properties
  var subb = d3.selectAll("."+data.id); //designate selector variable for brevity
  //var fillcolor = subb.select("desc").text(); //access original color from desc
  subb.style({"stroke": "#000", "stroke-width": "0px"}); //reset enumeration unit to orginal color

  d3.select("#"+data.id+"label").remove(); //remove info label

  };

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


function viewer(data){
   //implement function that will place locations of waste exporters on map
  //remove all other importers
  var self = this;
  var circles = d3.selectAll('svg circle');
    // All other elements resize randomly.
    circles.filter(function (x) { return self != this; })
        .transition()
        .remove();
  d3.selectAll(".pin").remove();

  //begin constructing latlongs of exporters
  var latlongdump = [];
  //var countydump = [];
   for (var i=0; i<latlongs.length-1; i++) {
    for (var j=0; j<latlongs[i]["values"].length; j++) {
      if (latlongs[i]["values"][j]["values"][0]["receivingLong"] == data.long) {
        console.log(latlongs[i]["values"][j]["values"][0]);
        latlongdump.push({"long": latlongs[i]["values"][j]["values"][0]["exporterLONG"], "lat": latlongs[i]["values"][j]["values"][0]["exporterLAT"], "name": latlongs[i]["values"][j]["values"][0]["Foreign Exporter Name"], "id": latlongs[i]["values"][j]["values"][0]["Foreign Exporter Name"]}) //lat longs of the foreign waste sites
        };     
      };
    };

  for (var i =0; i<exporterSum.length-1; i++){
    for (var j=0; j<latlongdump.length; j++){
      if (exporterSum[i]["key"] == latlongdump[j].long){
        latlongdump[j].total_waste = exporterSum[i]["values"]["total_waste"]
      };
    }; 
  };

  //scale exporter symbolization
  var max = d3.max(latlongdump, function(d) {return d.total_waste}),
  min = d3.min(latlongdump, function(d) {return d.total_waste})
  var radius = d3.scale.log()
    .domain([min, max])
    .range([10, 30]);

//add exporters to the map    
svg.selectAll(".pin")
  .data(latlongdump)
  .enter().append("circle", ".pin")
  .attr("r", function(d) { return radius(d.total_waste); })
  //.attr("class", "pin")
  .attr("class", function (d) { return d.id})
  .style({"fill": "green", "fill-opacity": ".75"})
  .attr("cx", function(d) {return projection([d.long, d.lat])[0]; }) 
  .attr("cy", function(d) { return projection([d.long, d.lat])[1]; })
  .on("mouseover", highlight)
  .on("mouseout", dehighlight)
  .on("mousemove", moveLabel)
  .on("click", exportViewer);
  
  //implement clickoff div - this creates a div that will do two things: 1) make the map more opaque, emphasizing the new info panel; 2) provide a clickable space so that when people click away from the info panel back to the map, the info panel closes
  d3.select("body")
    .append("div")
    .text("X")
    .attr("class", "clickoff")
    .style({"background-color": "#d3d3d3"}) //need to adjust size, color, opacity of div
    .on("click", function(){
      d3.selectAll("circle").remove()
      d3.selectAll(".viewer")
        .transition()
          .duration(0)
        .style({"height": "0%", "width": "0%"})
      d3.selectAll(".viewerText").remove()
      d3.selectAll(".clickoff").remove()
      importers(latlongReset); //removes itself so that the map can be clicked again
    });

  //implement the info panel/viewer here
  d3.selectAll(".viewerText").remove()
  d3.selectAll(".viewer")
    .style({"height": "0%", "width": "0%"})
  d3.selectAll(".viewer")
    .transition()
      .duration(1000)
        .style({"height": "50%", "width": "25%"})
          .each("end", function(d){ 
              d3.selectAll(".viewer").append("div").attr("class", "viewerText");
              d3.selectAll(".viewerText").text("this is: "+data.name+", which imports "+data.total_waste+" tons of lead");
            });
  /*d3.selectAll(".viewer")
    .append("div")
    .attr("class", "viewerText");*/
 




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
};

function exportViewer(data){
d3.selectAll(".clickoff").remove()
d3.select("body")
    .append("div")
    .text("X")
    .attr("class", "clickoff")
    .style({"background-color": "#d3d3d3"}) //need to adjust size, color, opacity of div
    .on("click", function(){
      d3.selectAll("circle").remove()
      d3.selectAll(".viewer")
        .transition()
          .duration(0)
            .style({"height": "0%", "width": "0%"})
              .each("start", function(){ d3.selectAll(".viewerText").remove()});
      d3.selectAll(".clickoff").remove()
      importers(latlongReset); //removes itself so that the map can be clicked again
    });

  //implement the info panel/viewer here

  d3.selectAll(".viewerText").remove()
  d3.selectAll(".viewer")
    .style({"height": "0%", "width": "0%"})
   d3.selectAll(".viewer")
    .transition()
      .duration(1000)
        .style({"height": "50%", "width": "25%"})
          .each("end", function(){ 
              d3.selectAll(".viewer").append("div").attr("class", "viewerText");
              d3.selectAll(".viewerText").text("this is: "+data.name+", which exports "+data.total_waste+" tons of lead");
            });
};