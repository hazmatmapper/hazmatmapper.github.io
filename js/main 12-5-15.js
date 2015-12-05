//global variables

var latlongs, svg, sum, zoomer;
var projection;
var latlongsR;
var latlongRdump = [];
var facilitySum;
var exporterSum;
var typeByFacility;
var typeSum;
var bigNest;
var latlongReset, exlatlongReset;
var Isvg;
var IAsvg;
var width66, width75, height33, height66, width100, height100;
var Site;
var DisposalMethod;
var povertydata = [];
var colorKey;
var stringwork1= ["other sites"];
var results = [];
var clickCheck = true
var viewClickCheck = false
var checker = false; //checks to see whether we've run initial data crunching, essentially
var methyTypeCheck = false;
var povSVG;
var zoomed = false; //are we zoomed into rust belt?
var firstTime = true, otherTimes = false, latlongGlobal, importByYearGlobal, exportByYearGlobal, filter, currentYears;
var exporterInfo;
var icicleDump;
var domain;
var filterDomain;
var margin = {top: 10, right: 10, bottom: 25, left: 10};
var name; //the name of the chart area selected
var phase = "Solids";
var view = "Sites";
var defaultColor = "#f7f7f7";
var exDefaultColor = "#636363"
//var exporterRing = "black";
var latlongdump;
var tooltip, stateTool;
var zoom = d3.behavior.zoom()
    .scaleExtent([1, Infinity])
    .on("zoom",zoomer);
var defaultStroke = {"stroke": "black", "opacity": 1} //{"stroke": "red", "stroke-width": ".5px"}
var highlighted = {"opacity": .2}
//var defaultStrokeZoomed = {"stroke": "none"}//{"stroke": "red", "stroke-width": ".5px"}
var siteViewerHelp = false;
var footerText;
var descriptors = {};
var currImporter,currColor,globalMax, globalMin, exGlobalMax, exGlobalMin, clickyCheck, iceCheck, lastImporter; //iceCheck sees if click on site was first ice then not
var UNtypeKey = {};
var mgmtTypeKey = {};
var displaySVG;
var facilityName = {"name": ""}
//var activePlace = 666
//var pathHelp;
var IMPradius;
var EXPradius;
var lineStroke
var u, c, m, b, imp, exp, arcGroup, ports;
var filterTypesYear, filterTypesSignal;
var lambda = "200px"; lambdaNOPX = 200, lambdaPad = "215px"
var lambdaPlus = "300px"; lambdaplusNOPX = 300
var chorodump;

var mexfips = {
  "0": {
    "FIELD2":"Aguascalientes",
    "FIELD3":""
  },
  "1": {
    "FIELD2":"Baja California",
    "FIELD3":""
  },
  "2": {
    "FIELD2":"Baja California Sur",
    "FIELD3":""
  },
  "3": {
    "FIELD2":"Campeche",
    "FIELD3":""
  },
  "5": {
    "FIELD2":"Chiapas",
    "FIELD3":""
  },
  "6": {
    "FIELD2":"Chihuahua",
    "FIELD3":""
  },
  "7": {
    "FIELD2":"Coahuila",
    "FIELD3":""
  },
  "8": {
    "FIELD2":"Colima",
    "FIELD3":""
  },
  "9": {
    "FIELD2":"Distrito Federal",
    "FIELD3":""
  },
  "13": {
    "FIELD2":"Durango",
    "FIELD3":""
  },
  "9": {
    "FIELD2":"Guanajuato",
    "FIELD3":""
  },
  "10": {
    "FIELD2":"Guerrero",
    "FIELD3":""
  },
  "14": {
    "FIELD2":"Hidalgo State, Mexico",
    "FIELD3":""
  },
  "15": {
    "FIELD2":"Jalisco",
    "FIELD3":""
  },
  "21": {
    "FIELD2":"Mexico State, Mexico",
    "FIELD3":""
  },
  "18": {
    "FIELD2":"Michoacan",
    "FIELD3":""
  },
  "16": {
    "FIELD2":"Morelos",
    "FIELD3":""
  },
  "17": {
    "FIELD2":"Nayarit",
    "FIELD3":""
  },
  "18": {
    "FIELD2":"Nuevo Leon",
    "FIELD3":""
  },
  "26": {
    "FIELD2":"Oaxaca",
    "FIELD3":""
  },
  "20": {
    "FIELD2":"Puebla",
    "FIELD3":""
  },
  "22": {
    "FIELD2":"Quer�taro",
    "FIELD3":""
  },
  "23": {
    "FIELD2":"Quintana Roo",
    "FIELD3":""
  },
  "25": {
    "FIELD2":"San Luis Potosi",
    "FIELD3":""
  },
  "24": {
    "FIELD2":"Sinaloa",
    "FIELD3":""
  },
  "28": {
    "FIELD2":"Sonora",
    "FIELD3":""
  },
  "27": {
    "FIELD2":"Tabasco",
    "FIELD3":""
  },
  "29": {
    "FIELD2":"Tamaulipas",
    "FIELD3":""
  },
  "31": {
    "FIELD2":"Tlaxcala",
    "FIELD3":""
  },
  "30": {
    "FIELD2":"Veracruz",
    "FIELD3":""
  },
  "32": {
    "FIELD2":"Yucat�n",
    "FIELD3":""
  },
  "33": {
    "FIELD2":"Zacatecas",
    "FIELD3":""
  }
}
var fips= {
  "2": {
    "name": "Alaska",
    "abbreviation": "AK"
  },
  "1": {
    "name": "Alabama",
    "abbreviation": "AL"
  },
  "5": {
    "name": "Arkansas",
    "abbreviation": "AR"
  },
  "60": {
    "name": "American Samoa",
    "abbreviation": "AS"
  },
  "4": {
    "name": "Arizona",
    "abbreviation": "AZ"
  },
  "6": {
    "name": "California",
    "abbreviation": "CA"
  },
  "8": {
    "name": "Colorado",
    "abbreviation": "CO"
  },
  "9": {
    "name": "Connecticut",
    "abbreviation": "CT"
  },
  "11": {
    "name": "District of Columbia",
    "abbreviation": "DC"
  },
  "10": {
    "name": "Delaware",
    "abbreviation": "DE"
  },
  "12": {
    "name": "Florida",
    "abbreviation": "FL"
  },
  "13": {
    "name": "Georgia",
    "abbreviation": "GA"
  },
  "66": {
    "name": "Guam",
    "abbreviation": "GU"
  },
  "15": {
    "name": "Hawaii",
    "abbreviation": "HI"
  },
  "19": {
    "name": "Iowa",
    "abbreviation": "IA"
  },
  "16": {
    "name": "Idaho",
    "abbreviation": "ID"
  },
  "17": {
    "name": "Illinois",
    "abbreviation": "IL"
  },
  "18": {
    "name": "Indiana",
    "abbreviation": "IN"
  },
  "20": {
    "name": "Kansas",
    "abbreviation": "KS"
  },
  "21": {
    "name": "Kentucky",
    "abbreviation": "KY"
  },
  "22": {
    "name": "Louisiana",
    "abbreviation": "LA"
  },
  "25": {
    "name": "Massachusetts",
    "abbreviation": "MA"
  },
  "24": {
    "name": "Maryland",
    "abbreviation": "MD"
  },
  "23": {
    "name": "Maine",
    "abbreviation": "ME"
  },
  "26": {
    "name": "Michigan",
    "abbreviation": "MI"
  },
  "27": {
    "name": "Minnesota",
    "abbreviation": "MN"
  },
  "29": {
    "name": "Missouri",
    "abbreviation": "MO"
  },
  "28": {
    "name": "Mississippi",
    "abbreviation": "MS"
  },
  "30": {
    "name": "Montana",
    "abbreviation": "MT"
  },
  "37": {
    "name": "North Carolina",
    "abbreviation": "NC"
  },
  "38": {
    "name": "North Dakota",
    "abbreviation": "ND"
  },
  "31": {
    "name": "Nebraska",
    "abbreviation": "NE"
  },
  "33": {
    "name": "New Hampshire",
    "abbreviation": "NH"
  },
  "34": {
    "name": "New Jersey",
    "abbreviation": "NJ"
  },
  "35": {
    "name": "New Mexico",
    "abbreviation": "NM"
  },
  "32": {
    "name": "Nevada",
    "abbreviation": "NV"
  },
  "36": {
    "name": "New York",
    "abbreviation": "NY"
  },
  "39": {
    "name": "Ohio",
    "abbreviation": "OH"
  },
  "40": {
    "name": "Oklahoma",
    "abbreviation": "OK"
  },
  "41": {
    "name": "Oregon",
    "abbreviation": "OR"
  },
  "42": {
    "name": "Pennsylvania",
    "abbreviation": "PA"
  },
  "72": {
    "name": "Puerto Rico",
    "abbreviation": "PR"
  },
  "44": {
    "name": "Rhode Island",
    "abbreviation": "RI"
  },
  "45": {
    "name": "South Carolina",
    "abbreviation": "SC"
  },
  "46": {
    "name": "South Dakota",
    "abbreviation": "SD"
  },
  "47": {
    "name": "Tennessee",
    "abbreviation": "TN"
  },
  "48": {
    "name": "Texas",
    "abbreviation": "TX"
  },
  "49": {
    "name": "Utah",
    "abbreviation": "UT"
  },
  "51": {
    "name": "Virginia",
    "abbreviation": "VA"
  },
  "78": {
    "name": "Virgin Islands",
    "abbreviation": "VI"
  },
  "50": {
    "name": "Vermont",
    "abbreviation": "VT"
  },
  "53": {
    "name": "Washington",
    "abbreviation": "WA"
  },
  "55": {
    "name": "Wisconsin",
    "abbreviation": "WI"
  },
  "54": {
    "name": "West Virginia",
    "abbreviation": "WV"
  },
  "56": {
    "name": "Wyoming",
    "abbreviation": "WY"
  }
}

//begin script when window loads 
window.onload = initialize(); 

