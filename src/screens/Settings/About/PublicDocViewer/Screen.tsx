import {ScrollViewWithHeaders} from '@codeherence/react-native-header';
import React, {useMemo, useState} from 'react';
import HeaderComponent from '../../components/Header';
import {useAppTheme} from 'app/styles/theme';
import {useBottomPadding} from 'app/hooks/useBottomPadding';
import {useHiddenTabBar} from 'app/context/tabBarContext';
import MarkdownParser from 'app/components/MarkdownViewer';
import {supabase} from 'app/lib/supabase';
import {RouteProp, useRoute} from '@react-navigation/native';
import {ProfileStackParamList} from 'app/navigation/ProfileStack';
import Skeleton from 'react-native-reanimated-skeleton';
import {generateSkeletonTextLines} from 'app/utils/skeletonHelpers';
import {useTimeout} from 'usehooks-ts';
import {Text} from 'app/components/common';
import dayjs from 'dayjs';

// Random time between 1000 and 1800
const randomTime = Math.floor(Math.random() * 800) + 1000;

const SettingsAboutDocumentViewScreen = () => {
  useHiddenTabBar();
  const theme = useAppTheme();
  const [document, setDocument] = useState<string>();
  const [updatedAt, setUpdatedAt] = useState<string>();
  const bottomListPadding = useBottomPadding(theme.spacing.mY);
  const skeletonLayout = useMemo(
    () => [
      ...generateSkeletonTextLines({
        count: 8,
        marginVertical: theme.spacing.xxsY,
      }),
      ...generateSkeletonTextLines({
        count: 1,
        fontSize: theme.textVariants.markdownH2.fontSize,
        randomWidthRange: [56, 56],
        marginVertical: theme.spacing.mY,
      }),
      ...generateSkeletonTextLines({
        count: 5,
        marginVertical: theme.spacing.xxsY,
      }),
      ...generateSkeletonTextLines({
        count: 1,
        fontSize: theme.textVariants.markdownH2.fontSize,
        randomWidthRange: [68, 77],
        marginVertical: theme.spacing.mY,
      }),
      ...generateSkeletonTextLines({
        count: 7,
        marginVertical: theme.spacing.xxsY,
      }),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const {
    params: {documentName},
  } = useRoute<RouteProp<ProfileStackParamList, 'SettingsDocumentViewer'>>();

  useTimeout(() => {
    supabase
      .from('public_docs')
      .select('*')
      .eq('name', documentName)
      .single()
      .then(({data, error}) => {
        if (error) {
          console.error('Error fetching privacy policy', error);
        } else {
          setDocument(data?.content);
          setUpdatedAt(data?.updated_at);
        }
      });
  }, randomTime);

  return (
    <ScrollViewWithHeaders
      HeaderComponent={HeaderComponent}
      contentContainerStyle={{
        paddingTop: theme.spacing.mY,
        paddingBottom: bottomListPadding,
      }}>
      <Skeleton
        containerStyle={{paddingHorizontal: theme.spacing.s}}
        isLoading={!document}
        boneColor={theme.colors.skeletonBackground}
        highlightColor={theme.colors.skeleton}
        layout={skeletonLayout}>
        <MarkdownParser text={document || ''} />
        <Text
          variant="body"
          color="cardText"
          style={{marginTop: theme.spacing.mY}}>
          Last updated: {dayjs(updatedAt).format('MMMM D, YYYY')}
        </Text>
      </Skeleton>
    </ScrollViewWithHeaders>
  );
};

export default SettingsAboutDocumentViewScreen;
