//global variables

var latlongs;
var svg;
var sum;
var projection;
var projectionV;
var pathV;
var latlongsR;
var latlongRdump = [];
var facilitySum;
var exporterSum;
var typeSum;
var bigNest;
var latlongReset;
var Isvg;
var IAsvg;
var width66;
var height33;
var Site;
var DisposalMethod;
var povertydata = [];
var colorDump;
var colorKey;
var checker = false; //detect add/remove importer/exporters
var povSVG;
var clickCheck = true; //detect whether radio button filter control was clicked
var clicker = false; //check if site was just hovered over or click for purposes of displaying exporters
var clickListen = false; //detect clicking away from site to remove exporters
var exporterInfo;
var icicleDump;
var domain;
var fullWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
var fullHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
var filterDomain;
var margin = {top: 10, right: 10, bottom: 40, left: 10};

//begin script when window loads 
window.onload = initialize(); 

//the first function called once the html is loaded 
function initialize(){
  d3.select("body")
    .append("div")
    .attr("class", "footer")
    .html("Footers")
 /* d3.select("body")
    .append("div")
    .attr('class', "greyedOut")
    .style({"background-color": "#333", "opacity": ".2"})
  d3.select("body")
    .append("div")
    .attr("class", "viewerText")
    .style({"background-color": "#555", "color": "white", "font-size": "24px"})
    .html("Welcome to the HazMatMapper <span class = 'intro'><p>This is a tool for exploring transnational flows of hazardous waste. While we typically think the US exports all of its most toxic waste to poorer countries, the US actually imports much waste from these countries and other rich countries, for disposal. Many of these are transnational corporations shifting between subsidiaries. <p> All of the sites in the US that receive waste are mapped, the size indicating the relative amount they are importing. To begin exploring, <b>hover over</b> or <b>click</b> on a site. <p> To explore in-depth, you can use the filter control to investigate how much each site imports, what types of material they import, and what they do with it. By clicking on the controls you can show only those sites importing, for instance, lead, or, for instance, only those sites performing a certain management method. At any time you can show all the importers and foreign exporters.</span>")
    .append("button").attr("class","introButton").text("Click here to begin")
    .on("click", function(){
      d3.select(".viewerText").remove()
      d3.select(".greyedOut").remove()
      setControls();
      })*/
setControls();
}
function setControls(){
  d3.select("body")
    .append("div")
    .classed("viewer", true)
    .html("<span class = 'intro'><p>This is a tool for exploring transnational flows of hazardous waste. While we typically think the US exports all of its most toxic waste to poorer countries, the US actually imports much waste from these countries and other rich countries, for disposal. Many of these are transnational corporations shifting between subsidiaries. <p> All of the sites in the US that receive waste are mapped, the size indicating the relative amount they are importing. To begin exploring, <b>hover over</b> or <b>click</b> on a site. <p> To explore in-depth, you can use the filter control to investigate how much each site imports, what types of material they import, and what they do with it. By clicking on the controls you can show only those sites importing, for instance, lead, or, for instance, only those sites performing a certain management method. At any time you can show all the importers and foreign exporters.</span>")
    //.style("display", "inline-block");
  d3.select("#showHide")
    .append("div")
    .text("Show/Hide Controls")
    .on("click", function(){
      if (clickCheck == true) {
        d3.select("#accordion")
          .style("display", "none")
        d3.select("#showHide")
          .style({"top": "95%"})
        clickCheck = false
      }
      else {
        d3.select("#accordion")
          .transition()
          .duration(750)
          .style("display", "block")
        d3.select("#showHide")
          .style({"top": "73%"})
        clickCheck = true
      }
    })

  d3.select("#accordion")
    .append("div")
    .attr("class", "barWrap");
  d3.select(".barWrap")
    .append("div")
    .text("Show on the map:")
    .attr("class", "filterSelector");

  width66 =  .75 * Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  height33 = .25 * Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  Isvg = d3.select(".barWrap").append("svg")
    .attr("width", width66)
    .attr("height", height33)
  
  IAsvg = d3.select(".barWrap").append("svg")
    .attr("width", width66/5)
    .attr("height", height33)

  //do show all exporters/importers here
  filterTypes = ["Importers", "Exporters"]
  var form = d3.select(".filterSelector").append("form"), j = 0;
  var labelEnter = form.selectAll("span")
    .data(filterTypes)
    .enter().append("span");
  labelEnter.append("input")
    .attr({
      type: "checkbox",
      class: "something",
      name: "mode",
      value: function(d, i) {return d;}
    })
    .on("change", function(){
     // add exporters and/or importers here
     var type = this.value, display = this.checked ? "on": "off";
     console.log(display);
     if (type == "Exporters"){
        exporters(latlongReset)
        checker = true;
      }
     if (type == "Exporters" && display == "off"){
        svg.selectAll("#exporter").remove();
      }
     if (type == "Importers"){
        svg.selectAll("#importer").style({"fill": "#8c8c8c", "fill-opacity": ".3"})
        checker = true;
      }
     /*if (type == "Importers" && display == "off"){
        svg.selectAll("#importer").remove();
      }*/

    });
  labelEnter.append("label").text(function(d) {return d;});

  //filter types selector
  filterTypes = ["Site", "DisposalMethod", "Type"]
    var show = d3.select(".filterSelector").append("div").html("<p>Filter by:")
  var form = d3.select(".filterSelector").append("form"), j = 0;
  var labelEnter = form.selectAll("div")
    .data(filterTypes)
    .enter().append("div")
    .attr("class", "filtering")
    .attr("id", function(d){return d})
    .on("click", function(d){
      console.log(window[this.value])
     Isvg.selectAll("rect, div, g")
        .transition()
        .duration(500)
        .style("opacity", 0)
        .remove();
    IAsvg.selectAll("g")
        .transition()
        .duration(500)
        .style("opacity", 0)
        .remove();
        //.each("end", function(){
      filterDomain = d
      icicle(window[d])
      icicleAxis();
       // });
     //svg.selectAll("#importer")
      //.style("fill", function(d) {for (var i=0; i<colorKey.length; i++) { if (colorKey[i].name == d.id) {return colorKey[i].color} }});
     
    });
  labelEnter.append("label").text(function(d) {return d;}); 
setData(); 
}

