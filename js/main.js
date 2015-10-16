//global variables

var latlongs;
var svg;
var sum;
var projection;
var projectionDefault;
var latlongsR;
var latlongRdump = [];
var facilitySum;
var exporterSum;
var typeByFacility;
var typeSum;
var bigNest;
var latlongReset;
var Isvg;
var IAsvg;
var width66;
var height33;
var height66;
var Site;
var DisposalMethod;
var povertydata = [];
var colorKey;
var checker = false; //checks to see whether we've run initial data crunching, essentially
var povSVG;
//var clickCheck = true; //detect whether radio button filter control was clicked
var zoomed = false; //are we zoomed into rust belt?
var switcher = false; //have we switched phases? if so, need to crunch data
var exporterInfo;
var icicleDump;
var domain;
var fullWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
var fullHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
var filterDomain;
var margin = {top: 10, right: 10, bottom: 30, left: 10};
var name; //the name of the chart area selected
var phase = "Solids";
var defaultColor = "#e8e8e8";
var exporterRing = "black";
var latlongdump;
var tooltip;
var defaultStroke = {"stroke": "red", "stroke-width": ".5px"}
var cxLeft;
var cyLeft;
var cxRight;
var cyRight;
var siteViewerHelp = false;
var footerText;
var descriptors = {};
var currImporter,currColor,globalMax, globalMin, exGlobalMax, exGlobalMin, clickyCheck, iceCheck, lastImporter; //iceCheck sees if click on site was first ice then not
var UNtypeKey = {};
var mgmtTypeKey = {};
var displaySVG;
var facilityName = {"name": ""}

//begin script when window loads 
window.onload = initialize(); 

//the first function called once the html is loaded 
function initialize(){
  d3.csv("/abouts/descriptors.csv", function (csv) {
  for (var i = 0; i < csv.length; i++){descriptors[csv[i].type] = csv[i].description;}
  }) // load waste descriptors
  d3.text("/abouts/footer.txt", function (text) {footerText = text}) //load footer text
  d3.select("body")
    .append("div")
    .attr("class", "footer")
    .html(" <span class='aboutFooter'>&nbsp;About</span>")
    .on("click", function(){
      d3.select("body")
      .append("div")
      .attr("class", "about")
      //.text(footerText)
      //.style({"color":"white", "font-family": 'Arial Narrow, Arial, sans-serif'})
      .html("<span class='aboutText'>"+footerText+"") //<p>This is a tool for exploring transnational flows of hazardous waste. While we typically think the US exports all of its most toxic waste to poorer countries, the US actually imports much waste from these countries and other rich countries, for disposal. Many of these are transnational corporations shifting between subsidiaries. <p> All of the sites in the US that receive waste are mapped, the size indicating the relative amount they are importing. To begin exploring, <b>hover over</b> or <b>click</b> on a site. <p> To explore in-depth, you can use the filter control to investigate how much each site imports, what types of material they import, and what they do with it. By clicking on the controls you can show only those sites importing, for instance, lead, or, for instance, only those sites performing a certain management method.</p></span>")
      .append("div").attr("class", "exitAbout").text("Exit")
      .on("click", function(){
        d3.select(".about").remove()
        d3.select(".exitAbout").remove()
      })
    })  
  d3.select(".footer")
  .append("text")
  .attr("class", "data")
  .html("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Data last updated: 3/5/15")
  
  setControls();
  /*d3.select("body")
    .append("div")
    .attr('class', "greyedOut")
    .style({"background-color": "#333", "opacity": ".2"})
  d3.select("body")
    .append("div")
    .attr("class", "introBox")
    .style({"background-color": "#555", "color": "white", "font-size": "24px"})
    .html("<span class='introTitle'>Welcome to the HazMatMapper</span><span class = 'intro'><p>This is a tool for exploring transnational flows of hazardous waste. While we typically think the US exports all of its most toxic waste to poorer countries, the US actually imports much waste from these countries and other rich countries, for disposal. Many of these are transnational corporations shifting between subsidiaries. <p> All of the sites in the US that receive waste are mapped, the size indicating the relative amount they are importing. To begin exploring, <b>hover over</b> or <b>click</b> on a site. <p> To explore in-depth, you can use the filter control to investigate how much each site imports, what types of material they import, and what they do with it. By clicking on the controls you can show only those sites importing, for instance, lead, or, for instance, only those sites performing a certain management method. At any time you can show all the importers and foreign exporters.</span>")
    .append("button").attr("class","introButton").text("Click here to begin")
    .on("click", function(){
      d3.select(".introBox").remove()
      d3.select(".greyedOut").remove()
      setControls();
      })*/
}
function setControls(){
  d3.select("body")
    .append("div")
    .attr("class", "title")
    .html("HazMatMapper")
  d3.select("body")
    .append("div")
    .classed("viewer", true)
    .html("<span class = 'intro'><p>This is a tool for exploring transnational flows of hazardous waste. While we typically think the US exports all of its most toxic waste to poorer countries, the US actually now imports more than twice as much waste from Canada and Mexico than it exports to the two countries combined. Many of these are transnational corporations shifting between subsidiaries. <p> All of the sites in the US that receive waste are mapped, the size indicating the relative amount they are importing. To begin exploring, <b>hover over</b> or <b>click</b> on a site. <p> To explore in-depth, you can use the filter control to investigate how much each site imports, what types of material they import, and what they do with it. By clicking on the controls you can show only those sites importing, for instance, lead, or, for instance, only those sites performing a certain management method. At any time you can show all the importers and foreign exporters.</span>")
    //.style("display", "inline-block");

/*  d3.select("#showHide")
    .append("div")
    .text(" Show/Hide Controls")
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
          .style({"top": "67%"})
        clickCheck = true
      }
    })
*/

  d3.select("#accordion")
    .append("div")
    .attr("class", "barWrap");
  d3.select(".barWrap")
    .append("div")
    .attr("class", "filterSelector");

  width66 =  .7 * Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  height33 = .25 * Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  height66 = .75 * Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

  projection = d3.geo.albers()
  .center([9,33])
  .rotate([100,0])
  .parallels([20,45])
  .scale(700)
  .translate([width66/2.75, height66/1.75]);

  projectionDefault = projection;

  IAsvg = d3.select(".barWrap").append("svg")
    .attr("width", width66/8)
    .attr("height", height33)

  Isvg = d3.select(".barWrap").append("svg")
    .attr("width", width66)
    .attr("height", height33)
  
  

  //do show all exporters/importers here
  /*d3.select(".filterSelector").append("div")
    .attr("class", "something")
    .on("click", function(){
     // add exporters and/or importers here
      if (exportCheck == false){
        exporters(latlongReset)
        exportCheck = true;
        d3.select(".something").style({"border-color": "yellow", "border-width": "1px", "border-type": "solid"})

      }
      else{
        svg.selectAll("#exporter").remove();
        exportCheck = false;
        d3.select(".something").style({"border-color": "black", "border-width": "1px", "border-type": "solid"})
      }
    })
    .append("label").text("Exporters");*/


    //phase switcher here
   filterTypes = ["Solids", "Liquids"]
    var show = d3.select(".filterSelector").append("div").html("Select phase:")
  var form = d3.select(".filterSelector").append("form"), j = 0;
  var labelEnter = form.selectAll("div")
    .data(filterTypes)
    .enter().append("div")
    .attr("class", "filtering")
    .attr("id", function(d){return d})
    .on("click", function(d){
      form.selectAll("div").style({"border-color": "black", "border-width": "1px", "border-type": "solid"})
      form.select("div #"+d).style({"border-color": "yellow", "border-width": "1px", "border-type": "solid"})
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
      d3.selectAll("#mapSVG").remove();
      filterDomain = "Site"
      filterform.selectAll("div").style({"border-color": "black", "border-width": "1px", "border-type": "solid"})
      filterform.select("div #Site").style({"border-color": "yellow", "border-width": "1px", "border-type": "solid"})
      switcher=true;
      setData(d)  
    });
  labelEnter.append("label").text(function(d) {return d;}); 
form.select("div #Solids").style({"border-color": "yellow", "border-width": "1px", "border-type": "solid"})



  //filter types selector
  filterTypes = ["Site", "DisposalMethod", "Type"]
    var show = d3.select(".filterSelector").append("div").html("Filter by:")
  var filterform = d3.select(".filterSelector").append("form"), j = 0;
  var labelEnter = filterform.selectAll("div")
    .data(filterTypes)
    .enter().append("div")
    .attr("class", "filtering")
    .attr("id", function(d){return d})
    .on("click", function(d){
      filterform.selectAll("div").style({"border-color": "black", "border-width": "1px", "border-type": "solid"})
      filterform.select("div #"+d).style({"border-color": "yellow", "border-width": "1px", "border-type": "solid"})
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
      svg.selectAll("#importer")
        .style({"fill": defaultColor, "fill-opacity": ".75"})
      filterDomain = d
      icicle(window[d])
      icicleAxis();
    });
  labelEnter.append("label").text(function(d) {return d;}); 
filterform.select("div #Site").style({"border-color": "yellow", "border-width": "1px", "border-type": "solid"})
setData(phase); 
}

