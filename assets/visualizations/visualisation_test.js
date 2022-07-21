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
  crossFilter: function (evt, pivot) {
    console.log("evt");
    console.log(evt);

    console.log("pivot");
    console.log(pivot);

    LookerCharts.Utils.toggleCrossfilter({
      pivot: pivot,
      event: evt,
    });
  },
  // Render in response to the data or settings changing
  updateAsync: function (data, element, config, queryResponse, details, done) {

    // console.log(data);
    // console.log(queryResponse);
    // console.log(details);

    this._container.innerHTML = "";
    // Clear any errors from previous updates
    this.clearErrors();

    var pivotCount = queryResponse.fields.pivots.length;

    if (pivotCount != 1) { // We aren't pivoting; handle data differently
      // Won't support for now
      this.addError({ title: "No Pivots", message: "This chart requires one pivot dimension." });
      console.error("No Pivots");
      return;
    }

    // Iterate through pivots and generate each pivot div from there
    for (var pivotIdx = 0; pivotIdx < queryResponse.pivots.length; pivotIdx += 1) {
      var pivotName = queryResponse.pivots[pivotIdx].key;

      var pivotElement = this._container.appendChild(document.createElement("div"));
      pivotElement.className = "pivot";

      pivotTitle = pivotElement.appendChild(document.createElement("div"));
      pivotTitle.className = "pivot-title";
      pivotTitle.innerHTML = `<h2>${pivotName}</h2>`;

      const crossfilter = LookerCharts.Utils.getCrossfilterSelection(queryResponse.pivots[pivotIdx])
      if (details.crossfilterEnabled && crossfilter === 1) {
        pivotTitle.classList.add('selected');
      }

      // Add an onclick behaviour to apply a crossfilter based on this value
      if (details.crossfilterEnabled) {
        pivotElement.onclick = (evt) => this.crossFilter.bind(this, queryResponse.pivots[pivotIdx]);
      }

      // iterate over metrics
      for (var metricIdx = 0; metricIdx < queryResponse.fields.measures.length; metricIdx += 1) {
        var metricName = queryResponse.fields.measures[metricIdx].name;
        var metricLabel = queryResponse.fields.measures[metricIdx].label_short;

        var metricElement = pivotElement.appendChild(document.createElement("div"));
        metricElement.className = "metric";

        metricElement.innerHTML = `
        <h3>${data[0][metricName][pivotName].rendered}</h3>
        <h4>${metricLabel}</h4>
        `;
      }
    }

    // We are done rendering! Let Looker know.
    done()
  }
});