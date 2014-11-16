//global variables

var latlongs;
var svg;
var projection;
//begin script when window loads 
window.onload = initialize(); 

//the first function called once the html is loaded 
function initialize(){
  setMap(); 
  
}; 

function setMap() {
var valueById = new Array (50); 
for (var i = 0; i < 50; i++) valueById[i] = 0;

d3.csv("data/leadTest.csv", function(data) {
  data.forEach(function(d){
    d.totalQuantityinShipment = +d.totalQuantityinShipment // convert the quantity of waste from string to number
    d.exporterLAT = +d.exporterLAT
    d.exporterLONG = +d.exporterLONG 
  });
  console.log(data);
 // var sum = d3.sum(data, function(d) { return d.totalQuantityinShipment; }); // sums quantity of waste in shipment for entire set
  var nested_data = d3.nest() //d3.nest allows us to sum only parts of a column of data, in this case, sum total waste by state, creating a new array called netsted_data to do so. code adapted from: http://bl.ocks.org/phoebebright/raw/3176159/
  .key(function(d) { return d.receivingStateCode; }) // set state code as key
  .rollup(function(leaves) { return {"total_waste": d3.sum(leaves, function(d) {return d.totalQuantityinShipment;})} }) // sum by state code
  .entries(data);
  delete nested_data[10]["key"]; //removes "" key for the waste that had no state listed - will need to rework to make flexible to any kind of waste
  for (var i=0; i<nested_data.length-1; i++) {
       valueById[nested_data[i]["key"]] = nested_data[i]["values"]["total_waste"];
        
};
  
    latlongs = d3.nest()
    .key(function(d) {return d.receivingStateCode;})
    .key(function(d) {return d.exporterLONG;})
    .entries(data);
});

projection = d3.geo.albers();
var path = d3.geo.path()
  .projection(projection);


svg = d3.select("body").append("svg")
    .attr("width", 960)
    .attr("height", 500);

//

d3.json("data/can.json", function(error, can) {
  svg.append("path")
      .datum(topojson.feature(can, can.objects.can))
      .attr("class", "land")
      .attr("d", path);
});

d3.json("data/mex.json", function(error, mex) {
  svg.append("path")
      .datum(topojson.feature(mex, mex.objects.mex))
      .attr("class", "land")
      .attr("d", path);
});



d3.json("data/us.json", function(error, us) {

  svg.selectAll(".state")
      .data(topojson.feature(us, us.objects.usa).features)
    .enter()
      .append("g")
      .attr("class", "state")
      .append("path")
      .attr("class", function(d) { return d.properties.stateID })
      .attr("d", path)

      /*.attr("transform", function(d) {
        var centroid = path.centroid(d),
            x = centroid[0],
            y = centroid[1];
        return "translate(" + x + "," + y + ")"
            + "scale(" + 100/Math.sqrt(valueById[d.properties.ID_1] || 0) + ")" //need to work on the proper scaling, esp. how to make scaling flexible to other toxics
            + "translate(" + -x + "," + -y + ")";
      })*/
      .attr("fill", function(d) {return (valueById[d.properties.ID_1] > 0 ? "#ccc" : "#fff")}) // if state is one actually importing, fill it gray. if not, white
      /*.style("stroke-width", function(d) {
        return .1/Math.sqrt(valueById[d.properties.ID_1] || .01)
      })*/

      .on("mouseover", highlight)
      .on("mouseout", dehighlight)
      .on("click", viewer);

  lakes();
});

//load great lakes last so that they overlay canada and us
function lakes(){
  d3.json("data/lakes.json", function(error, lakes) {
  svg.append("path")
      .datum(topojson.feature(lakes, lakes.objects.lakes))
      .attr("class", "land")
      .attr("d", path);
});
}

function highlight(data){
  d3.selectAll("."+data.properties.stateID) //select the current province in the DOM
    .style({"stroke": "#ffff00", "stroke-width": "5px"}); //yellow outline
};

function dehighlight(data){
  //json or csv properties
  var subb = d3.selectAll("."+data.properties.stateID); //designate selector variable for brevity
  //var fillcolor = subb.select("desc").text(); //access original color from desc
  subb.style({"stroke": "#000", "stroke-width": "0px"}); //reset enumeration unit to orginal color
  };

function viewer(data){

   //implement function that will place locations of waste exporters on map
  var latlongdump = [];
   for (var i=0; i<latlongs.length-1; i++) {
    if (latlongs[i]["key"] == data.properties.ID_1) {
      for (var j=0; j<latlongs[i]["values"].length; j++) {
        if( parseFloat(latlongs[i]["values"][j]["key"]) != 0) {
            latlongdump.push([latlongs[i]["values"][j]["values"][0]["exporterLONG"], latlongs[i]["values"][j]["values"][0]["exporterLAT"]])
        };     
      };
    };
  };

svg.selectAll(".pin")
  .data(latlongdump)
  .enter().append("circle", ".pin")
  .attr("r", 15)
  .attr("class", "pin")
  .style("fill", "yellow")
  .attr("cx", function(d) { return projection(d)[0]; }) 
  .attr("cy", function(d) { return projection(d)[1]; });
  
  //implement clickoff div - this creates a div that will do two things: 1) make the map more opaque, emphasizing the new info panel; 2) provide a clickable space so that when people click away from the info panel back to the map, the info panel closes
  d3.select("body")
    .append("div")
    .attr("class", "clickoff")
    .style({"background-color": "#d3d3d3", "opacity": ".75"}) //need to adjust size, color, opacity of div
    .on("click", function(){
      d3.selectAll(".pin").remove()
      d3.selectAll(".viewer").remove()
      d3.selectAll(".clickoff").remove(); //removes itself so that the map can be clicked again
    });

  //implement the info panel/viewer here
  d3.select("body")
    .append("div")
    .attr("class", "viewer")
    .text("this is: "+data.properties.NAME_1+", which imports "+valueById[data.properties.ID_1]+" tons of lead");

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
    var projectionV = d3.geo.mercator()
        .scale(1)
        .translate([0, 0]);

    // Create a path generator.
    var path = d3.geo.path()
        .projection(projectionV);

    // Compute the bounds of a feature of interest, then derive scale & translate.
    var b = path.bounds(stateFeature),
        s = .5 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
        t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

    // Update the projection to use computed scale & translate.
    projectionV
        .scale(s)
        .translate(t);
      
    svgViewer.append("path")
          .datum(stateFeature)
          .attr("class", "land")
          .attr("d", path);

  


  });



};
};