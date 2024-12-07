import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { HeroStore } from '../../../../core/store/hero.store';
import { HeroCardComponent } from '../../components/hero-card/hero-card.component';
import { HeroFormComponent } from '../../components/hero-form/hero-form.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Hero } from '../../../../core/models/hero.model';
import { animate, style, transition, trigger } from '@angular/animations';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-hero-list',
  standalone: true,
  imports: [
    CommonModule,
    MatGridListModule,
    MatInputModule,
    MatFormFieldModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    HeroCardComponent,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  animations: [
    trigger('fadeSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', 
          style({ opacity: 1, transform: 'translateY(0)' })
        )
      ]),
      transition(':leave', [
        animate('300ms ease-in', 
          style({ opacity: 0, transform: 'translateY(20px)' })
        )
      ])
    ])
  ],
  templateUrl: './hero-list.component.html',
  styleUrls: ['./hero-list.component.scss']
})
export class HeroListComponent implements OnInit{
  private snackBar = inject(MatSnackBar);
  heroStore = inject(HeroStore);
  dialog = inject(MatDialog);
  searchControl = new FormControl('');

  handlePageEvent(e: PageEvent) {
    this.heroStore.updatePagination(e.pageIndex);
  }
  
  ngOnInit() {
    this.setupSearch();
  }

  private setupSearch() {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.heroStore.setFilter(searchTerm || '');
    });
  }

  private openHeroDialog(hero?: Hero) {
    const dialogRef = this.dialog.open(HeroFormComponent, {
      width: '600px',
      height: 'auto',
      maxHeight: '90vh',
      panelClass: ['hero-dialog', 'modern-dialog'],
      disableClose: false,
      data: hero,
      autoFocus: true
    });
  
    dialogRef.afterClosed().subscribe((result: Hero | undefined) => {
      if (result) {
        if (hero) {
          this.heroStore.updateHero(result);
          this.showSnackbar('Hero updated successfully');
        } else {
          this.heroStore.addHero(result);
          this.showSnackbar('Hero created successfully');
        }
      }
    });
  }
  
  addHero() {
    this.openHeroDialog();
  }

  editHero(hero: Hero) {
    this.openHeroDialog(hero);
  }

  deleteHero(hero: Hero) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Hero',
        message: `Are you sure you want to delete ${hero.name}?`,
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.heroStore.deleteHero(hero.id);
        this.showSnackbar('Hero deleted successfully');
      }
    });
  
  }
  private showSnackbar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    });
  }
}
