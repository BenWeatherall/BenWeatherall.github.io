looker.plugins.visualizations.add({
  // Id and Label are legacy properties that no longer have any function besides documenting
  // what the visualization used to have. The properties are now set via the manifest
  // form within the admin/visualizations page of Looker
  id: "hello_world",
  label: "Hello World",
  options: {
    font_size: {
      type: "string",
      label: "Font Size",
      values: [
        { "Large": "large" },
        { "Small": "small" }
      ],
      display: "radio",
      default: "large"
    }
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
          -moz-border-radius-topright:5px;
          -moz-border-radius-topleft:5px;
          -webkit-border-top-right-radius:5px;
          -webkit-border-top-left-radius:5px;
      }
      
      .metric {
        display: flex;
        flex-direction: column;
        justify-content: center;
        text-align: center;
        padding:5px;
      } 
      
      .metric h3 {	
        font-size: 1em
      }
      
      .metric h4 {
        font-size: .75em
      }
      </style>
    `;

    // Create a parent element to house our pivots.
    this._container = element.appendChild(document.createElement("div"));
    this._container.className = "hello-world-vis";

  },
  // Render in response to the data or settings changing
  updateAsync: function (data, element, config, queryResponse, details, done) {
    /*
    console.log('updateAsync');
    console.log('updateAsync::data');
    console.log(data);
    console.log('updateAsync::element');
    console.log(element);
    console.log('updateAsync::config');
    console.log(config);
    console.log('updateAsync::queryResponse');
    console.log(queryResponse);
    console.log('updateAsync::details');
    console.log(details);
    console.log('updateAsync::done');
    console.log(done);
    */

    // Clear any errors from previous updates
    this.clearErrors();

    // Throw some errors and exit if the shape of the data isn't what this chart needs
    if (queryResponse.fields.dimensions.length == 0) {
      this.addError({ title: "No Dimensions", message: "This chart requires dimensions." });
      console.logError("No Dimensions");
      return;
    }

    var pivotCount = queryResponse.fields.pivots.length;


    if (pivotCount != 1) { // We aren't pivoting; handle data differently
      // Won't support for now
      this.addError({ title: "No Pivots", message: "This chart requires one pivot dimension." });
      console.logError("No Pivots");
      return;
    }

    // Iterate through pivots and generate each pivot div from there
    for (var pivotIdx = 0; pivotIdx < queryResponse.pivots.length; pivotIdx += 1) {
      var pivotName = queryResponse.pivots[pivotIdx].key;

      var pivotElement = this._container.append(document.createElement("div"));
      pivotElement.className = "pivot";

      pivotTitle = pivotElement.append(document.createElement("div"));
      pivotTitle.className = "pivotTitle";
      pivotTitle.innerHTML = `<h2>${pivotName}</h2>`;

      // iterate over metrics
      for (var metrixIdx = 0; metrixIdx < queryResponse.fields.measures.length; metrixIdx += 1) {
        var metricName = queryResponse.fields.measures[metricIdx].name;
        var metricLabel = queryResponse.fields.measures[metricIdx].label_short;

        var metricElement = pivotElement.append(document.createElement("div"));
        metricElement.className = "metric";

        metricElement.innerHTML = `
        <h3>${metricLabel}</h3>
        <h4>${data[0][metricName][pivotName].rendered}</h4>
        `;
      }
    }

    element.innerHTML = this._container;

    console.log(element.innerHTML);
    // We are done rendering! Let Looker know.
    done()
  }
});