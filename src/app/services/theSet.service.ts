import {Injectable} from '@angular/core';

@Injectable()
export class TheSetService {

  constructor() {
  }

  getRand(max: number, min: number) {
    return Math.floor(Math.random() * (max - min + 1) + 1);
  }

  generateTheSet() {
    let str = '',
      i = 0;

    const generateList = () => {
      const list = [];

      while (list.length < 1296) {
        str = '';
        // generate new nmber
        for (i = 0; i < 4; i++) {
          str += this.getRand(6, 1);
        }

        // check if current variation exists
        if (list.indexOf(+str) === -1 && str.length === 4) {
          list.push(+str);
        }
      }

      return list;
    };

    return generateList();
  }
}
