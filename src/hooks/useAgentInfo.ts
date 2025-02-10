import { useUserStore } from '@/stores/useUserStore';
import { authService } from '@/services/auth';
import { useMemo } from 'react';

export function useAgentInfo() {
  const { userProfile, setUserProfile } = useUserStore();

  const refetch = async () => {
    const { profile } = await authService.getProfile(userProfile?.userId || '');
    if (profile) {
      setUserProfile(profile);
    }
  };

  const level = useMemo(() => {
    return userProfile?.level || 0;
  }, [userProfile]);

  const experience = useMemo(() => {
    return userProfile?.experience || 0;
  }, [userProfile]);

  const nextLevelExp = useMemo(() => {
    return userProfile?.nextLevelExp || 0;
  }, [userProfile]);

  const points = useMemo(() => {
    return userProfile?.points || 0;
  }, [userProfile]);

  const agentname = useMemo(() => {
    if(userProfile?.agentname) {
      return userProfile?.agentname;
    }
    return "Blommy";
  }, [userProfile]);

  return {
    level,
    experience,
    nextLevelExp,
    agentname,
    points,
    refetch,
  };
}
