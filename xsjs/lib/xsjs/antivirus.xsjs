try {
	//create a new $.security.AntiVirus object using the default profile
	var av = new $.security.AntiVirus();
	av.scan('$.request.body');
} catch (e) {
	$.response.setBody(e.toString());
}