//the first function called once the html is loaded 
function initialize(){

  d3.csv("/abouts/descriptors.csv", function (csv) {
  for (var i = 0; i < csv.length; i++){descriptors[csv[i].type] = csv[i].description;}
  }) // load waste descriptors


  d3.text("/abouts/footer.txt", function (text) {footerText = text}) //load footer text (stuff that goes in about page)
  d3.select("body")
    .append("div")
    .attr("class", "footer")
  d3.select(".footer")
    .append("div")
    .attr("class", "aboutFooter")
    .text("About")
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
  .html("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Data last updated: 10/30/15")


    //define width variables
  width66 =  .55 * Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  width75 =  .7 * Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  height33 = .25 * Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  height66 = .6 * Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  height100 = window.innerHeight
  width100 = window.innerWidth

  svg = d3.select("body").append("svg")
    .attr("id", "mapSVG")
    .style({"height": height100-lambdaNOPX-10, "width": width100, "position": "absolute"})
    //create map projection
  projection = d3.geo.albers()
  .center([9,37])
  //.rotate([100,0])
  .scale((height100-lambdaNOPX-50)*1.3) //491, 578 . at 578, 750 is fine. at 491, not so much.
  .translate([(width100)/2, (height100-lambdaNOPX)/2]);

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
    .style({"height": lambdaNOPX/1.6+"px", "width": lambda})
    .html("HazMatMapper<br><span class='subtitle'>US Imports of Hazardous Waste from Canada and Mexico 2007-2012</span><br>")

  d3.select("body")
    .append("div")
    .attr("id", "resetter")
    .html("<img src='/data/icons/reset.svg' height='40' width='40'>")
    .on("click", reset)

  d3.select("body")
    .append("div")
    .classed("viewer", true)
    .style({"top": 10+lambdaNOPX/1.6+"px", "width": 0, "height": height100-100+"px"})
    //.html("<span class = 'intro'><p>This is a tool for exploring transnational flows of hazardous waste. While we typically think the US exports all of its most toxic waste to poorer countries, the US actually now imports more than twice as much waste from Canada and Mexico than it exports to the two countries combined.  <p> All of the sites in the US that receive waste are mapped, the size indicating the relative amount they are importing. To begin exploring, <b>hover over</b> or <b>click</b> on a site. <p> To explore in-depth, you can use the filter control to investigate how much each site imports, what types of material they import, and what they do with it. By clicking on the controls you can show only those sites importing, for instance, lead, or, for instance, only those sites performing a certain management method. At any time you can show all the importers and foreign exporters.</span>")
    //.style("display", "inline-block");

  d3.select("body")
    .append("div")
    .attr("id", "viewShowHide")
    .html("<img src='/data/icons/arrow.svg' height='40' width='40'>")
    .on("click", function(){
      if (viewClickCheck == true) {
        d3.select('.intro').remove()
        d3.select(".viewerText")
          .style("display", "none")
        d3.select(".viewer")
          .transition()
          .duration(450)
          .style("width", "0px")
        d3.select("#viewShowHide")
          .transition()
          .duration(450)
          .style({"left": "0px"})
        viewClickCheck = false
      }
      else {
        viewClickCheck = true
        d3.select("#viewShowHide")
          .transition()
          .duration(450)
          .style({"left": lambdaPlus})
        d3.select(".viewer")
          .transition()
          .duration(450)
          .style("width", lambdaPlus)
          .each("end", function(){
              d3.select(".viewerText").style("display", "block")
          })
      }
    })

  d3.select("#showHide")
    .append("div")
    .html("<img src='/data/icons/min.svg' height='40' width='40'>")
    .on("click", function(){
      if (clickCheck == true) {
        d3.select("#accordion")
          .style("display", "none")
        d3.select("#showHide")
          .style({"bottom": "20px"})
        d3.select("#mapSVG")
          .transition()
          .duration(450)
          .style({"height": height100-50})
/*          .each("end", function(){ // cut?
              if (viewClickCheck == true) {
              d3.select('.intro').remove()
              d3.select(".viewerText").remove()
              d3.select(".viewer")
                .transition()
                .duration(450)
                .style("width", "0px")
              d3.select("#viewShowHide")
                .transition()
                .duration(450)
                .style({"left": "0px"})
              viewClickCheck = false
            }
            if (view == "Sites"){
              svg.selectAll("path, circle").remove()
              projection = projectionLong//new projection terms
              zoomed = false
              zoom.translate([0,0]).scale(1)
              setMap()
              importers(latlongReset)
            }
            if (view == "States"){
              svg.selectAll("path, circle").remove()
              projection = projectionLong//new projection terms
              zoomed = false
              zoom.translate([0,0]).scale(1)
              setMap()
              setData(phase, currentYears, view)
            }
          })*/

        clickCheck = false
      }
      else {
/*          if (viewClickCheck == true) {
              d3.select('.intro').remove()
              d3.select(".viewerText").remove()
              d3.select(".viewer")
                .transition()
                .duration(450)
                .style("width", "0px")
              d3.select("#viewShowHide")
                .transition()
                .duration(450)
                .style({"left": "0px"})
              viewClickCheck = false
            }*/
        d3.select("#accordion")
          .transition()
          .duration(750)
          .style("display", "block")
        d3.select("#showHide")
          .style({"bottom": 15+lambdaNOPX/1.25+"px"})
        d3.select("#mapSVG")
          .transition()
          .duration(450)
          .style({"height": height100-lambdaNOPX-15})
/*          .each("end", function(){
            if (view == "Sites"){
              svg.selectAll("path, circle").remove()
              projection = projectionDefault //new projection terms
              zoomed = false
              zoom.translate([0,0]).scale(1)
              setMap()
              importers(latlongReset)
            }
            if (view == "States"){
              svg.selectAll("path, circle").remove()
              projection = projectionDefault//new projection terms
              zoomed = false
              zoom.translate([0,0]).scale(1)
              setMap()
              setData(phase, currentYears, view)
            }
          })*/
        clickCheck = true
      }
    })


  //create a div to wrap accordion contents into
  d3.select("#accordion")
    .append("div")
    .attr("class", "barWrap")
    .style({"height": lambdaNOPX/1.25+"px"})

  //create a div for the filter controls
  d3.select(".barWrap")
    .append("div")
    .attr("class", "filterSelector")
    .style({"width": lambda, "height": lambdaNOPX/1.25+"px"})


  //create SVGs for icicle and its y axis
  IAsvg = d3.select(".barWrap").append("svg")
    .style({"position": "absolute", "top": (lambdaNOPX/5),"width": "30px", "left": lambda, "height": lambdaNOPX/2})

  Isvg = d3.select(".barWrap").append("svg")
    .style({"position": "absolute", "top": (lambdaNOPX/5), "width": width100-lambdaNOPX*2.25, "left": lambdaNOPX+30, "height": (lambdaNOPX/2)+margin.bottom,})

var form = d3.select(".title").append("form")
var labels = form.selectAll("span").data([0]).enter().append("span")
labels.append("input")
    .attr({
        type: "text",
        id: "tags",
        value: "Find a place"
    })

//phase switcher here
filterPhases = ["Solids", "Liquids"]
var form = d3.select(".title").append("form"), j=0;
var labels = form.selectAll("span")
    .data(filterPhases)
    .enter().append("span")
labels.append("input")
    .attr({
        type: "radio",
        name: "mode",
        value: function(d, i) {return i;}
    })
    .property("checked", function(d, i) {return i===j;})
    .on("click", function(d){
      if (zoomed){reset()}
      filterDomain = "Site" // set type to Site when switching
      filterform.selectAll("#Site")
        .property("checked", true)
      phase = d
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
      d3.selectAll(".arc").remove()
      svg.selectAll("circle").transition().duration(1200).attr("r", 0).remove()//chain below so that removal only happens after r = 0
      zoom.translate([0,0]).scale(1)
      setData(d, currentYears, view) 
    })
  labels.append("label").text(function(d) {return d;})
  labels.append("text").html("&nbsp")


//site/state switcher here
filterView = ["Sites", "States"]
var form = d3.select(".title").append("form"), j=0;
var labels = form.selectAll("span")
    .data(filterView)
    .enter().append("span")
labels.append("input")
    .attr({
        type: "radio",
        name: "mode",
        value: function(d, i) {return i;}
    })
    .property("checked", function(d, i) {return i===j;})
    .on("click", function(d){
        d3.select(".viewerText").remove()
        d3.select(".descriptions").remove()
        d3.select(".povertyChart").remove()
        d3.selectAll(".yearData").remove()
        if (viewClickCheck == true) {
        d3.select('.intro').remove()
        d3.select(".viewerText")
          .style("display", "none")
        d3.select(".viewer")
          .transition()
          .duration(450)
          .style("width", "0px")
        d3.select("#viewShowHide")
          .transition()
          .duration(450)
          .style({"left": "0px"})
        viewClickCheck = false
      }
      if (zoomed){reset()}
      filterDomain = "Site" // set type to Site when switching
      view = d
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
      if (d == "Sites") {
        mapDisplay()
        svg.selectAll(".feature").transition().duration(2500).style({"fill": '#cccccc'}).style("stroke", "white");
        filterform.selectAll("input").property("disabled", false)
        filterform.selectAll("#Site")
        .property("checked", true)
      }
      if (d == "States") {
        d3.selectAll(".mapDisplay").remove()
        filterform.selectAll("input").property("disabled", true)
      } // and grey out/disable filter by...
      d3.selectAll(".arc").remove()
      svg.selectAll("circle").transition().duration(1200).attr("r", 0).remove()
      zoom.translate([0,0]).scale(1)
      setData(phase, currentYears, d) 
    })
  labels.append("label").text(function(d) {return d;})
  labels.append("text").html("&nbsp")


/*  var form = d3.select("title").append("form")
  form.append("input")
    .attr({
      type: 'search',
      value: "Nonoperational"
    })
  form.append("label").text("search")*/

  //filter types selector
  filterTypes = ["Site", "DisposalMethod", "Type"]
  var show = d3.select(".filterSelector").append("div").attr("class", "filterDiv").html("<span class='viewerCategory'>Filter by:</span>")
  var filterform = d3.select(".filterDiv").append("form"), j=0;

  var labelEnter = filterform.selectAll("span")
    .data(filterTypes)
    .enter().append("div")

  labelEnter.append("input")
    .attr({
        id: function(d) {return d},
        type: "radio",
        name: "mode",
        value: function(d, i) {return i;}
    })
    .property("checked", function(d, i) {return i===j;})
    .on("click", function(d){
      results = [];
      stringwork1= ["other sites"];
      filter = d
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
        .style({"fill": defaultColor, "fill-opacity": "1"})
      //d3.select(".mapDisplay").remove()
      d3.selectAll(".arc").remove()
      //mapDisplay()
      filterDomain = d
      icicle(window[d])
      //icicleAxis();
    });
  labelEnter.append("label").text(function(d) {return d;})
  labelEnter.append("text").html("&nbsp")


  //filter years selector
  filterTypesYear = ['2007', '2008', '2009', '2010', '2011', '2012']
  filterTypesSignal = {"2007": "on","2008": "on","2009": "on","2010": "on","2011": "on","2012": "on"}
    var show = d3.select(".filterSelector").append("div").attr("class", "yearDiv").html("<span class='viewerCategory'>Select year(s):</span>")
  var yearform = d3.select(".yearDiv").append("form");

  var labelEnter = yearform.selectAll("span")
    .data(filterTypesYear)
    .enter().append("span")

  labelEnter.append("input")
    .attr({
        type: "checkbox",
        name: "mode",
        value: function(d, i) {return i;}
    })
    .property("checked", function(d, i) {if (d!="2008"){return d};})
    .property("disabled", function(d){if (d=="2008"){return true}})
    .on("click", function(d){
      if (zoomed){reset()}
      if (filterTypesSignal[d] == "on"){
        filterTypesSignal[d] = "off"
      } else if (filterTypesSignal[d] == "off"){
        filterTypesSignal[d] = "on"
      }
      Isvg.selectAll("rect, div, g")
        .transition()
        .duration(750)
        .style("opacity", 0)
        .remove();
      IAsvg.selectAll("g")
        .transition()
        .duration(750)
        .style("opacity", 0)
        .remove();
      svg.selectAll("circle")
        .transition()
        .duration(750)
        .attr("r", 0)
        .remove();
      d3.select(".viewerText").remove()
      d3.select(".povertyChart").remove()
      d3.selectAll(".yearData").remove()
      d3.selectAll(".arc").remove()
      d3.selectAll("#importer").transition().duration(1200).attr("r", 0).remove()//chain below so that removal only happens after r = 0
      d3.selectAll("#exporters").transition().duration(1200).attr("r", 0).remove()
      //filterDomain = d
      otherTimes = true
      yearChange();

    })
    labelEnter.append("label").text(function(d) {return d;})
    labelEnter.append("br")

  //these only run first time
  setMap();
  setData(phase); 
}

function yearChange(){
  //litearlize this: return row["Year"] == "2007" || row["Year"] == "2009"
  //console.log(d3.map.values(filterTypesSignal))
  currentYears = []
  for (var n =0; n< filterTypesYear.length; n++){
    if (filterTypesSignal[filterTypesYear[n]] == "on"){
        currentYears.push(filterTypesYear[n])
    } else {
      currentYears.push("0")
    } 
  }
  //obj = "return"+obj
  //obj = obj.slice(0, obj.length-3)

  setData(phase, currentYears, view)
}

function setData(phase, years, view){
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
    d.rcra = d.rcra
    d.inputer = d.inputer
    d.filenom = d.filenom
    d.ExpectedManagementMethod = d.ExpectedManagementMethod
  });

  if (otherTimes){
    //console.log(filterTypesSignal[filterTypesYear[3]])
    data = data.filter(function(row){
      return row["Year"] == years[0] || row["Year"] == years[1] || row["Year"] == years[2] || row["Year"] == years[3] || row["Year"] == years[4] || row["Year"] == years[5]
    })
  }

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

  typeAndMethByFacility = d3.nest()
  .key(function(d) { return d.ReceivingFacilityEPAIDNumber; }) // EPA ID number
  .key(function(d) { return d.hazWasteDesc; })
  .key(function(d) { return d.mgmt; })
  .rollup(function(leaves) { return {"total_waste": d3.sum(leaves, function(d) {return d.totalQuantityinShipment;})} }) // 
  .entries(data);

  typeByExporter = d3.nest()
  .key(function(d) { return d.exporterLONG; })
  .key(function(d) { return d.hazWasteDesc; })
  .rollup(function(leaves) { return {"total_waste": d3.sum(leaves, function(d) {return d.totalQuantityinShipment;})} }) // 
  .entries(data);

  quantByExporter =d3.nest() //calculate for each importer, how much each exporter ships
  .key(function(d) { return d.ReceivingFacilityEPAIDNumber; }) // EPA ID number
  .key(function(d) { return d.exporterLONG })
  .rollup(function(leaves) { return {"total_waste": d3.sum(leaves, function(d) {return d.totalQuantityinShipment;})} }) // 
  .entries(data);

  quantByDesination =d3.nest() //calculate for each exporter, how much each desination gets
  .key(function(d) { return d.exporterLONG })
  .key(function(d) { return d.ReceivingFacilityEPAIDNumber; }) // EPA ID number
  .rollup(function(leaves) { return {"total_waste": d3.sum(leaves, function(d) {return d.totalQuantityinShipment;})} }) // 
  .entries(data);

  importByYear =d3.nest() //calculate for each importer, how much they get per year
  .key(function(d) { return d.ReceivingFacilityEPAIDNumber; }) // EPA ID number
  .key(function(d) { return d.Year})
  .rollup(function(leaves) { return {"total_waste": d3.sum(leaves, function(d) {return d.totalQuantityinShipment;})} }) // 
  .entries(data);
  if (firstTime) {importByYearGlobal = importByYear}

  exportByYear =d3.nest() //calculate for each exporter, how much they get per year
  .key(function(d) { return d.exporterLONG; }) // EPA ID number
  .key(function(d) { return d.Year})
  .rollup(function(leaves) { return {"total_waste": d3.sum(leaves, function(d) {return d.totalQuantityinShipment;})} }) // 
  .entries(data);
  if (firstTime) {exportByYearGlobal = exportByYear}

  importByState=d3.nest() //calculate for each importer, how much they get per year
  .key(function(d) { return d.importer_state; }) // EPA ID number
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
  .key(function(d) { return d.importer_state; })
  .key(function(d) {return d.receivingLong;})
  .entries(data);

  if (view == "States") {return choropleth(importByState)} // if we're looking at states, only do choropleth
  else{dataCrunch()}; //otherwise, crunch the data to get the circles
  
  firstTime=false



});
}

