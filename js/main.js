//global variables

var latlongs;
var svg;
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
var width66;
var height33;
var Site;
var DisposalMethod;
var povertydata = [];
var colorKey;
var checker = false;
var povSVG;
var clickCheck = true;
var exporterInfo;
var icicleDump;


//begin script when window loads 
window.onload = initialize(); 

//the first function called once the html is loaded 
function initialize(){
  d3.select("body")
    .append("div")
    .classed("viewer", true)
    .style("display", "inline-block");
  d3.select("body")
    .append("div")
    .attr("class", "footer")
    .html("Footers")
  d3.select(".viewer")
    .append("div")
    .attr("class", "viewerText")
    .style({"background-color": "#555", "color": "white", "font-size": "24px"})
    .text("Welcome to the HazMatMapper");
  d3.select("#showHide")
    .append("div")
    .text("Show/Hide")
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
          .style({"top": "64%"})
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

  width66 =  .66 * Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  height33 = .3 * Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  Isvg = d3.select(".barWrap").append("svg")
    .attr("width", width66)
    .attr("height", height33);

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
        importers(latlongReset)
        checker = true;
      }
     if (type == "Importers" && display == "off"){
        svg.selectAll("#importer").remove();
      }

    });
  labelEnter.append("label").text(function(d) {return d;});

  filterTypes = ["Site", "DisposalMethod", "Type"]
    var show = d3.select(".filterSelector").append("div").html("<p>Filter by:")
  var form = d3.select(".filterSelector").append("form"), j = 0;
  var labelEnter = form.selectAll("div")
    .data(filterTypes)
    .enter().append("div")
    .attr("class", "filtering")
    .attr("id", function(d){return d})
  labelEnter.append("input")
    .attr({
      type: "radio",
      class: "something",
      name: "mode",
      value: function(d, i) {return d;}
    })
    .property("checked", function(d, i) { 
        return (i===j); 
    })
    .on("change", function(){
     Isvg.selectAll("rect, div")
        .transition()
        .duration(750)
        .style("opacity", 0)
        .remove();
        //.each("end", function(){
      icicle(window[this.value])
       // });
     svg.selectAll("#importer")
      .style("fill", function(d) {for (var i=0; i<colorKey.length; i++) { if (colorKey[i].name == d.id) {return colorKey[i].color} }});
     
    });
  labelEnter.append("label").text(function(d) {return d;});



  setData(); 
}; 

