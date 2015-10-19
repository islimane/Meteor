describe("Test login and logout", function(){
	it("después de login muestra input para añadir players", function(){
		console.log(Meteor.userId());
		var addPlayerTemplate = $("[value='Add Player']");
		console.log(addPlayerTemplate.length);
		expect(addPlayerTemplate.length).toBe(1);
	});
});