/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0*/
/*eslint-env node, es6 */

function arrayBasic() {
	var colors = ["<font color=\"red\">Red</font>",
		"<font color=\"green\">Green</font>",
		"<font color=\"blue\">Blue</font>"
	];
	var extColors = ["<font color=\"black\">Black</font>",
		"<font color=\"white\">White</font>",
		"<font color=\"orange\">Orange</font>",
		"<font color=\"purple\">Purple</font>"
	];

	var body = "";

	//toString converts simple and complex types to a String Reprsentation
	//This allows the output of all Array elements	
	body = `Complete Array: ${colors.toString()} </p>`;

	//Elements can be accessed by index - the first element is zero	
	body += `First Element: ${colors[0]} </p>`;

	//length tells you how many elements in an array	
	body += `Number of Elements: ${colors.length.toString()} </p>`;

	//indexOf allows you to get the zero-based position of a particular value in an array    
	body += `Position of Blue: ${colors.indexOf("Blue").toString()} </p>`;

	//Common technique to loop through all elements in an array
	body += "Loop of Elements: ";
	for (let color of colors) {
		body += color + " ";
	}
	body += "</p>";

	//Combine two arrays
	colors = colors.concat(extColors);
	body += `Combined Array: ${colors.toString()} </p>`;

	//Reverse Sort the Array
	colors.reverse();
	body += `Reverse Sort: ${colors.toString()} </p>`;

	//Sort Ascending 
	colors.sort();
	body += `Sort Ascending: ${colors.toString()} </p>`;

	//Remove the last element
	colors.pop();
	body += "Remove the last element: " + colors.toString() + "</p>";

	//Remove the first element
	colors.shift();
	body += `Remove the first element: ${colors.toString()} </p>`;

	//Copy specific positions - slice(start,end)
	var slicedColors = colors.slice(2, 4);
	body += `Slice out the 3rd and 4th element: ${slicedColors.toString()} </p>`;

	//Add multiple elements at specific position - splice(insertion Index, number of elements, value1, ...)
	colors.splice(2, 2, "<font color=\"malachite\">Malachite</font>", "<font color=\"fallow\">Fallow</font>");
	body += `Add two values at position 3: ${colors.toString()} </p>`;

	//Add an element to the beginning of the array - unshift
	colors.unshift("<font color=\"brown\">Brown</font>");
	body += `Add element to the beginning of the array: ${colors.toString()} </p>`;

	$.response.status = $.net.http.OK;
	$.response.contentType = "text/html";
	$.response.setBody(body);

}

arrayBasic();
