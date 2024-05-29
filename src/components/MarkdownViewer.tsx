import React, {useMemo} from 'react';
import {Linking} from 'react-native';
import {HStack, Text, VStack} from './common';
import {mvs} from 'react-native-size-matters';

interface MarkdownProps {
  text: string;
}

const MarkdownParser: React.FC<MarkdownProps> = ({text}) => {
  const processInlineMarkdown = (line: string, key: number) => {
    const boldRegex = /(\*\*|__)(.*?)\1/g;
    const elements = [];
    let lastIndex = 0;

    line.replace(boldRegex, (match, p1, p2, offset) => {
      // Add text before the match
      if (offset > lastIndex) {
        elements.push(line.substring(lastIndex, offset));
      }
      // Add the bold text
      elements.push(
        <Text key={offset} variant="bodyBold">
          {p2}
        </Text>,
      );
      // Update lastIndex
      lastIndex = offset + match.length;
      return match; // returning match as required by replace callback
    });

    // Add the remaining text after the last match
    if (lastIndex < line.length) {
      elements.push(line.substring(lastIndex));
    }

    return (
      <Text key={key} variant="body">
        {elements.map((el, idx) =>
          typeof el === 'string' ? <Text key={idx}>{el}</Text> : el,
        )}
      </Text>
    );
  };

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
            {processInlineMarkdown(line.substring(2), index)}
          </HStack>
        );
      } else if (/^\d+\.\s/.test(line)) {
        const listItemMatch = line.match(/^\d+/);
        const listItemNumber = listItemMatch ? listItemMatch[0] : '';
        return (
          <HStack key={index} paddingHorizontal="xs" columnGap="xs" pb="mY">
            <Text fontSize={mvs(22)} lineHeight={26} fontWeight={'900'}>
              {listItemNumber}.
            </Text>
            {processInlineMarkdown(
              line.substring(listItemNumber.length + 2),
              index,
            )}
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
        return processInlineMarkdown(line, index);
      }
    });
  }, [text]);

  return <VStack paddingHorizontal="s">{parseMarkdown}</VStack>;
};

export default MarkdownParser;
