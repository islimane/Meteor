UsersList = new Mongo.Collection('users');
EventFields = new Mongo.Collection('fileds');

if(Meteor.isClient){
    // this code only runs on the client
    Template.doodleBoard.helpers({
      'user': function(){
        return UsersList.find({}, {sort: {score: -1, name: 1} });
      },
      'createBoard': function(){
        var dates = EventFields.find().fetch()[0].dates;
        var datesText = "";
        for (i in dates) {
          datesText += "<th>" + dates[i] + " - 10:00-12:00</th>"
        }
        return datesText;
      }
    });

    Template.addUserForm.events({
      'submit form': function(event){
        event.preventDefault();
        var userNameVar = event.target.userName.value;
        console.log(userNameVar);
        UsersList.insert({
            name: userNameVar
        });
      }
    });

    Template.main.helpers({
      'createdPoll': function(){
        // If this sentence return something then true
        return EventFields.find().fetch();
      }
    });

    Template.main.events({
      'submit form': function(event){
        event.preventDefault();
        var eventName = event.target.eventName.value;
        var userName = event.target.userName.value;
        var dates = event.target.dates.value.split(",");
        EventFields.insert({
            title: eventName,
            name: userName,
            dates: dates
        });
      }
    });

    Template.initForm.rendered=function() {
        $('#my-datepicker').datepicker({
          multidate: true
        });
    }
}
if(Meteor.isServer){
    // this code only runs on the client
}