function setData(phase){
d3.csv("data/"+phase+".csv", function(data) {
  data.forEach(function(d){
    d.totalQuantityinShipment = +d.totalQuantityinShipment // convert the quantity of waste from string to number
    d.exporterLAT = +d.exporterLAT
    d.exporterLONG = +d.exporterLONG 
    d.receivingLat = +d.latitude
    d.receivingLong = +d.longitude
    d.receivingFacilityZipCode = +d.receivingfacilityzipcode
    d.hazWasteDesc = d.hazWasteDesc
    d.exporter_key = d.exporter_key
    d.un = d.un
    d.mgmt = d.mgmt
    d.year = d.year
    /*d.hazWasteDesc.indexOf("LEAD") > -1 ? d.hazWasteDesc = "lead" : d.hazWasteDesc = d.hazWasteDesc; //convert everything with lead to lead in waste description; // this is where we can do work creating waste categories...
    d.hazWasteDesc.indexOf("MERCURY") > -1 ? d.hazWasteDesc = "mercury" : d.hazWasteDesc = d.hazWasteDesc;
    d.hazWasteDesc.indexOf("TOLULENE") > -1 ? d.hazWasteDesc = "toluene" : d.hazWasteDesc = d.hazWasteDesc;
    d.hazWasteDesc.indexOf("BATTER") > -1 ? d.hazWasteDesc = "batteries" : d.hazWasteDesc = d.hazWasteDesc;
    d.hazWasteDesc.indexOf("PAINT") > -1 ? d.hazWasteDesc = "paint" : d.hazWasteDesc = d.hazWasteDesc;
    d.hazWasteDesc.indexOf("CHLOROETHYLENE") > -1 ? d.hazWasteDesc = "Tri/dichloroethlene" : d.hazWasteDesc = d.hazWasteDesc;*/
  });

  sum = d3.sum(data, function(d) {return d.totalQuantityinShipment})
  
  UNtypeKey={}
  data.forEach(function(d) {
    UNtypeKey[d.un] = d.hazWasteDesc;
  });

  mgmtTypeKey={}
  data.forEach(function(d) {
    mgmtTypeKey[d.mgmt] = d.ExpectedManagementMethod;
  });

  Site = d3.nest()
  .key(function(d) { return d.ReceivingFacilityEPAIDNumber; })
  .key(function(d) { return d.un; })
  .key(function(d) { return d.mgmt; })
  .rollup(function(leaves) { return d3.sum(leaves, function(d) {return d.totalQuantityinShipment;})})
  .entries(data);
  Site={"key": "total", "values": Site};

  DisposalMethod = d3.nest()  
  .key(function(d) { return d.mgmt; })
  .key(function(d) { return d.un; })
  .key(function(d) { return d.ReceivingFacilityEPAIDNumber; })
  .rollup(function(leaves) { return d3.sum(leaves, function(d) {return d.totalQuantityinShipment;})})
  .entries(data);
  DisposalMethod={"key": "total", "values": DisposalMethod};

  Type = d3.nest()
  .key(function(d) { return d.un; })
  .key(function(d) { return d.mgmt; })
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

  typeByFacility = d3.nest()
  .key(function(d) { return d.hazWasteDesc; })
  .key(function(d) { return d.ReceivingFacilityEPAIDNumber; }) // EPA ID number
  .rollup(function(leaves) { return {"total_waste": d3.sum(leaves, function(d) {return d.totalQuantityinShipment;})} }) // 
  .entries(data);

  quantByExporter =d3.nest()
  .key(function(d) { return d.exporter_key; }) // EPA ID number
  .rollup(function(leaves) { return {"total_waste": d3.sum(leaves, function(d) {return d.totalQuantityinShipment;})} }) // 
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
var site = ["total", "importers", "types", "methods"]
var type = ["total", "types", "methods", "importers"]
var method = ["total", "methods", "types", "importers"]
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
    .range([0, height33/4.5, height33*2/4.5, height33*3/4.5]);

var yAxis = d3.svg.axis()
    .scale(yax)
    .orient("left");
IAsvg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate("+110+","+15+")")
      .call(yAxis);
}

function icicle(data){
var x = d3.scale.linear()
    .range([0, width66]);

var y = d3.scale.linear()
    .range([0, height33 - margin.bottom]);

var color = d3.scale.category10()
  //.range(['rgb(141,211,199)','rgb(255,255,179)','rgb(190,186,218)','rgb(251,128,114)','rgb(128,177,211)','rgb(253,180,98)','rgb(179,222,105)','rgb(252,205,229)','rgb(217,217,217)','rgb(188,128,189)','rgb(204,235,197)','rgb(255,237,111)']);

var partition = d3.layout.partition()
    //.size([width, height])
    .value(function(d) { return d.size; });

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<span style='color:white'>" + d.name + "</span>";
  })

Isvg.call(tip)

//d3.json("/js/thing.json", function(error, root) {
//  var nodes = partition.nodes(root);
var nodes = partition.nodes(data);

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
      if (d.name == "total"){return defaultColor} else {return color((d.children ? d : d.parent).name)}; }, "stroke": "black", "stroke-width": "1px", "fill-opacity": ".5"})
    .on("mouseover", function (d) {
      //look up facility name
      
      if (filterDomain ==  "Site" && d.depth == 1 || filterDomain == undefined && d.depth == 1){
        for (var c = 0; c<latlongRdump.length; c++){
        if (d.name == latlongRdump[c].id){
          facilityName.name = latlongRdump[c].name
          siteViewerHelp = true
          }
        }
        tip.show(facilityName); 
      } else if (filterDomain ==  "Type" && d.depth == 3) {
        for (var c = 0; c<latlongRdump.length; c++){
        if (d.name == latlongRdump[c].id){
          facilityName.name = latlongRdump[c].name
          siteViewerHelp = true
          }
        }
        tip.show(facilityName); 
      } else if (filterDomain ==  "DisposalMethod" && d.depth == 3) {
        for (var c = 0; c<latlongRdump.length; c++){
        if (d.name == latlongRdump[c].id){
          facilityName.name = latlongRdump[c].name
          siteViewerHelp = true
          }
        }
        tip.show(facilityName); 
      } else {tip.show(d); siteViewerHelp = false}
      if (filterDomain == "Type" && d.depth == 1 || filterDomain == "Site" && d.depth == 2 || filterDomain == "DisposalMethod" && d.depth == 2 || filterDomain == undefined && d.depth == 2){
        var show = {"name": UNtypeKey[d.name]}
        tip.show(show)
      }
      if (filterDomain == "Type" && d.depth == 2 || filterDomain == "Site" && d.depth == 3 || filterDomain == "DisposalMethod" && d.depth == 1 || filterDomain == undefined && d.depth == 3){
        var show = {"name": mgmtTypeKey[d.name]}
        tip.show(show)
      }
      //if (d.depth === 1 && d.name[0] != "H" || d.depth === 3 && d.name[0] !="H"){
      icicleHighlight(d);
      //};  
    })
    .on("mouseout", function(d){tip.hide(d); icicleDehighlight(d)})
    .on('click', function(d){
      if (filterDomain ==  "DisposalMethod" && d.depth == 1 || filterDomain ==  "Type" && d.depth == 2 || filterDomain ==  "Site" && d.depth == 3 || filterDomain ==  undefined && d.depth == 3){
        //show details of method here
        d3.select(".intro").remove()
        d3.select(".viewerText").remove()
        d3.select(".povertyChart").remove()
        drawLinesOut()
        var show = {"name": mgmtTypeKey[d.name]}
        ViewerHelp(show);
      }
      if (filterDomain ==  "DisposalMethod" && d.depth == 2 || filterDomain ==  "Type" && d.depth == 1 || filterDomain ==  "Site" && d.depth == 2 || filterDomain ==  undefined && d.depth == 2){
        //show details of type here
        drawLinesOut();
        d3.select(".intro").remove()
        d3.select(".viewerText").remove()
        d3.select(".povertyChart").remove()
        var show = {"name": UNtypeKey[d.name]}
        ViewerHelp(show);
      }
      if (siteViewerHelp == true){
        for (var c = 0; c<latlongRdump.length; c++){
        if (d.name == latlongRdump[c].id){
          drawLinesOut();
          exportThis(latlongRdump[c]);
          }
        }
      } 

      clicked(d);
      //icicleImporters(d);
      icicleFilter(d);
      clickyCheck = d.name
      clicky(d);
      updateDisplay(d);
});

