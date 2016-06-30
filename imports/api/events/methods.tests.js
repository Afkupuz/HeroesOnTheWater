import { invite, rsvp } from './methods';
import { Events } from './collection';

import { Meteor } from 'meteor/meteor';

if (Meteor.isServer) {
  describe('Events / Methods', () => {
    describe('invite', () => {
      function loggedIn(userId = 'userId') {
        return {
          userId
        };
      }

      it('should be called from Method', () => {
        spyOn(invite, 'apply');

        try {
          Meteor.call('invite');
        } catch (e) {}

        expect(invite.apply).toHaveBeenCalled();
      });

      it('should fail on missing eventId', () => {
        expect(() => {
          invite.call({});
        }).toThrowError();
      });

      it('should fail on missing userId', () => {
        expect(() => {
          invite.call({}, 'eventId');
        }).toThrowError();
      });

      it('should fail on not logged in', () => {
        expect(() => {
          invite.call({}, 'eventId', 'userId');
        }).toThrowError(/logged in/i);
      });

      it('should look for a event', () => {
        const eventId = 'eventId';
        spyOn(Events, 'findOne');

        try {
          invite.call(loggedIn(), eventId, 'userId');
        } catch (e) {}

        expect(Events.findOne).toHaveBeenCalledWith(eventId);
      });

      it('should fail if event does not exist', () => {
        spyOn(Events, 'findOne').and.returnValue(undefined);

        expect(() => {
          invite.call(loggedIn(), 'eventId', 'userId');
        }).toThrowError(/404/);
      });

      it('should fail if logged in user is not the owner', () => {
        spyOn(Events, 'findOne').and.returnValue({
          owner: 'notUserId'
        });

        expect(() => {
          invite.call(loggedIn(), 'eventId', 'userId');
        }).toThrowError(/404/);
      });

      it('should fail on public event', () => {
        spyOn(Events, 'findOne').and.returnValue({
          owner: 'userId',
          public: true
        });

        expect(() => {
          invite.call(loggedIn(), 'eventId', 'userId');
        }).toThrowError(/400/);
      });

      it('should NOT invite user who is the owner', () => {
        spyOn(Events, 'findOne').and.returnValue({
          owner: 'userId'
        });
        spyOn(Events, 'update');

        invite.call(loggedIn(), 'eventId', 'userId');

        expect(Events.update).not.toHaveBeenCalled();
      });

      it('should NOT invite user who has been already invited', () => {
        spyOn(Events, 'findOne').and.returnValue({
          owner: 'userId',
          invited: ['invitedId']
        });
        spyOn(Events, 'update');

        invite.call(loggedIn(), 'eventId', 'invitedId');

        expect(Events.update).not.toHaveBeenCalled();
      });

      it('should invite user who has not been invited and is not the owner', () => {
        const eventId = 'eventId';
        const userId = 'notInvitedId';
        spyOn(Events, 'findOne').and.returnValue({
          owner: 'userId',
          invited: ['invitedId']
        });
        spyOn(Events, 'update');
        spyOn(Meteor.users, 'findOne').and.returnValue({});

        invite.call(loggedIn(), eventId, userId);

        expect(Events.update).toHaveBeenCalledWith(eventId, {
          $addToSet: {
            invited: userId
          }
        });
      });
    });

    describe('rsvp', () => {
      function loggedIn(userId = 'userId') {
        return {
          userId
        };
      }

      it('should be called from Method', () => {
        spyOn(rsvp, 'apply');

        try {
          Meteor.call('rsvp');
        } catch (e) {}

        expect(rsvp.apply).toHaveBeenCalled();
      });

      it('should fail on missing eventId', () => {
        expect(() => {
          rsvp.call({});
        }).toThrowError();
      });

      it('should fail on missing rsvp', () => {
        expect(() => {
          rsvp.call({}, 'eventId');
        }).toThrowError();
      });

      it('should fail if not logged in', () => {
        expect(() => {
          rsvp.call({}, 'eventId', 'rsvp');
        }).toThrowError(/403/);
      });

      it('should fail on wrong answer', () => {
        expect(() => {
          rsvp.call(loggedIn(), 'eventId', 'wrong');
        }).toThrowError(/400/);
      });

      ['yes', 'maybe', 'no'].forEach((answer) => {
        it(`should pass on '${answer}'`, () => {
          expect(() => {
            rsvp.call(loggedIn(), 'eventId', answer);
          }).not.toThrowError(/400/);
        });
      });

      // TODO: more tests  
    });
  });
}