function choropleth(data){
    chorodump = [];
    for (var i = 0; i<data.length; i++){
      chorodump[data[i]["key"]] = data[i]["values"]["total_waste"]
    } 


    //chorodump.sort(function(a,b) {return b.total_waste-a.total_waste;})
    var max = d3.max(d3.values(chorodump));
    var min = d3.min(d3.values(chorodump));

    var color = d3.scale.quantile()
    .domain([min, max])
    .range(['#bdd7e7','#6baed6','#3182bd','#08519c']);

    d3.selectAll(".feature")
      .transition()
      .duration(2500)
      .style({"fill": function(d){
          var ddd = fips[d.id].abbreviation
          if (chorodump[ddd]){  
            return color(chorodump[ddd]) 
          } else{
            return '#eff3ff'
          }
        }
      })
      .style("stroke", "black");

    d3.select(".descriptions").remove()
    d3.select(".mapDisplay").remove()
    d3.select(".barWrap")
          .append("div")
          .attr("class", "mapDisplay")
        .style({"height": lambda, "width": lambda, "right": 0})
    var stringwork2 = [" no imports", " second quantile", " third quantile", " fourth quantile", " fifth quantile"]
    var squareData = [[16, '#eff3ff'], [16, '#bdd7e7'],[16, '#6baed6'],[16, '#3182bd'], [16,'#08519c']]

    displaySVG = d3.select(".mapDisplay").append("svg").attr("width", lambda).attr("height", lambda)
    displaySVG.selectAll("rect")
      .data(squareData)
      .enter()
      .append("rect")
      //.attr("class", function(d) {return data.parent.name})
      .style("fill", function(d){return d[1]})
      .attr("width", function(d){return d[0]})
      .attr("height", function(d){return d[0]})
      .attr("y", function(d,i){return i*40+10}) 
      .attr("x", 16)
    displaySVG.selectAll("text")
      .data(stringwork2)
       .enter()
       .append("text")
       .text(function(d){return d})
       .attr("text-anchor", "right")
       .attr("x", 40)
       .attr("y", function(d,i){return i * 40 + 20})
       .attr("font-size", "12px")
       .attr("fill", "white")
} 



/*function icicleAxis(){
  //domain calculator
var site = ["total", "importers"]
var type = ["total", "types"]
var method = ["total", "methods"]
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
    .range([0, -50]);

var yAxis = d3.svg.axis()
    .scale(yax)
    //.orient("left");
IAsvg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate("+10+","+10+")rotate(-90)")
      .call(yAxis);
}*/

