import { useEffect } from 'react';
import { useSocket } from '../SocketContext';

export const useQuestionsSocketListener = (profileId, cb) => {
  const socket = useSocket()
  const topic = `/user/${profileId}/question`;

  useEffect(() => {
    socket?.on(topic, (message) => {
      cb()
      console.log('Received message:', message);
    })

    return () => {
      socket?.off(topic);
    };
  }, [profileId, cb, socket]);
};
