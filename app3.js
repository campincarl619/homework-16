var svgWidth = 600;
var svgHeight = 600;

var margin = { top: 20, right: 40, bottom: 100, left: 100 };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var xSelect = false;

var svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var chart = svg.append("g");


d3.select(".chart")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

d3.csv("combinationData.csv", function(err, combData) {
	if (err) throw err;

    combData.forEach(function(data) {
    	data.alcConsumption = +data.alcConsumption;
      data.income = +data.income;
      data.veterans = +data.veterans;
    	data.totalBachelors = +data.totalBachelors;
      data.totalBachelors = +data.totalBachelors;
      data.totalAssociates = +data.totalAssociates;
      data.totalHighSchool = +data.totalHighSchool;
  });

  console.log(combData);

  var xLinearScale = d3.scaleLinear().range([0,width]);
  var yLinearScale = d3.scaleLinear().range([height,0]);

  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  var xMin;
  var xMax;
  var yMax;


  function xFindMinAndMax(dataColumnX) {
    xMin = d3.min(combData, function(data) {
      return +data[dataColumnX] * 0.8;
    });

    xMax = d3.max(combData, function(data) {
      return (+data[dataColumnX] * 1.1);
    });
  }

  function yFindMinAndMax(dataColumnX) {
    yMin = d3.min(combData, function(data) {
      return +data[dataColumnX] * 0.8;
    });

    yMax = d3.max(combData, function(data) {
      return (+data[dataColumnX] * 1.1);
    });
  }


	// xLinearScale.domain([0,d3.max(combData,function(data) {
 //  	return +data.alcConsumption * 120;
	// })]);
	// yLinearScale.domain([0,d3.max(combData,function(data) {
 //  	return +data.totalBachelors *120;
	// })]);

  var currentAxisLabelx = "alcConsumption";
  var currentAxisLabely = "totalHighSchool";
  xFindMinAndMax(currentAxisLabelx);
  yFindMinAndMax(currentAxisLabely);

  console.log("Made it here 1");  


  xLinearScale.domain([0, xMax * 100]);
  yLinearScale.domain([0, yMax* 100]);


	var toolTip = d3.tip()
		.attr("class", "tooltip")
    	.offset([-10, 0])
    	.html(function(data) {
      		var state = data.state;
      		var alcConsumption = +data.alcConsumption;
      		var totalBachelors = +data.totalBachelors;
          var totalAssociates = +data.totalAssociates;
          var totalHighSchool = +data.totalHighSchool;
          var income = +data.income;
          var veterans = +data.veterans;
          var xInfo = +data[currentAxisLabelx];
          var yInfo = +data[currentAxisLabely];
          var xLabel;
          var yLabel;

          if (currentAxisLabely === "totalBachelors") {
            yLabel = "Bachelor's Degree: ";
          } else if (currentAxisLabely === "totalAssociates") {
            yLabel = "Associate's Degree:"
          } else {
            yLabel = "High School Degree: "
          }

          if (currentAxisLabelx === "alcConsumption") {
            xLabel = "Binge Drinking: ";
          } else if (currentAxisLabelx === "veterans") {
            xLabel = "Veterans Status:";
          } else {
            xLabel = "Income Amount:";
          }
      		return ("<b>State: </b>" + state + "<br>" + yLabel + Dec(yInfo) + "%<br>" + xLabel + Dec(xInfo) + "%");
    	});

    console.log("Made it here 2");
    chart.call(toolTip);


  	chart.selectAll("circle")
  		.data(combData)
  		.enter()
  		.append("circle")
  		.attr("cx",function(data,index) {
  			return xLinearScale(+data[currentAxisLabelx] * 100);
  		})
  		.attr("cy",function(data,index) {
  			return yLinearScale(data[currentAxisLabely] * 100);
  		})
  		.attr("r","10")
  		.attr("stroke","black")
  		.attr("fill","lightblue")
  		.attr("fill-opacity", .6)
  		.on("mouseover", function(data) {
	        toolTip.show(data);
      	})
    	.on("mouseout", function(data, index) {
    		d3.selectAll("circle").attr("opacity",1);
        	toolTip.hide(data);
      	});


    console.log("Made it here 3");

 	chart.append("g")
    	.attr("transform", "translate(0," + height + ")")
      .attr("class", "x-axis")
     	.call(bottomAxis);

   	chart.append("g")
      .attr("class", "y-axis")
    	.call(leftAxis);

  	chart.append("text")
    	.attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", -30 - (height / 2	))
      .attr("dy", "1em")
      .attr("class", "axis-text active")
      .attr("data-axis-name", "totalHighSchool")
      .text("25 +, High School Degree Only");

    chart.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 20)
      .attr("x", -30 - (height / 2  ))
      .attr("dy", "1em")
      .attr("class", "axis-text inactive")
      .attr("data-axis-name", "totalAssociates")
      .text("25 +, Has Associate's Degree");

    chart.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", -30 - (height / 2  ))
      .attr("dy", "1em")
      .attr("class", "axis-text inactive")
      .attr("data-axis-name", "totalBachelors")
      .text("25 +, Has Bachelor's Degree");

  	chart.append("text")
	    .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 20) + ")")
    	.attr("class", "axis-text active")
      .attr("data-axis-name", "alcConsumption")
    	.text("Binge Drinking");

      chart.append("text")
      .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 40) + ")")
      .attr("class", "axis-text inactive")
      .attr("data-axis-name", "income")
      .text("Income Between $50,000 - $74,999");

      chart.append("text")
      .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 60) + ")")
      .attr("class", "axis-text inactive")
      .attr("data-axis-name", "veterans")
      .text("Veterans Status");

      console.log("Made it here 4");

  function labelChange(clickedAxis) {
      d3.selectAll(".axis-text")
      .filter(".active")
      .classed("active", false)
      .classed("inactive", true);
    clickedAxis.classed("inactive", false).classed("active", true);

  }

    d3.selectAll(".axis-text").on("click", function() {

      var clickedSelection = d3.select(this);
      var isClickedSelectionInactive = clickedSelection.classed("inactive");
      var clickedAxis = clickedSelection.attr("data-axis-name");
      console.log("current axis: ", clickedAxis);
      
      if (clickedAxis === "alcConsumption" || clickedAxis === "income" || clickedAxis === "veterans") {
        xSelect = true; 
      }

      if (isClickedSelectionInactive && xSelect) {

        currentAxisLabelx = clickedAxis;
        xFindMinAndMax(currentAxisLabelx);
        xLinearScale.domain([0,xMax*100]); 

        svg.select(".x-axis")
        .transition()
        .duration(1800)
        .call(bottomAxis);

        d3.selectAll("circle").each(function() {
          d3.select(this)
          .transition()
          .attr("cx", function(data) {
            return xLinearScale(+data[currentAxisLabelx]*100);
          })
          .duration(1800);
        });
        labelChange(clickedSelection);
      } else if (isClickedSelectionInactive) {
        
        currentAxisLabely = clickedAxis;
        yFindMinAndMax(currentAxisLabely);
        yLinearScale.domain([0,yMax*100]);

        svg.select(".y-axis")
        .transition()
        .duration(1800)
        .call(leftAxis);

        d3.selectAll("circle").each(function() {
          d3.select(this)
          .transition()
          .attr("cy",function(data) {
            return yLinearScale(+data[currentAxisLabely]*100);
          })
          .duration(1800)
        })
        labelChange(clickedSelection);
      }

      xSelect = false;
    });

console.log("Made it to end!");

});

function Dec(num) {
  var fix = num *100;
  return fix.toFixed(1);
}