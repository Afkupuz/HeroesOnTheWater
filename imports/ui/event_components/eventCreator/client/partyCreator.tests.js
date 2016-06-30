import { name as EventCreator } from '../eventCreator';
import { Meteor } from 'meteor/meteor';
import 'angular-mocks';

describe('EventCreator', () => {
  beforeEach(() => {
    window.module(EventCreator);
  });

  describe('controller', () => {
    let $rootScope;
    let $componentController;
    const event = {
      _id: 'eventId'
    };

    beforeEach(() => {
      inject((_$rootScope_, _$componentController_) => {
        $rootScope = _$rootScope_;
        $componentController = _$componentController_;
      });
    });

    function component(bindings) {
      return $componentController(EventCreator, {
        $scope: $rootScope.$new(true)
      }, bindings);
    }

    it('should return an empty string if there is no event', () => {
      const controller = component({
        event: undefined
      });

      expect(controller.creator).toEqual('');
    });

    it('should say `me` if logged in is the owner', () => {
      const owner = 'userId';
      // logged in
      spyOn(Meteor, 'userId').and.returnValue(owner);
      const controller = component({
        event: {
          owner
        }
      });

      expect(controller.creator).toEqual('me');
    });

    it('should say `nobody` if user does not exist', () => {
      const owner = 'userId';
      // not logged in
      spyOn(Meteor, 'userId').and.returnValue(null);
      // no user found
      spyOn(Meteor.users, 'findOne').and.returnValue(undefined);
      const controller = component({
        event: {
          owner
        }
      });

      expect(controller.creator).toEqual('nobody');
    });

    it('should return user data if user exists and it is not logged one', () => {
      const owner = 'userId';
      // not logged in
      spyOn(Meteor, 'userId').and.returnValue(null);
      // user found
      spyOn(Meteor.users, 'findOne').and.returnValue('found');
      const controller = component({
        event: {
          owner
        }
      });

      expect(controller.creator).toEqual('found');
    });
  });
});
