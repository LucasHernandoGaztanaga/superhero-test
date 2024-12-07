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
    MatButtonToggleModule,
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
      name: ['', Validators.required],
      alterEgo: ['', Validators.required],
      publisher: ['', Validators.required],
      rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      firstAppearance: [new Date(), Validators.required]
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
    const power = event.value?.trim();
    if (power) {
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
    if (!control) return '';
    
    if (control.hasError('required')) {
      return 'This field is required';
    }
    if (control.hasError('minlength')) {
      return `Minimum length is ${control.getError('minlength').requiredLength}`;
    }
    if (control.hasError('min') || control.hasError('max')) {
      return 'Value must be between 1 and 5';
    }
    return '';
  }
}