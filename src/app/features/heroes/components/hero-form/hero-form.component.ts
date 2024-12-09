import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { Hero } from '../../../../core/models/hero.model';
import { Publisher } from '../../../../core/models/publisher.enum';
import { UppercaseDirective } from '../../../../shared/directives/uppercase.directive';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { NativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-hero-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    UppercaseDirective,
    MatButtonToggleModule,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-US' },
    { provide: DateAdapter, useClass: NativeDateAdapter },
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: 'LL',
        },
        display: {
          dateInput: 'MM/DD/YYYY',
          monthYearLabel: 'MMM YYYY',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'MMMM YYYY',
        },
      },
    },
  ],
  templateUrl: './hero-form.component.html',
  styleUrls: ['./hero-form.component.scss']
 })

export class HeroFormComponent {
  form!: FormGroup;
  powers: string[] = [];
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<HeroFormComponent>);
  hero = inject(MAT_DIALOG_DATA) as Hero | undefined;
  publishers = Object.values(Publisher);
  ratings = [1, 2, 3, 4, 5];
  
  ngOnInit() {
    this.initForm();
  }
  
  isFormValid(): boolean {
    return this.form?.valid && this.powers.length > 0;
  }
  
  private initForm() {
    this.form = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
      ]],
      alterEgo: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
      ]],
      publisher: ['', [Validators.required]],
      rating: [5, [
        Validators.required,
        Validators.min(1),
        Validators.max(5)
      ]],
      firstAppearance: [new Date(), [
        Validators.required,
      ]],
    });

    if (this.hero) {
      this.powers = [...this.hero.powers];
      this.form.patchValue({
        ...this.hero,
        firstAppearance: new Date(this.hero.firstAppearance)
      });
    }
  }
  
  addPower(event: any) {
    const power = event.value?.trim().toUpperCase();
    if (power && power.length >= 3 && !this.powers.includes(power) && this.powers.length < 10) {
      this.powers.push(power);
      event.input.value = '';
    }
  }

  removePower(power: string) {
    const index = this.powers.indexOf(power);
    if (index >= 0) {
      this.powers.splice(index, 1);
    }
  }

  onSubmit() {
    if (this.isFormValid()) {
      const heroData = {
        ...this.form.value,
        powers: this.powers,
        id: this.hero?.id
      };
      this.dialogRef.close(heroData);
    }
  }

  getErrorMessage(controlName: string): string {
    const control = this.form.get(controlName);
    if (!control || !control.errors) return '';
  
    if (control.hasError('required')) {
      return `${controlName} is required`;
    }
    if (control.hasError('minlength')) {
      return `${controlName} must be at least ${control.errors['minlength'].requiredLength} characters`;
    }
    if (control.hasError('maxlength')) {
      return `${controlName} cannot exceed ${control.errors['maxlength'].requiredLength} characters`;
    }
    if (control.hasError('min')) {
      return `Minimum value is ${control.errors['min'].min}`;
    }
    if (control.hasError('max')) {
      return `Maximum value is ${control.errors['max'].max}`;
    }
    
    return '';
  }

  getFormErrors(): string[] {
    const errors: string[] = [];
    
    if (this.powers.length === 0) {
      errors.push('At least one power is required');
    }
    
    if (this.powers.length > 10) {
      errors.push('Maximum 10 powers allowed');
    }
    
    return errors;
  }
}