function setData(){
d3.csv("data/sites_subset_v2.csv", function(data) {
  data.forEach(function(d){
    d.totalQuantityinShipment = +d.totalQuantityinShipment // convert the quantity of waste from string to number
    d.exporterLAT = +d.exporterLAT
    d.exporterLONG = +d.exporterLONG 
    d.receivingLat = +d.latitude
    d.receivingLong = +d.longitude
    d.receivingFacilityZipCode = +d.receivingfacilityzipcode
    d.hazWasteDesc = d.hazWasteDesc
    /*d.hazWasteDesc.indexOf("LEAD") > -1 ? d.hazWasteDesc = "lead" : d.hazWasteDesc = d.hazWasteDesc; //convert everything with lead to lead in waste description; // this is where we can do work creating waste categories...
    d.hazWasteDesc.indexOf("MERCURY") > -1 ? d.hazWasteDesc = "mercury" : d.hazWasteDesc = d.hazWasteDesc;
    d.hazWasteDesc.indexOf("TOLULENE") > -1 ? d.hazWasteDesc = "toluene" : d.hazWasteDesc = d.hazWasteDesc;
    d.hazWasteDesc.indexOf("BATTER") > -1 ? d.hazWasteDesc = "batteries" : d.hazWasteDesc = d.hazWasteDesc;
    d.hazWasteDesc.indexOf("PAINT") > -1 ? d.hazWasteDesc = "paint" : d.hazWasteDesc = d.hazWasteDesc;
    d.hazWasteDesc.indexOf("CHLOROETHYLENE") > -1 ? d.hazWasteDesc = "Tri/dichloroethlene" : d.hazWasteDesc = d.hazWasteDesc;*/
  });

  sum = d3.sum(data, function(d) {return d.totalQuantityinShipment})

  Site = d3.nest()
  .key(function(d) { return d.ReceivingFacilityEPAIDNumber; })
  .key(function(d) { return d.hazWasteDesc; })
  .key(function(d) { return d.ExpectedManagementMethod; })
  .rollup(function(leaves) { return d3.sum(leaves, function(d) {return d.totalQuantityinShipment;})})
  .entries(data);
  Site={"key": "total", "values": Site};

  DisposalMethod = d3.nest()  
  .key(function(d) { return d.ExpectedManagementMethod; })
  .key(function(d) { return d.hazWasteDesc; })
  .key(function(d) { return d.ReceivingFacilityEPAIDNumber; })
  .rollup(function(leaves) { return d3.sum(leaves, function(d) {return d.totalQuantityinShipment;})})
  .entries(data);
  DisposalMethod={"key": "total", "values": DisposalMethod};

  Type = d3.nest()
  .key(function(d) { return d.hazWasteDesc; })
  .key(function(d) { return d.ExpectedManagementMethod; })
  .key(function(d) { return d.ReceivingFacilityEPAIDNumber; })
  .rollup(function(leaves) { return d3.sum(leaves, function(d) {return d.totalQuantityinShipment;})})
  .entries(data);
  Type={"key": "total", "values": Type};

  //need a sort by type solid/liquid here based on G/L vs K/P

  renameStuff(Site);
  renameStuff(DisposalMethod);
  renameStuff(Type);
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

  facilitySum = d3.nest()
  .key(function(d) { return d.ReceivingFacilityEPAIDNumber; }) // EPA ID number
  .rollup(function(leaves) { return {"total_waste": d3.sum(leaves, function(d) {return d.totalQuantityinShipment;})} }) // sum by receiving facility code
  .entries(data);

  exporterSum = d3.nest()
  .key(function(d) {return d.exporterLONG;})
  .rollup(function(leaves) { return {"total_waste": d3.sum(leaves, function(d) {return d.totalQuantityinShipment;})} }) // sum by state code
  .entries(data);

  latlongs = d3.nest() //rollup unique exportlatlongs
  .key(function(d) {return d.importer_state;}) // state code
  .key(function(d) {return d.exporterLONG;})
  .entries(data);

  latlongsR = d3.nest() //rollup unique receivinglatlongs by state
  .key(function(d) { return d.importer_state; }) //EPA ID number
  .key(function(d) {return d.receivingLong;})
  .entries(data);
  setMap(data);
  

});
}

