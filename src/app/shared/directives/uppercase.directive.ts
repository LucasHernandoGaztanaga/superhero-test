import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appUppercase]',
  standalone: true
})
export class UppercaseDirective {
  constructor(
    private el: ElementRef,
    private control: NgControl
  ) {}

  @HostListener('input', ['$event'])
  onInput(event: InputEvent) {
    const input = event.target as HTMLInputElement;
    const value = input.value.toUpperCase();
    
    this.control.control?.setValue(value, {
      emitEvent: false
    });
    input.value = value;
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pastedInput = event.clipboardData?.getData('text/plain')
      .toUpperCase();
      
    if (pastedInput) {
      this.control.control?.setValue(pastedInput);
    }
  }
}