//global variables

var latlongs;
var svg;
var projection;
var projectionV;
var pathV;
var latlongsR;
var valueById;
var latlongRdump = [];

//begin script when window loads 
window.onload = initialize(); 

//the first function called once the html is loaded 
function initialize(){
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
  });

  var sum = d3.sum(data, function(d) { return d.totalQuantityinShipment; }); // sums quantity of waste in shipment for entire set
  var nested_data = d3.nest() //d3.nest allows us to sum only parts of a column of data, in this case, sum total waste by state, creating a new array called netsted_data to do so. code adapted from: http://bl.ocks.org/phoebebright/raw/3176159/
  .key(function(d) { return d.receivingStateCode; }) // set state code as key
  .rollup(function(leaves) { return {"total_waste": d3.sum(leaves, function(d) {return d.totalQuantityinShipment;})} }) // sum by state code
  .entries(data);
  delete nested_data[10]["key"]; //removes "" key for the waste that had no state listed - will need to rework to make flexible to any kind of waste
  for (var i=0; i<nested_data.length-1; i++) {
       valueById[nested_data[i]["key"]] = nested_data[i]["values"]["total_waste"];
      };
  
  latlongs = d3.nest() //rollup unique exportlatlongs
  .key(function(d) {return d.receivingStateCode;})
  .key(function(d) {return d.exporterLONG;})
  .entries(data);

  latlongsR = d3.nest() //rollup unique receivinglatlongs by state
  .key(function(d) {return d.receivingStateCode;})
  .key(function(d) {return d.receivingLong;})
  .entries(data);

  setMap(data);

});
}

function setMap(data) {
console.log(latlongsR);

//get facility data ready to project

 for (var i=0; i<latlongsR.length-1; i++) {
    for (var j=0; j<latlongsR[i]["values"].length; j++) {
      if( parseFloat(latlongsR[i]["values"][j]["key"]) != 0) {
          latlongRdump.push({"long": latlongsR[i]["values"][j]["values"][0]["receivingLong"], "lat": latlongsR[i]["values"][j]["values"][0]["receivingLat"], "id": latlongsR[i]["values"][j]["values"][0]["ReceivingFacilityEPAIDNumber"], "name": latlongsR[i]["values"][j]["values"][0]["ReceivingFacilityName"]}) //lat longs of the foreign waste sites
      };     
    };
  };

svg = d3.select("body").append("svg")
    .attr("width", 960)
    .attr("height", 500);

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

  importers();

  };
};

function importers(data){
  svg.selectAll(".facility")
    .data(latlongRdump)
    .enter().append("circle", ".facility")
    .attr("r", 15) //scale size here for proportional symboling
    .attr("class", function(d) {console.log(d.id); return d.id})
    .style("fill", "yellow")
    .attr("cx", function(d) {console.log(d.long); return projection([d.long, d.lat])[0]; }) 
    .attr("cy", function(d) { return projection([d.long, d.lat])[1]; })
    .on("mouseover", highlight)
    .on("mouseout", dehighlight)
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
};

function highlight(data){
  d3.selectAll("."+data.id) //select the current province in the DOM
    .style({"stroke": "black", "stroke-width": "5px"}); //yellow outline
};

function dehighlight(data){
  //json or csv properties
  var subb = d3.selectAll("."+data.id); //designate selector variable for brevity
  //var fillcolor = subb.select("desc").text(); //access original color from desc
  subb.style({"stroke": "#000", "stroke-width": "0px"}); //reset enumeration unit to orginal color
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
  var latlongdump = [];
  //var countydump = [];
   for (var i=0; i<latlongs.length-1; i++) {
    for (var j=0; j<latlongs[i]["values"].length; j++) {
      if (latlongs[i]["values"][j]["values"][0]["receivingLong"] == data.long) {
        latlongdump.push([latlongs[i]["values"][j]["values"][0]["exporterLONG"], latlongs[i]["values"][j]["values"][0]["exporterLAT"]]) //lat longs of the foreign waste sites
        };     
      };
    };

svg.selectAll(".pin")
  .data(latlongdump)
  .enter().append("circle", ".pin")
  .attr("r", 15)
  .attr("class", "pin")
  .style("fill", "green")
  .attr("cx", function(d) { return projection(d)[0]; }) 
  .attr("cy", function(d) { return projection(d)[1]; });
  
  //implement clickoff div - this creates a div that will do two things: 1) make the map more opaque, emphasizing the new info panel; 2) provide a clickable space so that when people click away from the info panel back to the map, the info panel closes
  d3.select("body")
    .append("div")
    .attr("class", "clickoff")
    .style({"background-color": "#d3d3d3", "opacity": ".1"}) //need to adjust size, color, opacity of div
    .on("click", function(){
      d3.selectAll(".pin").remove()
      d3.selectAll(".viewer").remove()
      d3.select(data.id).remove()
      d3.selectAll(".clickoff").remove()
      importers(); //removes itself so that the map can be clicked again
    });

  //implement the info panel/viewer here

  d3.selectAll(".viewer").remove();
  d3.select("body")
    .append("div")
    .attr("class", "viewer")
    .text("this is: "+data.name+", which imports X tons of lead");

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
  });


};