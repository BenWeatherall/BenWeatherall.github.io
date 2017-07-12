$(document).ready(function() {
        $( "#CleanInput" )
                .keyup(function() {
                        var myValue = $(this).val();
                        myValue = myValue.replace(/ /g, '');
						if (!/^(f|ht)tps?:\/\//i.test(myValue)) {
							myValue = "http://" + myValue;
						}
                        $(CleanLink).html("Link: " + myValue.link(myValue));
        });
	$( "#ProxyInput" )
		.keyup(function() {
			var myValue = $(this).val();
			myValue = myValue.replace(/ /g, '');
			
			if (!/^(f|ht)tps?:\/\//i.test(myValue)) {
				myValue = "http://" + myValue;
			}
			
			myValue = "https://proxy.library.adelaide.edu.au/login?url=" + myValue;

			$(ProxyLink).html("Link: " + myValue.link(myValue));
	});
});
