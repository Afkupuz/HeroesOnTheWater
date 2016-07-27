import { Mongo } from 'meteor/mongo';

export const Inventories = new Mongo.Collection('inventories');

Inventories.allow({
  insert() {
    if (Meteor.user().auth['auth'] == 'admin') {
      return true;
    };
    if (Meteor.user().auth['auth'] == 'manager') {
      return true;
    };
  },
  update() {
    if (Meteor.user().auth['auth'] == 'admin') {
      return true;
    };
    if (Meteor.user().auth['auth'] == 'manager') {
      return true;
    };
  },
  remove() {
    if (Meteor.user().auth['auth'] == 'admin') {
      return true;
    };
    if (Meteor.user().auth['auth'] == 'admin') {
      return true;
    };
  }
});