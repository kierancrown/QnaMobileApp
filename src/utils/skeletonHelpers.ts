import {mvs} from 'react-native-size-matters';
import {ICustomViewStyle} from 'react-native-reanimated-skeleton';
import {DimensionValue} from 'react-native';

interface generateSkeletonTextLinesConfig {
  count?: number;
  fontSize?: number;
  randomWidthRange?: [number, number];
  marginVertical?: number;
  marginBottom?: number;
}

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const generateSkeletonTextLines = ({
  count = 15,
  fontSize = mvs(16),
  randomWidthRange = [86, 100],
  marginVertical = 6,
  marginBottom = 0,
}: generateSkeletonTextLinesConfig) => {
  const lines: ICustomViewStyle[] = [];
  for (let i = 0; i < count; i++) {
    const width = `${getRandomNumber(
      randomWidthRange[0],
      randomWidthRange[1],
    )}%` as DimensionValue;
    const height = fontSize + 6;

    console.log('width', width);

    lines.push({
      key: `line${i + 1}`,
      width,
      height,
      marginVertical: marginVertical === 0 ? undefined : marginVertical,
      marginBottom: marginBottom === 0 ? undefined : marginBottom,
    });
  }

  return lines;
};