//construct x axis
var xscale = d3.scale.linear()
    .range([10, width66-10]);
var xheight = height33-margin.bottom-5
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
    .attr("y", margin.bottom+5)
    .attr("x", width66/2)
    .style("text-anchor", "middle")
    .text("Proportion of Total Waste");

function clicked(d) {
  if (document.getElementsByClassName(d.name)["importer"]){lastImporter = d.name; iceCheck = document.getElementsByClassName(d.name)["importer"].style["fill"]}
  x.domain([d.x, d.x + d.dx]);
  y.domain([d.y, 1]).range([d.y ? 20 : 0, height33 - margin.bottom]);



  //reconstruct x axis
var xdomain = d.value/sum
var xscale = d3.scale.linear()
    .domain([0, xdomain])
    .range([10, width66-10]);
var xheight = height33-margin.bottom-5
var xAxis = d3.svg.axis()
    .scale(xscale)
    .ticks(10)
    .tickFormat(d3.format(".0%"))
    .orient("bottom");

Isvg.selectAll("g")
    .remove()
Isvg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0,"+xheight+")")
      .call(xAxis)
  .append("text")
    .attr("y", margin.bottom+5)
    .attr("x", width66/2)
    .style("text-anchor", "middle")
    .text("Proportion of Total Waste");

  Isvg.selectAll("rect")
      .attr("x", function(d) { return x(d.x); })
      .attr("y", function(d) { return y(d.y); })
      .attr("width", function(d) { return x(d.x + d.dx) - x(d.x); })
      .attr("height", function(d) { return y(d.y + d.dy) - y(d.y); })

//create temp domain for changing axis
  //calculate range for axis based on depth
  var range;
  var display;
  var boxy = parseInt(document.getElementsByClassName(d.name)[0].attributes[2].value)
  var boxheight = parseInt(document.getElementsByClassName(d.name)[0].attributes[4].value)
  var midpoint = (boxy+boxheight)/2
  if (d.depth == 0) {range = [0, height33/4.5, height33*2/4.5, height33*3/4.5]; display = domain; // remove viewer and lines
    d3.select(".viewerText").remove()
    d3.select(".povertyChart").remove()
    drawLinesOut()
  }
  if (d.depth == 1) {range = [0, midpoint, midpoint+boxheight, midpoint+(boxheight*2)]; display = domain}
  if (d.depth == 2) {range = [0, midpoint, midpoint+boxheight]; display = [domain[1], domain[2], domain[3]]}
  if (d.depth == 3) {range = [0, midpoint]; display = [domain[2], domain[3]]}

  var yax  = d3.scale.ordinal()
    .domain(display)
    .range(range);

  var yAxis = d3.svg.axis()
    .scale(yax)
    .orient("left");

  IAsvg.selectAll("g")
      .remove()
  IAsvg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate("+110+","+10+")")
      .call(yAxis);
  };


};

