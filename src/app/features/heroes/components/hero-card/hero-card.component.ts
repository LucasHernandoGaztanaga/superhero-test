import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { Hero } from '../../../../core/models/hero.model';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-hero-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  templateUrl: './hero-card.component.html',
  animations: [
    trigger('cardHover', [
      state('normal', style({
        transform: 'translateY(0)',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
      })),
      state('hovered', style({
        transform: 'translateY(-8px)',
        boxShadow: '0 8px 15px rgba(0,0,0,0.2)'
      })),
      transition('normal <=> hovered', [
        animate('200ms cubic-bezier(0.4, 0, 0.2, 1)')
      ])
    ]),
    trigger('iconRotate', [
      state('normal', style({ transform: 'rotate(0)' })),
      state('rotated', style({ transform: 'rotate(360deg)' })),
      transition('normal <=> rotated', [
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)')
      ])
    ])
  ],
  styleUrls: ['./hero-card.component.scss']
})
export class HeroCardComponent {
  @Input({ required: true }) hero!: Hero;
  @Output() edit = new EventEmitter<Hero>();
  @Output() delete = new EventEmitter<Hero>();

  cardState = 'normal';
  buttonState = 'normal';
  
  getPublisherColor(): string {
    switch (this.hero.publisher.toLowerCase()) {
      case 'marvel': return '#e23636';
      case 'dc': return '#0476F2';
      default: return '#757575';
    }
  }

  getRatingArray(): number[] {
    return Array(this.hero.rating).fill(0);
  }
}