import { signInWithPopupGoogle } from "@/packages";

export const googleAuth = async () => {
  const result = await signInWithPopupGoogle();
  // const accessToken = await result?.user.getIdToken();
  // @ts-ignore
  const accessToken = result?._tokenResponse.oauthAccessToken
  if (!accessToken) throw new Error("Failed to get access token");
  return accessToken;
};