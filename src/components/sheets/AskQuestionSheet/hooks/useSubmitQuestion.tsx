import {useAlert} from 'app/components/AlertsWrapper';
import {useAuth} from 'app/hooks/useAuth';
import {supabase} from 'app/lib/supabase';
import {resetSheet, setLoading} from 'app/redux/slices/askSheetSlice';
import {RootState, useAppDispatch} from 'app/redux/store';
import {decode} from 'base64-arraybuffer';
import {Asset} from 'react-native-image-picker';
import {useSelector} from 'react-redux';

export const useSubmitQuestion = () => {
  const dispatch = useAppDispatch();
  const {openAlert} = useAlert();
  const {profile} = useAuth({});
  const askSheetData = useSelector(
    (state: RootState) => state.nonPersistent.askSheet,
  );

  const uploadAsset = async (asset: Asset): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!asset.base64 || !profile?.user_id) {
        return;
      }

      supabase.storage
        .from('question_attatchments')
        .upload(
          `public/${profile.user_id}/${asset.timestamp ?? Date.now()}.jpg`,
          decode(asset.base64),
          {
            contentType: 'image/jpg',
          },
        )
        .then(({data, error}) => {
          if (error) {
            reject(error);
          } else if (data) {
            // Get public url to store
            resolve(
              supabase.storage
                .from('question_attatchments')
                .getPublicUrl(data.path).data.publicUrl,
            );
          }
        });
    });
  };

  const submit = async () => {
    dispatch(setLoading(true));

    const askData = askSheetData;
    const userId = profile?.user_id;

    if (!userId) {
      dispatch(setLoading(false));
      return;
    }

    const userMetaId = await supabase
      .from('user_metadata')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (!userMetaId.data) {
      // Error
      openAlert({
        title: 'Error posting',
        message: 'Cannot post',
      });
      return;
    }

    // Upload any media first
    let mediaUploads: string[] = [];
    try {
      mediaUploads = await Promise.all(
        askData.questionMedia.map(media => uploadAsset(media)),
      );
    } catch (error) {
      console.error('Error uploading media:', error);
      openAlert({
        title: 'Error uploading media',
        message: 'Cannot post',
      });
      dispatch(setLoading(false));
      return;
    }

    // Now insert question
    const {data} = await supabase
      .from('questions')
      .insert([
        {
          question: askData.question,
          body: askData.questionDetail ?? undefined,
          nsfw: false,
          user_meta: userMetaId.data.id,
          user_id: userId,
        },
      ])
      .select();

    // Update question metadata
    if (data && data.length > 0) {
      const insertedId = data[0].id;
      await supabase
        .from('question_metadata')
        .update({
          location: askData.selectedLocation
            ? askData.selectedLocation.id
            : null,
          media: mediaUploads.length > 0 ? mediaUploads : null,
          topics: askData.selectedTopics.length
            ? askData.selectedTopics.map(topic => topic.name)
            : null,
        })
        .eq('question_id', insertedId);

      dispatch(resetSheet());
    } else {
      console.log('No data returned after insert');
    }
  };

  return {submit};
};
