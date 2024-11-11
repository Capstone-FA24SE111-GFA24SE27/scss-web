import React, { createContext, useContext, useEffect, useRef } from 'react';
import io, { Socket } from 'socket.io-client';
import { useAppSelector } from '../../store/hooks';
import { selectAccount } from '../../store/user-slice';

const SocketContext = createContext<Socket | null>(null)

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
	const socketRef = useRef(null);
	const account = useAppSelector(selectAccount)
	console.log("Socket context: ", socketRef?.current)
	useEffect(() => {
		if (account) {
			// socketRef.current = io('http://102.37.21.11:4000');
			const socket = io('http://localhost:9092', {
				transports: ['websocket']
			});
			socketRef.current = socket;
		}
		// } else if (socketRef.current && socketRef.current.connected) {
		// 	socketRef.current?.disconnect();
		// 	socketRef.current = null;
		// }

		return () => {
			if (socketRef.current && socketRef.current.connected) {
				socketRef.current?.disconnect();
			}
			socketRef.current = null;
		};
	}, [account]);

	return (
		<SocketContext.Provider value={socketRef.current}>
			{children}
		</SocketContext.Provider>
	);
};