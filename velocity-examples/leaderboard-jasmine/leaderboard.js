// Set up a collection to contain player information. On the server,
// it is backed by a MongoDB collection named "players".

Players = new Meteor.Collection("players");

/**
 * Separate player logic into an own service singleton for better testability and reusability.
 * @type {{}}
 */
PlayersService = {
  getPlayerList: function () {
    return Players.find({}, {sort: {score: -1, name: 1}});
  },
  getPlayer: function (playerId) {
    return Players.findOne(playerId);
  },
  rewardPlayer: function (playerId) {
    Players.update(playerId, {$inc: {score: 5}});
  },
  penalizePlayer: function (playerId) {
    Players.update(playerId, {$inc: {score: -5}});
  },
  removePlayer: function (playerId) {
    Players.remove({_id:playerId});
  },
  addPlayer: function(event){
    event.preventDefault();
    var playerNameVar = event.target.playerName.value;
    Players.insert({
        name: playerNameVar,
        score: 0,
    });
    // Empty the form field after submit
    event.target.playerName.value = "";
  },
  playersExist: function () {
    return Players.find().count() > 0;
  }
};

if (Meteor.isClient) {
  Template.leaderboard.helpers({
    players: function () {
      return PlayersService.getPlayerList();
    },

    selected_name: function () {
      var player = PlayersService.getPlayer(Session.get("selected_player"));
      return player && player.name;
    }
  });

  Template.leaderboard.events({
    'click input.inc': function () {
      PlayersService.rewardPlayer(Session.get("selected_player"));
    },
    'click input.dec': function () {
      PlayersService.penalizePlayer(Session.get("selected_player"));
    },
    'click input.del': function () {
      PlayersService.removePlayer(Session.get("selected_player"));
    }
  });

  Template.addPlayerForm.events({
      'submit form': function(event){
        PlayersService.addPlayer(event);
      }
  });

  Template.player.helpers({
    selected: function () {
      return Session.equals("selected_player", this._id) ? "selected" : '';
    }
  });

  Template.player.events({
    'click': function () {
      Session.set("selected_player", this._id);
    }
  });
}

// On server startup, create some players if the database is empty.
if (Meteor.isServer) {
  Meteor.startup(function () {
    Meteor.publish('players', function(){
      return Players.find();
    });
  });
}
