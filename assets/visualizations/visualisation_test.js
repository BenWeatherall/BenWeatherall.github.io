looker.plugins.visualizations.add({
  // Id and Label are legacy properties that no longer have any function besides documenting
  // what the visualization used to have. The properties are now set via the manifest
  // form within the admin/visualizations page of Looker
  id: "visualisation_test",
  label: "Visualisation Test",
  options: {
  },
  // Set up the initial state of the visualization
  create: function (element, config) {

    // Insert a <style> tag with some styles we'll use later.
    element.innerHTML = `
      <style>
      .hello-world-vis {
        height: 100%;
        border-radius: 25px;
        border: 2px solid #73AD21;
        padding: 20px; 
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        text-align: center;
      }
      
      .pivot {
        border:2px solid #0094ff;
        width: 200px;
      }
      
      .pivot h2 {
        background:#0094ff;
        color:white;
        padding:10px;
      }
      
      .pivot p {
        color:#333;
        padding:10px;
      }
      
      .pivot {
        border-radius: 10px;
      }

      .pivot-title h2{
        margin-top: 0px;
      }
      
      .metric {
        display: flex;
        flex-direction: column;
        justify-content: center;
        text-align: center;
        padding:5px;
      } 
      
      .metric h3 {	
        font-size: 1em;
        margin-block-start: 0px;
        margin-block-end: 0px;
      }
      
      .metric h4 {
        font-size: .75em;
        margin-block-start: 0.25em;
      }

      .selected h2 { 
        background:#284a63;
      }
      </style>
    `;

    // Create a parent element to house our pivots.
    var container = element.appendChild(document.createElement("div"));
    // container.className = "hello-world-vis";

    this._container = container.appendChild(document.createElement("div"));
    this._container.className = "hello-world-vis"
  },
  crossFilter: function (evt) {

    LookerCharts.Utils.toggleCrossfilter({
      pivot: this,
      event: evt,
    });

  },
  // Render in response to the data or settings changing
  updateAsync: function (data, element, config, queryResponse, details, done) {

    this._container.innerHTML = "";
    // Clear any errors from previous updates
    this.clearErrors();

    if (Object.keys(queryResponse.totals_data).length < 1) {
      // Won't support for now
      this.addError({ title: "No totals", message: "This chart requires column totals." });
      console.error("No Totals");
      return;
    }
    // Generate Tab for Totals (Sum)
    var sumName = "Total";

    var sumElement = this._container.appendChild(document.createElement("div"));
    sumElement.className = "pivot";

    sumTitle = sumElement.appendChild(document.createElement("div"));
    sumTitle.className = "pivot-title";
    sumTitle.innerHTML = `<h2>${sumName}</h2>`;

    // d3.select('.pivot-title').style("color", "blue");

    // iterate over metrics for sum
    // iterate over metrics
    for (var metricIdx = 0; metricIdx < queryResponse.fields.measures.length; metricIdx += 1) {
      var metricName = queryResponse.fields.measures[metricIdx].name;
      var metricLabel = queryResponse.fields.measures[metricIdx].label_short;

      var metricElement = sumElement.appendChild(document.createElement("div"));
      metricElement.className = "metric";

      metricElement.innerHTML = `
            <h3>${queryResponse.totals_data[metricName].html}</h3>
            <h4>${metricLabel}</h4>
            `;
    }

    // Generate Barchart

    // We are done rendering! Let Looker know.
    done()
  }
});