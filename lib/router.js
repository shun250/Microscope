Router.configure({
  layoutTemplate: 'body',
  loadingTemplate: 'loading',
  notFoundTemplate: 'accessDenied'
});

Router.map(function() {
  this.route('home', {path: '/', template: 'newPosts'});
  this.route('newPosts', {path: '/new'});
  this.route('bestPosts', {path: '/best'});
  
  this.route('postSubmit', {
    path: '/submit'
  });
  
  this.route('postPage', {
    path: '/posts/:_id',
    waitOn: function() { 
      return [
        Meteor.subscribe('singlePost', this.params._id),
        Meteor.subscribe('comments', this.params._id)
      ];
    },
    data: function() { return Posts.findOne(this.params._id); }
  });
  
  this.route('postEdit', {
    path: '/posts/:_id/edit',
    waitOn: function() { 
      return Meteor.subscribe('singlePost', this.params._id);
    },
    data: function() { return Posts.findOne(this.params._id); }
  });
});

var mustBeLoggedIn = function() {
  if (! Meteor.user()) {
    this.render(Meteor.loggingIn() ? this.loadingTemplate : this.notFoundTemplate);
    this.stop();
  }
}

Router.before(function() {
  Meteor.subscribe('notifications');
});
Router.before(function() { clearErrors(); });
Router.before(mustBeLoggedIn, {only: ['postSubmit']});