function icicleAxis(){
  //domain calculator
var site = ["total", "sites", "type", "management method"]
var type = ["total", "type", "management method", "sites"]
var method = ["total", "management method", "type", "sites"]
if (filterDomain == undefined){
  domain = site 
} else if (filterDomain == "Site") {
  domain = site
} else if (filterDomain == "Type") {
  domain = type
} else if (filterDomain == "DisposalMethod") {
  domain = method
}
var yax  = d3.scale.ordinal()
    .domain(domain)
    .range([0, 60, 110, 160]);

var yAxis = d3.svg.axis()
    .scale(yax)
    .orient("right");
IAsvg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate("+0+","+15+")")
      .call(yAxis);
}

function icicle(data){
console.log(data)
var x = d3.scale.linear()
    .range([0, width66]);

var y = d3.scale.linear()
    .range([0, height33 - margin.bottom]);

var color = d3.scale.category10()
  //.range(["#f7fbff","#deebf7","#c6dbef","#9ecae1","#6baed6","#4292c6","#2171b5","#08519c","#08306b"]);

var partition = d3.layout.partition()
    //.size([width, height])
    .value(function(d) { return d.size; });

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) { console.log(d)
    return "<span style='color:white'>" + d.name + "</span>";
  })


//d3.json("/js/thing.json", function(error, root) {
//  var nodes = partition.nodes(root);
var nodes = partition.nodes(data);

Isvg.call(tip)
colorKey=[];

Isvg.selectAll("rects")
    .data(nodes)
  .enter().append("rect")
    .attr ("class",  function(d) { return d.name} )
    .attr("x", function(d) {  return x(d.x); })
    .attr("y", function(d) { return y(d.y); })
    .attr("width", function(d) { return x(d.dx); })
    .attr("height", function(d) { return y(d.dy); })
    .style({"cursor": "pointer", "fill": function(d) { 
      colorKey.push({"name": d.name, "color": color((d.children ? d : d.parent).name)}); 
      if (d.name == "total"){return "#8c8c8c"} else {return color((d.children ? d : d.parent).name)}; }, "stroke": "black", "stroke-width": "1px", "fill-opacity": ".5"})
    .on("mouseover", function (d) {
      tip.show(d);
      //if (d.depth === 1 && d.name[0] != "H" || d.depth === 3 && d.name[0] !="H"){
        icicleHighlight(d);
      //};  
    })
    .on("mouseout", function(d){tip.hide(d); icicleDehighlight(d)})
    .on('click', function(d){
      clicked(d);
      //icicleImporters(d);
      icicleFilter(d);
    });

