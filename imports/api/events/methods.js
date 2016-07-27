import _ from 'underscore';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Email } from 'meteor/email';

import { Events } from './collection';

function getContactEmail(user) {
  if (user.emails && user.emails.length)
    return user.emails[0].address;

  if (user.services && user.services.facebook && user.services.facebook.email)
    return user.services.facebook.email;

  return null;
}

export function invite(eventId, userId) {
  check(eventId, String);
  check(userId, String);

  if (!this.userId) {
    throw new Meteor.Error(400, 'You have to be logged in!');
  }

  const event = Events.findOne(eventId);

  if (!event) {
    throw new Meteor.Error(404, 'No such event!');
  }

  if (event.owner !== this.userId) {
    throw new Meteor.Error(404, 'No permissions!');
  }

  if (event.public) {
    throw new Meteor.Error(400, 'That event is public. No need to invite people.');
  }

  if (userId !== event.owner && ! _.contains(event.invited, userId)) {
    Events.update(eventId, {
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
        subject: `PARTY: ${event.title}`,
        text: `
          Hey, I just invited you to ${event.title} on Heroes.
          Come check it out: ${Meteor.absoluteUrl()}
        `
      });
    }
  }
}

export function rsvp(eventId, rsvp) {
  check(eventId, String);


  //if (!_.contains(['yes', 'cancel', 'volunteer'], rsvp)) {throw new Meteor.Error(400, 'Invalid response');}

  const event = Events.findOne({
    _id: eventId});

  if (!event) {
    throw new Meteor.Error(404, 'No such event');
  }

  if (!this.userId) {

    console.log("no user")

    const hasUserRsvp = _.findWhere(event.rsvps, {
        user: rsvp[1][0]
      });

    if (!hasUserRsvp) {
      console.log("no user!!")
      if (rsvp[0] == 'cancel'){
        throw new Meteor.Error(404, 'No such user');
      }
      // add new rsvp entry
      Events.update(eventId, {
        $push: {
          rsvps: {
            rsvp: rsvp[0],
            user: rsvp[1][0],
            conf: rsvp[1][1]
      }
        }
      });
    } else {
      console.log(rsvp)
      // update rsvp entry
      Events.update({
        _id: eventId,
        'rsvps.user': rsvp[1][0]
      }, {
        $set: {
          'rsvps.$.rsvp': rsvp[0],
          'rsvps.$.conf': rsvp[1][1]
        }
      });
    }
  }
  else {
    console.log("no user")
      const hasUserRsvp = _.findWhere(event.rsvps, {
        user: this.userId
      });

      if (!hasUserRsvp) {
        // add new rsvp entry
        Events.update(eventId, {
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
        Events.update({
          _id: eventId,
          'rsvps.user': userId
        }, {
          $set: {
            'rsvps.$.rsvp': rsvp
          }
        });
      }
  }
}

Meteor.methods({
  invite,
  rsvp
});
