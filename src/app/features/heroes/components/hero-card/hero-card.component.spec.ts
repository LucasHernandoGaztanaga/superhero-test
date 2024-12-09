import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroCardComponent } from './hero-card.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { By } from '@angular/platform-browser';

describe('HeroCardComponent', () => {
  let component: HeroCardComponent;
  let fixture: ComponentFixture<HeroCardComponent>;

  const mockHero = {
    id: 1,
    name: 'SPIDER-MAN',
    alterEgo: 'Peter Parker',
    powers: ['Web-slinging', 'Spider-sense'],
    publisher: 'Marvel',
    firstAppearance: new Date('1962-07-31T23:00:00.000Z'),
    rating: 5
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HeroCardComponent,
        NoopAnimationsModule,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        MatChipsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeroCardComponent);
    component = fixture.componentInstance;
    component.hero = mockHero;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('User Interactions', () => {
    it('should emit edit event', () => {
      spyOn(component.edit, 'emit');
      const editButton = fixture.debugElement.query(By.css('button[color="primary"]'));
      editButton.nativeElement.click();
      expect(component.edit.emit).toHaveBeenCalledWith(mockHero);
    });

    it('should emit delete event', () => {
      spyOn(component.delete, 'emit');
      const deleteButton = fixture.debugElement.query(By.css('button[color="warn"]'));
      deleteButton.nativeElement.click();
      expect(component.delete.emit).toHaveBeenCalledWith(mockHero);
    });

    it('should change card state on hover', () => {
      const card = fixture.debugElement.query(By.css('.hero-card'));
      card.triggerEventHandler('mouseenter', null);
      expect(component.cardState).toBe('hovered');
      card.triggerEventHandler('mouseleave', null);
      expect(component.cardState).toBe('normal');
    });

    it('should change button state on hover', () => {
      const editButton = fixture.debugElement.query(By.css('button[color="primary"]'));
      editButton.triggerEventHandler('mouseenter', null);
      expect(component.buttonState).toBe('rotated');
      editButton.triggerEventHandler('mouseleave', null);
      expect(component.buttonState).toBe('normal');
    });
  });

  describe('Display Logic', () => {
    it('should display hero name and alter ego', () => {
      const title = fixture.debugElement.query(By.css('mat-card-title'));
      const subtitle = fixture.debugElement.query(By.css('mat-card-subtitle'));
      expect(title.nativeElement.textContent).toContain('SPIDER-MAN');
      expect(subtitle.nativeElement.textContent).toContain('Peter Parker');
    });

    it('should display first letter of hero name in avatar', () => {
      const avatar = fixture.debugElement.query(By.css('.hero-avatar'));
      expect(avatar.nativeElement.textContent.trim()).toBe('S');
    });

    it('should display all powers as chips', () => {
      const chips = fixture.debugElement.queryAll(By.css('mat-chip'));
      expect(chips.length).toBe(mockHero.powers.length);
      expect(chips[0].nativeElement.textContent.trim()).toBe('Web-slinging');
      expect(chips[1].nativeElement.textContent.trim()).toBe('Spider-sense');
    });

    it('should display correct number of rating stars', () => {
      const stars = fixture.debugElement.queryAll(By.css('mat-icon'));
      const ratingStars = stars.filter(star => star.nativeElement.textContent.includes('star'));
      expect(ratingStars.length).toBe(mockHero.rating);
    });

    it('should display formatted first appearance date', () => {
      const dateElement = fixture.debugElement.query(By.css('.appearance-date'));
      const content = dateElement.nativeElement.textContent;
      expect(content).toContain('Jul 31, 1962');
    });
  });

  describe('Publisher Colors', () => {
    it('should return correct color for Marvel', () => {
      expect(component.getPublisherColor()).toBe('#e23636');
    });

    it('should return correct color for DC', () => {
      component.hero = { ...mockHero, publisher: 'DC' };
      expect(component.getPublisherColor()).toBe('#0476F2');
    });

    it('should return default color for other publishers', () => {
      component.hero = { ...mockHero, publisher: 'Image' };
      expect(component.getPublisherColor()).toBe('#757575');
    });

    it('should handle publisher case-insensitively', () => {
      component.hero = { ...mockHero, publisher: 'marvel' };
      expect(component.getPublisherColor()).toBe('#e23636');
    });
  });

  describe('Rating Array Generation', () => {
    it('should generate correct rating array length', () => {
      expect(component.getRatingArray().length).toBe(5);
    });

    it('should handle zero rating', () => {
      component.hero = { ...mockHero, rating: 0 };
      expect(component.getRatingArray().length).toBe(0);
    });

    it('should handle maximum rating', () => {
      component.hero = { ...mockHero, rating: 10 };
      expect(component.getRatingArray().length).toBe(10);
    });
  });

  describe('Input Validation', () => {
    it('should throw error if hero input is not provided', () => {
      const validateComponent = () => {
        const tempFixture = TestBed.createComponent(HeroCardComponent);
        tempFixture.detectChanges();
      };
      expect(validateComponent).toThrow();
    });
  });

  describe('Dynamic Updates', () => {
    it('should update display when hero input changes', () => {
      const updatedHero = { ...mockHero, name: 'BATMAN', alterEgo: 'Bruce Wayne' };
      component.hero = updatedHero;
      fixture.detectChanges();
      
      const title = fixture.debugElement.query(By.css('mat-card-title'));
      const subtitle = fixture.debugElement.query(By.css('mat-card-subtitle'));
      expect(title.nativeElement.textContent).toContain('BATMAN');
      expect(subtitle.nativeElement.textContent).toContain('Bruce Wayne');
    });
  });
});