//construct x axis
var xscale = d3.scale.linear()
    .range([10, width66-10]);
var xheight = height33-margin.bottom
var xAxis = d3.svg.axis()
    .scale(xscale)
    .ticks(10)
    .tickFormat(d3.format(".0%"))
    .orient("bottom");
Isvg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0,"+xheight+")")
      .call(xAxis)
    .append("text")
    //.attr("transform", "rotate(-90)")
    .attr("y", margin.bottom)
    .attr("x", width66/2)
    .style("text-anchor", "middle")
    .text("Proportion of Total Waste");

/*
Isvg.selectAll("foreignObject").data(nodes.filter(function(d) {return x(d.dx) > 50; })).enter()
     .append("foreignObject")
     .attr("x", function(d) { return x(d.x); })
     .attr("y", function(d) { return y(d.y); })
     .attr("width", function(d) { return x(d.dx); })
     .attr("height", function(d) { return y(d.dy); })
     .append("xhtml:div")
     .html(function(d) { return d.name; })
     .attr("class", "textdiv")*/
     

function clicked(d) {
  x.domain([d.x, d.x + d.dx]);
  y.domain([d.y, 1]).range([d.y ? 20 : 0, height33 - margin.bottom]);

 //create temp domain for changing axis
  //calculate range for axis based on depth
  var range;
  var display;
  if (d.depth == 0) {range = [0, 60, 110, 160]; display = domain}
  if (d.depth == 1) {range = [0, 36, 101, 156]; display = domain}
  if (d.depth == 2) {range = [0, 56, 146]; display = [domain[1], domain[2], domain[3]]}
  if (d.depth == 3) {range = [0, 116]; display = [domain[2], domain[3]]}

  var yax  = d3.scale.ordinal()
    .domain(display)
    .range(range);

  var yAxis = d3.svg.axis()
    .scale(yax)
    .orient("right");

  IAsvg.selectAll("g").transition()
      .remove()
  IAsvg.append("g").transition()
      .attr("class", "axis")
      .attr("transform", "translate("+0+","+15+")")
      .call(yAxis);

  //reconstruct x axis
var xdomain = d.value/sum
var xscale = d3.scale.linear()
    .domain([0, xdomain])
    .range([10, width66-10]);
var xheight = height33-margin.bottom
var xAxis = d3.svg.axis()
    .scale(xscale)
    .ticks(10)
    .tickFormat(d3.format(".0%"))
    .orient("bottom");

Isvg.selectAll("g").transition()
    .remove()
Isvg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0,"+xheight+")")
      .call(xAxis)
  .append("text")
    .attr("y", margin.bottom)
    .attr("x", width66/2)
    .style("text-anchor", "middle")
    .text("Proportion of Total Waste");

  Isvg.selectAll("rect").transition()
      .duration(750)
      .attr("x", function(d) { return x(d.x); })
      .attr("y", function(d) { return y(d.y); })
      .attr("width", function(d) { return x(d.x + d.dx) - x(d.x); })
      .attr("height", function(d) { return y(d.y + d.dy) - y(d.y); });

/*
  Isvg.selectAll("div").style("opacity", 0).transition().duration(750).remove()
  Isvg.selectAll("foreignObject").data(nodes.filter(function(d) {return x(d.x + d.dx) - x(d.x) > 50; })).enter()
     .append("foreignObject")
     .attr("x", function(d) { return x(d.x); })
     .attr("y", function(d) { return y(d.y); })
     .attr("width", function(d) { return x(d.x + d.dx) - x(d.x); })
     .attr("height", function(d) { return y(d.y + d.dy) - y(d.y); })
     .append("xhtml:div")
     .html(function(d) { return d.name; })
     .attr("class", "textdiv")
*/
  };
};

function icicleFilter(data){
  console.log(data)
  name = data.name
  icicleDump = [];
  if (data.depth == 0) {colorize(latlongReset, name)}
  else if (data.depth == 1){
    for (var k=0; k<data.children.length; k++){
      for (var l=0; l<data.children[k].children.length; l++){
        icicleDump.push(data.children[k].children[l])
     }
    }
    console.log(icicleDump)
    icicleImporters(icicleDump, name)
  }
  else if (data.depth == 2){
    if (data.children.length == 1){
        icicleDump=data.children[0]
        icicleImporters(icicleDump, name)
      }
    else{
    for (var k=0; k<data.children.length; k++){
        icicleDump.push(data.children[k])
      }
        icicleImporters(icicleDump, name)
  }
  }
  else if (data.depth == 3){icicleImporters(icicleDump=[data], name)}
}

