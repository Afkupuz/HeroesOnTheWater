import { Meteor } from 'meteor/meteor';
import { Events } from '../api/events';
import { Chapters } from '../api/chapters';
import { Donations } from '../api/donations';
import { Easycron } from 'meteor/chfritz:easycron';

Meteor.startup(() => {
  var today = new Date()
  var nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
  var twoWeeks = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000)

  if (Events.find().count() === 0) {
    const events = [{
      'name': 'Kayak Fishing 101',
      'description': 'Learn from the best, basics in kayaking and fishing',
      'public': true,
      'date': nextWeek,
      'address' : "5556 Locust Grove Rd, Garland, TX 75043"
    }, {
      'name': 'Fishing with a buddy',
      'description': 'Bring your furry best friend for a relaxing break on the water',
      'public': true,
      'date': twoWeeks,
      'address' : "1570 FM1382, Cedar Hill, TX 75104"
    }, {
      'name': 'Alone on the Water',
      'description': 'You know your stuff. Just get out there and relax',
      'public': true,
      'date': today,
      'address' : "20400 Hackberry Creek Park Rd, Frisco, TX 75034"
    }];

    events.forEach((event) => {
      Events.insert(event)
    });
  }
  if (Chapters.find().count() === 0) {
    const chapters = [{
      'state': 'California',
      'location': 'Shasta',
      'manger': 'Bryan Rusk',
      'contact': 'ShastaCA@HeroesOnTheWater.org',
      'facebook': 'https://www.facebook.com/pages/Heroes-on-the-Water-Shasta-California-Chapter/1476679525959048?fref=ts'
    }, {
      'state': 'Texas',
      'location': 'DFW',
      'manger': 'George Chrisman or Dave Potts',
      'contact': 'howaus@howaus.org',
      'facebook': 'https://www.facebook.com/HeroesOnTheWaterDallasFortWorthChapter'
    }, {
      'state': 'Affiliate',
      'location': 'Australia',
      'manger': 'Andrew Theodoropoulous',
      'contact': 'ShastaCA@HeroesOnTheWater.org',
      'facebook': 'https://www.facebook.com/heroesonthewateraustralia'
    }];

    chapters.forEach((chapter) => {
      Chapters.insert(chapter)
    });
  }
  if (Donations.find().count() === 0) {
  const donations = [{
    'amount': 13423,
    'state': 'California',
    'location': 'Shasta',
    'name': 'Barry Klinger',
    'contact': 'AlltheMOneys@charity.gov'
  }, {
    'amount': 12930,
    'state': 'Texas',
    'location': 'DFW',
    'name': 'Geoff Pits',
    'contact': 'Igive@more.com'
  }, {
    'amount': 129393,
    'state': 'Affiliate',
    'location': 'Australia',
    'name': 'Theador Thompson',
    'contact': 'Generous@yes.com'
  }];

  donations.forEach((donation) => {
    Donations.insert(donation)
  });
  }

});
