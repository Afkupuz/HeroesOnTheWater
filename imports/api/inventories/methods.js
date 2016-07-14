import _ from 'underscore';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Email } from 'meteor/email';

import { Inventories } from './collection';

function getContactEmail(user) {
  if (user.emails && user.emails.length)
    return user.emails[0].address;

  if (user.services && user.services.facebook && user.services.facebook.email)
    return user.services.facebook.email;

  return null;
}

export function invite_to_inventory(inventoryId, userId) {
  check(inventoryId, String);
  check(userId, String);

  if (!this.userId) {
    throw new Meteor.Error(400, 'You have to be logged in!');
  }

  const inventory = Inventories.findOne(inventoryId);

  if (!inventory) {
    throw new Meteor.Error(404, 'No such inventory!');
  }

  if (inventory.owner !== this.userId) {
    throw new Meteor.Error(404, 'No permissions!');
  }

  if (inventory.public) {
    throw new Meteor.Error(400, 'That inventory is public. No need to invite people.');
  }

  if (userId !== inventory.owner && ! _.contains(inventory.invited, userId)) {
    Inventories.update(inventoryId, {
      $addToSet: {
        invited: userId
      }
    });

    const replyTo = getContactEmail(Meteor.users.findOne(this.userId));
    const to = getContactEmail(Meteor.users.findOne(userId));

    if (Meteor.isServer && to) {
      Email.send({
        to,
        replyTo,
        from: 'noreply@how.com',
        subject: `PARTY: ${inventory.title}`,
        text: `
          Hey, I just invited you to ${inventory.title} on Heroes.
          Come check it out: ${Meteor.absoluteUrl()}
        `
      });
    }
  }
}

export function rsvp_to_inventory(inventoryId, rsvp) {
  check(inventoryId, String);
  check(rsvp, String);

  if (!this.userId) {
    throw new Meteor.Error(403, 'You must be logged in to RSVP');
  }

  if (!_.contains(['yes', 'no', 'maybe'], rsvp)) {
    throw new Meteor.Error(400, 'Invalid RSVP');
  }

  const inventory = Inventories.findOne({
    _id: inventoryId,
    $or: [{
      // is public
      $and: [{
        public: true
      }, {
        public: {
          $exists: true
        }
      }]
    },{
      // is owner
      $and: [{
        owner: this.userId
      }, {
        owner: {
          $exists: true
        }
      }]
    }, {
      // is invited
      $and: [{
        invited: this.userId
      }, {
        invited: {
          $exists: true
        }
      }]
    }]
  });

  if (!inventory) {
    throw new Meteor.Error(404, 'No such inventory');
  }

  const hasUserRsvp = _.findWhere(inventory.rsvps, {
    user: this.userId
  });

  if (!hasUserRsvp) {
    // add new rsvp entry
    Inventories.update(inventoryId, {
      $push: {
        rsvps: {
          rsvp,
          user: this.userId
        }
      }
    });
  } else {
    // update rsvp entry
    const userId = this.userId;
    Inventories.update({
      _id: inventoryId,
      'rsvps.user': userId
    }, {
      $set: {
        'rsvps.$.rsvp': rsvp
      }
    });
  }
}

Meteor.methods({
  invite_to_inventory,
  rsvp_to_inventory
});
