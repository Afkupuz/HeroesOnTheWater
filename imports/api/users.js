// user permissions located:  /Users/nicolas/events/.meteor/local/build/programs/server/packages/accounts-base.js:
import { Accounts } from 'meteor/accounts-base';

import { Meteor } from 'meteor/meteor';

if (Meteor.isServer) {
  Meteor.publish('users', function(searchString, opt) {
  
    var regex = new RegExp(`.*${searchString}.*`, 'i')

    if (typeof searchString === 'string' && searchString.length) {

      console.log(opt)
      console.log(searchString)
      
      switch(opt) {
        case 'ID':
            return Meteor.users.find({ '_id' : regex });
        case 'Auth Level':
            return Meteor.users.find({ 'auth.auth' : regex });
        case 'Admin Note':
            return Meteor.users.find({ 'auth.note' : regex });
        case 'Email':
            return Meteor.users.find({ 'emails.address' : regex });
        case 'User Name':
            return Meteor.users.find({ 'profile.username' : regex });
        case 'First Name':
            return Meteor.users.find({ 'profile.first_name' : regex });
        case 'Last Name':
            return Meteor.users.find({ 'profile.last_name' : regex });
        case 'Phone':
            return Meteor.users.find({ 'profile.phone' : regex });
        case 'Bio':
            return Meteor.users.find({ 'profile.bio' : regex });
        case 'Chapter':
            return Meteor.users.find({ 'profile.chapter' : regex });
        default:
          return Meteor.users.find({ 'profile.username' : regex });
        }
    }else{
    return Meteor.users.find({});
}
  });

  Meteor.users.deny({
  insert() {
    if (Meteor.user().auth['auth'] != 'admin') {
      return true;
    }
  },
  update() {
    return false;
  },
  remove() {
    if (Meteor.user().auth['auth'] != 'admin') {
      return true;
    }
  }
});

  Meteor.users.allow({
  insert() {
    if (Meteor.user().auth['auth'] == 'admin') {
      return true;
    }
  },
  update(userId, user, fields, modifier) {
    if (user.auth == undefined) {
      console.log("User has no authentication")
      return false;
    }

    if (Meteor.user().auth['auth'] == 'admin') {
      return true;
    }

    if (user.auth.auth != modifier.$set.auth.auth) {
      return false;
    }
      if (user._id !== userId) {
        return false; }

      if (fields.length !== 2 || fields[1] !== 'profile') {
      return false;
      }                    
      return true;                          
  },
  remove() {
    if (Meteor.user().auth['auth'] == 'admin') {
      return true;
    }
  }
});     

  Accounts.onCreateUser(function(options, user) {
  console.log('created')

    user.auth = {auth: "admin", note: "none"}

    if (options.profile)
        user.profile = options.profile;

  return user;
})


}