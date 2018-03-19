import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-base-button',
  templateUrl: './baseButton.component.html'
})
export class BaseButtonComponent {
  @Input()
  name: string;
  @Input()
  disabled = false;
}
