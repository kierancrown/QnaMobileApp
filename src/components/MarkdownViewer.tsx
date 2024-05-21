import React, {useMemo} from 'react';
import {Linking} from 'react-native';
import {HStack, Text, VStack} from './common';
import {mvs} from 'react-native-size-matters';

interface MarkdownProps {
  text: string;
}

const MarkdownParser: React.FC<MarkdownProps> = ({text}) => {
  const parseMarkdown = useMemo(() => {
    const lines = text.split('\n');
    return lines.map((line, index) => {
      if (line.startsWith('# ')) {
        return (
          <Text key={index} variant="markdownH1">
            {line.substring(2)}
          </Text>
        );
      } else if (line.startsWith('## ')) {
        return (
          <Text key={index} variant="markdownH2">
            {line.substring(3)}
          </Text>
        );
      } else if (line.startsWith('### ')) {
        return (
          <Text key={index} variant="markdownH3">
            {line.substring(4)}
          </Text>
        );
      } else if (line.startsWith('* ') || line.startsWith('- ')) {
        return (
          <HStack key={index} paddingHorizontal="xs" columnGap="xs" pb="mY">
            <Text fontSize={mvs(22)} lineHeight={26} fontWeight={'900'}>
              •
            </Text>
            <Text variant="markdownBullet">{line.substring(2)}</Text>
          </HStack>
        );
      } else if (
        line.includes('[') &&
        line.includes('](') &&
        line.includes(')')
      ) {
        const startIdx = line.indexOf('[');
        const endIdx = line.indexOf(']');
        const str = line.substring(startIdx + 1, endIdx);
        const urlStartIdx = line.indexOf('(');
        const urlEndIdx = line.indexOf(')');
        const url = line.substring(urlStartIdx + 1, urlEndIdx);
        return (
          <Text key={index} onPress={() => Linking.openURL(url)} variant="body">
            {str}
          </Text>
        );
      } else {
        return (
          <Text key={index} variant="body">
            {line}
          </Text>
        );
      }
    });
  }, [text]);

  return <VStack paddingHorizontal="s">{parseMarkdown}</VStack>;
};

export default MarkdownParser;
