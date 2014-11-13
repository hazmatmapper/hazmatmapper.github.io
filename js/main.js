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
  });
  var sum = d3.sum(data, function(d) { return d.totalQuantityinShipment; }); // sums quantity of waste in shipment for entire set
  console.log(sum);
  var nested_data = d3.nest() //d3.nest allows us to sum only parts of a column of data, in this case, sum total waste by state, creating a new array called netsted_data to do so. code adapted from: http://bl.ocks.org/phoebebright/raw/3176159/
  .key(function(d) { return d.receivingStateCode; }) // set state code as key
  .rollup(function(leaves) { return {"total_waste": d3.sum(leaves, function(d) {return d.totalQuantityinShipment;})} }) // sum by state code
  .entries(data);
  console.log(nested_data[1]["key"]);
  delete nested_data[10]["key"]; //removes "" key for the waste that had no state listed - will need to rework to make flexible to any kind of waste
  console.log(nested_data[1]["values"]["total_waste"]);
  for (var i=0; i<nested_data.length-1; i++) {
       valueById[nested_data[i]["key"]] = nested_data[i]["values"]["total_waste"];
        
};

});

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
            + "scale(" + .1/Math.sqrt(valueById[d.id] || 0) + ")"
            + "translate(" + -x + "," + -y + ")";
      })
      .style("stroke-width", function(d) {
        return .1/Math.sqrt(valueById[d.id] || .01)
      })
      .on("mouseover", highlight)
      .on("mouseout", dehighlight)
      .on("click", viewer);
});

function highlight(data){
  console.log(data.id);
  //json or csv properties
  d3.selectAll("."+data.id) //select the current province in the DOM
    .style({"stroke": "#ffff00", "stroke-width": "5px"}); //set the enumeration unit fill to black
};
function dehighlight(data){
  
  //json or csv properties
  var subb = d3.selectAll("."+data.id); //designate selector variable for brevity
  //var fillcolor = subb.select("desc").text(); //access original color from desc
  subb.style({"stroke": "#000", "stroke-width": "0px"}); //reset enumeration unit to orginal color
  };
function viewer(data){
  //launch info panel
  alert("hello world");
};
};