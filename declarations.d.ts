declare module '*.svg' {
  import React from 'react';
  import {SvgProps} from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}

declare module '@env' {
  export const API_KEY: string;
  export const API_URL: string;
  export const SUPABASE_URL: string;
  export const SUPABASE_ANON_KEY: string;
}
