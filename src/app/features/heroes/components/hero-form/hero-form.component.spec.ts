import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HeroFormComponent } from './hero-form.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Publisher } from '../../../../core/models/publisher.enum';
import { Hero } from '../../../../core/models/hero.model';
import { By } from '@angular/platform-browser';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { CommonModule } from '@angular/common';

describe('HeroFormComponent', () => {
  let component: HeroFormComponent;
  let fixture: ComponentFixture<HeroFormComponent>;
  let dialogRef: MatDialogRef<HeroFormComponent>;

  const mockHero: Hero = {
    id: 1,
    name: 'SPIDER-MAN',
    alterEgo: 'Peter Parker',
    publisher: Publisher.MARVEL,
    rating: 4,
    powers: ['Web-slinging', 'Spider-sense'],
    firstAppearance: new Date('1962-08-01')
  };

  beforeEach(async () => {
    dialogRef = {
      close: jasmine.createSpy('close')
    } as any;

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatChipsModule,
        MatIconModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSelectModule,
        MatButtonToggleModule,
        NoopAnimationsModule,
        HeroFormComponent
      ],
      providers: [
        FormBuilder,
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: null }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeroFormComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();
  });

  describe('Form Initialization', () => {
    it('should create component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize empty form', () => {
      expect(component.form.get('name')?.value).toBe('');
      expect(component.form.get('alterEgo')?.value).toBe('');
      expect(component.form.get('publisher')?.value).toBe('');
      expect(component.form.get('rating')?.value).toBe(5);
      expect(component.powers).toEqual([]);
    });

    it('should initialize form with hero data', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [
          CommonModule,
          ReactiveFormsModule,
          MatFormFieldModule,
          MatInputModule,
          MatButtonModule,
          MatChipsModule,
          MatIconModule,
          MatDatepickerModule,
          MatNativeDateModule,
          MatSelectModule,
          MatButtonToggleModule,
          NoopAnimationsModule,
          HeroFormComponent
        ],
        providers: [
          FormBuilder,
          { provide: MatDialogRef, useValue: dialogRef },
          { provide: MAT_DIALOG_DATA, useValue: mockHero }
        ]
      });

      const editFixture = TestBed.createComponent(HeroFormComponent);
      const editComponent = editFixture.componentInstance;
      editComponent.ngOnInit();
      editFixture.detectChanges();

      expect(editComponent.form.value).toEqual({
        name: 'SPIDER-MAN',
        alterEgo: 'Peter Parker',
        publisher: Publisher.MARVEL,
        rating: 4,
        firstAppearance: jasmine.any(Date)
      });
      expect(editComponent.powers).toEqual(['Web-slinging', 'Spider-sense']);
    });
  });

  describe('Form Validation', () => {
    it('should validate required fields', () => {
      expect(component.form.valid).toBeFalse();
      
      component.form.patchValue({
        name: 'BATMAN',
        alterEgo: 'Bruce Wayne',
        publisher: Publisher.DC,
        rating: 5,
        firstAppearance: new Date()
      });
      
      expect(component.form.valid).toBeTrue();
    });

    it('should validate name length', () => {
      const nameControl = component.form.get('name');
      nameControl?.setValue('A');
      expect(nameControl?.errors?.['minlength']).toBeTruthy();
      
      nameControl?.setValue('A'.repeat(51));
      expect(nameControl?.errors?.['maxlength']).toBeTruthy();
      
      nameControl?.setValue('BATMAN');
      expect(nameControl?.errors).toBeNull();
    });

    it('should validate alter ego length', () => {
      const alterEgoControl = component.form.get('alterEgo');
      alterEgoControl?.setValue('B');
      expect(alterEgoControl?.errors?.['minlength']).toBeTruthy();
      
      alterEgoControl?.setValue('B'.repeat(51));
      expect(alterEgoControl?.errors?.['maxlength']).toBeTruthy();
      
      alterEgoControl?.setValue('Bruce Wayne');
      expect(alterEgoControl?.errors).toBeNull();
    });

    it('should validate rating range', () => {
      const ratingControl = component.form.get('rating');
      ratingControl?.setValue(0);
      expect(ratingControl?.errors?.['min']).toBeTruthy();
      
      ratingControl?.setValue(6);
      expect(ratingControl?.errors?.['max']).toBeTruthy();
      
      ratingControl?.setValue(5);
      expect(ratingControl?.errors).toBeNull();
    });
  });

  describe('Powers Management', () => {
    it('should add valid power', () => {
      const event = { value: 'Super Strength', input: { value: '' } };
      component.addPower(event);
      expect(component.powers).toContain('SUPER STRENGTH');
      expect(event.input.value).toBe('');
    });

    it('should not add duplicate power', () => {
      component.powers = ['FLIGHT'];
      const event = { value: 'Flight', input: { value: '' } };
      component.addPower(event);
      expect(component.powers).toEqual(['FLIGHT']);
    });

    it('should remove power', () => {
      component.powers = ['FLIGHT', 'SUPER STRENGTH'];
      component.removePower('FLIGHT');
      expect(component.powers).toEqual(['SUPER STRENGTH']);
    });

    it('should enforce power list limits', () => {
      for (let i = 0; i < 10; i++) {
        component.addPower({ value: `Power ${i + 1}`, input: { value: '' } });
      }
      expect(component.powers.length).toBe(10);

      component.addPower({ value: 'Extra Power', input: { value: '' } });
      expect(component.powers.length).toBe(10);
    });

    it('should handle different power inputs', () => {
      const testCases = [
        { value: 'Valid Power', expected: true },
        { value: '  Trimmed Power  ', expected: true },
        { value: 'ab', expected: false },
        { value: '', expected: false },
        { value: '   ', expected: false }
      ];

      testCases.forEach(({ value, expected }) => {
        component.powers = [];
        component.addPower({ value, input: { value: '' } });
        if (expected) {
          expect(component.powers.length).toBe(1);
          expect(component.powers[0]).toBe(value.trim().toUpperCase());
        } else {
          expect(component.powers.length).toBe(0);
        }
      });
    });

    it('should validate form with powers', () => {
      component.form.patchValue({
        name: 'BATMAN',
        alterEgo: 'Bruce Wayne',
        publisher: Publisher.DC,
        rating: 5,
        firstAppearance: new Date()
      });
      expect(component.isFormValid()).toBeFalse();

      component.addPower({ value: 'Intelligence', input: { value: '' } });
      expect(component.isFormValid()).toBeTrue();
    });

    it('should track powers array changes', () => {
      expect(component.powers.length).toBe(0);
      
      component.addPower({ value: 'Power 1', input: { value: '' } });
      expect(component.powers.length).toBe(1);
      
      component.removePower('POWER 1');
      expect(component.powers.length).toBe(0);
    });
});

  describe('Form Submission', () => {
    it('should submit valid form', fakeAsync(() => {
      const submitDate = new Date();
      component.form.patchValue({
        name: 'BATMAN',
        alterEgo: 'Bruce Wayne',
        publisher: Publisher.DC,
        rating: 5,
        firstAppearance: submitDate
      });
      component.powers = ['Intelligence', 'Martial Arts'];
      
      component.onSubmit();
      tick();
      
      expect(dialogRef.close).toHaveBeenCalledWith({
        name: 'BATMAN',
        alterEgo: 'Bruce Wayne',
        publisher: Publisher.DC,
        rating: 5,
        firstAppearance: submitDate,
        powers: ['Intelligence', 'Martial Arts'],
        id: undefined
      });
    }));

    it('should not submit invalid form', () => {
      component.form.patchValue({
        name: '',
        alterEgo: '',
        publisher: '',
        rating: 0
      });
      component.onSubmit();
      expect(dialogRef.close).not.toHaveBeenCalled();
    });

    it('should not submit form without powers', () => {
      component.form.patchValue({
        name: 'BATMAN',
        alterEgo: 'Bruce Wayne',
        publisher: Publisher.DC,
        rating: 5,
        firstAppearance: new Date()
      });
      component.powers = [];
      component.onSubmit();
      expect(dialogRef.close).not.toHaveBeenCalled();
    });
  });

  describe('DatePicker Interactions', () => {
    it('should initialize with current date', () => {
      const dateControl = component.form.get('firstAppearance');
      expect(dateControl?.value).toBeTruthy();
      expect(dateControl?.value instanceof Date).toBeTrue();
    });

    it('should validate date input', () => {
      const dateControl = component.form.get('firstAppearance');
      dateControl?.setValue(null);
      expect(dateControl?.errors?.['required']).toBeTrue();
      
      const validDate = new Date();
      dateControl?.setValue(validDate);
      expect(dateControl?.errors).toBeNull();
    });
  });

  describe('UI Elements', () => {
    it('should display correct title for new hero', () => {
      const title = fixture.debugElement.query(By.css('.dialog-title'));
      expect(title.nativeElement.textContent).toContain('Create New Hero');
    });

    it('should display correct title for edit mode', () => {
      component.hero = mockHero;
      fixture.detectChanges();
      const title = fixture.debugElement.query(By.css('.dialog-title'));
      expect(title.nativeElement.textContent).toContain('Edit Hero');
    });

    it('should disable submit button when form is invalid', () => {
      const submitButton = fixture.debugElement.query(By.css('button[type="submit"]'));
      expect(submitButton.nativeElement.disabled).toBeTrue();
    });

    it('should show error messages for invalid fields', () => {
      component.form.controls['name'].setValue('');
      component.form.controls['name'].markAsTouched();
      fixture.detectChanges();
      
      const errorElement = fixture.debugElement.query(By.css('mat-error'));
      expect(errorElement.nativeElement.textContent).toContain('required');
    });

    it('should display all publishers in select', () => {
      const options = Object.values(Publisher);
      expect(component.publishers).toEqual(options);
    });

    it('should display rating options', () => {
      expect(component.ratings).toEqual([1, 2, 3, 4, 5]);
    });
  });

  describe('Error Messages', () => {
    it('should return correct error messages for each field', () => {
      expect(component.getErrorMessage('name')).toBe('name is required');
      component.form.controls['rating'].setValue(0);
      expect(component.getErrorMessage('rating')).toBe('Minimum value is 1');
    });

    it('should return empty string for valid field', () => {
      component.form.controls['name'].setValue('BATMAN');
      expect(component.getErrorMessage('name')).toBe('');
    });

    it('should return form-level errors', () => {
      expect(component.getFormErrors()).toContain('At least one power is required');
      component.powers = Array(11).fill('Power');
      expect(component.getFormErrors()).toContain('Maximum 10 powers allowed');
    });

    it('should handle non-existent control errors', () => {
      expect(component.getErrorMessage('nonexistent')).toBe('');
    });
  });
});