function icicleHighlight(data){
  Isvg.selectAll("."+data.name) //select the current id
    .style({"fill-opacity": "1"}); //yellow outline
  if (data.name == "total"){
  svg.selectAll("#importer")
    .style({"stroke": "yellow", "stroke-width": "2px"})}
  else {
  svg.selectAll("."+data.name)
    .style({"stroke": "yellow", "stroke-width": "5px"})}
  //povSVG.selectAll("."+data.id)
   // .style({"stroke": "yellow", "stroke-width": "2px"});
  //rSVG.selectAll("."+data.id)
    //.style({"stroke": "yellow", "stroke-width": "2px"});
}; 

function icicleDehighlight(data){
  Isvg.selectAll("."+data.name) //designate selector variable for brevity
    .style({"fill-opacity": ".5"}); //reset enumeration unit to orginal color
  svg.selectAll("#importer")
    .style({"stroke": "yellow", "stroke-width": "0px"})
  //povSVG.selectAll("."+data.id)
    //.style({"stroke": "#000", "stroke-width": "0px"});
  //rSVG.selectAll("."+data.id)
    //.style({"stroke-width": "0px"});
  };



function setMap(data) {
var height66 = .66 * Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

svg = d3.select("body").append("svg")
    .attr("width", width66)
    .attr("height", height66);

projection = d3.geo.albers()
  .center([9,38])
  .rotate([100,0])
  .parallels([20,50])
  .scale(750)
  //.translate([width66/2, height66/2])
var path = d3.geo.path()
  .projection(projection);


queue()
  .defer(d3.json, "data/us4.topojson")
  .defer(d3.json, "data/mex2.topojson")
  .await(callback);

function callback(error, us, mex){
  var us = svg.append("path")
    .datum(topojson.feature(us, us.objects.usa))
    .attr("class", "land")
    .attr("d", path);

  var mex = svg.append("path")
    .datum(topojson.feature(mex, mex.objects.mex))
    .attr("class", "land")
    .attr("d", path);

  dataCrunch();


  };
};

function dataCrunch(data){
  //get facility data ready to project
 for (var i=0; i<latlongsR.length-1; i++) {
    for (var j=0; j<latlongsR[i]["values"].length; j++) {
      if( parseFloat(latlongsR[i]["values"][j]["key"]) != 0) {
          latlongRdump.push({"zip": latlongsR[i]["values"][j]["values"][0]["receivingFacilityZipCode"], "long": latlongsR[i]["values"][j]["values"][0]["longitude"], "lat": latlongsR[i]["values"][j]["values"][0]["latitude"], "id": latlongsR[i]["values"][j]["values"][0]["ReceivingFacilityEPAIDNumber"], "name": latlongsR[i]["values"][j]["values"][0]["importer_name"]})
      };     
    };
  };

console.log(facilitySum)
for (var i =0; i<facilitySum.length-1; i++){
  for (var j=0; j<latlongRdump.length; j++){
    if (facilitySum[i]["key"] == latlongRdump[j].id){
      latlongRdump[j].total_waste = facilitySum[i]["values"]["total_waste"]
    };
  }; 
};
latlongReset = latlongRdump;
icicle(Site);
icicleAxis();
importers(latlongRdump);
}

function icicleImporters(data, name){
  var latlongRdump2=[];
  if (data.length != undefined) {
      for (var k=0; k<data.length; k++){
        for (var j=0; j<latlongRdump.length; j++){
          //console.log(data[k].name, latlongRdump[j].id)
        if (data[k].name == latlongRdump[j].id || name == latlongRdump[j].id){
          latlongRdump2.push(latlongRdump.slice([j], [j+1])[0])
        };
    }} colorize(latlongRdump2, name);
  /*} else if (data.length == undefined) {
    for (var j=0; j<latlongRdump.length; j++){
      //console.log(data.name, latlongRdump[j].id)
    if (data.name == latlongRdump[j].id){
      //alert("success")
      latlongRdump2.push(latlongRdump.slice([j], [j+1])[0])
      //console.log(latlongRdump2)
    };

  }*/
} 
};

