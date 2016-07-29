import '../imports/startup/fixtures';
import '../imports/api/events';
import '../imports/api/users';
import '../imports/api/images';

import '../imports/api/inventories';

// Configure the Twilio client
var twilioClient = new Twilio({
	from: '+15005550006',
	sid: 'ACb6eeacae7e6e900169ea48585ee9a049',
	token: 'f1fdd6130374254af6f2396882db51dc'
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