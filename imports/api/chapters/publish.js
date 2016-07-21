import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { Chapters } from './collection';

if (Meteor.isServer) {

  Meteor.publish('chapters', function() {
        return Chapters.find({});
    });
}
