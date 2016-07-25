import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { Events } from './collection';

if (Meteor.isServer) {

/*
//meteor add chfritz:easycron

    var everyMinute = new Cron(function() {
var x = Events.findOne('Micmw2CBgA9bTaeLk')
        console.log(x)
        

    console.log("another minute has passed!");
}, {});

    */

  Meteor.publish('events', function(options, searchString, opt) {

    const selector = {
      $or: [{
        // the public events
        $and: [{
          public: true
        }, {
          public: {
            $exists: true
          }
        }]
      }, {
        // when logged in user is the owner
        $and: [{
          owner: this.userId
        }, {
          owner: {
            $exists: true
          }
        }]
      }, {
        // when logged in user is one of invited
        $and: [{
          invited: this.userId
        }, {
          invited: {
            $exists: true
          }
        }]
      }]
    };

    if (typeof searchString === 'string' && searchString.length) {
      switch(opt) {
        case 'Name':
            selector.name = {
            $regex: `.*${searchString}.*`,
            $options : 'i'
            };
            break;
        case 'Date':
            selector.date = {
            $regex: `.*${searchString}.*`,
            $options : 'i'
            };
            break;
        case 'Description':
            selector.description = {
            $regex: `.*${searchString}.*`,
            $options : 'i'
            };
            break;
        case 'Address':
            selector.address = {
            $regex: `.*${searchString}.*`,
            $options : 'i'
            };
            break;
        case 'Resources':
            selector.resources = {
            $regex: `.*${searchString}.*`,
            $options : 'i'
            };
            break;
        case 'Volunteers':
            selector.volunteers = {
            $regex: `.*${searchString}.*`,
            $options : 'i'
            };
            break;
        case 'Organizer':
            selector.organizer = {
            $regex: `.*${searchString}.*`,
            $options : 'i'
            };
            break;
        case 'Attendants':
            selector.attendants = {
            $regex: `.*${searchString}.*`,
            $options : 'i'
            };
            break;
        case 'Chapter':
            selector.chapter = {
            $regex: `.*${searchString}.*`,
            $options : 'i'
            };
            break;
        default:
            selector.name = {
            $regex: `.*${searchString}.*`,
            $options : 'i'
            };
            break;
        }
    }

    Counts.publish(this, 'numberOfEvents', Events.find(selector), {
      noReady: true
    });

    return Events.find(selector, options);

  });
}
