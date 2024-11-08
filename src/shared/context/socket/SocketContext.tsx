import React, { createContext, useContext, useEffect, useRef } from 'react';
import io, { Socket } from 'socket.io-client';
import { useAppSelector } from '../../store/hooks';
import { selectAccount } from '../../store/user-slice';

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
	const socketRef = useRef<Socket | null>(null);
	const account = useAppSelector(selectAccount);
	// console.log('Socket context: ', socketRef?.current);
	useEffect(() => {
		if (account) {
			// socketRef.current = io('http://102.37.21.11:4000');
			socketRef.current = io('http://localhost:9092', {
				transports: ['websocket']
			});

			socketRef.current.on("connect_error", (err) => {
				console.log(err);
				console.log(err.message);

			  });
			  socketRef.current.on("connect", () => {
				console.log('connected', socketRef.current);
				
			  });
			  socketRef.current.on("disconnect", () => {
				console.log('disconnected');
			  
				
			  });
		} else if (socketRef.current) {
			socketRef.current?.disconnect();
			console.log('Socket disconnecting, no account');
		}

		return () => {
			if (socketRef.current) {
				socketRef.current?.disconnect();
				console.log('Socket disconnecting unmount', socketRef.current);
			}
		};
	}, [account]);

	return (
		<SocketContext.Provider value={socketRef.current}>
			{children}
		</SocketContext.Provider>
	);
};
