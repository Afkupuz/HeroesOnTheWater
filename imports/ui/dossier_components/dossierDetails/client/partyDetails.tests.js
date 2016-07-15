import { name as DossierDetails } from '../dossierDetails';
import { Events } from '../../../../api/events';
import 'angular-mocks';

describe('DossierDetails', () => {
  beforeEach(() => {
    window.module(DossierDetails);
  });

  describe('controller', () => {
    let controller;
    const dossier = {
      _id: 'dossierId',
      name: 'Foo',
      description: 'Birthday of Foo',
      public: true
    };

    beforeEach(() => {
      inject(($rootScope, $componentController) => {
        controller = $componentController(DossierDetails, {
          $scope: $rootScope.$new(true)
        });
      });
    });

    describe('save()', () => {
      beforeEach(() => {
        spyOn(Events, 'update');
        controller.dossier = dossier;
        controller.save();
      });

      it('should update a proper dossier', () => {
        expect(Events.update.calls.mostRecent().args[0]).toEqual({
          _id: dossier._id
        });
      });

      it('should update with proper modifier', () => {
        expect(Events.update.calls.mostRecent().args[1]).toEqual({
          $set: {
            name: dossier.name,
            description: dossier.description,
            public: dossier.public
          }
        });
      });
    });
  });
});
