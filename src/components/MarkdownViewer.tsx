import React, {useCallback, useMemo} from 'react';
import {Linking} from 'react-native';
import {HStack, Text, VStack} from './common';
import {mvs} from 'react-native-size-matters';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {ProfileStackParamList} from 'app/navigation/ProfileStack';

interface MarkdownProps {
  text: string;
}

const MarkdownParser: React.FC<MarkdownProps> = ({text}) => {
  const {push} = useNavigation<NavigationProp<ProfileStackParamList>>() as any;

  const parseUrl = useCallback(
    (url: string) => {
      const parts = url.split('::');
      const isExternal = parts[0] === 'external';
      if (isExternal) {
        Linking.openURL(parts[1]);
      } else {
        const internalParts = parts[1].split('/');
        const headerTitle = internalParts[0];
        const documentName = internalParts[1];

        push('SettingsDocumentViewer', {
          headerTitle,
          documentName,
        });
      }
    },
    [push],
  );

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
        const elements = [];
        let lastIndex = 0;

        line.replace(
          /\[([^\]]+)\]\(([^\)]+)\)/g,
          (match, urlText, url, offset) => {
            if (offset > lastIndex) {
              elements.push(line.substring(lastIndex, offset));
            }
            elements.push(
              <Text
                key={offset}
                onPress={() => parseUrl(url)}
                variant="bodyUnderline"
                color="brand">
                {urlText}
              </Text>,
            );
            lastIndex = offset + match.length;
            return match;
          },
        );

        if (lastIndex < line.length) {
          elements.push(line.substring(lastIndex));
        }

        return (
          <Text key={index} variant="body">
            {elements.map((el, idx) =>
              typeof el === 'string' ? <Text key={idx}>{el}</Text> : el,
            )}
          </Text>
        );
      } else {
        return processInlineMarkdown(line, index);
      }
    });
  }, [parseUrl, text]);

  return <VStack paddingHorizontal="s">{parseMarkdown}</VStack>;
};

export default MarkdownParser;
