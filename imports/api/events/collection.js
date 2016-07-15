import { Mongo } from 'meteor/mongo';

export const Events = new Mongo.Collection('events');

Events.allow({
  insert(userId, event) {
    if (Meteor.user().auth['auth'] == 'admin') {
      return true;
    };
  },
  update(userId, event, fields, modifier) {
    if (Meteor.user().auth['auth'] == 'admin') {
      return true;
    };
  },
  remove(userId, event) {
    if (Meteor.user().auth['auth'] == 'admin') {
      return true;
    };
  }
});