function icicleFilter(data){
  name = data.name
  icicleDump = [];
  if (data.depth == 0) {colorize(latlongReset, name)}
  else if (data.depth == 1){
    for (var k=0; k<data.children.length; k++){
      for (var l=0; l<data.children[k].children.length; l++){
        icicleDump.push(data.children[k].children[l])
     }
    }
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
    .style({"fill-opacity": "1"}); 
  if (data.name == "total"){
  svg.selectAll("#importer")
    .style({"stroke": "yellow", "stroke-width": "2px"})} //yellow outline
  else {
  svg.selectAll("."+data.name)
    .style({"stroke": "yellow", "stroke-width": "5px"})}
  if (filterDomain == undefined && data.depth == 1 || filterDomain == "Site" && data.depth == 1 || filterDomain == "DisposalMethod" && data.depth == 3 || filterDomain == "Type" && data.depth == 3){ //if sites and at bottom of barchart

  //icicleTranslate(data);
  /*oldFill = document.getElementsByClassName(data.name)["importer"].style.fill
  oldFillOpacity = document.getElementsByClassName(data.name)["importer"].style.opacity
  console.log(document.getElementsByClassName(data.parent.name))
  var colorRect = document.getElementsByClassName(data.name)[0].style.fill
  if (data.depth == 3){colorRect = document.getElementsByClassName(data.parent.name)[0].style.fill}
  var colorRect = document.getElementsByClassName(data.name)[0].style.fill
  svg.selectAll("."+data.name)
    .style({"fill": colorRect, "fill-opacity": "1"})*/}
}; 

function icicleDehighlight(data){
  Isvg.selectAll("."+data.name) //designate selector variable for brevity
    .style({"fill-opacity": ".5"}); //reset enumeration unit to orginal color
  svg.selectAll("#importer")
    .style(defaultStroke)
  svg.selectAll("."+clickyCheck) //select the current province in the DOM
    .style({"stroke": "yellow", "stroke-width": "5px", "opacity": "1"});
  /*if (filterDomain == undefined && data.depth == 1 || filterDomain == "Site" && data.depth == 1 || filterDomain == "DisposalMethod" && data.depth == 3 || filterDomain == "Type" && data.depth == 3){
    //console.log(document.getElementsByClassName(data.name))
    svg.selectAll("."+data.name)
    .style({"fill": oldFill, "opacity": oldFillOpacity})}*/
  };

/*function icicleTranslate(data){
  //slice latlongReset where data = latlongReset, then call viewer
  var temp;
  for (var u = 0; u<latlongReset.length; u++){
    if (data.name == latlongReset[u].id){
      temp = latlongReset.slice([u], [u+1])[0]
      //viewer(temp);
    }
  }
}*/

function setMap(data) {
svg = d3.select("body").append("svg")
    .attr("id", "mapSVG")
    .attr("width", width66)
    .attr("height", height66);
var path = d3.geo.path()
  .projection(projection);


queue()
  .defer(d3.json, "data/usa008.topojson")
  .defer(d3.json, "data/can008.topojson")
  .defer(d3.json, "data/mex10.topojson")
  .defer(d3.json, "data/borders.topojson")
  .await(callback);

function callback(error, us, can, mex, borders){
  var us = svg.append("path")
    .datum(topojson.feature(us, us.objects.usa))
    .attr("class", "importer")
    .attr("d", path);

  var can = svg.append("path")
    .datum(topojson.feature(can, can.objects.can))
    .attr("class", "exporter")
    .attr("d", path);

  var mex = svg.append("path")
    .datum(topojson.feature(mex, mex.objects.mex))
    .attr("class", "exporter")
    .attr("d", path);

  var borders = svg.append("path")
    .datum(topojson.feature(borders, borders.objects.borders))
    .attr("class", "borders")
    .attr("d", path);

if(checker == true && switcher == false){importers(data)} else{dataCrunch()}
  //switcher is whether we've switched phases
  //checker is whether we've crunched data
 //if checker false and switch true, data crunch
 //if checker false and switch not true, data crunch
 //if checker true and switch true, data crunch
 //if checker true and switch not true, importers


  };
};

function dataCrunch(data){
  latlongRdump=[];
  //get facility data ready to project
 for (var i=0; i<latlongsR.length; i++) {
    for (var j=0; j<latlongsR[i]["values"].length; j++) {
      if( parseFloat(latlongsR[i]["values"][j]["key"]) != 0) {
          latlongRdump.push({"zip": latlongsR[i]["values"][j]["values"][0]["receivingFacilityZipCode"], "long": latlongsR[i]["values"][j]["values"][0]["longitude"], "lat": latlongsR[i]["values"][j]["values"][0]["latitude"], "id": latlongsR[i]["values"][j]["values"][0]["ReceivingFacilityEPAIDNumber"], "name": latlongsR[i]["values"][j]["values"][0]["importer_name"], "address": latlongsR[i]["values"][j]["values"][0]["importer_address"], "city": latlongsR[i]["values"][j]["values"][0]["importer_city"], "state": latlongsR[i]["values"][j]["values"][0]["importer_state"], "rank": [], "types": [], "units": latlongsR[i]["values"][j]["values"][0]["units_final"]})
      };     
    };
  };

for (var i =0; i<facilitySum.length; i++){
  for (var j=0; j<latlongRdump.length; j++){
    if (facilitySum[i]["key"] == latlongRdump[j].id){
      latlongRdump[j].total_waste = facilitySum[i]["values"]["total_waste"]
    };
  }; 
};



//put total for each type here
for (var i =0; i<typeByFacility.length; i++){
  var p = typeByFacility[i]["key"]
  for (var n =0; n<typeByFacility[i]["values"].length; n++){
    for (var j=0; j<latlongRdump.length; j++){
      if (typeByFacility[i]["values"][n]["key"] == latlongRdump[j].id){
        var obj = [p, typeByFacility[i]["values"][n]["values"]["total_waste"]]
        latlongRdump[j].types.push(obj)
      };
    }; 
  };
};

//do sort and rank here
latlongRdump.sort(function(a,b) {return b.total_waste-a.total_waste;}) // note: this is helpful in order that the larger sites are drawn on the map first, allowing smaller sites to be highlighted and selected rather than swamped out/overwritten by larger ones
for (var j=0; j<latlongRdump.length; j++){
  latlongRdump[j].rank = j+1+"/"+latlongRdump.length}

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

    

  var max = d3.max(latlongReset, function(d) {return d.total_waste}),
  min = d3.min(latlongReset, function(d) {return d.total_waste})
  globalMax = max;
  globalMin = min;

  var radius; 
  if (zoomed == false) {radius= d3.scale.sqrt()
    .domain([min+1, max]) //don't want min to be 0
    .range([10, 30])}
  if (zoomed == true) {radius = d3.scale.sqrt()
    .domain([min+1, max]) //don't want min to be 0
    .range([15, 50])}
  
  tooltip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<span style='color:white'>" + d.name + "</span>";
  })

  svg.call(tooltip)

  svg.selectAll("circle")
    .data(data)
    .enter().append("circle")
    .attr("class", function(d) {return d.id})
    .attr("id", "importer")
    .style("fill", defaultColor)
    .style("fill-opacity", ".75")
    .attr("r", function(d) { return radius(d.total_waste); })
    .attr("cx", function(d) {return projection([d.long, d.lat])[0]; }) 
    .attr("cy", function(d) { return projection([d.long, d.lat])[1]; })
    .on("mouseover", function(d){
      tooltip.show(d);
      highlight(d);
    })
    .on("mouseout", function(d){
      tooltip.hide(d);
      dehighlight(d);
      //drawLinesOut(d);
    })
   .on("click", function (d){
      drawLinesOut();
      exportThis(d);
      clickyCheck = d.id;
      clicky(d);
      color2(d);
      updateDisplay(d);
    })
  
  exporters();
  cxLeft = document.getElementsByClassName("OHD00816629")["importer"].attributes[3].value //get svg coords of Cincinatti site to set bounds
  cyLeft = document.getElementsByClassName("OHD00816629")["importer"].attributes[4].value


  cxRight = document.getElementsByClassName("E5A43183")[0].attributes[3].value
  cyRight = document.getElementsByClassName("E5A43183")[0].attributes[4].value
  var mar = 40
  var w = cxRight - cxLeft + 2*mar
  var h = cyLeft - cyRight

   //controls for zooming to the rust belt:
  if (zoomed == false) { //if not zoomed in, draw zoom box
    svg.append("rect")
      .attr("class", "zoomBox")
      .attr("x", cxLeft - mar)
      .attr("y", cyRight - mar)
      .attr("width",w)
      .attr("height", h + mar)
      .on("mouseover", function(){
        d3.select(".zoomBox")
          .style({"stroke": "yellow", "fill": "#d3d3d3", "fill-opacity": ".2"})
      })
      .on("mouseout", function(){
        d3.select(".zoomBox")
          .style({"stroke": "black", "fill": "none"})
      })
      .on("click", function(){
        d3.selectAll("#mapSVG")
          .remove();
        projection = d3.geo.mercator()
          .center([14.5,45])
          .rotate([100,0])
          //.parallels([40,50])
          .scale(12000)
          .translate([width66/5, height66/5])
        checker = true;
        zoomed = true;
        switcher = false;
        setMap(data)
      })
  }


  else if (zoomed == true) { //if zoomed in, draw zoom out box
     svg.append("rect")
    .attr("class", "zoomBox")
    .attr("x", cxLeft - mar)
    .attr("y", cyRight - mar)
    .attr("width",w)
    .attr("height", h + mar)
    .on("mouseover", function(){
        d3.select(".zoomBox")
          .style({"stroke": "yellow", "fill": "#d3d3d3", "fill-opacity": ".2"})
      })
    .on("mouseout", function(){
        d3.select(".zoomBox")
          .style({"stroke": "black", "fill": "none"})
      })
    .on("click", function(){d3.selectAll("#mapSVG")
          .remove();
      projection = projectionDefault
      zoomed = false;
      setMap(data)
    })
  }   
  
};

