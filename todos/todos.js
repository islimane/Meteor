/**
*
* ROUTERS
*
*/

Router.configure({
    layoutTemplate: 'main'
});

Router.route('/register');
Router.route('/login');
Router.route('/', {
  name: 'home',
  template: 'home'
});
Router.route('/list/:_id', {
  name: 'listPage',
  template: 'listPage',
  data: function(){
    var currentUser = Meteor.userId();
    var currentList = this.params._id;
    return Lists.findOne({_id:currentList, createdBy:currentUser});
  },
  onBeforeAction: function(){
    var currentUser = Meteor.userId();
    if(currentUser){
      this.next();
    } else {
      this.render("login");
    }
  }
});


/**
*
* METEOR APP
*
*/

// COLLECTIONS
Todos = new Meteor.Collection('todos');
Lists = new Meteor.Collection('lists');


if(Meteor.isClient){
    // client code goes here
  Template.todos.helpers({
    'todo': function(){
      var currentUser = Meteor.userId();
      var currentList = this._id;
      return Todos.find({listId:currentList, createdBy:currentUser},
                        {sort:{createdAt:-1}});
    }
  });

  Template.addTodo.events({
    /// events go here
    'submit form': function(event){
      event.preventDefault();
      var todoName = $('[name="todoName"]').val();
      var currentUser = Meteor.userId();
      var currentList = this._id;
      Todos.insert({
        name: todoName,
        completed: false,
        createdAt: new Date(),
        createdBy: currentUser,
        listId: currentList
      });
      // Empty the text field
      $('[name="todoName"]').val('')
    }
  });

  Template.todoItem.events({
    // events go here
    'click .delete-todo': function(event){
      event.preventDefault();
      var documentId = this._id;
      var confirm = window.confirm("Delete this task?");
      if(confirm){
        Todos.remove({_id:documentId});
      }
    },
    'keyup [name=todoItem]': function(event){
      if(event.which == 13 || event.which == 27){
          $(event.target).blur();
      } else {
          var documentId = this._id;
          var todoItem = $(event.target).val();
          Todos.update({ _id: documentId }, {$set: { name: todoItem }});
      }
    },
    'change [type=checkbox]': function(){
      // code goes here
      var documentId = this._id;
      Todos.update({_id:documentId}, {$set:{completed:(!this.completed)}});
    }
  });

  Template.todoItem.helpers({
    'checked': function(){
      var isCompleted = this.completed;
      if(isCompleted)
        return "checked";
      else
        return "";
    }
  });

  Template.todosCount.helpers({
      // helpers go here
      'totalTodos': function(){
        var currentList = this._id;
        return Todos.find({listId:currentList}).count();
      },
      'completedTodos': function(){
        var currentList = this._id;
        return Todos.find({listId:currentList, completed:true}).count();
      }
  });

  Template.addList.events({
    'submit form': function(event){
      event.preventDefault();
      var listName = $('[name=listName]').val();
      var currentUser = Meteor.userId();
      Lists.insert({
        name: listName,
        createdBy: currentUser
      }, function(error, results){
        Router.go('listPage', {_id:results});
      });
      $('[name=listName]').val('');
    }
  });

  Template.lists.helpers({
    'list': function(){
      var currentUser = Meteor.userId();
      return Lists.find({createdBy:currentUser}, {sort:{name:1}});
    }
  });

  Template.register.events({
    'submit form': function(event){
      event.preventDefault();
      var email = $('[name=email]').val();
      var password = $('[name=password]').val();
      Accounts.createUser({
        email: email,
        password: password
      }, function(error){
        if(error){
          console.log(error.reason); // Output error if registration fails
        } else {
          Router.go("home"); // Redirect user if registration succeeds
        }
      });
    }
  });

  Template.navigation.events({
    'click .logout': function(event){
      event.preventDefault();
      Meteor.logout();
      Router.go('login');
    }
  });

  Template.login.events({
    'submit form': function(event){
      event.preventDefault();
      var email = $('[name=email]').val();
      var password = $('[name=password]').val();
      Meteor.loginWithPassword(email, password, function(error){
        if(error){
          console.log(error.reason);
        } else {
          var currentRoute = Router.current().route.getName();
          if(currentRoute == "login"){
            Router.go("home");
          }
        }
      });
    }
  });
}

if(Meteor.isServer){
    // server code goes here
}
