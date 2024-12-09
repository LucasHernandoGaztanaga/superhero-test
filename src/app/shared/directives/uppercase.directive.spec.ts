import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { UppercaseDirective } from './uppercase.directive';

@Component({
  template: `
    <input [formControl]="control" appUppercase>
  `,
  standalone: true,
  imports: [ReactiveFormsModule, UppercaseDirective]
})
class TestComponent {
  control = new FormControl('');
}

describe('UppercaseDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should transform input value to uppercase', () => {
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    input.value = 'test';
    input.dispatchEvent(new Event('input'));
    expect(input.value).toBe('TEST');
  });

  it('should transform pasted text to uppercase', () => {
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    const pasteEvent = new ClipboardEvent('paste', {
      clipboardData: new DataTransfer(),
    });
    pasteEvent.clipboardData?.setData('text/plain', 'pasted text');
    input.dispatchEvent(pasteEvent);
    expect(component.control.value).toBe('PASTED TEXT');
  });

  it('should not modify value when pasting empty text', () => {
    component.control.setValue('test');
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    const pasteEvent = new ClipboardEvent('paste', {
      clipboardData: new DataTransfer(),
    });
    pasteEvent.clipboardData?.setData('text/plain', '');
    input.dispatchEvent(pasteEvent);
    expect(component.control.value).toBe('TEST');
  });

  it('should update form control value on input', () => {
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    input.value = 'test';
    input.dispatchEvent(new Event('input'));
    expect(component.control.value).toBe('TEST');
  });

  it('should update form control value on paste', () => {
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    const pasteEvent = new ClipboardEvent('paste', {
      clipboardData: new DataTransfer(),
    });
    pasteEvent.clipboardData?.setData('text/plain', 'pasted text');
    input.dispatchEvent(pasteEvent);
    expect(component.control.value).toBe('PASTED TEXT');
  });

  it('should not update form control value when pasting empty text', () => {
    component.control.setValue('test');
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    const pasteEvent = new ClipboardEvent('paste', {
      clipboardData: new DataTransfer(),
    });
    pasteEvent.clipboardData?.setData('text/plain', '');
    input.dispatchEvent(pasteEvent);
    expect(component.control.value).toBe('TEST');
  });
});