import { TestBed } from '@angular/core/testing';
import { EventsService } from './events.service';
import { Hero } from '../models/hero.model';

describe('EventsService', () => {
  let service: EventsService;

  const mockHero: Hero = {
    id: 1,
    name: 'SPIDER-MAN',
    alterEgo: 'Peter Parker',
    powers: ['Web-slinging'],
    publisher: 'Marvel',
    firstAppearance: new Date(),
    rating: 5
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EventsService]
    });
    service = TestBed.inject(EventsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit hero created event', () => {
    service.emitHeroEvent({ type: 'created', hero: mockHero });
    expect(service.heroEvent()?.type).toBe('created');
    expect(service.heroEvent()?.hero).toEqual(mockHero);
  });

  it('should emit hero updated event', () => {
    service.emitHeroEvent({ type: 'updated', hero: mockHero });
    expect(service.heroEvent()?.type).toBe('updated');
  });

  it('should emit hero deleted event', () => {
    service.emitHeroEvent({ type: 'deleted', hero: mockHero });
    expect(service.heroEvent()?.type).toBe('deleted');
  });
});