var mustBeLoggedIn = function() {
  if (! Meteor.user()) {
    this.render(Meteor.loggingIn() ? this.loadingTemplate : this.notFoundTemplate);
    this.stop();
  }
}

Router.configure({
  loadingTemplate: 'loading',
  notFoundTemplate: 'accessDenied',
  before: clearErrors
})

Router.map(function() {
  this.route('home', {path: '/', template: 'newPosts'});
  this.route('newPosts', {path: '/new'});
  this.route('bestPosts', {path: '/best'});
  
  this.route('postSubmit', {
    path: '/submit',
    before: mustBeLoggedIn
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