import { useEffect } from 'react';
import { useSocket } from '../SocketContext';

export const useQuestionsSocketListener = (profileId, cb) => {
  const socket = useSocket()
  const topic = `/user/${profileId}/question`;
  // console.log(`Has topic?`)
  useEffect(() => {
    socket?.on(topic, (message) => {
      console.log('Received message:', message);
      cb()
    })

    return () => {
      socket?.off(topic);
    };
  }, [profileId, cb, socket]);
};
