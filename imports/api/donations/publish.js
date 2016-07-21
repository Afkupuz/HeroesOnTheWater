import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { Donations } from './collection';

if (Meteor.isServer) {

  Meteor.publish('donations', function() {
        return Donations.find({});  
    });
}
