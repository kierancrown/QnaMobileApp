import {ScrollViewWithHeaders} from '@codeherence/react-native-header';
import React, {useState} from 'react';
import HeaderComponent from '../../components/Header';
import {useAppTheme} from 'app/styles/theme';
import {useBottomPadding} from 'app/hooks/useBottomPadding';
import {useHiddenTabBar} from 'app/context/tabBarContext';
import MarkdownParser from 'app/components/MarkdownViewer';
import useMount from 'app/hooks/useMount';
import {supabase} from 'app/lib/supabase';
import {RouteProp, useRoute} from '@react-navigation/native';
import {ProfileStackParamList} from 'app/navigation/ProfileStack';
import Skeleton from 'react-native-reanimated-skeleton';
import {generateSkeletonTextLines} from 'app/utils/skeletonHelpers';

const SettingsAboutDocumentViewScreen = () => {
  useHiddenTabBar();
  const theme = useAppTheme();
  const [privacyPolicy, setPrivacyPolicy] = useState<string>();
  const bottomListPadding = useBottomPadding(theme.spacing.mY);

  const {
    params: {documentName},
  } = useRoute<RouteProp<ProfileStackParamList, 'SettingsDocumentViewer'>>();

  useMount(() => {
    supabase
      .from('public_docs')
      .select('*')
      .eq('name', documentName)
      .single()
      .then(({data, error}) => {
        if (error) {
          console.error('Error fetching privacy policy', error);
        } else {
          setPrivacyPolicy(data?.content);
        }
      });
  });

  return (
    <ScrollViewWithHeaders
      HeaderComponent={HeaderComponent}
      contentContainerStyle={{
        paddingTop: theme.spacing.mY,
        paddingBottom: bottomListPadding,
      }}>
      <Skeleton
        containerStyle={{paddingHorizontal: theme.spacing.s}}
        isLoading={privacyPolicy == null}
        boneColor={theme.colors.skeletonBackground}
        highlightColor={theme.colors.skeleton}
        layout={[
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
        ]}>
        <MarkdownParser text={privacyPolicy || ''} />
      </Skeleton>
    </ScrollViewWithHeaders>
  );
};

export default SettingsAboutDocumentViewScreen;
