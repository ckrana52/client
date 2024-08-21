import { useContext, useEffect } from 'react';
import { useQuery } from 'react-query';
import { getUserProfile } from '../api/api';
import reactQueryConfig from '../config/reactQueryConfig';
import { globalContext } from '../pages/_app';

function useUpdateUserInfo() {
  const { updateAuthUserInfo } = useContext(globalContext);
  const { data } = useQuery('user-profile', getUserProfile, reactQueryConfig);
  useEffect(() => {
    if (data) {
      updateAuthUserInfo(data);
    }
  }, [data, updateAuthUserInfo]);
  return data;
}

export default useUpdateUserInfo;
