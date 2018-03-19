import {Component, OnInit} from '@angular/core';
import {CardRow} from './card';
import {MastermindSolver} from './mastermindSolver';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Mastermind game';
  Cards: Array<any>;
  code: number;
  isSolved = false;
  tries = 0;

  constructor() {
  }

  onGameStarted() {
    const splitted = this.convertToArrayInt(this.code);

    if (this.isValidCode(splitted)) {
      this.Cards = [];
      this.startDecode(splitted);
    }
  }

  ngOnInit() {
  }

  isValidCode(value) {
    return Array.isArray(value) && value.length === 4 && value.filter(val => !isNaN(val) && val >= 1 && val <= 6);
  }

  convertToArrayInt(value) {
    return value && value.toString().split('').map(val => +val);
  }

  startDecode(settedCode: Array<number>) {
    this.Cards = [];

    const places = 4;
    const numbers = 6;
    const masterMind = new MastermindSolver(places, numbers);
    let guess, tries = 0, blackPins, whitePins;

    while (true) {
      tries++;
      guess = this.convertToArrayInt(masterMind.getGuess());

      const res = this.getDecodeResult(settedCode, guess);

      this.Cards.push(this.getCard(this.convertDecodeResult(res.matched, res.mismatched), guess));

      blackPins = res.matched;
      whitePins = res.mismatched;

      masterMind.feedPins(blackPins, whitePins);

      if (masterMind.status().state === 'solved' || masterMind.status().state === 'failed') {
        this.isSolved = masterMind.status().state === 'solved';

        break;
      }
    }

    this.tries = tries;
  }

  convertDecodeResult(matched, mismatched) {
    const convertedResult = [];

    for (let i = 4; i-- > 0;) {
      if (matched) {
        convertedResult.push(1);
        matched--;
        continue;
      }

      if (mismatched) {
        convertedResult.push(2);
        mismatched--;
        continue;
      }

      convertedResult.push(0);
    }

    return convertedResult;
  }

  getCard(result: Array<number>, guess: Array<number>) {
    const items = [],
      list = {
        0: 'grey darken-1',
        1: 'black',
        2: 'white'
      };

    result.forEach(val => {
      items.push(list[val]);
    });

    return {
      items,
      values: guess
    };
  }


  getDecodeResult(code: Array<Number>, decode: Array<Number>) {
    const _code = code.slice(), _decode = decode.slice();
    const isMatch = (val, index) => val === _code[index],
      matches = _decode.filter(isMatch),
      missed = _decode.filter((val, index) => !isMatch(val, index)),
      mismatched = [];

    matches.forEach((val) => _code.splice(_code.indexOf(val), 1));
    missed.forEach(val => {
      const index = _code.indexOf(val);

      if (index !== -1) {
        _code.splice(index, 1);
        mismatched.push(val);
      }
    });

    return {
      matched: matches.length,
      mismatched: mismatched.length
    };
  };
}
