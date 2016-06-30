import { name as EventRemove } from '../eventRemove';
import { Events } from '../../../../api/events';
import 'angular-mocks';

describe('EventRemove', () => {
  beforeEach(() => {
    window.module(EventRemove);
  });

  describe('controller', () => {
    let controller;
    const event = {
      _id: 'eventId'
    };

    beforeEach(() => {
      inject(($rootScope, $componentController) => {
        controller = $componentController(EventRemove, {
          $scope: $rootScope.$new(true)
        }, {
          event
        });
      });
    });

    describe('remove()', () => {
      beforeEach(() => {
        spyOn(Events, 'remove');
        controller.remove();
      });

      it('should remove a event', () => {
        expect(Events.remove).toHaveBeenCalledWith(event._id);
      });
    });
  });
});
