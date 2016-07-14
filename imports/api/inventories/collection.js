import { Mongo } from 'meteor/mongo';

export const Inventories = new Mongo.Collection('inventories');

Inventories.allow({
  insert(userId, inventory) {
    return userId && inventory.owner === userId;
  },
  update(userId, inventory, fields, modifier) {
    return userId && inventory.owner === userId;
  },
  remove(userId, inventory) {
    return userId && inventory.owner === userId;
  }
});
