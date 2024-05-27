export interface QuestionsDetailData {
  id: number;
  created_at: string;
  nsfw: boolean;
  question: string;
  user_id: string;
  body: string | null;

  user_metadata: {
    verified: boolean;
    profile_picture: {
      path: string | null;
      thumbhash: string | null;
    } | null;
    username: string | null;
  };

  question_metadata: {
    upvote_count: number;
    response_count: number;
    view_count: number;
    visible: boolean;
    topics: string[];
    location?: {
      name: string;
    };
    media?: string[] | null;
  };
}
