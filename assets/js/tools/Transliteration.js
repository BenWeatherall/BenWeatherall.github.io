$(document).ready(function() {
	Item = makeStruct("id symbol letter");
	allDivs = new Array();
	ascii = /^[ -~]+$/;

	$.ajax({
		type: "GET",
		url: "js/dictionary.txt",
		dataType: "text",
		success: function(data) {processData(data);}
	});

	$( "#TRANSInput" ).keyup(refresh);
});

function refresh() { 
	var divs = new Array();
	var input = $("#TRANSInput").val();
	var output = "";
	var unknown = "";
	var changed = false;

	// Clean input (remove new lines and tabs)
	input = cleanInput(input);

	if ( !ascii.test( input ) ) {
		changed = true;
		// string has non-ascii characters
		for (var i = 0; i < input.length; i++){
			if ( !ascii.test( input[i])) {

				// Detect Super and subscript characters
				// If so determine how many, create a substring of those characters
				// Then place brackets around them and insert them into output
				if(isSuperScript(input[i]))
				{
					var tempStr = "(";

					for (var j = i; j < input.length; j++)
					{
						if(isSuperScript(input[j]))
						{
							tempStr += foldToASCII(input[j]);
						}
						else
						{
							break;
						}
					}
					tempStr += ")";
					output += tempStr;
					i = (j-1);      //On continue the i loop will increment. so take one now to even out
					continue;
				}

				//Subscript check
				if(isSubScript(input[i]))
				{
					var tempStr = "(";

					for (var j = i; j < input.length; j++)
					{
						if(isSubScript(input[j]))
						{
							tempStr += foldToASCII(input[j]);
						}
						else
						{
							break;
						}
					}
					tempStr += ")";
					output += tempStr;
					i = (j-1);      //On continue the i loop will increment. so take one now to even out
					continue;
				}

				var translations = []
				translations = lookUpCharacter(input[i]);

				if (translations == false)
				{
					//Skipped combining accents (Caused errors)
					//See: http://www.javascripter.net/faq/accentedcharacters.htm
					if(input[i].charCodeAt() >= 768 && input[i].charCodeAt() <= 879 || input[i].charCodeAt() >= 8201 && input[i].charCodeAt() <= 8203 || input[i].charCodeAt() == 173)
					{
						continue;
					}

					//Special replacement character
					if(input[i].charCodeAt() == 773)
					{
						output += "-bar";
						continue;
					}
					//See if foldToASCII has a solution
					//If so add the solution and continue
					if(input[i] != foldToASCII(input[i]))
					{
						output += foldToASCII(input[i]);
						continue;
					}
					//Finally if not known flag the character
					unknown += input[i];
					output += ("<NON-ASCII>"+input[i]+"(" + input[i].charCodeAt() + ")" +"<NON-ASCII>")
					continue;
				}
				else {
					for(j=0; j < translations.length; j++) {
						before = output.substring(output.length-translations[j][2]);
						after = "";
						for(k=1; k <= translations[j][3]; k++) {
							after += input[i+k];
						}
						display = before + input[i] + after;
						if(translations[j][0] != before+input[i]+after) {
							translations.splice(j, 1);
						}
					}
				}

				if (translations.length > 1)
				{
					divs.push(i);
					addElement(i, input[i], translations);
				}

				var chosen = 0;
				if (translations.length > 1) {
					var selection = $("#"+i+input[i]+" input[type='radio']:checked");
					if (selection.length > 0){
						chosen = selection.val();
					}
				}

				selection = translations[chosen];

				// If the first character of the translation is lowercase and the last character
				// proceeding it is lower case. Insert a space before the string.
				var sublength = (1 + output.length - selection[2]);
				output = output.substring(0, output.length);
				i += selection[3];

				if ((selection[1][0] == selection[1][0].toLowerCase()) &&       //If first character of translation is lower
					(output.length-1 >= 0) &&       //Not before start of string
					(output[output.length-1] != output[output.length-1].toUpperCase()) && // Character before is lowercase
					(output[output.length-1] != " ")) //Character before isn't " "
				{
					output += (" "+selection[1]);
				}
				else {
					output += selection[1];
				}
				// If the following character is a lower case (such as non-ascii characters) insert a space
				// at the end of the output
				if(((i+1) < input.length) && (input[(i+1)] != input[(i+1)].toUpperCase())){
					output += " ";
				}
			}
			else {
				output += input[i];
			}
		}
	}
	else {
		output = input;
	}
	$( "#TRANSOutput" ).text(output);
	$( "#unknown" ).text(unknown);
	if(changed == true)
	{
		$( "#changed" ).text("NON-Keyboard characters removed");
	}
	else
	{
		$( "#changed" ).text("");
	}
	removeElements(divs);
	divs = [];
}