function importers(data){
  //console.log(data)
  var max = d3.max(latlongReset, function(d) {return d.total_waste}),
  min = d3.min(latlongReset, function(d) {return d.total_waste})
  var radius = d3.scale.log()
    .domain([min, max])
    .range([5, 20]);
  
  svg.selectAll("circle")
    .data(data)
    .enter().append("circle")
    .attr("class", function(d) {return d.id})
    .attr("id", "importer")
    .style("fill", "#8c8c8c")
    .style("fill-opacity", ".5")
    .attr("r", function(d) { return radius(d.total_waste); })
    .attr("cx", function(d) {return projection([d.long, d.lat])[0]; }) 
    .attr("cy", function(d) { return projection([d.long, d.lat])[1]; })
    .on("mouseover", function(d){
      viewer(d);
      highlight(d);
    })
    .on("mouseout", dehighlight)
    .on("click", function (d){
      clicker = true;
      viewer(d)}); 
};

function colorize(data, name){
  //match data with colorkey
  var colorDump=[]
  //get color key 
  for (var i=0; i<colorKey.length; i++) { if (colorKey[i].name == name) {colorDump.push(colorKey[i].color)}}
  //svg.selectAll("circle")
    //.style({"fill": "#1f77b4"})
  svg.selectAll("circle")
    .data(latlongReset).filter(function(d) {for (var r = 0; r<data.length; r++) { if (data[r].id == d.id){return d}}})
    .style("fill", function(){
      if (name == "total"){return "#8c8c8c"}
      else {return colorDump[0]}
      })
    .style("fill-opacity", function(){
      if (name == "total"){return ".5"}
      else {return "1"}
      })
}

function highlight(data){
  svg.selectAll("."+data.id) //select the current province in the DOM
    .style({"stroke": "yellow", "stroke-width": "5px", "fill-opacity": "1"}); //yellow outline
  Isvg.selectAll("."+data.id) //select the current province in the DOM
    .style({"fill-opacity": "1"});
  povSVG.selectAll("."+data.id)
    .style({"stroke": "yellow", "stroke-width": "2px"});
  rSVG.selectAll("."+data.id)
    .style({"stroke": "yellow", "stroke-width": "2px"});
};

function dehighlight(data){
  svg.selectAll("."+data.id) //designate selector variable for brevity
    .style({"fill-opacity": ".3", "stroke-width": "0px"}); //reset enumeration unit to orginal color
  Isvg.selectAll("."+data.id) //select the current province in the DOM
    .style({"fill-opacity": ".5"});
  povSVG.selectAll("."+data.id)
    .style({"stroke-width": "0px"});
  rSVG.selectAll("."+data.id)
    .style({"stroke-width": "0px"});
};


