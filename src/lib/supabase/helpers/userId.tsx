import {supabase} from '../init';

export const getUserId = async () => {
  const u = await supabase.auth.getUser();
  return u?.data?.user?.id ?? null;
};
