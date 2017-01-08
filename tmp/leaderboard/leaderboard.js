PlayerList = new Mongo.Collection('players');
if(Meteor.isClient){
  console.log("Hello Client!");

  Meteor.subscribe('thePlayers');

  Template.leaderboard.helpers({
    'players': function(){
      console.log(PlayerList.find());
      var currentUserId = Meteor.userId();
      return PlayerList.find({createdBy: currentUserId},
                            {sort: {socre: -1, name: 1}});
    },
    'selectedPlayer': function(){
      var selectedPlayer = Session.get('selectedPlayer');
      return PlayerList.findOne({_id: selectedPlayer});
    },
    'selectedClass': function(){
      var playerId = this._id;
      //console.log(playerId);
      var selectedPlayer = Session.get('selectedPlayer');
      if(playerId == selectedPlayer){
        return "selected"
      }
    }
  });

  Template.leaderboard.events({
    'click .player': function(){
      var playerId = this._id;
      Session.set('selectedPlayer', playerId);
    },
    'click .increment': function(){
      var selectedPlayer = Session.get('selectedPlayer');
      console.log('selectedPlayer: ' + selectedPlayer);
      PlayerList.update({_id: selectedPlayer}, {$inc: {socre: 5}});
    },
    'click .decrement': function(){
      var selectedPlayer = Session.get('selectedPlayer');
      PlayerList.update({ _id: selectedPlayer }, {$inc: {socre: -5} });
    },
    'click .remove': function(){
      var selectedPlayer = Session.get('selectedPlayer');
      PlayerList.remove({ _id: selectedPlayer });
    }
  });

  Template.addPlayerForm.events({
    'submit form': function(event){
      event.preventDefault();
      var playerNameVar = event.target.playerName.value;
      event.target.playerName.value = "";
      console.log(playerNameVar);
      var currentUserId = Meteor.userId();
      PlayerList.insert({
        name: playerNameVar,
        socre: 0,
        createdBy: currentUserId
      });
    }
  });

}

if(Meteor.isServer){
    console.log("Hello Server!");
    Meteor.publish('thePlayers', function(){
      var currentUserId = this.userId;
      return PlayerList.find({createdBy: currentUserId});
    });
}