function setData(){
d3.csv("data/sites_v4.csv", function(data) {
  data.forEach(function(d){
    d.totalQuantityinShipment = +d.totalQuantityinShipment // convert the quantity of waste from string to number
    d.exporterLAT = +d.exporterLAT
    d.exporterLONG = +d.exporterLONG 
    d.receivingLat = +d.latitude
    d.receivingLong = +d.longitude
    d.receivingFacilityZipCode = +d.receivingfacilityzipcode
    d.hazWasteDesc.indexOf("LEAD") > -1 ? d.hazWasteDesc = "lead" : d.hazWasteDesc = d.hazWasteDesc; //convert everything with lead to lead in waste description; // this is where we can do work creating waste categories...
    d.hazWasteDesc.indexOf("MERCURY") > -1 ? d.hazWasteDesc = "mercury" : d.hazWasteDesc = d.hazWasteDesc;
    d.hazWasteDesc.indexOf("TOLULENE") > -1 ? d.hazWasteDesc = "toluene" : d.hazWasteDesc = d.hazWasteDesc;
    d.hazWasteDesc.indexOf("BATTER") > -1 ? d.hazWasteDesc = "batteries" : d.hazWasteDesc = d.hazWasteDesc;
    d.hazWasteDesc.indexOf("PAINT") > -1 ? d.hazWasteDesc = "paint" : d.hazWasteDesc = d.hazWasteDesc;
    d.hazWasteDesc.indexOf("CHLOROETHYLENE") > -1 ? d.hazWasteDesc = "Tri/dichloroethlene" : d.hazWasteDesc = d.hazWasteDesc;
  });

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

function icicle(data){
var x = d3.scale.linear()
    .range([0, width66]);

var y = d3.scale.linear()
    .range([0, height33]);

var color = d3.scale.category10();

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
    .style({"cursor": "pointer", "fill": function(d) { colorKey.push({"name": d.name, "color": color((d.children ? d : d.parent).name)}); return color((d.children ? d : d.parent).name); }, "stroke": "black", "stroke-width": "1px", "fill-opacity": ".5"} )
    .on("mouseover", function (d) {
      tip.show(d);
      if (d.depth === 1 && d.name[0] != "H" || d.depth === 3 && d.name[0] !="H"){
        icicleHighlight(d)
      };  
    })
    .on("mouseout", function(d){tip.hide(d); icicleDehighlight(d)})
    .on('click', function(d){
      clicked(d);
      icicleImporters(d);
      icicleFilter(d);
    });

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
  y.domain([d.y, 1]).range([d.y ? 20 : 0, height33]);

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
  console.log(data.depth)
  console.log(data.children[3])
  icicleDump = [];
  if (data.depth == 1){
    for (var k=0; k<data.children.length; k++){
      for (var l=0; l<data.children[k].children.length; l++){
        icicleDump.push(data.children[k].children[l])
     }
    }
    icicleImporters(icicleDump)
  }
  else if (data.depth === 2){
    if (data.children.length == 1){
        icicleDump=data.children[0]
        icicleImporters(icicleDump)
      }
    else{
    for (var k=0; k<data.children.length; k++){
        icicleDump.push(data.children[k])
      }
    icicleImporters(icicleDump)
  }
  }
}

function icicleHighlight(data){
  Isvg.selectAll("."+data.name) //select the current id
    .style({"fill-opacity": "1"}); //yellow outline
  svg.selectAll("."+data.name)
    .style({"stroke": "black", "stroke-width": "5px"})
  povSVG.selectAll("."+data.id)
    .style({"stroke": "black", "stroke-width": "2px"});
  rSVG.selectAll("."+data.id)
    .style({"stroke": "black", "stroke-width": "2px"});
}; 

function icicleDehighlight(data){
  Isvg.selectAll("."+data.name) //designate selector variable for brevity
    .style({"fill-opacity": ".5"}); //reset enumeration unit to orginal color
  svg.selectAll("."+data.name)
    .style({"stroke": "black", "stroke-width": "0px"})
  //povSVG.selectAll("."+data.id)
    //.style({"stroke": "#000", "stroke-width": "0px"});
  rSVG.selectAll("."+data.id)
    .style({"stroke": "#000", "stroke-width": "0px"});
  };



function setMap(data) {
var height66 = .66 * Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

svg = d3.select("body").append("svg")
    .attr("width", width66)
    .attr("height", height66);

projection = d3.geo.albers()
  .scale(800)
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
importers(latlongRdump);
}

function icicleImporters(data){
  console.log(data)
  var latlongRdump2=[];
  for (var k=0; k<data.length; k++){
  for (var j=0; j<latlongRdump.length; j++){
    if (data[k].name == latlongRdump[j].id){
      console.log(latlongRdump.slice([j], [j+1])[0]) 
      latlongRdump2.push(latlongRdump.slice([j], [j+1])[0])
    };
  }};
  console.log(latlongRdump2)
  if (data.name == "total") {
      latlongRdump2 = latlongReset;
  };

  var circle = d3.selectAll("circle") //reset map
    circle.remove();
  importers(latlongRdump2); //project filtered lat/longs
};

function importers(data){
  console.log(data)
  var max = d3.max(latlongReset, function(d) {return d.total_waste}),
  min = d3.min(latlongReset, function(d) {return d.total_waste})
  var radius = d3.scale.log()
    .domain([min, max])
    .range([5, 20]);
  
  svg.selectAll(".facility")
    .data(data)
    .enter().append("circle", ".facility")
    .attr("class", function(d) {return d.id})
    .attr("id", "importer")
    .style("fill", function(d) {for (var i=0; i<colorKey.length; i++) { if (colorKey[i].name == d.id) {return colorKey[i].color} }})
    .style("fill-opacity", ".75")
    .attr("r", function(d) { return radius(d.total_waste); })
    .attr("cx", function(d) { return projection([d.long, d.lat])[0]; }) 
    .attr("cy", function(d) { return projection([d.long, d.lat])[1]; })
    .on("mouseover", highlight)
    .on("mouseout", dehighlight)
    .on("click", viewer); 
};

function highlight(data){
  svg.selectAll("."+data.id) //select the current province in the DOM
    .style({"stroke": "black", "stroke-width": "5px"}); //yellow outline
  Isvg.selectAll("."+data.id) //select the current province in the DOM
    .style({"fill-opacity": "1"});
  povSVG.selectAll("."+data.id)
    .style({"stroke": "black", "stroke-width": "2px"});
  rSVG.selectAll("."+data.id)
    .style({"stroke": "black", "stroke-width": "2px"});
};

function dehighlight(data){
  svg.selectAll("."+data.id) //designate selector variable for brevity
    .style({"stroke": "#000", "stroke-width": "0px"}); //reset enumeration unit to orginal color
  Isvg.selectAll("."+data.id) //select the current province in the DOM
    .style({"fill-opacity": ".5"});
  povSVG.selectAll("."+data.id)
    .style({"stroke": "#000", "stroke-width": "0px"});
  rSVG.selectAll("."+data.id)
    .style({"stroke": "#000", "stroke-width": "0px"});
};


function exporters(data){
  
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
    .style({"fill": "#3d3d3d", "fill-opacity": ".7", "stroke": "black", "stroke-width": "3px"})
    .attr("cx", function(d) {return projection([d.long, d.lat])[0]; }) 
    .attr("cy", function(d) { return projection([d.long, d.lat])[1]; })
    .on("mouseover", highlight)
    .on("mouseout", dehighlight)
    .on("click", exportViewer);
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
  
  exporters(data)
  //implement clickoff div - this creates a div that will do two things: 1) make the map more opaque, emphasizing the new info panel; 2) provide a clickable space so that when people click away from the info panel back to the map, the info panel closes
  d3.select("body")
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
    });


  //implement the info panel/viewer here
  d3.selectAll(".viewerText").remove()
  d3.selectAll(".viewer")
    .style({"height": "0%", "width": "0%"})
  d3.selectAll(".povertyChart").remove()
  d3.selectAll(".viewer")
    .transition()
      .duration(1000)
        .style({"height": "50%", "width": "33%"})
          .each("end", function (d){
            d3.selectAll(".viewer").append("div").attr("class", "viewerText");
            d3.selectAll(".viewerText").text("this is: "+data.name+", which imports "+data.total_waste+" tons of lead");
            demographicCharts(data);
          });

function demographicCharts(data){ 
  d3.selectAll(".viewer").append("div").attr("class", "povertyChart");

  var width = 150
  var height = 250

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
console.log(data)
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
          for (var i=0; i<colorKey.length; i++) { if (colorKey[i].name == data.id) {return colorKey[i].color} }
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
  });

  var width = 150
  var chartPadding = 50
  var height = 250

  rSVG =  d3.select(".povertyChart").append("svg")
    .attr("width", width)
    .attr("height", height);

//match zips
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
          for (var i=0; i<colorKey.length; i++) { if (colorKey[i].name == data.id) {return colorKey[i].color} }
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
         .text(function(d) {
            return d;
         })
         .attr("text-anchor", "middle")
         .attr("x", function(d, i) {
            return i * (width / racedump.length) + (width / racedump.length - barPadding) / 2;
         })
         .attr("y", function(d) { return y(d) + 14; })
         .attr("font-family", "sans-serif")
         .attr("font-size", "11px")
         .attr("fill", "white");
  });
}
}
function exportViewer(data){
  
d3.selectAll(".clickoff").remove()
d3.select("body")
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
              .each("start", function(){ d3.selectAll(".viewerText").remove()});
      d3.selectAll(".clickoff").remove()
      importers(latlongReset); //removes itself so that the map can be clicked again
    });

  //implement the info panel/viewer here

  d3.selectAll(".viewerText").remove()
  d3.selectAll(".viewer")
    .style({"height": "0%", "width": "0%"})
  d3.selectAll(".povertyChart").remove()
   d3.selectAll(".viewer")
    .transition()
      .duration(1000)
        .style({"height": "50%", "width": "33%"})
          .each("end", function(){ 
              d3.selectAll(".viewer").append("div").attr("class", "viewerText");
              d3.selectAll(".viewerText").html("Name:"+data.name+"<p>Exports: "+data.total_waste+"<p>Managment methods: "+exporterInfo[0]["methods"]+"<p>Waste types: "+exporterInfo[0]["waste"]+"");
            });
};