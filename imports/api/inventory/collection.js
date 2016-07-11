import { Mongo } from 'meteor/mongo';

export const Inventory = new Mongo.Collection('inventory');

Inventory.allow({
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
