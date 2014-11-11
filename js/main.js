//begin script when window loads 
window.onload = initialize(); 

//the first function called once the html is loaded 

function initialize(){
  setMap(); 
  
}; 

function setMap() {
var valueById = []; 

d3.csv("data/leadTest.csv", function(data) {
  data.forEach(function(d){
    d.totalQuantityinShipment = +d.totalQuantityinShipment // convert "Length" column to number
  });
  console.log(data);
  var sum = d3.sum(data.totalQuantityinShipment, function(d) { return d.value; });
  console.log(sum);
}
);
// load lead values by state id
//sum lead values by state id
/*function() {
console.log(data.receivingStateCode);
var sum = d3.sum(data.receivingStateCode["1"], function(d) { return d.value; });
console.log(sum);
}*/


var path = d3.geo.path();

var svg = d3.select("body").append("svg")
    .attr("width", 960)
    .attr("height", 500);

d3.json("data/us.json", function(error, us) {
  svg.append("path")
      .datum(topojson.feature(us, us.objects.land))
      .attr("class", "land")
      .attr("d", path);

  svg.selectAll(".state")
      .data(topojson.feature(us, us.objects.states).features)
    .enter().append("path")
      .attr("class", "state")
      .attr("d", path)
      .attr("transform", function(d) {
        var centroid = path.centroid(d),
            x = centroid[0],
            y = centroid[1];
        return "translate(" + x + "," + y + ")"
            + "scale(" + Math.sqrt(valueById[d.id] * 5 || 0) + ")"
            + "translate(" + -x + "," + -y + ")";
      })
      .style("stroke-width", function(d) {
        return 1 / Math.sqrt(valueById[d.id] * 5 || 1);
      });
});
};