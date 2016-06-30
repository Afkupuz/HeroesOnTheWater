import { Mongo } from 'meteor/mongo';

export const Events = new Mongo.Collection('events');

Events.allow({
  insert(userId, event) {
    return userId && event.owner === userId;
  },
  update(userId, event, fields, modifier) {
    return userId && event.owner === userId;
  },
  remove(userId, event) {
    return userId && event.owner === userId;
  }
});
