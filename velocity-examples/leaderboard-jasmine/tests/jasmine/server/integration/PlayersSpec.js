describe('Collection: Players', function () {
	beforeAll(function (done) {
	    Meteor.call('clearDB', function () {
	      Meteor.call('loadFixtures', function(){
	      	done();
	      });
	    });
	});

	it('some players are available in the collection', function () {
		expect(Players.find().count()).toBeGreaterThan(0);
	});
});
