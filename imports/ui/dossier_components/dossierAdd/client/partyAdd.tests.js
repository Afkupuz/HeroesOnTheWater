import { Meteor } from 'meteor/meteor';
import { name as DossierAdd } from '../dossierAdd';
import { Events } from '../../../../api/events';
import 'angular-mocks';

describe('DossierAdd', () => {
  beforeEach(() => {
    window.module(DossierAdd);
  });

  describe('controller', () => {
    let controller;
    const dossier = {
      name: 'Foo',
      description: 'Birthday of Foo',
      public: true
    };
    const user = {
      _id: 'userId'
    };

    beforeEach(() => {
      inject(($rootScope, $componentController) => {
        controller = $componentController(DossierAdd, {
          $scope: $rootScope.$new(true)
        });
      });

      spyOn(Meteor, 'user').and.returnValue(user);
    });

    describe('reset()', () => {
      it('should clean up dossier object', () => {
        controller.dossier = dossier;
        controller.reset();

        expect(controller.dossier).toEqual({});
      });
    });

    describe('submit()', () => {
      beforeEach(() => {
        spyOn(Events, 'insert');
        spyOn(controller, 'reset').and.callThrough();

        controller.dossier = dossier;

        controller.submit();
      });

      it('should insert a new dossier', () => {
        expect(Events.insert).toHaveBeenCalledWith({
          name: dossier.name,
          description: dossier.description,
          public: dossier.public,
          owner: user._id
        });
      });

      it('should call reset()', () => {
        expect(controller.reset).toHaveBeenCalled();
      });
    });
  });
});