function exportThis(data){
  //change latlongdump to site-specific latlongdump
  if (data.length == undefined){data = [data]}; //if we're just clicking one site, put data in an array so we can work with it below. otherwise, it's all exporters...
  latlongdump = [];
  for (var k=0; k<data.length; k++){
   for (var i=0; i<latlongs.length; i++) {
    for (var j=0; j<latlongs[i]["values"].length; j++) {
        if (latlongs[i]["values"][j]["values"][0]["longitude"] == data[k].long) {
          latlongdump.push({"long": latlongs[i]["values"][j]["values"][0]["exporterLONG"], "lat": latlongs[i]["values"][j]["values"][0]["exporterLAT"], "name": latlongs[i]["values"][j]["values"][0]["exporter_name"], "id": latlongs[i]["values"][j]["values"][0]["exporter_name"], "units": latlongs[i]["values"][j]["values"][0]["units_final"], "types": []}) //lat longs of the foreign waste sites
          for (var z=0; z<latlongs[i]["values"][j]["values"].length; z++) {
            latlongdump[0]["types"].push(latlongs[i]["values"][j]["values"][z]["hazWasteDesc"])

          };
        };

        };     
      };
    };
  //add exporter sum to latlongdump object for symbolizing etc.
  for (var i =0; i<exporterSum.length; i++){
    for (var j=0; j<latlongdump.length; j++){
      if (exporterSum[i]["key"] == latlongdump[j].long){
        latlongdump[j].total_waste = exporterSum[i]["values"]["total_waste"]
      };
    }; 
  };
  //send data off to viewer
  viewer(data, latlongdump);

  //draw lines between exporters and this site
  drawLinesOver(latlongdump, data);
}



function drawLinesOver(data, base){
  //var max = d3.max(data, function(d) {return d.total_waste}),
  //min = d3.min(data, function(d) {return d.total_waste})
  var lineStroke = d3.scale.sqrt()
    .domain([globalMin, globalMax]) 
    .range([2, 10])

  var tooltipFlow = d3.tip()
  .attr('class', 'd3-tip')
  .offset([0, 0])
  .html(function(d) {
    return "<span style='color:white' style='text-size:8px'>" + d.total_waste + " " + d.units + " from "+ d.name +"</span>";
  })

  svg.call(tooltipFlow)

  //based on: http://bl.ocks.org/enoex/6201948
  var arcGroup = svg.append('g');
  var path = d3.geo.path()
    .projection(projection);

// --- Helper functions (for tweening the path)
        var lineTransition = function lineTransition(path) {
            path.transition()
                //NOTE: Change this number (in ms) to make lines draw faster or slower
                .duration(1500)
                .attrTween("stroke-dasharray", tweenDash)
                .each("end", function(d,i) { 
                    ////Uncomment following line to re-transition
                    //d3.select(this).call(transition); 
                    
                    //We might want to do stuff when the line reaches the target,
                    //  like start the pulsating or add a new point or tell the
                    //  NSA to listen to this guy's phone calls
                    //doStuffWhenLineFinishes(d,i);
                });
        };
        var tweenDash = function tweenDash() {
            //This function is used to animate the dash-array property, which is a
            //  nice hack that gives us animation along some arbitrary path (in this
            //  case, makes it look like a line is being drawn from point A to B)
            var len = this.getTotalLength(),
                interpolate = d3.interpolateString("0," + len, len + "," + len);

            return function(t) { return interpolate(t); };
        };


var links = [];
for(var i=0, len=data.length; i<len; i++){
    // (note: loop until length - 1 since we're getting the next
    //  item with i+1)
        links.push({
            type: "LineString",
            coordinates: [
                [ data[i].long, data[i].lat ],
                [ base[0].long, base[0].lat ]
            ],
            total_waste: data[i].total_waste,
            name: data[i].name,
            units: data[i].units
        });
    }
var pathArcs = arcGroup.selectAll(".arc")
            .data(links);

        //enter
        pathArcs.enter()
            .append("path").attr({
                'class': 'arc'
            })
            .style({ 
                fill: 'none',
            });

        //update
        pathArcs.attr({
                //d is the points attribute for this path, we'll draw
                //  an arc between the points using the arc function
                d: path
            })
            .style("stroke", '#0000ff')
            .style('stroke-width', function(d) {return lineStroke(d.total_waste)})
            .style('cursor', "pointer")
            .on("mouseover", function(d) {tooltipFlow.show(d)})
            .on("mouseout", function(d) {tooltipFlow.hide(d)})
                //'stroke-dasharray': '5'
            .call(lineTransition); 

}

function drawLinesOut(){
d3.selectAll(".arc").remove();
}

