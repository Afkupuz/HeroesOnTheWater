import { Meteor } from 'meteor/meteor';
import { name as EventAdd } from '../eventAdd';
import { Events } from '../../../../api/events';
import 'angular-mocks';

describe('EventAdd', () => {
  beforeEach(() => {
    window.module(EventAdd);
  });

  describe('controller', () => {
    let controller;
    const event = {
      name: 'Foo',
      description: 'Birthday of Foo',
      public: true
    };
    const user = {
      _id: 'userId'
    };

    beforeEach(() => {
      inject(($rootScope, $componentController) => {
        controller = $componentController(EventAdd, {
          $scope: $rootScope.$new(true)
        });
      });

      spyOn(Meteor, 'user').and.returnValue(user);
    });

    describe('reset()', () => {
      it('should clean up event object', () => {
        controller.event = event;
        controller.reset();

        expect(controller.event).toEqual({});
      });
    });

    describe('submit()', () => {
      beforeEach(() => {
        spyOn(Events, 'insert');
        spyOn(controller, 'reset').and.callThrough();

        controller.event = event;

        controller.submit();
      });

      it('should insert a new event', () => {
        expect(Events.insert).toHaveBeenCalledWith({
          name: event.name,
          description: event.description,
          public: event.public,
          owner: user._id
        });
      });

      it('should call reset()', () => {
        expect(controller.reset).toHaveBeenCalled();
      });
    });
  });
});