function exporters(data){
  svg.selectAll("#exporter").remove();
    //begin constructing latlongs of exporters
  if (data.length == undefined){data = [data]}; //if we're just clicking one site, put data in an array so we can work with it below. otherwise, it's all exporters...
  var latlongdump = [];
  exporterInfo = [];
  for (var k=0; k<data.length; k++){
   for (var i=0; i<latlongs.length-1; i++) {
    for (var j=0; j<latlongs[i]["values"].length; j++) {
        if (latlongs[i]["values"][j]["values"][0]["longitude"] == data[k].long) {
          latlongdump.push({"long": latlongs[i]["values"][j]["values"][0]["exporterLONG"], "lat": latlongs[i]["values"][j]["values"][0]["exporterLAT"], "name": latlongs[i]["values"][j]["values"][0]["exporter_name"], "id": latlongs[i]["values"][j]["values"][0]["exporter_name"]}) //lat longs of the foreign waste sites
          for (var z=0; z<latlongs[i]["values"][j]["values"].length; z++) {
            exporterInfo.push({"methods": latlongs[i]["values"][j]["values"][z]["ExpectedManagementMethod"], "waste": latlongs[i]["values"][j]["values"][z]["hazWasteDesc"]})
          };
        };

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
    .domain([min+1, max]) //don't want min to be 0
    .range([5, 20]);
  //add exporters to the map    
  svg.selectAll(".pin")
    .data(latlongdump)
    .enter().append("circle")
    .attr("r", function(d) {return radius(d.total_waste); })
    .attr("id", "exporter")
    .attr("class", function (d) { return d.id})
    .style({"fill": "#3d3d3d", "fill-opacity": "0", "stroke": "black", "stroke-width": "3px"})
    .attr("cx", function(d) {return projection([d.long, d.lat])[0]; }) 
    .attr("cy", function(d) { return projection([d.long, d.lat])[1]; })
    .on("mouseover", highlight)
    .on("mouseout", dehighlight)
    .on("click", exportViewer);
};

function viewer(data){
   //implement function that will place locations of waste exporters on map
  //remove all other importers
  
  //implement clickoff div - this creates a div that will do two things: 1) make the map more opaque, emphasizing the new info panel; 2) provide a clickable space so that when people click away from the info panel back to the map, the info panel closes
  /*d3.select("body")
    .append("div")
    .text("X")
    .attr("class", "clickoff")
    .style({"background-color": "#d3d3d3"}) //need to adjust size, color, opacity of div
    .on("click", function(){
      if (checker != true) {d3.selectAll("circle").remove()}      
      d3.selectAll(".povertyChart").remove()
      d3.selectAll(".viewer")
        .transition()
          .duration(0)
        .style({"height": "0%", "width": "0%"})
      d3.selectAll(".viewerText").remove()
      d3.selectAll(".clickoff").remove()
      importers(latlongReset); //removes itself so that the map can be clicked again
    });*/


  //implement the info panel/viewer here
  d3.select(".intro").remove()
  d3.select(".viewerText").remove()
  d3.select(".povertyChart").remove()
  d3.select(".viewer").append("div").attr("class", "viewerText");
  d3.select(".viewerText").text("this is: "+data.name+", which imports "+data.total_waste+" tons of lead");
  
  
  if (clicker == true){

  clicker = false;
  //var circles = svg.selectAll("circle")
  //circles.filter(function(d){return d.name != data.name})
    //.remove()
  exporters(data);
  }


  demographicCharts(data);

function demographicCharts(data){ 
  d3.selectAll(".viewer").append("div").attr("class", "povertyChart");

var curr_width = document.getElementsByClassName("viewer")[0].clientWidth;
var curr_height = document.getElementsByClassName("viewer")[0].clientHeight;

  var width = curr_width/2
  var height = curr_height * .9
  console.log(curr_width)

  povSVG =  d3.select(".povertyChart").append("svg")
    .attr("width", width)
    .attr("height", height);

//match zips
  d3.csv("data/poverty.csv", function(povdata) {
    povertydata = povdata.map(function(d) { return {"Geography": d["Geography"], "percentPoverty": +d["percentPoverty"] }; });
  
  var povdump;
  for (var i =0; i<povertydata.length-1; i++){
      if (povertydata[i].Geography == data.zip){
        povdump = [povertydata[i].percentPoverty, povertydata[0].percentPoverty]
      };
    }; 
/*var x = d3.scale.linear()
    .range([0, width]);
*/
  var y = d3.scale.linear()
    .domain([0, 100])
    .range([height, 0]);
  /*var bar = povSVG.selectAll("g")
    .data(povdump)
    .enter().append("g")
    .attr("transform", function(d, i) { return "translate(" + i * 25 + ",0)"; });
  bar.append("rect")
    .attr("class", "povBars")
    .attr("width", 25)
    .attr("height", y)*/
var barPadding = 1;
povSVG.selectAll("rect")
     .data(povdump)
     .enter()
     .append("rect")
     .attr("x", function(d, i) {
        return i * (width / povdump.length);
     })
     .attr("y", function(d) { return y(d); })
     .attr("width", width / povdump.length - barPadding)
     .attr("height", function(d){ return height - y(d)})
     .attr("class", function(d, i){ if (i == 0){return data.id}})
     .attr("fill", function(d, i) {
        if (i == 0) {
          return document.getElementsByClassName(data.id)["importer"].style.fill
        }
        else {
          return "rgb(136,136,136)"
        }
     })
     .on("mouseover", highlight)
     .on("mouseout", dehighlight);
povSVG.selectAll("text")
         .data(povdump)
         .enter()
         .append("text")
         .text(function(d) {
            return d;
         })
         .attr("text-anchor", "middle")
         .attr("x", function(d, i) {
            return i * (width / povdump.length) + (width / povdump.length - barPadding) / 2;
         })
         .attr("y", function(d) { return y(d) + 14; })
         .attr("font-family", "sans-serif")
         .attr("font-size", "11px")
         .attr("fill", "white");
povSVG.selectAll("label")
    .data(povdump)
         .enter()
         .append("text")
         .text(function(d, i) {
            if (i == 0) {return data.id}
            else{return "Ntl. Average"}
         })
         .attr("text-anchor", "middle")
         .attr("x", function(d, i) {
            return i * (width / povdump.length) + (width / povdump.length - barPadding) / 2;
         })
         .attr("y", height - 5)
         .attr("font-family", "sans-serif")
         .attr("font-size", "11px")
         .attr("fill", "white")
         .attr("font-weight", "bold");
d3.select(".povertyChart").append("div")
  .attr("class", "povLabel")
  .text("% of individuals in poverty")

  });





  //minority chart
  rSVG =  d3.select(".povertyChart").append("svg")
    .attr("width", width)
    .attr("height", height);

  d3.csv("data/minority.csv", function(racedata) {
    racedata = racedata.map(function(d) { return {"Geography": d["Geography"], "percentMinority": +d["percentMinority"] }; });
  
  var racedump;
  for (var i =0; i<racedata.length-1; i++){
      if (racedata[i].Geography == data.zip){
        racedump = [racedata[i].percentMinority, racedata[0].percentMinority]
      };
    }; 
/*var x = d3.scale.linear()
    .range([0, width]);
*/
  var y = d3.scale.linear()
    .domain([0, 100])
    .range([height, 0]);
  /*var bar = povSVG.selectAll("g")
    .data(povdump)
    .enter().append("g")
    .attr("transform", function(d, i) { return "translate(" + i * 25 + ",0)"; });
  bar.append("rect")
    .attr("class", "povBars")
    .attr("width", 25)
    .attr("height", y)*/
var barPadding = 1;
console.log(data)
rSVG.selectAll("rect")
     .data(racedump)
     .enter()
     .append("rect")
     .attr("x", function(d, i) {
        return i * (width / racedump.length);
     })
     .attr("y", function(d) { return y(d); })
     .attr("width", width / racedump.length - barPadding)
     .attr("height", function(d){ return height - y(d)})
     .attr("class", function(d, i){ if (i == 0){return data.id}})
     .attr("fill", function(d, i) {
        if (i == 0) {
          console.log(document.getElementsByClassName(data.id)["importer"].style.fill)
          return document.getElementsByClassName(data.id)["importer"].style.fill
        }
        else {
          return "rgb(136,136,136)"
        }
     })
     .on("mouseover", highlight)
     .on("mouseout", dehighlight);
rSVG.selectAll("text")
         .data(racedump)
         .enter()
         .append("text")
         .text(function(d){return d})
         .attr("text-anchor", "middle")
         .attr("x", function(d, i) {
            return i * (width / racedump.length) + (width / racedump.length - barPadding) / 2;
         })
         .attr("y", function(d) { return y(d) + 14; })
         .attr("font-family", "sans-serif")
         .attr("font-size", "11px")
         .attr("fill", "white");
rSVG.selectAll("label")
    .data(racedump)
         .enter()
         .append("text")
         .text(function(d, i) {
            if (i == 0) {return data.id}
            else{return "Ntl. Average"}
         })
         .attr("text-anchor", "middle")
         .attr("x", function(d, i) {
            return i * (width / racedump.length) + (width / racedump.length - barPadding) / 2;
         })
         .attr("y", height - 5)
         .attr("font-family", "sans-serif")
         .attr("font-size", "11px")
         .attr("fill", "white")
        .attr("font-weight", "bold");
  });
d3.select(".povertyChart").append("div")
    .attr("class", "raceLabel")
    .text("% of non-white individuals")
}
}
function exportViewer(data){

  //implement the info panel/viewer here

  d3.selectAll(".viewerText").remove()
  d3.selectAll(".povertyChart").remove()
  d3.selectAll(".viewer").append("div").attr("class", "viewerText");
  d3.selectAll(".viewerText").html("Name:"+data.name+"<p>Exports: "+data.total_waste+"<p>Managment methods: "+exporterInfo[0]["methods"]+"<p>Waste types: "+exporterInfo[0]["waste"]+"");
};