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
    console.log('create');
    console.log('create::element');
    console.log(element);
    console.log('create::config');
    console.log(config)

    // Insert a <style> tag with some styles we'll use later.
    element.innerHTML = `
      <style>
        .hello-world-vis {
          height: 100%;
          border-radius: 25px;
          border: 2px solid #73AD21;
          padding: 20px; 
          display: flex;
          flex-direction: column;
          justify-content: center;
          text-align: center;
        }

        }
        .hello-world-text-large {
          font-size: 72px;
        }
        .hello-world-text-small {
          font-size: 18px;
        }
      </style>
    `;

    // Create a container element to let us center the text.
    var container = element.appendChild(document.createElement("div"));
    container.className = "hello-world-vis";

    // Create an element to contain the text.
    this._textElement = container.appendChild(document.createElement("div"));

  },
  // Render in response to the data or settings changing
  updateAsync: function (data, element, config, queryResponse, details, done) {

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

    // Clear any errors from previous updates
    this.clearErrors();

    // Throw some errors and exit if the shape of the data isn't what this chart needs
    if (queryResponse.fields.dimensions.length == 0) {
      this.addError({ title: "No Dimensions", message: "This chart requires dimensions." });
      return;
    }

    done();
    /*

    // Iterate through each pivot, generate child divs? Though that wouldn't allow for broadening unless we dip
    // in and out of each parent from route :(
    for(var pivotIdx = 0; pivotIdx < queryResponse.fields.pivots.length; pivotIdx += 1) {} 
    // Grab the first cell of the data
    var firstRow = data[0];
    var firstCell = firstRow[queryResponse.fields.dimensions[0].name];

    // Insert the data into the page
    this._textElement.innerHTML = LookerCharts.Utils.htmlForCell(firstCell);

    // Set the size to the user-selected size
    if (config.font_size == "small") {
    this._textElement.className = "hello-world-text-small";
    } else {
    this._textElement.className = "hello-world-text-large";
    }

    // We are done rendering! Let Looker know.
    done()
    */
  }
});