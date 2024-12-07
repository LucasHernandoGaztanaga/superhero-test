import { Injectable, signal } from '@angular/core';
import { Hero } from '../models/hero.model';

export interface HeroEvent {
  type: 'created' | 'updated' | 'deleted';
  hero: Hero;
}

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private heroEventSignal = signal<HeroEvent | null>(null);
  heroEvent = this.heroEventSignal.asReadonly();

  emitHeroEvent(event: HeroEvent) {
    this.heroEventSignal.set(event);
  }
}