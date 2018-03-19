import {Component, OnInit} from '@angular/core';
import {CardRow} from './card';
import {TheSetService} from './services/theSet.service';
import {MastermindSolver} from './mastermindSolver';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Mastermind game';
  Cards: Array<any>;
  code: Array<number>;
  theSet = [];
  isSolved = false;

  onGameStarted() {
    if (this.code) {
      this.Cards = [];
      this.startDecode();
    }
  }

  constructor(private theSetService: TheSetService) {
  }

  ngOnInit() {
  }

  isValidCode(value) {
    const splitted = value.split('').map(val => +val);

    if (splitted.length === 4 && splitted.filter(val => !isNaN(val) && val >= 1 && val <= 6)) {
      return splitted;
    }

    return false;
  }

  onChangeCode(value) {
    this.code = this.isValidCode(value);
  }

  startDecode() {
    this.Cards = [];
    const getRand = () => this.theSetService.getRand(6, 1),
      startGuess = [],
      code = [];

    for (let i = 4; i-- > 0;) {
      startGuess.push(getRand());
      code.push(getRand());
    }

    this.code = code.slice();
    this.theSet = this.theSetService.generateTheSet();

    const places = 4;
    const numbers = 6;
    const mm = new MastermindSolver(places, numbers);
    let guess, tries = 0, blackPins, whitePins;

    while (true) {
      tries++;
      guess = mm.getGuess().toString().split('').map(item => +item);

      const res = this.getDecodeResult(code, guess);

      this.Cards.push(this.getCard(this.convertDecodeResult(res.matched, res.mismatched), guess));

      blackPins = res.matched;
      whitePins = res.mismatched;

      mm.feedPins(blackPins, whitePins);

      if (mm.status().state === 'solved' || mm.status().state === 'failed') {
        this.isSolved = mm.status().state === 'solved';

        break;
      }
    }
  }

  convertDecodeResult(matched, mismatched) {
    const convertedResult = [];

    for (let i = 0; i < 4; i++) {
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
    let _code = code.slice(), _decode = decode.slice();
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
