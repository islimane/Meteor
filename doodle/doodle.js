UsersList = new Mongo.Collection('users');
EventFields = new Mongo.Collection('fileds');
DatesList = new Mongo.Collection('dates');
dates = [];

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

  Template.hours.helpers({
    'dateField': function(){
      return DatesList.find().fetch()[0].dates;
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
    'click #selectHours': function(event){
      event.preventDefault();
      var val = $("#my-datepicker").val();
      console.log("val: '" + val + "'");
      dates = $("#my-datepicker").val().split(",");
      console.log(dates);
      DatesList.insert({
          dates: dates
      });
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