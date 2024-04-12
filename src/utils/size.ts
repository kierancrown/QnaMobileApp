import {WINDOW_HEIGHT, WINDOW_WIDTH} from '@gorhom/bottom-sheet';

const roundNumber = (num: number): number => {
  return Math.round(num);
};

const percentWidth = (percent: number): number => {
  return (WINDOW_WIDTH * percent) / 100;
};

const percentHeight = (percent: number): number => {
  return (WINDOW_HEIGHT * percent) / 100;
};

export {roundNumber, percentWidth, percentHeight};
