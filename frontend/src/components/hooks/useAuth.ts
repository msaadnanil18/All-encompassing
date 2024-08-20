import React from 'react';
import { useRecoilState } from 'recoil';
import { $ME } from '../atoms/root';
const useAuth = () => {
  const [me, setMe] = useRecoilState($ME);
  return {
    me,
    setMe,
  };
};

export default useAuth;
