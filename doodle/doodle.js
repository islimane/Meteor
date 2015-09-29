UsersList = new Mongo.Collection('users');
if(Meteor.isClient){
    // this code only runs on the client
    Template.doodleBoard.helpers({
      'user': function(){
        return UsersList.find({}, {sort: {score: -1, name: 1} });
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

}
if(Meteor.isServer){
    // this code only runs on the client
}