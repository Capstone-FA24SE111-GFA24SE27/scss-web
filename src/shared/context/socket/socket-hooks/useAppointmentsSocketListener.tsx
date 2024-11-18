import { useEffect } from 'react';
import { useSocket } from '../SocketContext';

export const useAppointmentsSocketListener = (profileId, cb) => {
  const socket = useSocket()
  const topic = `/user/${profileId}/appointment`;

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
