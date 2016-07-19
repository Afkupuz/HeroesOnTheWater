import { Meteor } from 'meteor/meteor';
import { Events } from '../api/events';
import { Easycron } from 'meteor/chfritz:easycron';

Meteor.startup(() => {
  if (Events.find().count() === 0) {
    const events = [{
      'name': 'Dubstep-Free Zone',
      'description': 'Fast just got faster with Nexus S.',
      'public': true
    }, {
      'name': 'All dubstep all the time',
      'description': 'Get it on!',
      'public': true
    }, {
      'name': 'Savage lounging',
      'description': 'Leisure suit required. And only fiercest manners.',
      'public': true
    }];

    events.forEach((event) => {
      Events.insert(event)
    });
  }
});
