describe("Test login and logout", function(){

	beforeEach(function (done) {
		Meteor.loginWithPassword("pepe@gmail.com", "123456", function(err){
		  Tracker.afterFlush(done);
		});
	});

	afterEach(function (done){
		Meteor.logout(function() {
			Tracker.afterFlush(done);
		});
	});

	it("después de login muestra input para añadir players", function(){
		var addPlayerTemplate = $("[value='Add Player']");
		expect(addPlayerTemplate.length).toBe(1);
	});
});