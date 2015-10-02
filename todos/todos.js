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
    var currentList = this.params._id;
    return Lists.findOne({ _id: currentList });
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
      var currentList = this._id;
      return Todos.find({listId:currentList}, {sort:{createdAt:-1}});
    }
  });

  Template.addTodo.events({
    /// events go here
    'submit form': function(event){
      event.preventDefault();
      var todoName = $('[name="todoName"]').val();
      var currentList = this._id;
      Todos.insert({
        name: todoName,
        completed: false,
        createdAt: new Date(),
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
      Lists.insert({
        name: listName
      }, function(error, results){
        Router.go('listPage', { _id: results });
      });
      $('[name=listName]').val('');
    }
  });

  Template.lists.helpers({
    'list': function(){
      return Lists.find({}, {sort: {name: 1}});
    }
  });

}

if(Meteor.isServer){
    // server code goes here
}
