  import { TestBed } from '@angular/core/testing';
  import { HeroStore } from './hero.store';
  import { Hero } from '../models/hero.model';
  import { fakeAsync, tick } from '@angular/core/testing';
  import { PLATFORM_ID } from '@angular/core';

  describe('HeroStore', () => {
    let store: HeroStore;

    const mockHero: Omit<Hero, 'id'> = {
      name: 'SPIDER-MAN',
      alterEgo: 'Peter Parker',
      powers: ['Web-slinging', 'Spider-sense'],
      publisher: 'Marvel',
      firstAppearance: new Date('1962-08-01'),
      rating: 5,
    };

    beforeEach(() => {
      localStorage.clear();
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          HeroStore,
          { provide: PLATFORM_ID, useValue: 'browser' }
        ],
      });
      store = TestBed.inject(HeroStore);

      spyOn(localStorage, 'getItem').and.callFake((key: string) => {
        if (key === 'heroState') {
          return JSON.stringify({
            heroes: [],
            pagination: { currentPage: 0, itemsPerPage: 6, totalItems: 0 },
          });
        }
        return null;
      });

      spyOn(localStorage, 'setItem');
    });

    afterEach(() => {
      localStorage.clear();
    });

    it('should be created', () => {
      expect(store).toBeTruthy();
    });

    describe('Hero Management', () => {
      it('should add a hero and assign an id', () => {
        const addedHero = store.addHero(mockHero);
        expect(store.heroes().length).toBe(1);
        expect(addedHero.id).toBeDefined();
        expect(store.heroes()[0].name).toBe('SPIDER-MAN');
      });

      it('should generate correct id for first hero', () => {
        const addedHero = store.addHero(mockHero);
        expect(addedHero.id).toBe(1);
      });

      it('should generate sequential ids for heroes', () => {
        const hero1 = store.addHero(mockHero);
        const hero2 = store.addHero({ ...mockHero, name: 'BATMAN' });
        expect(hero1.id).toBe(1);
        expect(hero2.id).toBe(2);
      });

      it('should not add a hero if required fields are missing', () => {
        const invalidHero = {
          name: '',
          alterEgo: '',
          powers: [],
          publisher: '',
          firstAppearance: new Date('1900-01-01'),
          rating: 0,
        };
        expect(() => store.addHero(invalidHero as Omit<Hero, 'id'>)).toThrowError('Invalid hero: missing required fields');
        expect(store.heroes().length).toBe(0);
      });

      it('should update a hero correctly', () => {
        const addedHero = store.addHero(mockHero);
        const updatedHero = { ...addedHero, name: 'AMAZING SPIDER-MAN' };
        store.updateHero(updatedHero);
        expect(store.heroes()[0].name).toBe('AMAZING SPIDER-MAN');
        expect(store.heroes()[0].id).toBe(addedHero.id);
      });

      it('should delete a hero correctly', () => {
        const addedHero = store.addHero(mockHero);
        expect(store.heroes().length).toBe(1);
        store.deleteHero(addedHero.id);
        expect(store.heroes().length).toBe(0);
      });

      it('should get hero by id', () => {
        const addedHero = store.addHero(mockHero);
        const foundHero = store.getHeroById(addedHero.id);
        expect(foundHero).toEqual(addedHero);
      });

      it('should return undefined for non-existent hero id', () => {
        const foundHero = store.getHeroById(999);
        expect(foundHero).toBeUndefined();
      });
    });

    describe('Hero Selection', () => {
      it('should set selected hero', () => {
        const addedHero = store.addHero(mockHero);
        store.setSelectedHero(addedHero);
        expect(store.selectedHero()).toEqual(addedHero);
      });

      it('should clear selected hero', () => {
        const addedHero = store.addHero(mockHero);
        store.setSelectedHero(addedHero);
        store.setSelectedHero(null);
        expect(store.selectedHero()).toBeNull();
      });
    });

    describe('Filtering', () => {
      it('should filter heroes by name', () => {
        store.addHero(mockHero);
        store.addHero({
          ...mockHero,
          name: 'BATMAN',
          alterEgo: 'Bruce Wayne',
        });

        store.setFilter('SPIDER');
        const filtered = store.filteredHeroes();
        expect(filtered.heroes.length).toBe(1);
        expect(filtered.heroes[0].name).toBe('SPIDER-MAN');
      });

      it('should filter heroes by alter ego', () => {
        store.addHero(mockHero);
        store.addHero({
          ...mockHero,
          name: 'BATMAN',
          alterEgo: 'Bruce Wayne',
        });

        store.setFilter('bruce');
        const filtered = store.filteredHeroes();
        expect(filtered.heroes.length).toBe(1);
        expect(filtered.heroes[0].name).toBe('BATMAN');
      });

      it('should reset filters', () => {
        store.addHero(mockHero);
        store.setFilter('SPIDER');
        store.resetFilters();
        expect(store.filter()).toBe('');
        expect(store.pagination().currentPage).toBe(0);
      });
    });

    describe('Pagination', () => {
      beforeEach(() => {
        for (let i = 0; i < 10; i++) {
          store.addHero({
            ...mockHero,
            name: `HERO ${i + 1}`,
          });
        }
      });

      it('should handle first page correctly', () => {
        const firstPage = store.filteredHeroes();
        expect(firstPage.heroes.length).toBe(6);
        expect(firstPage.heroes[0].name).toBe('HERO 1');
      });

      it('should handle second page correctly', () => {
        store.updatePagination(1);
        const secondPage = store.filteredHeroes();
        expect(secondPage.heroes.length).toBe(4);
        expect(secondPage.heroes[0].name).toBe('HERO 7');
      });

      it('should update pagination currentPage', () => {
        store.updatePagination(1);
        expect(store.pagination().currentPage).toBe(1);
      });

      it('should reset pagination when filtering', () => {
        store.updatePagination(1);
        store.setFilter('HERO');
        expect(store.pagination().currentPage).toBe(0);
      });
    });

    describe('Loading State', () => {
      it('should have initial loading state as false', () => {
        expect(store.loading()).toBeFalse();
      });
    });

    describe('Platform Behavior', () => {
      it('should handle server-side rendering', () => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
          providers: [
            HeroStore,
            { provide: PLATFORM_ID, useValue: 'server' }
          ],
        });
        const serverStore = TestBed.inject(HeroStore);
        serverStore.loadStateFromLocalStorage();
        expect(serverStore.heroes().length).toBe(0);
      });
    });
  });