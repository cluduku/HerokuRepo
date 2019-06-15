//Creator:Chike Uduku
//Created: 06/15/2019
//Desc: Thid function handles displaying the meta data for a given sample on the index html page
function buildMetadata(sample) {
  console.log("Build metadata"); 

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    d3.json(`/metadata/${sample}`).then(function(data){
    // Use d3 to select the panel with id of `#sample-metadata`
    var pnl = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    pnl.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(data).forEach(([key,value])=>{
      pnl.append("h6").text(`${key}:${value}`);
    });
    
  });
  
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

//Creator:Chike Uduku
//Created: 06/15/2019
//Desc: Thid function handles building of a pie and bubble chart for data of a given sample
function buildCharts(sample) {
  console.log("Build new chart");

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then(function(data){
    // @TODO: Build a Pie Chart
    var trace1 = {values:data["sample_values"].slice(0,10),
                  labels:data["otu_ids"].slice(0,10),
                  hovertext:data["otu_labels"].slice(0,10),
                  type:"pie"};
    var data1 = [trace1];
    var layout1 = {title:"Pie Chart"};
    Plotly.newPlot("pie", data1, layout1);

    // @TODO: Build a Bubble Chart using the sample data
    var trace2 = {y:data["sample_values"].slice(0,10),
                  x:data["otu_ids"].slice(0,10),
                  mode: "markers",
                  marker:{
                            size:data["sample_values"].slice(0,10),
                            color:data["otu_ids"].slice(0,10)
                        },
                  text:data["otu_labels"].slice(0,10),
                  type:"bubble"};
    var data2 = [trace2];
    var layout2 = {title:"Bubble Chart", xaxis: { title: "OTU_IDS"}};
    Plotly.newPlot("bubble", data2, layout2);
  });
    
   
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
