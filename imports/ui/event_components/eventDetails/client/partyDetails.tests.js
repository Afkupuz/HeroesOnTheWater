import { name as EventDetails } from '../eventDetails';
import { Events } from '../../../../api/events';
import 'angular-mocks';

describe('EventDetails', () => {
  beforeEach(() => {
    window.module(EventDetails);
  });

  describe('controller', () => {
    let controller;
    const event = {
      _id: 'eventId',
      name: 'Foo',
      description: 'Birthday of Foo',
      public: true
    };

    beforeEach(() => {
      inject(($rootScope, $componentController) => {
        controller = $componentController(EventDetails, {
          $scope: $rootScope.$new(true)
        });
      });
    });

    describe('save()', () => {
      beforeEach(() => {
        spyOn(Events, 'update');
        controller.event = event;
        controller.save();
      });

      it('should update a proper event', () => {
        expect(Events.update.calls.mostRecent().args[0]).toEqual({
          _id: event._id
        });
      });

      it('should update with proper modifier', () => {
        expect(Events.update.calls.mostRecent().args[1]).toEqual({
          $set: {
            name: event.name,
            description: event.description,
            public: event.public
          }
        });
      });
    });
  });
});