function icicle(data){
var x = d3.scale.linear()
    .range([0, width100-lambdaNOPX*2.25]);

var y = d3.scale.linear()
    .range([0, (lambdaNOPX/2)-margin.bottom]);

var color = d3.scale.category20b()
  //.range(['#8dd3c7','#ffffb3','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69','#fccde5','#d9d9d9','#bc80bd','#ccebc5','#ffed6f']);

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
var iceFilter = nodes.filter(function(d) {for (n=0; n<nodes.length; n++){ if (d.depth == 1 || d.depth == 0){return d}}});
iceFilter.sort(function(a,b){return a.value-b.value})

color.domain(iceFilter)
colorKey=[];

Isvg.selectAll("rects")
    .data(iceFilter)
  .enter().append("rect")
    .attr ("class",  function(d) { return d.name} )
    .attr("x", function(d) {  return x(d.x); })
    .attr("y", function(d) { if (d.depth == 0){return y(d.y)}else{return y(.5); }})
    .attr("width", function(d) { return x(d.dx); })
    .attr("height", function(d) {return y(.5)})
    .style({"cursor": "pointer", "fill": function(d) { 
      colorKey.push({"name": d.name, "color": color((d.children ? d : d.parent).name)}); 
      if (d.name == "total"){return defaultColor} else {return color((d.children ? d : d.parent).name)}; }, "stroke": "black", "stroke-width": "1px", "opacity": 1})
    .on("mouseover", function (d) {
      //look up facility name
      //can cut?
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
      } else {siteViewerHelp = false} //tip.show(d); 
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
    .on("mouseout", function(d){ icicleDehighlight(d); tip.hide(d);}) 
    .on('click', function(d){
/*      if (filterDomain ==  "DisposalMethod" && d.depth == 1 || filterDomain ==  "Type" && d.depth == 2 || filterDomain ==  "Site" && d.depth == 3 || filterDomain ==  undefined && d.depth == 3){
        //show details of method here
        d3.select(".intro").remove()
        d3.select(".viewerText").remove()
        d3.select(".povertyChart").remove()
        d3.selectAll(".yearData").remove()
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
        d3.selectAll(".yearData").remove()
        var show = {"name": UNtypeKey[d.name]}
        ViewerHelp(show);
      }*/
      if (siteViewerHelp == true){
        for (var c = 0; c<latlongRdump.length; c++){
        if (d.name == latlongRdump[c].id){
          drawLinesOut();
          exportThis(latlongRdump[c]);
          }
        }
      } 
      if (d.depth == 0) {
        results = [];
        stringwork1= ["other sites"];
        d3.select(".viewerText").remove()
        d3.select(".descriptions").remove()
        d3.select(".povertyChart").remove()
        d3.selectAll(".yearData").remove()
        drawLinesOut()
        if (viewClickCheck == true) {
        d3.select('.intro').remove()
        d3.select(".viewerText")
          .style("display", "none")
        d3.select(".viewer")
          .transition()
          .duration(450)
          .style("width", "0px")
        d3.select("#viewShowHide")
          .transition()
          .duration(450)
          .style({"left": "0px"})
        viewClickCheck = false
      }
      }
      //clicked(d);
      //icicleImporters(d);
      icicleFilter(d);
      clickyCheck = d.name
      clicky(d);
      updateDisplay(d);
});

//construct y axis
var site = ["total", "importers"]
var type = ["total", "types"]
var method = ["total", "methods"]
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
    .range([0, -50]);

var yAxis = d3.svg.axis()
    .scale(yax)
    //.orient("left");
IAsvg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate("+10+","+10+")rotate(-90)")
      .call(yAxis);

//construct x axis
var xscale = d3.scale.linear()
    .range([10, width100-lambdaNOPX*2-15]);
var xheight = (lambdaNOPX/2)-margin.bottom
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
    .attr("x", (width100-lambdaNOPX*2)/2)
    .style("text-anchor", "middle")
    .text("Proportion of Total Waste");

/*function clicked(d) {
  if (document.getElementsByClassName(d.name)["importer"]){lastImporter = d.name; iceCheck = document.getElementsByClassName(d.name)["importer"].style["fill"]}
  x.domain([d.x, d.x + d.dx]);
  y.domain([d.y, 1]).range([d.y ? 20 : 0, lambdaNOPX/2 - margin.bottom]);



  //reconstruct x axis
var xdomain = d.value/sum
var xscale = d3.scale.linear()
    .domain([0, xdomain])
    .range([10, width100-lambdaNOPX*2-15]);
var xheight = (lambdaNOPX/2)-margin.bottom
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
    .attr("x", (width100-lambdaNOPX*2)/2)
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
  var height = lambdaNOPX/2
  if (d.depth == 0) {range = [0, height/4.5, height*2/4.5, height*3/4.5]; display = domain; // remove viewer and lines
    d3.select(".viewerText").remove()
    d3.select(".povertyChart").remove()
    d3.selectAll(".yearData").remove()
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
      .attr("transform", "translate("+(width100-lambdaNOPX*2)/16+","+5+")")
      .call(yAxis);
  };*/


};

function icicleFilter(data){
  //can cut?
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
  if (data.name == "total"){
  Isvg.selectAll("rect")
    .transition().duration(500) 
    .style({"opacity": "1"}); 
  svg.selectAll("circle")
    .transition().duration(500)
    .style(defaultStroke)
    //.style({"stroke": "yellow", "stroke-width": "2px"})} //yellow outline
  } else if (filterDomain != "Site" && filterDomain != undefined){
  Isvg.selectAll("rect")
    .transition().duration(500)
    .style({"opacity": ".2"});
  Isvg.selectAll("."+data.name)
    .transition().duration(500) 
    .style({"opacity": "1"});
    var icicleDump =[]
    //get the importers
    for (var k=0; k<data.children.length; k++){
      for (var l=0; l<data.children[k].children.length; l++){
        icicleDump.push(data.children[k].children[l])
       }
     }
    svg.selectAll("circle")
      .transition().duration(500)
      .style(highlighted)
    svg.selectAll("circle")
      .data(latlongReset).filter(function(d) {for (var n = 0; n<icicleDump.length; n++){ if (icicleDump[n].name == d.id) {return d}}})
      .transition().duration(500)
      .style(defaultStroke) 
  } else { 
    // if importer highlighted
    Isvg.selectAll("rect")
      .transition().duration(500)
      .style({"opacity": ".2"});
    Isvg.selectAll("."+data.name)
      .transition().duration(500) 
      .style({"opacity": "1"});
    svg.selectAll("circle")
      .transition().duration(500)
      .style(highlighted)
    svg.selectAll("."+data.name)
      .transition().duration(500)
      .style(defaultStroke)
  }
    //.style({"stroke": "yellow", "stroke-width": "5px"})}
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
  Isvg.selectAll("rect")
      .transition().duration(500)
      .style({"opacity": "1"});
  svg.selectAll("circle")
    .transition().duration(500)
    .style(defaultStroke)
  svg.selectAll("."+clickyCheck)
      .transition().duration(500)
    .style(defaultStroke)
    //.style({"stroke": "yellow", "stroke-width": "5px", "opacity": "1"});
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

function setMap() {


var path = d3.geo.path()
  .projection(projection);


u = svg.append("g")
c = svg.append("g")
m = svg.append("g")
b = svg.append("g")


queue()
  .defer(d3.json, "data/us2.json")
  .defer(d3.json, "data/canada.json")
  .defer(d3.json, "data/mex008.json")
  .defer(d3.json, "data/borders.json")
  .await(callback);

function callback(error, us, can, mex, borders){
  svg.call(zoom);

  var name, sum, length;

  stateTool = d3.tip()
  .attr('class', 'd3-tip')
  .offset([0, 0])
  .html(function(d) {
    return "<span style='color:white'>" + name + ": " + sum + " at " + length+ " sites</span>";
  })
  svg.call(stateTool)

  b.selectAll('path')
    .data(topojson.feature(borders, borders.objects.borders).features)
    .enter().append("path")
      .attr("d", path)
      .attr("class", "borders")

  u.selectAll("path")
    .data(topojson.feature(us, us.objects.states).features)
    .enter().append("path")
      .attr("d", path)
      .attr("class", "feature")
      .attr("id", function (d){return fips[d.id].abbreviation})
      .on("mouseover", function(d){console.log(d); statez(d); stateTool.show()})
      .on("mouseout", function(d){stateTool.hide()})
  
  c.selectAll('path')
    .data(topojson.feature(can, can.objects.provinces).features)
    .enter().append("path")
      .attr("d", path)
      .attr("class", "exporter")
      .attr("id", function (d){return d.id})
      .on("mouseover",  function(d){
        if (view == "Sites"){statez(d);stateTool.show()}})
      .on("mouseout", function(d){stateTool.hide()})

  m.selectAll('path')
    .data(topojson.feature(mex, mex.objects.mex).features)
    .enter().append("path")
      .attr("d", path)
      .attr("class", "exporter")
      .attr("id", function (d){return mexfips[d.properties.id]["FIELD2"]})
      .on("mouseover",  function(d){
        if (view == "Sites"){statez(d);stateTool.show()}})
      .on("mouseout", function(d){stateTool.hide()})



  //pathHelp=path

  function statez(data){


  if (typeof(data.id) === "string") {
    name = data.id
    var state = document.getElementsByClassName(data.id.toUpperCase())
    length = state.length
  }
  if (typeof(data.id) === "number") {
    name = fips[data.id].name
    var ddd = fips[data.id].abbreviation
    var state = document.getElementsByClassName(ddd)
    length = state.length
  }
  if (data.properties.id){
    name = mexfips[data.properties.id]["FIELD2"]
    var state = document.getElementsByClassName(name.toUpperCase())
    length = state.length
  }

  sum = 0;
  for (var k=0; k<state.length; k++){
    sum += state[k].__data__.total_waste
  }

  if (view == "States"){
   sum = chorodump[ddd]
   if (sum == undefined){sum = 0}
   length = "Not available"
  }
  
}
  /*g.append("path")
      .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
      .attr("class", "mesh")
      .attr("d", path);*/


  /*var borders = svg.append("path")
    .datum(topojson.feature(borders, borders.objects.borders))
    .attr("class", "borders")
    .attr("d", path);*/

//if(checker == true && switcher == false){importers(latlongRdump)} else{dataCrunch()}
  //switcher is whether we've switched phases
  //checker is whether we've ever crunched data
 //if checker false and switch true, data crunch
 //if checker false and switch not true, data crunch
 //if checker true and switch true, data crunch
 //if checker true and switch not true, importers


  };
};

function zoomer() {
  if (zoom.scale() > 1) {zoomed = true} else {return zoom.translate([0,0]); zoom.scale(1)} //control slippiness for arcgroup

  u.attr("transform", "translate(" + zoom.translate() + ")scale(" + zoom.scale() + ")")
      .selectAll("path").style("stroke-width", 1 / zoom.scale() + "px" );
  c.attr("transform", "translate(" + zoom.translate() + ")scale(" + zoom.scale() + ")")
      .selectAll("path").style("stroke-width", 1 / zoom.scale() + "px" );
  m.attr("transform", "translate(" + zoom.translate() + ")scale(" + zoom.scale() + ")")
      .selectAll("path").style("stroke-width", 1 / zoom.scale() + "px" );
  b.attr("transform", "translate(" + zoom.translate() + ")scale(" + zoom.scale() + ")")
      .selectAll("path").style("stroke-width", 1 / zoom.scale() + "px" );
  imp.attr("transform", "translate(" + zoom.translate() + ")scale(" + zoom.scale() + ")")
      .selectAll("circle").attr("r", function (d){return IMPradius(d.total_waste)/(zoom.scale())}).style("stroke-width", 1 / zoom.scale() + "px" )
  exp.attr("transform", "translate(" + zoom.translate() + ")scale(" + zoom.scale() + ")")
      .selectAll("circle").attr("r", function (d){return EXPradius(d.total_waste)/(zoom.scale())}).style("stroke-width", 1 / zoom.scale() + "px" )
  if(arcGroup){arcGroup.attr("transform", "translate(" + zoom.translate() + ")scale(" + zoom.scale() + ")")
      .selectAll(".arc").style('stroke-width', function(d) {return lineStroke(d.total_waste)/zoom.scale()})}
}

/*function clickedMap(d) {
  if (activePlace == d.properties.id || activePlace == d.id) {activePlace = 666; return reset()} else if (d.properties.id) {activePlace = d.properties.id}  else if (d.id) {activePlace =d.id}//mexico test

  zoomed = true;

  path = pathHelp

  var bounds = path.bounds(d),
      dx = bounds[1][0] - bounds[0][0],
      dy = bounds[1][1] - bounds[0][1],
      x = (bounds[0][0] + bounds[1][0]) / 2,
      y = (bounds[0][1] + bounds[1][1]) / 2,
      scale = .5 / Math.max(dx / width100, dy / height100-lambdaNOPX),
      translate = [width100 / 2 - scale * x, height100-lambdaNOPX / .4 - scale * y];

  if (d.id == "Quebec") {scale = scale*3, translate = [translate[0]-width66*3, translate[1]-height66*1.5]}
  if (d.id == "Ontario") {scale = scale* 3.5; translate = [translate[0]-width66*4.25, translate[1]-height66*2.5]}

  sumByState(d);

  d3.select(".mapDisplay").remove()
  mapDisplay();

  u.transition()
    .duration(750)
    .style("stroke-width", 1.5 / scale + "px")
    .attr("transform", "translate(" + translate + ")scale(" + scale + ")");
  c.transition()
    .duration(750)
    .style("stroke-width", 1.5 / scale + "px")
    .attr("transform", "translate(" + translate + ")scale(" + scale + ")");
  m.transition()
    .duration(750)
    .style("stroke-width", 1.5 / scale + "px")
    .attr("transform", "translate(" + translate + ")scale(" + scale + ")");
  b.transition()
    .duration(750)
    .style("stroke-width", 1.5 / scale + "px")
    .attr("transform", "translate(" + translate + ")scale(" + scale + ")");
  imp.transition()
    .selectAll('circle')
    .duration(750)
    //.style("stroke-width", function (d) {if (d.id == clickyCheck) {return "1px"} else {return 1 / scale + "px"}} )
    .attr("transform", "translate(" + translate + ")scale(" + scale + ")")
    .attr("r", function (d){return IMPradius(d.total_waste)/(scale/2)})
  /*ports.transition()
    .selectAll('circle')
    .duration(750)
    //.style("stroke-width", function (d) {if (d.id == clickyCheck) {return "1px"} else {return 1 / scale + "px"}} )
    .attr("transform", "translate(" + translate + ")scale(" + scale + ")")
    .attr("r", 9/scale)
  exp.transition()
    .selectAll('circle')
    .duration(750)
    //.style("stroke-width", function (d) {if (d.id == clickyCheck) {return "1px"} else {return 1 / scale + "px"}} )
    .attr("transform", "translate(" + translate + ")scale(" + scale + ")")
    .attr("r", function (d){return EXPradius(d.total_waste)/(scale/2)})
  arcGroup.transition()
    .selectAll(".arc")
    .duration(750)
    .style('stroke-width', function(d) {return lineStroke(d.total_waste)/(scale/2)})
    .attr("transform", "translate(" + translate + ")scale(" + scale + ")");



  //need to get bounds of sites... not center of state/province
   /*var center = d3.geo.centroid(d)

  .center(center)
  //.rotate([100,0])
  //.parallels([20,45])
  .scale(22000)
  .translate([width66/2, height66/2])

  d3.select("#mapSVG").remove()

  zoomed = true;
  checker = true;

  setMap(dataHelp)*/
  //svg.selectAll("#importer").remove()
  //svg.selectAll("#exporter").remove()

  //importers(latlongRdump)
  
//}

function reset() {
  //d3.select("#mapSVG").remove()
  zoomed = false;
  zoom.translate([0,0]).scale(1)

  svg.selectAll("#importer")
    .style({"fill": defaultColor, "fill-opacity": "1"})

  svg.selectAll(".arc").remove()

  d3.select(".descriptions").remove()
  d3.select(".mapDisplay").remove()
  mapDisplay();

  if (viewClickCheck == true) {
        d3.select('.intro').remove()
        d3.select(".viewerText").remove()
        d3.select(".viewerText")
          .style("display", "none")
        d3.select(".viewer")
          .transition()
          .duration(450)
          .style("width", "0px")
        d3.select("#viewShowHide")
          .transition()
          .duration(450)
          .style({"left": "0px"})
        viewClickCheck = false
      }
  u.attr("transform", "translate(" + zoom.translate() + ")scale(" + zoom.scale() + ")")
      .selectAll("path").style("stroke-width", .5 / zoom.scale() + "px" );
  c.attr("transform", "translate(" + zoom.translate() + ")scale(" + zoom.scale() + ")")
      .selectAll("path").style("stroke-width", .5 / zoom.scale() + "px" );
  m.attr("transform", "translate(" + zoom.translate() + ")scale(" + zoom.scale() + ")")
      .selectAll("path").style("stroke-width", .5 / zoom.scale() + "px" );
  b.attr("transform", "translate(" + zoom.translate() + ")scale(" + zoom.scale() + ")")
      .selectAll("path").style("stroke-width", 1 / zoom.scale() + "px" );
  imp.attr("transform", "translate(" + zoom.translate() + ")scale(" + zoom.scale() + ")")
      .selectAll("circle").attr("r", function (d){return IMPradius(d.total_waste)/(zoom.scale())}).style("stroke-width", 1 / zoom.scale() + "px" )
  exp.attr("transform", "translate(" + zoom.translate() + ")scale(" + zoom.scale() + ")")
      .selectAll("circle").attr("r", function (d){return EXPradius(d.total_waste)/(zoom.scale())}).style("stroke-width", 1 / zoom.scale() + "px" )
  if (arcGroup){arcGroup.attr("transform", "translate(" + zoom.translate() + ")scale(" + zoom.scale() + ")")
.selectAll(".arc").style('stroke-width', function(d) {return lineStroke(d.total_waste)/zoom.scale()})}
 /* b.transition()
      .duration(750)
      .style("stroke-width", "1px")
      .attr("transform", "");
  u.transition()
      .duration(750)
      .style("stroke-width", "1px")
      .attr("transform", "");
  c.transition()
      .duration(750)
      .style("stroke-width", "1px")
      .attr("transform", "");
  m.transition()
      .duration(750)
      .style("stroke-width", "1px")
      .attr("transform", "");

  imp.transition()
      .selectAll('circle')
      .duration(750)
      //.style("stroke-width", function (d) {if (d.id == clickyCheck) {return "5px"} else {return "1px"}} )
      .attr("transform", "")
      .attr("r", function (d){return IMPradius(d.total_waste)})
  ports.transition()
      .selectAll('circle')
      .duration(750)
      //.style("stroke-width", function (d) {if (d.id == clickyCheck) {return "5px"} else {return "1px"}} )
      .attr("transform", "")
      .attr("r", 3)
  exp.transition()
      .selectAll('circle')
      .duration(750)
      //.style("stroke-width", function (d) {if (d.id == clickyCheck) {return "5px"} else {return ".5px"}} )
      .attr("transform", "")
      .attr("r", function (d){return EXPradius(d.total_waste)})
  if(arcGroup){
  arcGroup.transition()
      .selectAll(".arc")
      .duration(750)
      .style('stroke-width', function(d) {return lineStroke(d.total_waste)})
      //.style("stroke-width", "1.5px")
      .attr("transform", "");
  }*/
}

function dataCrunch(data){
  latlongRdump=[];
  //get facility data ready to project
 for (var i=0; i<latlongsR.length; i++) {
    for (var j=0; j<latlongsR[i]["values"].length; j++) {
      if( parseFloat(latlongsR[i]["values"][j]["key"]) != 0) {
          latlongRdump.push({"zip": latlongsR[i]["values"][j]["values"][0]["receivingFacilityZipCode"], "long": latlongsR[i]["values"][j]["values"][0]["longitude"], "lat": latlongsR[i]["values"][j]["values"][0]["latitude"], "id": latlongsR[i]["values"][j]["values"][0]["ReceivingFacilityEPAIDNumber"], "name": latlongsR[i]["values"][j]["values"][0]["importer_name"], "address": latlongsR[i]["values"][j]["values"][0]["importer_address"], "city": latlongsR[i]["values"][j]["values"][0]["importer_city"], "state": latlongsR[i]["values"][j]["values"][0]["importer_state"], "years": [], "rank": [], "types": [], "units": latlongsR[i]["values"][j]["values"][0]["units_final"]})
      };     
    };
  };


//years here
for (var a =0; a<importByYear.length; a++){
  for(var b=0; b<latlongRdump.length; b++){
    //console.log(importByYear[a]["key"], latlongRdump[b].id)
    if (importByYear[a]["key"] == latlongRdump[b].id){
      var obj = "";
      for (var c=0; c<importByYear[a]["values"].length; c++){
        obj = obj+" a"+importByYear[a]["values"][c]["key"]
      }
      latlongRdump[b].years = obj //could add total waste and year both here?
    }
  }
}

for (var i =0; i<facilitySum.length; i++){
  for (var j=0; j<latlongRdump.length; j++){
    if (facilitySum[i]["key"] == latlongRdump[j].id){
      latlongRdump[j].total_waste = facilitySum[i]["values"]["total_waste"]
    };
  }; 
};



//put total for each type here
/*for (var i =0; i<typeByFacility.length; i++){
  var p = typeByFacility[i]["key"]
  for (var n =0; n<typeByFacility[i]["values"].length; n++){
    for (var j=0; j<latlongRdump.length; j++){
      if (typeByFacility[i]["values"][n]["key"] == latlongRdump[j].id){
        var obj = [p, typeByFacility[i]["values"][n]["values"]["total_waste"]]
        latlongRdump[j].types.push(obj)
      };
    }; 
  };
};*/

//total by type and meth

for (var e =0; e<typeAndMethByFacility.length; e++){
  for (var j=0; j<latlongRdump.length; j++){
    if (typeAndMethByFacility[e]["key"] == latlongRdump[j].id){
      for (var n =0; n<typeAndMethByFacility[e]["values"].length; n++){ //for all the different types
        //console.log(typeAndMethByFacility[e]["values"][n])
        var type = typeAndMethByFacility[e]["values"][n]["key"] //name the type
        var tots = []
        var obj = []
          for (var v =0; v<typeAndMethByFacility[e]["values"][n]["values"].length; v++){  //for all the ways of disposing the type
            //console.log(typeAndMethByFacility[e]["values"][n]["values"][v])
            var meth = typeAndMethByFacility[e]["values"][n]["values"][v]["key"] //name the mgmt meth
            var amt = typeAndMethByFacility[e]["values"][n]["values"][v]["values"]["total_waste"]
            //totals += amt
            obj[meth]=amt
            //console.log(obj)
             //[{type1: {meth1: amount1, meth2: amount2}...]
           // console.log(type)
          };
        tots[type]=obj
        latlongRdump[j].types.push(tots)
        //console.log(latlongRdump[j].types)
      }; 
    };
  };
};

//do sort and rank here
latlongRdump.sort(function(a,b) {return b.total_waste-a.total_waste;}) // note: this is helpful in order that the larger sites are drawn on the map first, allowing smaller sites to be highlighted and selected rather than swamped out/overwritten by larger ones
for (var j=0; j<latlongRdump.length; j++){
  latlongRdump[j].rank = j+1+"/"+latlongRdump.length}

if (firstTime) {latlongGlobal = latlongRdump}

latlongReset = latlongRdump;





icicle(Site);
//icicleAxis();
importers(latlongRdump);
mapDisplay();
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
 
  if (zoomed == false) {IMPradius= d3.scale.sqrt()
    .domain([min+1, max]) //don't want min to be 0
    .range([10, 30])}
  if (zoomed == true) {IMPradius = d3.scale.sqrt()
    .domain([min+1, max]) //don't want min to be 0
    .range([15, 70])}
  
  tooltip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<span style='color:white'>" + d.name + "</span>";
  })

  svg.call(tooltip)

  imp = svg.append("g")
  imp.selectAll("circle")
    .data(data)
    .enter().append("circle")
    .attr("class", function(d) {return d.id+" "+d.state+d.years+" "+d.name})
    .attr("id", "importer")
    .style("fill", defaultColor)
    .style(defaultStroke)
    .attr("cx", function(d) {return projection([d.long, d.lat])[0]; }) 
    .attr("cy", function(d) { return projection([d.long, d.lat])[1]; })
    //.attr("id", function(d){return data.state})
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
    console.log(d)
      drawLinesOut();
      exportThis(d);
      clickyCheck = d.id;
      clicky(d);
      color2(d);
      updateDisplay(d);
    })
  imp.selectAll("circle")
    .transition()
    .duration(1000)
    .attr("r", function(d) { return IMPradius(d.total_waste); })

  exporters();
 
  
  /*
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
  } */  
  
};

