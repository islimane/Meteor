PlayerList = new Mongo.Collection('players');
console.log("Hello world");
if(Meteor.isClient){
    // this code only runs on the client
    console.log("Hello client");

    Template.leaderboard.helpers({
	    'player': function(){
	        return PlayersList.find();
   		}
	});
}
if(Meteor.isServer){
    // this code only runs on the client
    console.log("Hello server");
}