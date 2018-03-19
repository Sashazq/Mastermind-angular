import {Component, EventEmitter, Input, Output} from '@angular/core';
import {BaseButtonComponent} from '../baseButton/button.component';

@Component({
  selector: 'app-start-button',
  templateUrl: './startButton.component.html'
})
export class StartButtonComponent extends BaseButtonComponent {
  name = 'Start Game';
  disabled: boolean;

  @Output() onGameStarted = new EventEmitter<boolean>();

  click() {
    this.onGameStarted.emit(true);
    this.disabled = true;
  }
}