function sumByState(data){

  var toolio = d3.tip()
  .attr('class', 'd3-tip')
  .offset([0, 0])
  .html(function(d) {
    return "<span style='color:white'>" + d.name + "</span>";
  })

  svg.call(toolio)

  if (typeof(data.id) === "string") {
    var name = data.id
    var state = document.getElementsByClassName(data.id.toUpperCase())
    var length = state.length
  }
  if (typeof(data.id) === "number") {
    var name = fips[data.id].name
    var ddd = fips[data.id].abbreviation
    var state = document.getElementsByClassName(ddd)
    var length = state.length
  }
  if (data.properties.id){
    var name = mexfips[data.properties.id]["FIELD2"]
    var state = document.getElementsByClassName(name.toUpperCase())
    var length = state.length
  }



  var sum = 0;
  for (var k=0; k<state.length; k++){
    sum += state[k].__data__.total_waste
  }

  d3.select(".intro").remove()
  d3.select(".viewerText").remove()
  d3.select(".povertyChart").remove()
  d3.selectAll(".yearData").remove()
  

  if (view == "States"){
   sum = chorodump[ddd]
   if (sum == undefined){sum = 0}
   length = "Not available"
  }


  if (viewClickCheck == true) {
  d3.select(".viewer").append("div").attr("class", "viewerText")
  .html("<span class='importerName'>"+name+"</span><p><span class='viewerCategory'>For selected year(s):</span><p><span class = 'viewerCategory'>Total waste</span><br><span class ='viewerData'>"+sum+"<p><span class = 'viewerCategory'>Number of sites</span><br><span class ='viewerData'>"+length+"")
  } else {
        viewClickCheck = true
        d3.select("#viewShowHide")
          .transition()
          .duration(450)
          .style({"left": lambdaPlus})
        d3.select(".viewer")
          .transition()
          .duration(450)
          .style("width", lambdaPlus)
          .each("end", function(){
              d3.select(".viewer").append("div").attr("class", "viewerText")
              .html("<span class='importerName'>"+name+"</span><p><span class='viewerCategory'>For selected year(s):</span><p><span class = 'viewerCategory'>Total waste</span><br><span class ='viewerData'>"+sum+"<p><span class = 'viewerCategory'>Number of sites</span><br><span class ='viewerData'>"+length+"")

          })
      }
}

/*function ports(){
  var toolio = d3.tip()
  .attr('class', 'd3-tip')
  .offset([0, 0])
  .html(function(d) {
    return "<span style='color:white'>" + d.name + "</span>";
  })

  svg.call(toolio)

  ports = svg.append("g")
  d3.csv("data/ports.csv", function(error, data) {
    data.forEach(function (d){d.lat = +d.latitude, d.long = +d.longitude})

  ports.selectAll("circle")
    .data(data)
    .enter().append("circle")
    .attr("class", "ports")
    .style("fill", "red")
    .attr("r", 3)
    .attr("cx", function(d) {return projection([d.long, d.lat])[0]; }) 
    .attr("cy", function(d) { return projection([d.long, d.lat])[1]; })
    .on("mouseover", function(d){
      toolio.show(d);
    })
    .on("mouseout", function(d){
      toolio.hide(d);})

   
})
}
*/

