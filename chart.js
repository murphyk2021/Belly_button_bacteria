function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h5").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {

    // 3. Create a variable that holds the samples array. 
    var sampleArray =data.samples;
    // console.log(sampleArray);

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filteredArray=sampleArray.filter(sampleObj =>sampleObj.id==sample);
    // console.log(filteredArray);

    //  5. Create a variable that holds the first sample in the array.
    var result=filteredArray[0];
    console.log(result);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_id = result.otu_ids;
    var topTen = otu_id.slice(0,10).reverse();
    var otu_labels = result.otu_labels
    var otu_labels_topTen= otu_labels.slice(0,10).reverse();
    var sample_values = result.sample_values
    var sample_values_topTen = sample_values.slice(0,10).reverse();
    // console.log(otu_id);
    // console.log(otu_labels);
    // console.log(sample_values);
    console.log(topTen);
    console.log(sample_values_topTen);
 

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    
    var yticks = topTen.map((bact) => "OTU" + bact);
    // console.log(yticks);

    // 8. Create the trace for the bar chart. 
    var trace ={
      type: 'bar',
      orientation: 'h',
      x: sample_values_topTen,
      y: yticks,
      text: otu_labels_topTen,
      marker: {
        width: 1
      },
      autosize: true
    };
      
    var barData = [trace];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found from Sample", font: {color: "black"},
    };
     
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);






     // 1. Create the trace for the bubble chart.
     var bubbleData = {
        type: 'scatter',
        x: otu_id,
        y: sample_values,
        mode: 'markers',
        marker: {
          size: sample_values,
          color: otu_id, 
          colorscale: 'Jet'},
        text: otu_labels
     };

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Isolated from Sample", font: {color: "black", size: 20},
      xaxis: {title: "OTU ID"},
      autosize: true
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", [bubbleData], bubbleLayout); 





    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var sample_washing = data.metadata.filter(individual =>individual.id==sample);

    // 2. Create a variable that holds the first sample in the metadata array.
    // 3. Create a variable that holds the washing frequency.
   
   var wfreq =parseFloat(sample_washing[0].wfreq);
   console.log(wfreq);

    // // Create the yticks for the bar chart.

    // // Use Plotly to plot the bar data and layout.
    // Plotly.newPlot();
    
    // // Use Plotly to plot the bubble data and layout.
    // Plotly.newPlot();
   
    
    // // 4. Create the trace for the gauge chart.
    var gaugeData = 
      {
        type: "indicator",
        mode: "gauge+number",
		    value: wfreq,
		    title: {text: "Belly Button Washing Frequency <br> (Washes per week)", font: {color: "black", size: 20}},
        gauge: { 
          axis: {range: [0, 10], tickwidth: 3, tickcolor: "navy"},
          bar: {color: "black"},
          borderwidth: 2,
          bordercolor: "navy",
          steps: [
            {range: [0, 2], color: "royalblue"},
            {range: [2, 4], color: "cornflowerblue"},
            {range: [4, 6], color: "lightsteelblue"},
            {range: [6, 8], color: "lightblue"},
            {range: [8, 10], color: "azure"}
            ],
          }
      };
  
    
    // // 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      width: '100%', 
      height: 325,
      // margin: { t: 0, r: 20, l: 20, b: 0 }
    };
     
     // // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", [gaugeData], gaugeLayout);
});
};
