import React, {createContext, useContext, useEffect, useState} from 'react';
import {supabase} from 'app/lib/supabase';
import {Database} from 'app/types/supabase';

export type FeatureFlag = Database['public']['Tables']['feature_flags']['Row'];

interface FeatureFlagContext {
  featureFlags: FeatureFlag[];
}

interface FeatureFlagProviderProps {
  children: React.ReactNode;
}

const FeatureFlagContext = createContext<FeatureFlagContext>({
  featureFlags: [],
});

export const FeatureFlagProvider: React.FC<FeatureFlagProviderProps> = ({
  children,
}) => {
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>([]);

  useEffect(() => {
    const fetchFeatureFlags = async () => {
      const {data, error} = await supabase.from('feature_flags').select('*');

      if (error) {
        console.error('Error fetching feature flags:', error);
      } else {
        setFeatureFlags(data || []);
      }
    };

    fetchFeatureFlags();
  }, []);

  return (
    <FeatureFlagContext.Provider value={{featureFlags}}>
      {children}
    </FeatureFlagContext.Provider>
  );
};

export const useFeatureFlag = <T extends FeatureFlag['value']>(
  name: string,
  defaultValue: T,
) => {
  const {featureFlags} = useContext(FeatureFlagContext);
  return featureFlags.find(flag => flag.name === name)?.value || defaultValue;
};