function color2(data){
  currColor = document.getElementsByClassName(data.id)["importer"].style["fill"]
  svg.selectAll("."+currImporter)
    .style({"fill": currColor, "fill-opacity": .75});
  if(iceCheck){svg.selectAll("."+lastImporter)
    .style({"fill": iceCheck, "fill-opacity": .75});}
  var rectColor = document.getElementsByClassName(data.id)[0].style["fill"]
  svg.selectAll("."+data.id)
    .style({"fill": rectColor, "fill-opacity": 1});
  currImporter = data.id
}

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
      if (name == "total"){return defaultColor}
      else {return colorDump[0]}
      })
    .style("fill-opacity", function(){
      if (name == "total"){return ".75"}
      else {return "1"}
      })
    .style("stroke", function(){
      if (name == "total"){return defaultStroke}
      })
}

function clicky(data){
  svg.selectAll("."+currImporter)
    .style({"fill": currColor, "fill-opacity": .75});
  svg.selectAll("circle") //select the current province in the DOM
    //.style("fill-opacity", "1")
    .style(defaultStroke);
  if (data.id){ svg.selectAll("."+data.id) //select the current province in the DOM
    .style({"stroke": "yellow", "stroke-width": "5px", "opacity": "1"});
  } else if (data.name) { svg.selectAll("."+data.name) //select the current province in the DOM
    .style({"stroke": "yellow", "stroke-width": "5px", "opacity": "1"});
  }

}

function highlight(data){
  svg.selectAll("."+data.id) //select the current province in the DOM
    .style({"stroke": "yellow", "stroke-width": "5px", "opacity": "1"}); //yellow outline
  Isvg.selectAll("."+data.id) //select the current province in the DOM
    .style({"fill-opacity": "1"});
};

function dehighlight(data){
  if (data.id == name){
   svg.selectAll("."+data.id) //designate selector variable for brevity
    .style({"fill-opacity": "1"})
    .style(defaultStroke)
  }
  else{
  svg.selectAll("."+data.id) //designate selector variable for brevity
    .style({"fill-opacity": ".75"})//reset enumeration unit to orginal color
    .style(defaultStroke)
  Isvg.selectAll("."+data.id) //select the current province in the DOM
    .style({"fill-opacity": ".5"});
  }
  if (data.id == clickyCheck) {
  svg.selectAll("."+data.id) //select the current province in the DOM
    .style({"stroke": "yellow", "stroke-width": "5px", "opacity": "1"}); //yellow outline  
  }

};