function exportThis(data){
  //change latlongdump to site-specific latlongdump
  if (data.length == undefined){data = [data]}; //if we're just clicking one site, put data in an array so we can work with it below. otherwise, it's all exporters...????
  latlongdump = [];

  for (var k=0; k<data.length; k++){ //data.length should be 1?
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
  //add exporter sum to latlongdump object for symbolizing etc
  for (var i = 0; i<quantByExporter.length; i++){
    if (quantByExporter[i]["key"] == data[0].id){ //find matching importer
      for (var j=0; j<quantByExporter[i]["values"].length; j++){
        //match latlong key to exporterlong
        for (var k=0; k<latlongdump.length; k++){
          if (quantByExporter[i]["values"][j]["key"] == latlongdump[k].long) {
            latlongdump[k]["total_waste"] = quantByExporter[i]["values"][j]["values"]["total_waste"]
          };
        }
      };
    }; 
  };
  //send data off to viewer
  viewer(data, latlongdump);

  //draw lines between exporters and this site
  drawLinesOver(latlongdump, data);
}



function drawLinesOver(data, base){
  if (zoomed == false){
  //var max = d3.max(data, function(d) {return d.total_waste}),
  //min = d3.min(data, function(d) {return d.total_waste})
  lineStroke = d3.scale.sqrt()
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
  arcGroup = svg.append('g');
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
            .style("stroke", "#f33")
            .style('stroke-width', function(d) {return lineStroke(d.total_waste)})
            .style('cursor', "pointer")
            .on("mouseover", function(d) {tooltipFlow.show(d)}) //
            .on("mouseout", function(d) {tooltipFlow.hide(d)})
                //'stroke-dasharray': '5'
            .call(lineTransition); 
}
}

function drawLinesOut(){
d3.selectAll(".arc").remove();
}

function color2(data){
  console.log("Problem:", data)
  currColor = document.getElementsByClassName(data.id)["importer"].style["fill"]
  svg.selectAll("."+currImporter)
    .style({"fill": currColor, "opacity": 1});
  if(iceCheck){svg.selectAll("."+lastImporter)
    .style({"fill": iceCheck, "opacity": 1});}
  var rectColor = document.getElementsByClassName(data.id)[0].style["fill"]
  svg.selectAll("."+data.id)
    .style({"fill": rectColor, "opacity": 1});
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
    .style("opacity", function(){
      return 1
      })
}

function clicky(data){
  /*svg.selectAll("."+currImporter)
  .transition().duration(500) 
    .style({"fill": currColor, "opacity": 1});
*/
  //if (zoomed) {
    //svg.selectAll("circle") //select the current province in the DOM
    //.style("fill-opacity", "1")
    //.style(defaultStrokeZoomed);
    if (data.id){ 
    svg.selectAll("circle") 
    .transition().duration(500) 
    .style({"opacity": ".2"})
    svg.selectAll("."+data.id)
    .transition().duration(500)  
    .style({"opacity": "1"})
    //.style({"stroke": "yellow", "stroke-width": "1px", "opacity": "1"});
    } /*else if (data.name) { 
    svg.selectAll("circle")
    .transition().duration(500) 
    .style({"opacity": ".2"})
    svg.selectAll("."+data.name) 
    .transition().duration(500) 
    .style({"opacity": "1"})
    //.style({"stroke": "yellow", "stroke-width": "1px", "opacity": "1"});
    }*/
 /* } else{
    //svg.selectAll("circle")
    //.style("fill-opacity", "1")
    //.style(defaultStroke);
    if (data.id){ 
    svg.selectAll("circle") 
    .transition().duration(500) 
    .style({"opacity": ".2"})
    svg.selectAll("."+data.id) 
    .transition().duration(500) 
    .style({"opacity": "1"})
    //.style({"stroke": "yellow", "stroke-width": "5px", "opacity": "1"});
    } else if (data.name) {
    svg.selectAll("circle") 
    .transition().duration(500) 
    .style({"opacity": ".2"})
    svg.selectAll("."+data.name) 
    .transition().duration(500) 
    .style({"opacity": "1"})
    //.style({"stroke": "yellow", "stroke-width": "5px", "opacity": "1"});
    }
  }*/

}

function highlight(data){

  Isvg.selectAll("rect") 
      .transition().duration(500) 
    .style({"opacity": ".2"})
  Isvg.selectAll("."+data.id) 
  .transition().duration(500) 
    .style({"opacity": "1"});

  if (zoomed == false){
    svg.selectAll("circle")
    .transition().duration(500) 
    .style({"opacity": ".2"})
    svg.selectAll("."+data.id) 
    .transition().duration(500) 
    .style({"opacity": "1"})
  } else {
    svg.selectAll("circle") 
    .style({"opacity": ".2"})
    .transition().duration(500) 
    svg.selectAll("."+data.id) 
    .transition().duration(500) 
    .style({"opacity": "1"})
    //.style({"stroke": "yellow", "stroke-width": "1px", "opacity": "1"});
  }
};

function dehighlight(data){
  if (data.id == name){
   svg.selectAll("."+data.id)
   .transition().duration(500)  
    .style({"opacity": "1"})
    //.style(defaultStroke)
  }
  else{
  svg.selectAll("circle") 
    .transition().duration(500) 
    .style({"opacity": "1"})
    //.style(defaultStroke)
  Isvg.selectAll("rect") 
    .transition().duration(500) 
    .style({"opacity": "1"});
  }

  if (data.id == clickyCheck && zoomed == false) {
  svg.selectAll("."+data.id) 
    .transition().duration(500) 
    .style({"opacity": "1"})
    //.style({"stroke": "yellow", "stroke-width": "5px", "opacity": "1"}); //yellow outline  
  }
  if (data.id == clickyCheck && zoomed == true) {
  svg.selectAll("."+data.id)
    .transition().duration(500) 
    .style({"opacity": "1"})
    //.style({"stroke": "yellow", "stroke-width": "1px", "opacity": "1"}); //yellow outline  
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
/*          for (var z=0; z<latlongs[i]["values"][j]["values"].length; z++) {
            latlongdump[0]["types"].push(latlongs[i]["values"][j]["values"][z]["hazWasteDesc"])
          };*/
        };
      };
  for (var i =0; i<exporterSum.length-1; i++){
    for (var j=0; j<latlongdump.length; j++){
      if (exporterSum[i]["key"] == latlongdump[j].long){
        latlongdump[j].total_waste = exporterSum[i]["values"]["total_waste"]
      };
    }; 
  };
  //exporter types here
  for (var i =0; i<latlongdump.length; i++){
    for (var j=0; j<typeByExporter.length; j++){
      if (typeByExporter[j]["key"] == latlongdump[i].long){
        latlongdump[i].types = typeByExporter[j]["values"]
      };
    }; 
  };

exlatlongReset = latlongdump

//search terms
var database = []
for (var o =0; o<latlongReset.length; o++) {
  database.push({"label":latlongReset[o].name, "value":latlongReset[o].id, "category": "Importers"})
}

for (var o =0; o<latlongdump.length; o++) {
  database.push({"label":latlongdump[o].name, "value":latlongdump[o].id, "category": "Exporters"})
}

//mexfips.forEach( function (d) {database.push(d.FIELD2)})
for (var key in mexfips){database.push({"label": mexfips[key].FIELD2, "value": mexfips[key].FIELD2, "category": "Places"})}
for (var key in fips){database.push({"label": fips[key].name, "value": fips[key].abbreviation, "category": "Places"})}

$.widget( "custom.catcomplete", $.ui.autocomplete, {
    _create: function() {
      this._super();
      this.widget().menu( "option", "items", "> :not(.ui-autocomplete-category)" );
    },
    _renderMenu: function( ul, items ) {
      var that = this,
        currentCategory = "";
      $.each( items, function( index, item ) {
        var li;
        if ( item.category != currentCategory ) {
          ul.append( "<li class='ui-autocomplete-category'>" + item.category + "</li>" );
          currentCategory = item.category;
        }
        li = that._renderItemData( ul, item );
        if ( item.category ) {
          li.attr( "aria-label", item.category + " : " + item.label );
        }
      });
    }
  });
$(function() {
    var availableTags = database;
    $( "#tags" ).catcomplete({
      minLength: 3,
      autoFocus: true,  
      source: database,
      focus: function(e, ui) {
       if (ui.item.category == "Importers" || ui.item.category == "Exporters" ){
        svg.selectAll("circle")
          .style("opacity", ".2")
        svg.selectAll("."+ui.item.value)
          .style("opacity", "1")
        }
        // } else if (ui.item.category == "Places"){
        // console.log(ui.item)
        // svg.selectAll("#"+ui.item.value)
        //     .style("fill", "#dddddd");
        // }
        return false;
        },
      //close: function(e, ui ) {$("#tags")}
      select: function(e, ui) {
        event.preventDefault()
        if(e.keyCode == 13) {return false}
        if (ui.item.category == "Importers"){
          var searchSelection = latlongRdump.filter(function (d){if (d.id == ui.item.value){return d}})
          drawLinesOut();
          exportThis(searchSelection);
          clickyCheck = searchSelection.id;
          clicky(searchSelection);
          color2(searchSelection[0]);
          updateDisplay(searchSelection);
        }
        else if (ui.item.category == "Exporters"){
          var searchSelection = exlatlongReset.filter(function (d){if (d.id == ui.item.value){return d}})
          drawLinesOut();
          importThis(searchSelection);
          clickyCheck = searchSelection.id;
          clicky(searchSelection);
          updateDisplay(searchSelection);
        }
        else if (ui.item.category == "Places"){
          return false
        }
        return false;
        },
        response: function(event, ui) {
          // ui.content is the array that's about to be sent to the response callback.
          if (ui.content.length === 0) {
              alert("sorry");
              $("#tags").text("No results found");
          } else {
              $("#tags").empty();
          }
        }
    });
$("#tags").keypress(function(e) {
    var code = (e.keyCode ? e.keyCode : e.which);
    if(code == 13) { //Enter keycode
        return false;
    }
});
  });


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
  
  if (zoomed == false) {EXPradius= d3.scale.sqrt()
    .domain([min+1, max]) //don't want min to be 0
    .range([10, 30])}
  if (zoomed == true) {EXPradius = d3.scale.sqrt()
    .domain([min+1, max]) //don't want min to be 0
    .range([15, 50])}

  exp = svg.append("g")
  //add exporters to the map   

  exp.selectAll(".pin")
    .data(latlongdump)
    .enter().append("circle")
    .attr("id", "exporter")
    .attr("class", function (d) { return d.state+" "+d.id})
    .style({"fill": exDefaultColor /*, "stroke": exporterRing, "stroke-width": "3px"*/})
    .style(defaultStroke)
    .attr("cx", function(d) {return projection([d.long, d.lat])[0]; }) 
    .attr("cy", function(d) { return projection([d.long, d.lat])[1]; })
    .on("mouseover", function(d){
      tooltip.show(d);
      highlight(d);
    }) 
    .on("mouseout", function(d){
      tooltip.hide(d);
      dehighlight(d)}) 
    .on("click", function(d){drawLinesOut(d);importThis(d); clickyCheck = d.id; clicky(d); updateDisplay(d)})
  exp.selectAll("circle")
    .transition()
    .duration(1000)
    .attr("r", function(d) {return EXPradius(d.total_waste); })
  //ports();
};

