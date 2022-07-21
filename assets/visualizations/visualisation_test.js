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
    },
    colorPreSet:
    {
      type: 'string',
      display: 'select',
      label: 'Color Range',
      section: 'Data',
      values: [{ 'Custom': 'c' },
      { 'Tomato to Steel Blue': '#F16358,#DF645F,#CD6566,#BB666D,#A96774,#97687B,#856982,#736A89,#616B90,#4F6C97,#3D6D9E' },
      { 'Pink to Black': '#170108, #300211, #49031A, #620423, #79052B, #910734, #AA083D, #C30946, #DA0A4E, #F30B57, #F52368, #F63378, #F63C79, #F75389, #F86C9A, #F985AB, #FB9DBC, #FCB4CC, #FDCDDD, #FEE6EE' },
      { 'Green to Red': '#7FCDAE, #7ED09C, #7DD389, #85D67C, #9AD97B, #B1DB7A, #CADF79, #E2DF78, #E5C877, #E7AF75, #EB9474, #EE7772' },
      { 'White to Green': '#ffffe5,#f7fcb9 ,#d9f0a3,#addd8e,#78c679,#41ab5d,#238443,#006837,#004529' }],
      default: 'c',
      order: 1
    },
    colorRange: {
      type: 'array',
      label: 'Custom Color Ranges',
      section: 'Data',
      order: 2,
      placeholder: '#fff, red, etc...'
    },
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

    if (this.options.colorPreSet == 'c') {
      var colorSettings = this.options.colorRange || ['white', 'green', 'red']; // put a default in
    } else {
      var colorSettings = this.options.colorPreSet.split(",");
    };

    console.log(colorSettings);

    if (colorSettings[0]) {
      this._container.style.color = colorSettings[0];
    }


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

      // Apply Filter Styling
      const crossfilter = LookerCharts.Utils.getCrossfilterSelection(null, queryResponse.pivots[pivotIdx]);

      if (details.crossfilterEnabled && crossfilter === 1) {
        pivotTitle.classList.toggle("selected", true);
        pivotElement.classList.toggle("selected", true);
      }

      // Add an onclick behaviour to apply a crossfilter based on this value
      if (details.crossfilterEnabled) {
        pivotElement.onclick = this.crossFilter.bind(queryResponse.pivots[pivotIdx]);
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