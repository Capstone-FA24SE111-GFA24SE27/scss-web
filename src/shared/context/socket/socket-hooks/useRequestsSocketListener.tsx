import { useEffect } from 'react';
import { useSocket } from '../SocketContext';

export const useRequestsSocketListener = (profileId, cb) => {
  const socket = useSocket()
  const topic = `/user/${profileId}/appointment/request`;

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