function makeStruct(elements) {
	var elements = elements.split(' ');
	var count = elements.length;
	function constructor() {
		for (var i = 0; i < count; i++) {
			this[elements[i]] = arguments[i];
		}
	}
	return constructor;
}

function divTemplate(location, symbol, character) {
	var start = '<div id=' + location + symbol + '>' +
		'<form action="n" name="Form_' + location + '" value="'+character.length+'">' +
		'<label for="choice"> ' + symbol + ' </label>';

	var middle = "";

	for(var i = 0; i < character.length; i++) {
		middle += '<input type="radio" name="Radio_'+location+'" value="'+i+'" checked>' + character[i][0];
	}

	var end = '</form></div>';
	return start+middle+end;
}

function addElement(location, symbol, character){
	if($("#" + location + symbol).length == 0) {
	//it doesn't exist
		allDivs.push(new Item(location, symbol, character));
		$( "#elements" ).append(divTemplate(location,symbol,character));
		$("#"+location+symbol).change(refresh);     
	}
}

function removeElements(array){
	for(var i = 0; i < allDivs.length; i++) {
		if ($.inArray(allDivs[i].id, array) >= 0) {
			continue;
		}
		else {
			$( ("#"+allDivs[i].id+ allDivs[i].symbol) ).remove();
			allDivs.splice(i,1);
		}
	}
}

//Checks if character is a superscript
function isSuperScript(character) {
	if(inRangeInc(character.charCodeAt(), 8304, 8319))      //Unicode sub/super script range
	{
		return true;
	}
	else if(character.charCodeAt() == 185 ||        //Superscript 1
		character.charCodeAt() == 178 ||        //Superscript 2
		character.charCodeAt() == 179)          //Superscript 3
	{
		return true;
	}
	else
	{
		return false;
	}
}

//Checks if character is a subscript
function isSubScript(character) {
	if(inRangeInc(character.charCodeAt(), 8320, 8335))
	{
		return true;
	}
	else if (inRangeInc(character.charCodeAt(), 8336, 8341))
	{
		return true;
	}
	else
	{
		return false;
	}
}

//Check to see if the value is within the listed
//Range of numbers (Inclusive)
function inRangeInc(value, lower, higher)                                                                                                    {
	return (value >= lower && value <= higher);
}

//Takes a string, removes new lines, and tabs
//Returns cleaned string
function cleanInput(input)
{
	input = input.replace(/\r\n/g, ' ');
	input = input.replace(/\n/g, ' ');
	input = input.replace(/\t/g, ' ');
	input = input.replace(/ +/g, ' ');
	input = input.trim();
	return input;
}

//Loads dictionary.txt into page memory
function processData(allText) {
	var allTextLines = allText.split(/\r\n|\n/);
	var headers = allTextLines[0].split(';');
	dictionary = new Object();

	for (var i=1; i<allTextLines.length; i++) {
		var after = 0;
		var before = 0;
		var symbols = [];
		var data = allTextLines[i].split(';');
		
		for(var j=0; j<data[0].length; j++){
			if(!ascii.test(data[0][j])){
				symbols.push(j);
			}
		}

		if(symbols.length <1){
			continue;
		}
		else {
			before = symbols[0];
			after = data[0].length - (symbols[0] + 1)
		}
		if (!dictionary.hasOwnProperty(data[0][symbols[0]])){
			dictionary[data[0][symbols[0]]] = [];
		}
		dictionary[data[0][symbols[0]]].push([data[0], data[1], before, after]);;
	}
}


//Takes the inputted character and checks against
//The data loaded from dictionary.txt
function lookUpCharacter(character) {
	if (dictionary.hasOwnProperty(character)) {
		return dictionary[character];
	}
	else {
		return false;
	}
}

