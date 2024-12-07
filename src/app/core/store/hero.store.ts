import { isPlatformBrowser } from '@angular/common';
import { computed, effect, signal, Signal } from '@angular/core';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { Hero } from '../models/hero.model';
import { MOCK_HEROES } from '../data/mock-heroes';

interface HeroState {
  heroes: Hero[];
  loading: boolean;
  selectedHero: Hero | null;
  filter: string;
  pagination: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
  };
}

const initialState: HeroState = {
  heroes: MOCK_HEROES,
  loading: false,
  selectedHero: null,
  filter: '',
  pagination: {
    currentPage: 0,
    itemsPerPage: 6,
    totalItems: MOCK_HEROES.length
  }
};

@Injectable({
  providedIn: 'root'
})
export class HeroStore {
  private platformId = inject(PLATFORM_ID);
  private state = signal<HeroState>(initialState);
  private isBrowser = isPlatformBrowser(this.platformId);

  heroes: Signal<Hero[]> = computed(() => this.state().heroes);
  loading: Signal<boolean> = computed(() => this.state().loading);
  selectedHero: Signal<Hero | null> = computed(() => this.state().selectedHero);
  filter: Signal<string> = computed(() => this.state().filter);
  pagination: Signal<HeroState['pagination']> = computed(() => this.state().pagination);

  filteredHeroes = computed(() => {
    const { heroes, filter, pagination } = this.state();
    
    let filtered = heroes;
    
    if (filter) {
      filtered = heroes.filter(hero => 
        hero.name.toLowerCase().includes(filter.toLowerCase()) ||
        hero.alterEgo.toLowerCase().includes(filter.toLowerCase())
      );
    }

    const start = pagination.currentPage * pagination.itemsPerPage;
    const end = start + pagination.itemsPerPage;
    
    return {
      heroes: filtered.slice(start, end),
      totalFiltered: filtered.length
    };
  });

  constructor() {

    if (this.isBrowser) {
      effect(() => {
        localStorage.setItem('heroState', JSON.stringify(this.state()));
      });

      const savedState = localStorage.getItem('heroState');
      if (savedState) {
        this.state.set({
          ...JSON.parse(savedState),
          loading: false
        });
      }
    }
  }

  addHero(hero: Omit<Hero, 'id'>): Hero {
    const newHero: Hero = {
      ...hero,
      id: Math.max(...this.state().heroes.map(h => h.id), 0) + 1
    };

    this.state.update((state: HeroState) => ({
      ...state,
      heroes: [...state.heroes, newHero],
      pagination: {
        ...state.pagination,
        totalItems: state.heroes.length + 1
      }
    }));

    return newHero;
  }

  updateHero(updatedHero: Hero): void {
    this.state.update((state: HeroState) => ({
      ...state,
      heroes: state.heroes.map(hero => 
        hero.id === updatedHero.id ? updatedHero : hero
      )
    }));
  }

  deleteHero(id: number): void {
    this.state.update((state: HeroState) => ({
      ...state,
      heroes: state.heroes.filter(hero => hero.id !== id),
      pagination: {
        ...state.pagination,
        totalItems: state.heroes.length - 1
      }
    }));
  }

  getHeroById(id: number): Hero | undefined {
    return this.state().heroes.find(hero => hero.id === id);
  }

  setSelectedHero(hero: Hero | null): void {
    this.state.update((state: HeroState) => ({
      ...state,
      selectedHero: hero
    }));
  }

  setFilter(filter: string) {
    this.state.update(state => ({
      ...state,
      filter,
      pagination: {
        ...state.pagination,
        currentPage: 0
      }
    }));
  }

  updatePagination(currentPage: number): void {
    this.state.update((state: HeroState) => ({
      ...state,
      pagination: {
        ...state.pagination,
        currentPage
      }
    }));
  }

  resetFilters(): void {
    this.state.update((state: HeroState) => ({
      ...state,
      filter: '',
      pagination: {
        ...state.pagination,
        currentPage: 0
      }
    }));
  }
}