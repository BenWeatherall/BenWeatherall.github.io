//Function to enable hiding of Divs within webpage
function hideDiv(element) {
  if (document.getElementById) { // DOM3 = IE5, NS6
    document.getElementById(element).style.display = 'none';
  }
  else {
    if (document.layers) { // Netscape 4
      document.element.display = 'none';
    }
    else { // IE 4
      document.all.element.style.display = 'none';
    }
  }
}

function showDiv(element) {
  if (document.getElementById) { // DOM3 = IE5, NS6
    document.getElementById(element).style.display = 'block';
  }
  else {
    if (document.layers) { // Netscape 4
      document.element.display = 'block';
    }
    else { // IE 4
      document.all.element.style.display = 'block';
    }
  }
}

