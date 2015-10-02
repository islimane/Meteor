UsersList = new Mongo.Collection('users');
EventFields = new Mongo.Collection('fileds');

var myTemplate = "ada";

// this function return true if there is
// an empty string in the array, otherwise
// returns false
var thereIsAnEmptyString = function(strArr){
  for (i in strArr)
    if(strArr[i] === "")
      return true;
  return false;
};

// This function proccess the initial form's information
var procForm = function(eventName, userName, dates){
  var instants = [];
  dates.forEach(function(element, index, array){
    instants.push({
      date: element,
      time: ""
    });
  });
  EventFields.insert({
    title: eventName,
    name: userName,
    dates: instants
  });
};

if(Meteor.isClient){
    // this code only runs on the client
    Template.doodleBoard.helpers({
      'user': function(){
        return UsersList.find({}, {sort: {score: -1, name: 1} });
      },
      'date': function(){
        return EventFields.find().fetch()[0].dates;
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
        // Return false if the collection is not ready
        if(EventFields.find().fetch().length>0)
          if(EventFields.find().fetch()[0].dates.hours==='undefined')
            return false;
        return EventFields.find().fetch();
      }
    });

    Template.initForm.helpers({
      'schedule': function(event){
        event.preventDefault();
        var eventName = event.target.eventName.value;
        var userName = event.target.userName.value;
        var dates = event.target.dates.value.split(",");
        var strArr = [eventName, userName, event.target.dates.value];
        if(!thereIsAnEmptyString(strArr)){
          procForm(eventName, userName, dates);
        }else{
          alert("There is some empty field!");
        }
      }
    });

    Template.initForm.events({
      'submit form': function(event){
        event.preventDefault();
        var eventName = event.target.eventName.value;
        var userName = event.target.userName.value;
        var dates = event.target.dates.value.split(",");
        var strArr = [eventName, userName, event.target.dates.value];
        if(!thereIsAnEmptyString(strArr)){
          procForm(eventName, userName, dates);
        }else{
          alert("There is some empty field!");
        }
      },
      'click #dates': function(event){
        event.preventDefault();
        var val = $("#my-datepicker").val();
        console.log("val: '" + val + "'");
     },
    });

    Template.initForm.rendered=function() {
        $('#my-datepicker').datepicker({
          format: "dd/mm/yyyy",
          todayHighlight: true,
          multidate: true
        });
    }
}
if(Meteor.isServer){
    // this code only runs on the client
}