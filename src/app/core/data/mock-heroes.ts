import { Hero } from '../models/hero.model';

export const MOCK_HEROES: Hero[] = [
  {
    id: 1,
    name: 'SPIDER-MAN',
    alterEgo: 'Peter Parker',
    powers: ['Wall-crawling', 'Super strength', 'Spider-sense'],
    publisher: 'Marvel',
    firstAppearance: new Date('1962-08-01'),
    rating: 5
  },
  {
    id: 2,
    name: 'BATMAN',
    alterEgo: 'Bruce Wayne',
    powers: ['Intelligence', 'Martial Arts', 'Technology'],
    publisher: 'DC',
    firstAppearance: new Date('1939-05-01'),
    rating: 5
  }
];