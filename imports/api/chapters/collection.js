import { Mongo } from 'meteor/mongo';

export const Chapters = new Mongo.Collection('chapters');

Chapters.allow({
  insert(userId, event) {
    return true;
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
