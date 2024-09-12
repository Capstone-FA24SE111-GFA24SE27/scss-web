// import React, { createContext, useCallback, useMemo, useState, useContext, useEffect, useLayoutEffect } from 'react';

// export type SignInPayload = {
//   email: string;
//   password: string;
// };

// export type SignUpPayload = {
//   displayName: string;
//   password: string;
//   email: string;
// };

// export type AuthContextType = {

// };

// export const AuthContext = createContext<AuthContextType>({

// });


// export const useAuth = () => {
//   const authContext = useContext(AuthContext);

//   if (!authContext) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }

//   return authContext;
// }


// type AuthProviderProps = { children: React.ReactNode };

// function AuthProvider(props: AuthProviderProps) {
//   const { children } = props;
//   const [accessToken, setAccessToken] = useState();

//   useEffect(() => {
//     //fetch access token
//   }, []);

//   useEffect(() => {
 
//   })

//   const contextValue = useMemo(
//     () =>
//       ({

//       }) as AuthContextType,
//     []
//   );

//   return (
//     <AuthContext.Provider value={contextValue}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export default AuthProvider;
