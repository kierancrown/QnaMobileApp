export interface QuestionsDetailData {
  id: number;
  created_at: string;
  nsfw: boolean;
  question: string;
  user_id: string;

  user_metadata: {
    verified: boolean;
    profile_picture_key: string | null;
    username: string | null;
  };

  question_metadata: {
    upvote_count: number;
    response_count: number;
    view_count: number;
    visible: boolean;
    location?: {
      name: string;
    };
  };
}
