$(document).ready(function() {
	$( "#SRInput" )
		.keyup(function() {
			var noLines = $(this).val();
			noLines = noLines.replace(/\r\n/g, ' ');
			noLines = noLines.replace(/\n/g, ' ');
			noLines = noLines.replace(/\t/g, ' ');
			noLines = noLines.replace(/ +/g, ' ');
			noLines = noLines.trim();
			$( "#SROutput" ).text(noLines);
	});
});