//show all exporters
function exporters(){
  svg.selectAll("#exporter").remove();
    //begin constructing latlongs of exporters
  //if (data.length == undefined){data = [data]}; //if we're just clicking one site, put data in an array so we can work with it below. otherwise, it's all exporters...

  latlongdump = [];
  
   for (var i=0; i<latlongs.length-1; i++) {
    for (var j=0; j<latlongs[i]["values"].length; j++) {   
          //console.log(latlongs[i]["values"][j]["values"][0])   
          latlongdump.push({"long": latlongs[i]["values"][j]["values"][0]["exporterLONG"], "lat": latlongs[i]["values"][j]["values"][0]["exporterLAT"], "name": latlongs[i]["values"][j]["values"][0]["exporter_name"], "id": latlongs[i]["values"][j]["values"][0]["exporter_key"], "address": latlongs[i]["values"][j]["values"][0]["exporter_address"], "city": latlongs[i]["values"][j]["values"][0]["exporter_city"], "state": latlongs[i]["values"][j]["values"][0]["exporter_state"],"units": latlongs[i]["values"][j]["values"][0]["units_final"], "types": [], "rank": []}) //lat longs of the foreign waste sites
          for (var z=0; z<latlongs[i]["values"][j]["values"].length; z++) {
            latlongdump[0]["types"].push(latlongs[i]["values"][j]["values"][z]["hazWasteDesc"])
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

  //do sort and rank here

latlongdump.sort(function(a,b) {return b.total_waste-a.total_waste;}) // note: this is helpful in order that the larger sites are drawn on the map first, allowing smaller sites to be highlighted and selected rather than swamped out/overwritten by larger ones
for (var j=0; j<latlongdump.length; j++){
  latlongdump[j].rank = j+1+"/"+latlongdump.length}

  //scale exporter symbolization
  var max = d3.max(latlongdump, function(d) {return d.total_waste}),
  min = d3.min(latlongdump, function(d) {return d.total_waste})
  
  exGlobalMax = max;
  exGlobalMin = min;

  //scale according to zoom
  var radius; 
  if (zoomed == false) {radius= d3.scale.sqrt()
    .domain([min+1, max]) //don't want min to be 0
    .range([10, 30])}
  if (zoomed == true) {radius = d3.scale.sqrt()
    .domain([min+1, max]) //don't want min to be 0
    .range([15, 50])}
  //add exporters to the map    
  svg.selectAll(".pin")
    .data(latlongdump)
    .enter().append("circle")
    .attr("r", function(d) {return radius(d.total_waste); })
    .attr("id", "exporter")
    .attr("class", function (d) { return d.id})
    .style({"fill": "#3d3d3d", "fill-opacity": ".75"/*, "stroke": exporterRing, "stroke-width": "3px"*/})
    .attr("cx", function(d) {return projection([d.long, d.lat])[0]; }) 
    .attr("cy", function(d) { return projection([d.long, d.lat])[1]; })
    .on("mouseover", function(d){
      tooltip.show(d);
      highlight(d);
    }) 
    .on("mouseout", function(d){tooltip.hide(d); dehighlight(d)}) 
    .on("click", function(d){drawLinesOut(d);importThis(d); clickyCheck = d.id; clicky(d); updateDisplay(d)})
};

function ViewerHelp(data){
  d3.select(".viewer").append("div").attr("class", "viewerText");
  d3.select(".viewerText").html("<span class = 'importerName'>"+data.name+"</span><p><span class = 'viewerData'>"+descriptors[data.name]+"</span>")
}


function viewer(data, latlongdump){
  //implement the info panel/viewer here
  data = data[0]
  
  d3.select(".intro").remove()
  d3.select(".viewerText").remove()
  d3.select(".povertyChart").remove()
  d3.select(".viewer").append("div").attr("class", "viewerText");
  var names=[]
  for (i=0;i<latlongdump.length;i++){names.push(latlongdump[i].name)}
  z=JSON.stringify(names)
  

  // Sort the array based on the second element
  data.types.sort(function(a, b)
  {
    return b[1] - a[1];
  });

  //biggest export partner
  latlongdump.sort(function(a,b) {return b.total_waste-a.total_waste;})

  d3.select(".viewerText").html("<span class='importerName'>"+data.name+"</span><p><span class = 'viewerCategory'>Total imports and rank</span><br><span class ='viewerData'>"+data.total_waste+" "+data.units+"..........."+data.rank+"</span><p><span class = 'viewerCategory'>Main Export Partner</span><br><span class ='viewerData'>"+latlongdump[0].name+"</span><p><span class = 'viewerCategory'>Top Import Type</span><br><span class ='viewerData'>"+data.types[0][0]+": "+data.types[0][1]+" "+data.units+"</span><p><span class = 'viewerCategory'>Site Address</span><br><span class ='viewerData'>"+data.address+", "+data.city+", "+data.state+"</span><br><a href='http://epamap14.epa.gov/ejmap/ejmap.aspx?wherestr="+data.address+" "+data.city+" "+data.state+"' target='_blank'>Open in EPA's EJView</a>");

  demographicCharts(data);

function demographicCharts(data){ 
  d3.selectAll(".viewerText").append("div").attr("class", "povertyChart");

d3.select(".povertyChart").append("div")
  .attr("class", "povLabel")
  .text("% in poverty near site")

d3.select(".povertyChart").append("div")
    .attr("class", "raceLabel")
    .text("% non-white near site")

var curr_width = document.getElementsByClassName("viewer")[0].clientWidth;
var curr_height = document.getElementsByClassName("viewer")[0].clientHeight;

var width = curr_width/3
var height = curr_height/8

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
var x = d3.scale.linear()
    .domain([100, 0])
    .range([0, width]);
/*
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
     .attr("y", function(d, i) {
        return i * (height / povdump.length);
     })
     .attr("x", function(d) { return 0; })
     .attr("height", height / povdump.length - barPadding)
     .attr("width", function(d){ return width - x(d)})
     .attr("class", function(d, i){ if (i == 0){return data.id}})
     .attr("fill", function(d, i) {
        if (i == 0) {
          return document.getElementsByClassName(data.id)["importer"].style.fill
        }
        else {
          return "rgb(136,136,136)"
        }
     })
     //.on("mouseover", highlight)
     //.on("mouseout", dehighlight);
povSVG.selectAll("text")
         .data(povdump)
         .enter()
         .append("text")
         .text(function(d) {
            return d3.round(d, 1)+"%";
         })
         .attr("text-anchor", "middle")
         .attr("y", function(d, i) {
            return i * (height / povdump.length) + (height / povdump.length - barPadding) / 1.5;
         })
         .attr("x", function(d) { return 16; })
         .attr("font-size", "11px")
         .attr("fill", "black")
povSVG.selectAll("label")
    .data(povdump)
         .enter()
         .append("text")
         .text(function(d, i) {
            if (i == 0) {return "Site zipcode"}
            else{return "Ntl. Average"}
         })
         .attr("text-anchor", "middle")

         .attr("y", function(d, i) {
            return i * (height / povdump.length) + (height / povdump.length - barPadding) / 2;
         })
         .attr("x", width - 50)
         .attr("font-size", "11px")
         .attr("fill", "white")
         //.attr("font-weight", "bold");


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
var x = d3.scale.linear()
    .domain([100,0])
    .range([0, width]);
/*
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
rSVG.selectAll("rect")
     .data(racedump)
     .enter()
     .append("rect")
     .attr("y", function(d, i) {
        return i * (height / racedump.length);
     })
     .attr("x", function(d) { return 0; })
     .attr("height", height / racedump.length - barPadding)
     .attr("width", function(d){ return width-x(d)})
     .attr("class", function(d, i){ if (i == 0){return data.id}})
     .attr("fill", function(d, i) {
        if (i == 0) {
          return document.getElementsByClassName(data.id)["importer"].style.fill
        }
        else {
          return "rgb(136,136,136)"
        }
     })
     //.on("mouseover", highlight)
     //.on("mouseout", dehighlight);
rSVG.selectAll("text")
         .data(racedump)
         .enter()
         .append("text")
         .text(function(d){return d3.round(d, 1)+"%"})
         .attr("text-anchor", "middle")
         .attr("y", function(d, i) {
            return i * (height / racedump.length) + (height / racedump.length - barPadding) / 1.5;
         })
         .attr("x", function(d) { return 16; })
         .attr("font-size", "11px")
         .attr("fill", "black")
         //.attr("font-weight", "bold");
/*rSVG.selectAll("label")
    .data(racedump)
         .enter()
         .append("text")
         .text(function(d, i) {
            if (i == 0) {return "This site"}
            else{return "Ntl. Average"}
         })
         .attr("text-anchor", "middle")
         .attr("y", function(d, i) {
            return i * (height / racedump.length) + (height / racedump.length - barPadding) / 2;
         })
         .attr("x", width - 5)
         .attr("font-family", "sans-serif")
         .attr("font-size", "11px")
         .attr("fill", "white")
        .attr("font-weight", "bold");*/
  });

d3.select(".povertyChart").append("div")
    .attr("class", "Manifests")
    .html("<p>Manifests")

}
}
function exportViewer(data, latlongdump){
  //implement the info panel/viewer here
  data=data[0]
  d3.select(".intro").remove()
  d3.selectAll(".viewerText").remove()
  d3.selectAll(".povertyChart").remove()
  d3.selectAll(".viewer").append("div").attr("class", "viewerText");
  var names=[]
  for (i=0;i<latlongdump.length;i++){names.push(latlongdump[i].name)}
  z=JSON.stringify(names)
  names=[]
  for (i=0;i<latlongdump[0].types.length;i++){names.push(latlongdump[0].types[i])}
  r=JSON.stringify(names)
  
  //sort data
  //Largest chemical
  // Create items array
  latlongdump[0].types.sort(function(a,b) {return b.type-a.type;})
  //console.log(latlongdump[0].types.type[1])
  stuff=[]
  for (var x=0;x<latlongdump.length;x++){
  latlongdump[x].types.sort(function(a,b) {return b[1]-a[1];})
  stuff.push(latlongdump[x].types[0])
  }
  stuff.sort(function(a,b){return b[1]-a[1]})

  /*
  data.types.sort(function(a, b)
  {
    return b[1] - a[1];
  });

  //biggest export partner
  latlongdump.sort(function(a,b) {return b.total_waste-a.total_waste;})
  */



  //combine and rank
  /*var ExportTypeSum = d3.nest()
  .key(function(d) { return latlongdump[0].types; }) // set type as key
  .rollup(function(leaves) { return {"total_waste": d3.sum(leaves, function(d) {return d.totalQuantityinShipment;})} })
  .entries(data);*/

  d3.selectAll(".viewerText").html("<span class='importerName'>"+data.name+"</span><p><span class = 'viewerCategory'>Total exports and rank</span><br><span class ='viewerData'>"+data.total_waste+" "+data.units+"..........."+data.rank+"</span><p><span class = 'viewerCategory'>Largest Shipment: </span><br><span class ='viewerData'>"+stuff[0][0]+": "+stuff[0][1]+" "+data.units+"</span><p><span class = 'viewerCategory'>Sent To: </span><br><span class ='viewerData'>"+stuff[0][2]+"</span><p><span class = 'viewerCategory'>Site Address</span><br><span class ='viewerData'>"+data.address+", "+data.city+", "+data.state+"</span><br><a href='http://maps.google.com/?q="+data.address+" "+data.city+" "+data.state+"' target='_blank'>Open in Google Maps</a><p><span class = 'viewerCategory'>")
};

function printThis(latlongdump){
  for (i=0;i<latlongdump.length;i++){document.write(latlongdump[i].name)}
}

function importThis(data){
  //change latlongdump to site-specific latlongdump
  if (data.length == undefined){data = [data]}; //if we're just clicking one site, put data in an array so we can work with it below. otherwise, it's all exporters...
  //construct object with exporters to...
  latlongdump = [];
  for (var k=0; k<data.length; k++){
   for (var i=0; i<latlongs.length; i++) {
    for (var j=0; j<latlongs[i]["values"].length; j++) {
        if (latlongs[i]["values"][j]["values"][0]["exporterLONG"] == data[k].long) {
          latlongdump.push({"long": latlongs[i]["values"][j]["values"][0]["receivingLong"], "lat": latlongs[i]["values"][j]["values"][0]["receivingLat"], "name": latlongs[i]["values"][j]["values"][0]["importer_name"], "id": latlongs[i]["values"][j]["values"][0]["importer_name"], "units": latlongs[i]["values"][j]["values"][0]["units_final"], "types": [], "total_waste": 0}) //lat longs of the importing waste sites
          for (var z=0; z<latlongs[i]["values"][j]["values"].length; z++) {
            for (var x=0;x<latlongdump.length;x++){
              latlongdump[x]["types"].push([latlongs[i]["values"][j]["values"][z]["hazWasteDesc"],latlongs[i]["values"][j]["values"][z]["totalQuantityinShipment"], latlongs[i]["values"][j]["values"][0]["importer_name"]])
            };
          };
          
        };

        };     
      };
    };
  //sum for each destination here
  for (var h=0; h<latlongdump.length; h++){
    //push total waste to export in latlongdump
   latlongdump[h]["total_waste"] = d3.sum(latlongdump[h].types, function(d) { return d[1]; })
    
  }

  exportViewer(data, latlongdump)
  //draw lines between exporters and this site
  exDrawLinesOver(latlongdump, data);
}



function exDrawLinesOver(data, base){
  var lineStroke = d3.scale.sqrt()
    .domain([exGlobalMin, exGlobalMax]) 
    .range([2, 10])

  var tooltipFlow = d3.tip()
  .attr('class', 'd3-tip')
  .offset([0, 0])
  .html(function(d) {
    return "<span style='color:white' style='font-size:4px'>" + d.total_waste + " " + d.units + " to "+ d.name +"</span>";
  })

  svg.call(tooltipFlow)
  //based on: http://bl.ocks.org/enoex/6201948
  var arcGroup = svg.append('g');
  var path = d3.geo.path()
    .projection(projection);

// --- Helper functions (for tweening the path)
        var lineTransition = function lineTransition(path) {
            path.transition()
                //NOTE: Change this number (in ms) to make lines draw faster or slower
                .duration(1500)
                .attrTween("stroke-dasharray", tweenDash)
                .each("end", function(d,i) { 
                    ////Uncomment following line to re-transition
                    //d3.select(this).call(transition); 
                    
                    //We might want to do stuff when the line reaches the target,
                    //  like start the pulsating or add a new point or tell the
                    //  NSA to listen to this guy's phone calls
                    //doStuffWhenLineFinishes(d,i);
                });
        };
        var tweenDash = function tweenDash() {
            //This function is used to animate the dash-array property, which is a
            //  nice hack that gives us animation along some arbitrary path (in this
            //  case, makes it look like a line is being drawn from point A to B)
            var len = this.getTotalLength(),
                interpolate = d3.interpolateString("0," + len, len + "," + len);

            return function(t) { return interpolate(t); };
        };


var links = [];
for(var i=0, len=data.length; i<len; i++){
    // (note: loop until length - 1 since we're getting the next
    //  item with i+1)
        links.push({
            type: "LineString",
            coordinates: [
                [ base[0].long, base[0].lat ],
                [ data[i].long, data[i].lat ]
            ],
            total_waste: data[i].total_waste,
            name: data[i].name,
            units: data[i].units
        });
    }
var pathArcs = arcGroup.selectAll(".arc")
            .data(links);

        //enter
        pathArcs.enter()
            .append("path").attr({
                'class': 'arc'
            })
            .style({ 
                fill: 'none',
            });

        //update
        pathArcs.attr({
                //d is the points attribute for this path, we'll draw
                //  an arc between the points using the arc function
                d: path
            })

            .style('stroke', '#0000ff')
            .style('stroke-width', function(d) {return lineStroke(d.total_waste)})
            .style('cursor', "pointer")
            .on("mouseover", function(d) {tooltipFlow.show(d)})
            .on("mouseout", function(d) {tooltipFlow.hide(d)})
            .call(lineTransition); 


}

function updateDisplay(data){ //function is called whether system change occurs and displays the new state of the system

  d3.select(".mapDisplay").remove()
  d3.select(".holder").remove()

  d3.select("body")
        .append("div")
        .attr("class", "mapDisplay")
        .text("What you're seeing: ")
  d3.select("body")
        .append("div")
        .attr("class", "holder")
        .text(""+data.name)
  

  if (data.depth && filterDomain != "Site" && filterDomain != undefined){
    d3.select(".holder").remove()
    d3.select("body")
        .append("div")
        .attr("class", "holder")
    var result = colorKey.filter(function( obj ) {return obj.name == data.name;});
    result = result[0];

    if (data.depth == 1){
      if (mgmtTypeKey[data.name]) {data.desc = mgmtTypeKey[data.name]}
      if (UNtypeKey[data.name]) {data.desc = UNtypeKey[data.name]}
      var stringwork1 = ["= sites with " + data.desc]
      displaySVG = d3.select(".holder").append("svg")
      displaySVG.append("circle")
        //.attr("class", function(d) {return data.name})
        .style("fill", result.color)
        .style("fill-opacity", ".75")
        .attr("r", 16)
        .attr("cx", 16) 
        .attr("cy", 16)
      displaySVG.selectAll("text")
        .data(stringwork1)
         .enter()
         .append("text")
         .text(function(d){return d})
         .attr("text-anchor", "right")
         .attr("y", 20)
         .attr("x", 40)
         .attr("font-size", "16px")
         .attr("fill", "white")
    } else if (data.depth == 2){
      if (mgmtTypeKey[data.name]) {data.desc = mgmtTypeKey[data.name]; data.desc2 = UNtypeKey[data.parent.name]}
      if (UNtypeKey[data.name]) {data.desc = UNtypeKey[data.name]; data.desc2 = mgmtTypeKey[data.parent.name]}
      var stringwork2 = ["= sites with " + data.desc2+"", "= of those, sites with " + data.desc]
      var circleData = [data.parent.name, data.name]
      var result2 = colorKey.filter(function( obj ) {return obj.name == data.parent.name; });
      console.log(result2)
      result=[result2[0], result]
      console.log(result)
      displaySVG = d3.select(".holder").append("svg")
      displaySVG.selectAll("circle")
        .data(circleData)
        .enter()
        .append("circle")
        //.attr("class", function(d) {return data.parent.name})
        .style("fill", function(d, i){ return result[i].color})
        .style("fill-opacity", ".75")
        .attr("r", 16)
        .attr("cx", function(d,i){return i*400 + 16}) 
        .attr("cy", 16)
      displaySVG.selectAll("text")
        .data(stringwork2)
         .enter()
         .append("text")
         .text(function(d){return d})
         .attr("text-anchor", "right")
         .attr("y", 20)
         .attr("x", function(d,i){return i * 400 + 40})
         .attr("font-size", "16px")
         .attr("fill", "white")
    } else{
    d3.select(".holder")
    .text(""+facilityName.name)
  }
}
}