function viewer(data, latlongdump){
  //implement the info panel/viewer here
  console.log(data, latlongdump)

  data = data[0]
  
  d3.select(".intro").remove()
  d3.select(".viewerText").remove()
  d3.select(".povertyChart").remove()
  d3.select(".yearData").remove()

  if (viewClickCheck == true) {
        d3.select("#viewShowHide")
            .transition()
            .duration(450)
            .style({"left": "0px"})
        d3.select(".viewer")
          .transition()
          .duration(450)
          .style("width", "0px")
          //.style("display", "none")
          .each("end", function(){
            d3.select("#viewShowHide")
              .transition()
              .duration(450)
              .style({"left": lambdaPlus})
            d3.select(".viewer")
              //.style("display", "block") 
              .transition()
              .duration(450)
              .style("width", lambdaPlus)
              .each("end", function(){
                d3.select(".viewer").append("div").attr("class", "viewerText")
                viewerHelp(data, latlongdump)
          })
         })     

      } else if (viewClickCheck == false){
        viewClickCheck = true
        d3.select("#viewShowHide")
          .transition()
          .duration(450)
          .style({"left": lambdaPlus})
        d3.select(".viewer")
          .transition()
          .duration(450)
          .style("width", lambdaPlus)
          .each("end", function(){
                d3.select(".viewer").append("div").attr("class", "viewerText")
                viewerHelp(data, latlongdump)
          })
        }
}

  function viewerHelp(data, latlongdump){

/*  var names=[]
  for (i=0;i<latlongdump.length;i++){names.push(latlongdump[i].name)}
  z=JSON.stringify(names)
  */

  // Sort the array based on the second element
  data.types.sort(function(a, b)
  {
    return b[1] - a[1];
  });
/*
  //biggest export partner
  latlongdump.sort(function(a,b) {return b.total_waste-a.total_waste;})*/

  d3.select(".viewerText")
    .html("<span class='importerName'>"+data.name+"</span><br> <span class ='viewerData'>"+data.address+", "+data.city+", "+data.state+"</span><br><a href='http://epamap14.epa.gov/ejmap/ejmap.aspx?wherestr="+data.address+" "+data.city+" "+data.state+"' target='_blank'>Open in EPA's EJView</a><p><span class='viewerCategory'>For selected year(s):</span><br><span class = 'viewerCategory'>Total imports and rank: </span><span class ='viewerData'>"+data.total_waste+" "+data.units+"..........."+data.rank+"</span>");
    // <br><span class = 'viewerCategory'>Main Export Partner</span><br><span class ='viewerData'>"+latlongdump[0].name+"</span><br><span class = 'viewerCategory'>Top Import Type</span><br><span class ='viewerData' width = '50px'>"+data.types[0][0]+": "+data.types[0][1]+" "+data.units+"</span>
    
  demographicCharts(data);
  

function demographicCharts(data){ 
//imports by type
d3.selectAll(".viewerText").append("div").attr("class", "typeChart");

d3.select(".typeChart").append("div")
  .attr("class", "povLabel")
  .html("Imports by type")

typedump = data.types

var width = lambdaplusNOPX -10
var height = lambdaNOPX / (20/typedump.length)

//height max = lambdaNOPX*1.5 = lambdaNOPX*27
//height min  = lambdaNOPX/5
//height = lanox * 1.5 / 1/length

var barheight = height/typedump.length

//implement control for svgbuild here
labelView = ["Type", "Disposal Method"]
var form = d3.select(".typeChart").append("form"), j=0;

form.append("text")
  .attr("class", "viewerCategory")
 .text("Label by: ")

var labels = form.selectAll("span")
    .data(labelView)
    .enter().append("span")

labels.append("input")
    .attr({
        type: "radio",
        name: "mode",
        value: function(d, i) {return i;}
    })
    .property("checked", function(d, i) {return i===j;})
    .on("click", function(d){
      if (d == "Type"){methyTypeCheck = false} else {methyTypeCheck = true}
      typeSVG.selectAll("text")
        .remove()
      typeLabels();
    })
  labels.append("label").text(function(d) {return d;})
  labels.append("text").html("&nbsp")

typeSVG =  d3.select(".typeChart").append("svg")
  .attr("width", width)
  .attr("height", height);

var tooltipBars = d3.tip()
  .attr('class', 'd3-tip')
  .offset([0, 0])
  .html(function(d) {
    return "<span style='color:white' style='font-size:4px'>" + d[0] + ": " +d[1] + data.units +"</span>";
  })

typeSVG.call(tooltipBars)



//sum = d3.sum(typedump[0], function(d) {return d[0][1]})
/*numbers = []
for (var i=0; i<typedump.length; i++){if (typeof(typedump[i]) == "number") {numbers.push(typedump[i])}}
typedump = typedump.filter(function(d){return typeof(d) != "number"})*/
typesum=[];
work = []
typemax =[]
typemin = []
typedumper=[]
methdumper = []

var sorted = [];
for(var key in typedump) {
  sorted[sorted.length] = d3.values(d3.values(typedump[key])[0])
}
sorted.sort(function(a,b){return b-a}); //sorts by type
//sorted.sort(function(a){for (c=1; c<sorted[a].length;c++){return sorted[a][c] - sorted[a][c-1]}})//sorts within type
//console.log(d3.values(d3.values(typedump[0])[0]))

//sort typedump before pushing to work
//typedump.sort(function(a,b){console.log(d3.sum(d3.values(d3.values(b)[0])), d3.sum(d3.values(d3.values(a)[0]))); return d3.sum(d3.values(d3.values(a)[0]))-d3.sum(d3.values(d3.values(b[0])))})


for (l=0; l<typedump.length; l++){
    typesum[l]=d3.sum(d3.values(d3.values(typedump[l])[0])) //sum by type
    typemax[l]=d3.max(d3.values(d3.values(typedump[l])[0])) //max in type
    typemin[l]=d3.min(d3.values(d3.values(typedump[l])[0]))
    //console.log(d3.values(typedump[l])[0])
    typedumper[l]=[d3.keys(typedump[l])[0],typesum[l]]
    methdumper[l]=d3.keys(d3.values(typedump[l])[0])
    //d3.values(typedump[l])[0].sort(function(a,b){console.log(a,b); return b-a})
    work[l]=d3.values(d3.values(typedump[l])[0])
    //work[l].sort(function(a,b){return b-a})
}
typedumper.sort(function(a, b){return b[1]-a[1]})

//typedump.sort(function(a,b){return d3.sum(d3.values(d3.values(b)[0]))-d3.sum(d3.values(d3.values(a[0])))})
work.sort(function(a,b) {return d3.sum(b)-d3.sum(a)})
summy = d3.sum(typesum)
maxi = d3.max(typemax)
mini = d3.min(typemin)

//here, cut typedump/work to 6?

var x = d3.scale.sqrt()
    .domain([summy, mini])
    .range([10, width]);
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


var barPadding = 3;
var spacing = 10;
var lastStart = 0
typeSVG.append("g")
    .selectAll("g")
     .data(work)
     .enter()
     .append("g")
     .selectAll("rect")
     .data(function(d,i,j){return d})
     .enter()
     .append("rect")
     .attr("y", function(d, i, j) {
        return j * barheight;
     })
     .attr("x", function(d, i, j) {
      if (x(work[j][i-1])) {
        lastStart += spacing + width - x(work[j][i-1])
        return lastStart
      }
        else {lastStart =0; return 0;} //return last d + spacing 
      })
     .attr("height", barheight - barPadding).transition().duration(750)
     .attr("width", function(d, i, j){return width - x(d)})
     .transition().duration(750)
     //.attr("class", function(d, i){ if (i == 0){return data.id}})
     .attr("fill", function(d, i, j) {
          return document.getElementsByClassName(data.id)["importer"].style.fill
        })
typeLabels();
//type labels
function typeLabels(){
lastStart=0
if (methyTypeCheck){
typeSVG.append("g")
    .selectAll("g")
     .data(methdumper)
     .enter()
     .append("g")
     .selectAll("text")
     .data(function(d,i,j){return d})
     .enter()
     .append("text")
      .text(function(d, i, j) { return d})
      .attr("y", function(d, i, j) {
      return j * barheight + (barheight - barPadding) / 1.1;
      })
      .attr("x", function(d, i, j) {if (x(work[j][i-1])) {
        lastStart += spacing + width - x(work[j][i-1])
        return lastStart
      }
        else {lastStart =0; return 0;} //return last d + spacing 
      }) //scale by x...
      .attr("class", "percentLabel") 
  } else{
typeSVG.append("g")
    .selectAll("g")
     .data(typedumper)
     .enter()
     .append("text")
      .text(function(d) { return d[0]})
      .attr("y", function(d, i, j) {
      return i * barheight + (barheight - barPadding) / 1.1;
      })
      .attr("x", function(d, i, j) {if (x(work[i][j-1])) {
        lastStart += spacing + width - x(work[i][j-1])
        return lastStart
      }
        else {lastStart =0; return 0;} //return last d + spacing 
      }) //scale by x...
      .attr("class", "percentLabel") 
    }   
}


//poverty chart
d3.selectAll(".viewerText").append("div").attr("class", "povertyChart");

d3.select(".povertyChart").append("div")
  .attr("class", "povLabel")
  .html("<p>% in poverty near site")

var width = lambdaplusNOPX - 10
var height = lambdaNOPX/6

  povSVG =  d3.select(".povertyChart").append("svg")
    .attr("width", width)
    .attr("height", height);
//match zips
  d3.csv("data/poverty.csv", function(povdata) {
    povertydata = povdata.map(function(d) { return {"Geography": d["Geography"], "percentPoverty": +d["percentPoverty"], "RecFacName": d["RecFacName"], "RecZip": +d["RecZip"], "RecPcntPoverty": +d["RecPcntPoverty"]}; });

  var censusDump
    for (var i =0; i<povertydata.length-1; i++){
      if (povertydata[i].RecZip === data.zip){
        censusDump = povertydata[i].RecPcntPoverty
      };
    };

  var povdump;
  for (var i =0; i<povertydata.length-1; i++){
      if (povertydata[i].Geography == data.zip){
        povdump = [povertydata[i].percentPoverty, censusDump, povertydata[0].percentPoverty]
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
var barPadding = 3;
povSVG.selectAll("rect")
     .data(povdump)
     .enter()
     .append("rect")
     .attr("y", function(d, i) {
        return i * (height / povdump.length);
     })
     .attr("x", function(d) { return 0; })
     .attr("height", height / povdump.length - barPadding).transition().duration(750)
     .attr("width", function(d){ return width - x(d)}).transition().duration(750)
     .attr("class", function(d, i){ if (i == 0){return data.id}})
     .attr("fill", function(d, i) {
        if (i != 2) {
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
            if (d == undefined) {return "Not available"} else{
            return d3.round(d, 1)+"%";
            }
         })
         .attr("y", function(d, i) {
            return i * (height / povdump.length) + (height / povdump.length - barPadding) / 1.1;
         })
         .attr("x", function(d) { return 16; })
         .attr("class", "percentLabel")

povSVG.selectAll("label")
    .data(povdump)
         .enter()
         .append("text")
         .text(function(d, i) {
            if (i == 0) {return "Site zipcode"}
            else if (i == 1) {return "Site census tract"}
            else{return "Ntl. Average"}
         })

         .attr("y", function(d, i) {
            return i * (height / povdump.length) + (height / povdump.length - barPadding) / 1.1;
         })
         .attr("x", width - 100)
         .attr("font-size", "8px")
         .attr("fill", exDefaultColor)
         //.attr("font-weight", "bold");

  });




  
  //minority chart

  d3.select(".povertyChart").append("div")
    .attr("class", "raceLabel")
    .html("<p>% non-white near site")

  rSVG =  d3.select(".povertyChart").append("svg")
    .attr("width", width)
    .attr("height", height);

  d3.csv("data/minority.csv", function(rdata) {
    racedata = rdata.map(function(d) { return {"Geography": d["Geography"], "percentMinority": +d["percentMinority"], "RecFacName": d["RecFacName"], "RecZip": +d["RecZip"], "RecPcntNonwhite": +d["RecPcntNonwhite"]}});
  
  var censusDump
    for (var i =0; i<racedata.length-1; i++){
      if (racedata[i].RecZip === data.zip){
        censusDump = racedata[i].RecPcntNonwhite
      };
    };

  var racedump;
  for (var i =0; i<racedata.length-1; i++){
      if (racedata[i].Geography == data.zip){
        racedump = [racedata[i].percentMinority, censusDump, racedata[0].percentMinority]
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
var barPadding = 3;
rSVG.selectAll("rect")
     .data(racedump)
     .enter()
     .append("rect")
     .attr("y", function(d, i) {
        return i * (height / racedump.length);
     })
     .attr("x", function(d) { return 0; })
     .attr("height", height / racedump.length - barPadding).transition().duration(750)
     .attr("width", function(d){ return width-x(d)}).transition().duration(750)
     .attr("class", function(d, i){ if (i == 0){return data.id}})
     .attr("fill", function(d, i) {
        if (i != 2) {
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
         .text(function(d){if (d == undefined) {return "Not available"} else{return d3.round(d, 1)+"%"}})
         .attr("y", function(d, i) {
            return i * (height / racedump.length) + (height / racedump.length - barPadding) / 1.1;
         })
         .attr("x", function(d) { return 16; })
         .attr("class", "percentLabel")
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

//FOR DISPLAYING MANIFESTS
/*d3.select(".povertyChart").append("div")
    .attr("class", "Manifests")
    .html("<p>Manifests")*/

}

yearData(data);

function yearData(data){
  d3.selectAll(".viewerText").append("div").attr("class", "yearData");
  d3.select(".yearData").append("div")
  .attr("class", "povLabel")
  .html("<p>Imports by year")

  d3.select(".yearData").append("div")
    .attr("class", "yearChart")

  var width = lambdaplusNOPX - 10
  var height = lambdaNOPX/3


  //do work here getting imports by year for importer
  var years= ["2007","2008","2009","2010","2011","2012"] 
   var yearskey = {"2007":0,"2008":0,"2009":0,"2010":0,"2011":0,"2012":0}
  for (var i = 0; i<importByYearGlobal.length; i++){
    if (importByYearGlobal[i]["key"] == data.id){ //find matching importer
          for (var k=0; k<importByYearGlobal[i]["values"].length; k++){
            x=importByYearGlobal[i]["values"][k]["key"]
              yearskey[x] = importByYearGlobal[i]["values"][k]["values"]["total_waste"]
            } 
          }
        }
   yearskey = [yearskey["2007"],yearskey["2008"],yearskey["2009"],yearskey["2010"],yearskey["2011"],yearskey["2012"]]

  var maxi = d3.max(yearskey, function(d){return d})
  var mini = d3.min(yearskey, function(d){return d})
  
  yearSVG =  d3.select(".yearChart").append("svg")
    .attr("width", width)
    .attr("height", height);

  var x = d3.scale.sqrt()
    .domain([maxi, mini])
    .range([0,width]);

  var barPadding = 3;

  var tooltipBars = d3.tip()
  .attr('class', 'd3-tip')
  .offset([0, 0])
  .html(function(d) {
    return "<span style='color:white' style='font-size:4px'>" + d + data.units +"</span>";
  })

 yearSVG.call(tooltipBars)

  yearSVG.selectAll("rect")
     .data(yearskey)
     .enter()
     .append("rect")
    .on("mouseover", function(d){
    tooltipBars.show(d)
   })
    .on("mouseout", function(d){
    tooltipBars.hide(d)
   })
    .attr("y", function(d, i) {
        return i * (height / yearskey.length);
     })
     .attr("x", function(d) { return 0; })
     .attr("height", height / yearskey.length - barPadding).transition().duration(750)
     .attr("width", function(d){ return width - x(d)}).transition().duration(750)
     .attr("class", data.id)
     .attr("fill", function(d) {return document.getElementsByClassName(data.id)[0].style.fill})



  yearSVG.selectAll("text")
     .data(yearskey)
     .enter()
     .append("text")
     .text(function(d,i) {
      return years[i]
     })
      .attr("y", function(d, i) {
            return i * (height / yearskey.length) + (height / yearskey.length - barPadding) / 1.1;
         })
      .attr("x", function(d) { return 16; })
     .attr("class", "percentLabel")
}
}


function exportViewer(data, latlongdump){

  //implement the info panel/viewer here
  data=data[0]
  d3.select(".intro").remove()
  d3.selectAll(".viewerText").remove()
  d3.selectAll(".povertyChart").remove()
  d3.selectAll(".yearData").remove()
  //d3.selectAll(".viewer").append("div").attr("class", "viewerText");

  if (viewClickCheck == true) {
        d3.select("#viewShowHide")
            .transition()
            .duration(450)
            .style({"left": "0px"})
        d3.select(".viewer")
          .transition()
          .duration(450)
          .style("width", "0px")
          //.style("display", "none")
          .each("end", function(){
            d3.select("#viewShowHide")
              .transition()
              .duration(450)
              .style({"left": lambdaPlus})
            d3.select(".viewer")
              //.style("display", "block") 
              .transition()
              .duration(450)
              .style("width", lambdaPlus)
              .each("end", function(){
                d3.select(".viewer").append("div").attr("class", "viewerText")
                viewerHelp(data, latlongdump)
          })
         })     

      } else if (viewClickCheck == false){
        viewClickCheck = true
        d3.select("#viewShowHide")
          .transition()
          .duration(450)
          .style({"left": lambdaPlus})
        d3.select(".viewer")
          .transition()
          .duration(450)
          .style("width", lambdaPlus)
          .each("end", function(){
                d3.select(".viewer").append("div").attr("class", "viewerText")
                viewerHelp(data, latlongdump)
          })
        }
function viewerHelp(data, latlongdump){
/*  var names=[]
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
  */
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



  d3.selectAll(".viewerText").html("<span class='importerName'>"+data.name+"</span><br><span class ='viewerData'>"+data.address+", "+data.city+", "+data.state+"</span><br><a href='http://maps.google.com/?q="+data.address+" "+data.city+" "+data.state+"' target='_blank'>Open in Google Maps</a><p><span class = 'viewerCategory'>Total exports and rank</span><br><span class ='viewerData'>"+data.total_waste+" "+data.units+"..........."+data.rank+"<p></span>")


//exports by type
d3.selectAll(".viewerText").append("div").attr("class", "typeChart");

typedump = []
for (var e=0; e<data.types.length; e++){
  typedump[e] = [data.types[e].key,data.types[e].values.total_waste]
}

d3.select(".typeChart").append("div")
  .attr("class", "povLabel")
  .html("Exports by type <p>")

var width = lambdaplusNOPX -10
var height = lambdaNOPX/3
var barheight = height/6

typeSVG =  d3.select(".typeChart").append("svg")
  .attr("width", width)
  .attr("height", height);

var tooltipBars = d3.tip()
  .attr('class', 'd3-tip')
  .offset([0, 0])
  .html(function(d) {
    return "<span style='color:white' style='font-size:4px'>" + d[0] + ": " +d[1] + data.units +"</span>";
  })

typeSVG.call(tooltipBars)

var maxi = d3.max(typedump, function(d){return d[1]})
var mini = d3.min(typedump, function(d){return d[1]})

var x = d3.scale.sqrt()
    .domain([maxi, mini])
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
var barPadding = 3;
typeSVG.selectAll("rect")
     .data(typedump)
     .enter()
     .append("rect")
      .on("mouseover", function(d){
      tooltipBars.show(d)
      })
      .on("mouseout", function(d){
      tooltipBars.hide(d)
      })
     .attr("y", function(d, i) {
        return i * barheight;
     })
     .attr("x", function(d) { return 0; })
     .attr("height", barheight - barPadding).transition().duration(750)
     .attr("width", function(d){ return width - x(d[1])}).transition().duration(750)
     //.attr("class", function(d, i){ if (i == 0){return data.id}})
     .attr("fill", function(d, i) {
          return document.getElementsByClassName(data.id)["exporter"].style.fill
        })
typeSVG.selectAll("text")
         .data(typedump)
         .enter()
         .append("text")
         .text(function(d) {
            if (d == undefined) {return "Not available"} else{
            return d[0];
            }
         })
         .attr("y", function(d, i) {
            return i * barheight + (barheight - barPadding) / 1.1;
         })
         .attr("x", function(d) { return 16; })
         .attr("class", "percentLabel")


  d3.selectAll(".viewerText").append("div").attr("class", "yearData");
  d3.select(".yearData").append("div")
  .attr("class", "povLabel")
  .html("Exports by year <p>")

  d3.select(".yearData").append("div")
    .attr("class", "yearChart")

  var width = lambdaplusNOPX - 10
  var height = lambdaNOPX/3


  //do work here getting imports by year for exporter
  var years= ["2007","2008","2009","2010","2011","2012"] 
   var yearskey = {"2007":0,"2008":0,"2009":0,"2010":0,"2011":0,"2012":0}
  for (var i = 0; i<exportByYearGlobal.length; i++){
    if (exportByYearGlobal[i]["key"] == data.long){ //find matching importer
          for (var k=0; k<exportByYearGlobal[i]["values"].length; k++){
            x=exportByYearGlobal[i]["values"][k]["key"]
              yearskey[x] = exportByYearGlobal[i]["values"][k]["values"]["total_waste"]
            } 
          }
        }
   yearskey = [yearskey["2007"],yearskey["2008"],yearskey["2009"],yearskey["2010"],yearskey["2011"],yearskey["2012"]]

  var maxi = d3.max(yearskey, function(d){return d})
  var mini = d3.min(yearskey, function(d){return d})
  
  yearSVG =  d3.select(".yearChart").append("svg")
    .attr("width", width)
    .attr("height", height);

  var x = d3.scale.sqrt()
    .domain([maxi, mini])
    .range([0,width]);

  var barPadding = 3;

 var tooltipBars = d3.tip()
  .attr('class', 'd3-tip')
  .offset([0, 0])
  .html(function(d) {
    return "<span style='color:white' style='font-size:4px'>" + d + data.units +"</span>";
  })

 yearSVG.call(tooltipBars)

  yearSVG.selectAll("rect")
     .data(yearskey)
     .enter()
     .append("rect")
    .on("mouseover", function(d){
    tooltipBars.show(d)
   })
    .on("mouseout", function(d){
    tooltipBars.hide(d)
   })
    .attr("y", function(d, i) {
        return i * (height / yearskey.length);
     })
     .attr("x", function(d) { return 0; })
     .attr("height", height / yearskey.length - barPadding).transition().duration(750)
     .attr("width", function(d){ return width - x(d)}).transition().duration(750)
     .attr("class", data.id)
     .attr("fill", function(d) {return document.getElementsByClassName(data.id)[0].style.fill})



  yearSVG.selectAll("text")
     .data(yearskey)
     .enter()
     .append("text")
     .text(function(d,i) {
      return years[i]
     })
      .attr("y", function(d, i) {
            return i * (height / yearskey.length) + (height / yearskey.length - barPadding) / 1.1;
         })
      .attr("x", function(d) { return 16; })
     .attr("class", "percentLabel")











};
};

function printThis(latlongdump){
  for (i=0;i<latlongdump.length;i++){document.write(latlongdump[i].name)}
}

function importThis(data){
  //change latlongdump to site-specific latlongdump
  if (data.length == undefined){data = [data]}; //if we're just clicking one site, put data in an array so we can work with it below. otherwise, it's all exporters...
  //construct object with exporters to...
  console.log("look here", data)
  latlongdump = [];
  for (var k=0; k<data.length; k++){
   for (var i=0; i<latlongs.length; i++) {
    for (var j=0; j<latlongs[i]["values"].length; j++) {
        if (latlongs[i]["values"][j]["values"][0]["exporterLONG"] == data[k].long) {
          latlongdump.push({"long": latlongs[i]["values"][j]["values"][0]["receivingLong"], "lat": latlongs[i]["values"][j]["values"][0]["receivingLat"], "name": latlongs[i]["values"][j]["values"][0]["importer_name"], "id": latlongs[i]["values"][j]["values"][0]["ReceivingFacilityEPAIDNumber"], "units": latlongs[i]["values"][j]["values"][0]["units_final"], "types": [], "total_waste": 0}) //lat longs of the importing waste sites
          for (var z=0; z<latlongs[i]["values"][j]["values"].length; z++) {
            for (var x=0;x<latlongdump.length;x++){
              latlongdump[x]["types"].push([latlongs[i]["values"][j]["values"][z]["hazWasteDesc"],latlongs[i]["values"][j]["values"][z]["totalQuantityinShipment"], latlongs[i]["values"][j]["values"][0]["importer_name"]])
            };
          };
          
        };

        };     
      };
    };
    for (var i = 0; i<quantByDesination.length; i++){
     // console.log(quantByDesination[i], data.long)
    if (quantByDesination[i]["key"] == data[0].long){ //find matching importer
      for (var j=0; j<quantByDesination[i]["values"].length; j++){
        //match latlong key to exporterlong
        for (var k=0; k<latlongdump.length; k++){
          if (quantByDesination[i]["values"][j]["key"] == latlongdump[k].id) {
            latlongdump[k]["total_waste"] = quantByDesination[i]["values"][j]["values"]["total_waste"]
          };
        }
      };
    }; 
  };


  exportViewer(data, latlongdump)
  //draw lines between importers and this site
  exDrawLinesOver(latlongdump, data);
}



function exDrawLinesOver(data, base){
  if (zoomed == false){
  lineStroke = d3.scale.sqrt()
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

 arcGroup = svg.append('g');
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

            .style('stroke', "#f33")
            .style('stroke-width', function(d) {return lineStroke(d.total_waste)})
            .style('cursor', "pointer")
            .on("mouseover", function(d) {tooltipFlow.show(d)})//
            .on("mouseout", function(d) {tooltipFlow.hide(d)})
            .call(lineTransition); 

}
}

function mapDisplay(){ //show steady state of system - ports, importers, and exporters
  d3.select(".mapDisplay").remove(); 
  d3.select(".barWrap")
        .append("div")
        .attr("class", "mapDisplay")
        .style({"height": lambda, "width": lambda, "right": 0})

  globalMean = sum/latlongReset.length
  exglobalMean = sum/exlatlongReset.length

  radius= d3.scale.sqrt()
    .domain([globalMin+1, globalMax]) //don't want min to be 0
    .range([10, 30])

  var stringwork2 = ["Importer min, mean, max","Exporter min, mean, max"]
  var circleData = [[globalMax, defaultColor], [globalMean, defaultColor], [globalMin, defaultColor], [exGlobalMax, exDefaultColor], [exglobalMean, exDefaultColor], [exGlobalMin, exDefaultColor]]
  var circleSpot = [35, 50, 53, 110, 125, 128] //calculate based on math....

  displaySVG = d3.select(".mapDisplay").append("svg").attr("width", lambda).attr("height", lambda)
  leg = displaySVG.append("g")
  leg.selectAll("circle")
    .data(circleData)
    .enter()
    .append("circle")
    //.attr("class", function(d) {return data.parent.name})
    .style("fill", function(d){return d[1]})
    .style(defaultStroke)
    .attr("r", function(d){return radius(d[0])})
    .attr("cy", function(d,i){
      return circleSpot[i]
    }) 
    .attr("cx", 35)
 leg.selectAll("text")
    .data(stringwork2)
     .enter()
     .append("text")
     .text(function(d){return d})
     .attr("text-anchor", "middle")
     .attr("x", 70)
     .attr("y", function(d,i){if (i>0){return 150} else{return 75}})
     .attr("font-size", "12px")
     .attr("fill", "white")
}

function updateDisplay(data){ //function is called whether system change occurs and displays the new state of the system
  if (data.depth == 0) {return mapDisplay()}

  //lookup data.name console.log(data)
  var name = data.name
  if (mgmtTypeKey[data.name]) {data.desc, name = mgmtTypeKey[data.name]}
  if (UNtypeKey[data.name]) {data.desc, name = UNtypeKey[data.name]}

  d3.select(".descriptions").remove()


  if (data.depth && filterDomain != "Site" && filterDomain != undefined){

  console.log(document.getElementsByClassName("barWrap"))
    d3.select(".barWrap").append("div").attr("class", "descriptions")
      .style({"left": lambdaNOPX+30+"px","top": 10+"px"}) //calculate based on bar rwap?
      .html("<span class = 'importerName'>"+name+"</span>....<span class = 'viewerData'>"+descriptors[name]+"</span>")

    d3.select(".mapDisplay").remove()
    d3.select(".barWrap")
        .append("div")
        .attr("class", "mapDisplay")
        .style({"height": lambda, "width": lambda, "right": 0})

    var result = colorKey.filter(function( obj ) {return obj.name == data.name;});
    result = result[0];
    results.splice(0,0,result)
    console.log(results)

    if (data.depth == 1){
      if (mgmtTypeKey[data.name]) {data.desc = mgmtTypeKey[data.name]}
      if (UNtypeKey[data.name]) {data.desc = UNtypeKey[data.name]}
      tempString = "sites with " + data.desc
      stringwork1.splice(0,0,tempString)

      displaySVG = d3.select(".mapDisplay").append("svg").attr("width", lambda).attr("height", lambda)
      displaySVG.selectAll("circle")
        .data(stringwork1)
        .enter()
        .append("circle")
        //.attr("class", function(d) {return data.name})
        .style("fill", function(d,i) {if (i==stringwork1.length-1){return defaultColor} else {return results[i].color}})
        .style(defaultStroke)
        .attr("r", 16)
        .attr("cy", function(d,i){return i*50 + 16}) 
        .attr("cx", 16)


      displaySVG.selectAll("text")
        .data(stringwork1)
         .enter()
         .append("text")
         .text(function(d){return d})
         //.attr("text-anchor", "right")
         .attr("x", 0)
         .attr("y", function (d, i){return 42+ i*50})
         .attr("font-size", "12px")
         .attr("fill", "white")
    } /*else if (data.depth == 2){ ///can cut???
      if (mgmtTypeKey[data.name]) {data.desc = mgmtTypeKey[data.name]; data.desc2 = UNtypeKey[data.parent.name]}
      if (UNtypeKey[data.name]) {data.desc = UNtypeKey[data.name]; data.desc2 = mgmtTypeKey[data.parent.name]}

      if (filterDomain == "DisposalMethod"){var stringwork2 = ["= sites with " + data.desc2+"", "= sites doing " + data.desc2 + " of "+ data.desc]}
      if (filterDomain == "Type"){var stringwork2 = ["= sites with " + data.desc2+"", "= sites doing " + data.desc + " of "+ data.desc2]}
      var circleData = [data.parent.name, data.name]

      var result2 = colorKey.filter(function( obj ) {return obj.name == data.parent.name; });
      result=[result2[0], result]
      displaySVG = d3.select(".mapDisplay").append("svg")
      displaySVG.selectAll("circle")
        .data(circleData)
        .enter()
        .append("circle")
        //.attr("class", function(d) {return data.parent.name})
        .style("fill", function(d, i){ return result[i].color})
        .style(defaultStroke)
        .attr("r", 16)
        .attr("cy", function(d,i){return i*50 + 16}) 
        .attr("cx", 16)
      displaySVG.selectAll("text")
        .data(stringwork2)
         .enter()
         .append("text")
         .text(function(d){return d})
         .attr("text-anchor", "right")
         .attr("x", 0)
         .attr("y", function (d, i){return 42+ i*50})
         .attr("font-size", "12px")
         .attr("fill", "white")
    } */
}
}