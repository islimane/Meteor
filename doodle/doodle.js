UsersList = new Mongo.Collection('users');
EventsList = new Mongo.Collection('fileds');

// this function return true if there is
// an empty string in the array, otherwise
// returns false
var thereIsAnEmptyString = function(strArr){
  for (i in strArr)
    if(strArr[i] === "")
      return true;
  return false;
};

var insertDate = function(day, time){
  var dayHtml = '<td class="day">' + day + '</td>';
  var timeHtml = '<td class="time">' + time + '</td>';
  html = '<tr class="date">' + dayHtml + timeHtml + '</tr>'
  $(html).appendTo('#datesBoard');
};

if(Meteor.isClient){
  // this code only runs on the client
  Template.main.helpers({
    'createdEvent': function(){
      console.log(EventsList.find().fetch().length>0);
      if(EventsList.find().fetch())
        console.log("OK");
      else
        console.log("ERROR");
      return EventsList.find().fetch();
    }
  });

  Template.events.helpers({
    'event': function(){
      return EventsList.find();
    }
  });

  Template.doodleBoard.helpers({
    'user': function(){
      return UsersList.find({}, {sort: {score: -1, name: 1} });
    },
    'date': function(){
      return EventsList.find().fetch()[0].dates;
    }
  });

  Template.addUserForm.events({
    'submit form': function(event){
      event.preventDefault();
      var userNameVar = event.target.userName.value;
      console.log(userNameVar);
      console.log("id: " + this._id);
      UsersList.insert({
          name: userNameVar
      });
    }
  });

  Template.initForm.events({
    'submit form': function(event){
      event.preventDefault();
      var eventName = event.target.eventName.value;
      var userName = event.target.userName.value;
      if(thereIsAnEmptyString([eventName, userName])){
        alert("There is some empty field!");
        return false;
      }
      var dates = [];
      $('.day').each(function(index, element){
        //console.log("element: '" + $(this).text() + "'");
        dates.push({day: $(this).text()});
      });
      $('.time').each(function(index, element){
        //console.log("element: '" + $(this).text() + "'");
        dates[index].time = $(this).text();
      });
      if(dates.length<=0){
        alert("You must select at least one day and time");
        return false;
      }else{
        EventsList.insert({
          title: eventName,
          name: userName,
          dates: dates
        });
      }
      
    },
    'click #addDate': function(event){
      event.preventDefault();
      var day = $("#my-datepicker").val();
      var time = $('[name="time"]').val();
      $("#my-datepicker").val("");
      $('[name="time"]').val("");
      if(thereIsAnEmptyString([day, time]))
        alert('You must set a day and a time');
      else
        insertDate(day, time);
   },
  });

  Template.initForm.rendered=function() {
      $('#my-datepicker').datepicker({
        format: "dd/mm/yyyy"
      });
  }
}
if(Meteor.isServer){
  // this code only runs on the client
}