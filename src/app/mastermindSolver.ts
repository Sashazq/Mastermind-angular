export class MastermindSolver {
  numberNames: any[];
  private currentTry: number;
  private possible: number;
  private state: string;
  private maxCombs: number;
  private combinations: any[];
  private options: {
    numbers: number,
    places: number
  };
  private curComb: any;

  constructor(places: number, numbers: number) {
    this.options = {
      places,
      numbers
    };

    this.reset();
  }

  reset() {
    this.currentTry = 0;
    this.combinations = [];
    this.maxCombs = Math.pow(this.options.numbers, this.options.places);
    this.state = 'initial';
    this.possible = 0;

    const numberNames: any[] = [];
    let i;

    for (i = 0; i < this.options.numbers; i++) {
      numberNames[i] = i + 1;
    }
    this.numberNames = numberNames;
  }

  getGuess() {
    if (this.state === 'solved') {
      throw new Error('Mastermind already solved');
    }
    if (this.state !== 'initial' && this.state !== 'fedpins') {
      throw new Error('Incorrect state, cannot guess at this time');
    }
    let temp, tot, curCombNumber, curComb, output, i;
    const places = this.options.places, numbers = this.options.numbers, maxCombs = this.maxCombs;

    this.state = 'guessing';

    temp = [];
    tot = 0;

    for (i = 0; i < maxCombs; i++) {
      if (this.combinations[i] === undefined) {
        tot++;
        temp[tot] = i;
      }
    }

    curCombNumber = temp[Math.floor(Math.random() * tot) + 1];
    temp = null;
    curComb = [];

    for (i = 0; i < places; i++) {
      curComb[i] = Math.floor(curCombNumber / Math.pow(numbers, i)) % numbers;
    }
    this.curComb = curComb;

    this.currentTry++;
    output = '';

    for (i = places - 1; i >= 0; i--) {
      output += this.numberNames[curComb[i]];
    }

    return parseInt(output, 10);
  }

  feedPins(blackPins, whitePins) {
    if (this.state !== 'guessing') {
      throw new Error('Must be in guessing state to feed guess results');
    }

    let last, examinedCombNumber, examinedComb, examinedblackPins, examinedwhitePins, used, a, b, i;
    const places = this.options.places, numbers = this.options.numbers, maxCombs = this.maxCombs;

    if (blackPins === this.options.places) {
      this.state = 'solved';
      return;
    } else if ((blackPins + whitePins) > this.options.numbers) {
      throw new Error('Invalid number of pins');
    }

    this.possible = 0;
    last = 0;

    for (examinedCombNumber = 0; examinedCombNumber < maxCombs; examinedCombNumber++) {
      if (Math.floor(10 * examinedCombNumber / (maxCombs - 1)) >= last) {
        last++;
      }
      if (this.combinations[examinedCombNumber] === undefined) {
        examinedComb = [];
        for (i = 0; i < places; i++) {
          examinedComb[i] = Math.floor(examinedCombNumber / Math.pow(numbers, i)) % numbers;
        }
        examinedblackPins = 0;
        examinedwhitePins = 0;
        used = [];
        for (a = 0; a < places; a++) {
          if (this.curComb[a] === examinedComb[a]) {
            examinedblackPins++;
            examinedComb[a] = -1;
            used[a] = 1;
          }
        }
        for (a = 0; a < places; a++) {
          if (used[a] === undefined) {
            for (b = 0; b < places; b++) {
              if (this.curComb[a] === examinedComb[b]) {
                examinedwhitePins++;
                examinedComb[b] = -1;
                break;
              }
            }
          }
        }
        if (whitePins !== examinedwhitePins || blackPins !== examinedblackPins) {
          this.combinations[examinedCombNumber] = 0;
        }
      }
      if (this.combinations[examinedCombNumber] === undefined) {
        this.possible++;
      }
    }

    this.state = 'fedpins';

    if (this.possible === 0) {
      this.state = 'failed';
    }

    return this.status();
  }

  status() {
    const possibilities = (this.state === 'initial' || this.currentTry <= 1) ? this.maxCombs : this.possible;
    const successProbability = Math.floor(10000 / possibilities + 0.5) / 10000;
    const status = {
      state: this.state,
      possibilities: 1,
      successProbability: 1
    };
    if (this.state !== 'solved' && this.state !== 'failed') {
      status.possibilities = possibilities;
      status.successProbability = successProbability;
    }
    return status;
  }
}
