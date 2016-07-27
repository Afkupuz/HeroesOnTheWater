import '../imports/startup/fixtures';
import '../imports/api/events';
import '../imports/api/users';
import '../imports/api/images';

import '../imports/api/inventories';

// Configure the Twilio client
var twilioClient = new Twilio({
	from: Meteor.settings.TWILIO.FROM,
	sid: Meteor.settings.TWILIO.SID,
	token: Meteor.settings.TWILIO.TOKEN
});

Meteor.methods({
	'sendSMS': function (opts) {
		console.log("Attempting to send a message with options", opts);
		try {
			var result = twilioClient.sendSMS({
				to: opts.to,
				body: opts.message
			});
		} catch (err) {
			console.log(err);
		}
		console.log("New message sent: ", result);
		return result;
	}
});