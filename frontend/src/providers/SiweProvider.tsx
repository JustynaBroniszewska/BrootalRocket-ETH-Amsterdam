import { useEthers } from "@usedapp/core";
import axios from "axios";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { SiweMessage } from "siwe";

const SiweContext = createContext<{
  message: SiweMessage | undefined;
  signIn: () => Promise<void>;
  signOut: () => void;
}>({
  message: undefined,
  signIn: async () => {},
  signOut: () => {},
});

async function getNonce(): Promise<string> {
  const req = await axios.post(
    "https://solitary-glitter-2647.fly.dev/siwe/init"
  );
  return req.data.nonce;
}

async function checkAuthStatus(): Promise<{
  message?: SiweMessage;
}> {
  const token = localStorage.getItem("authToken");

  const req = await axios.get("https://solitary-glitter-2647.fly.dev/siwe/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return req.data;
}

interface SiweProviderProps {
  children: ReactNode;
}

export const SiweProvider = ({ children }: SiweProviderProps) => {
  const [message, setMessage] = useState<SiweMessage | undefined>();
  const { library, account, chainId } = useEthers();

  const signIn = async () => {
    const domain = window.location.host;
    const uri = window.location.origin;
    const statement = "Sign in with Ethereum to the app.";

    console.log({ account, chainId, library });
    if (!account || !chainId || !library) return;

    const message = new SiweMessage({
      domain,
      address: account,
      statement,
      uri,
      version: "1",
      chainId,
      nonce: await getNonce(),
    });

    const signature = await library
      .getSigner()
      .signMessage(message.prepareMessage());
    localStorage.setItem("authToken", JSON.stringify({ signature, message }));
    checkAuthStatus().then((res) => setMessage(res?.message));
  };

  function signOut() {
    localStorage.removeItem("authToken");
    setMessage(undefined);
  }

  useEffect(() => {
    checkAuthStatus().then((res) => setMessage(res?.message));
  }, []);

  return (
    <SiweContext.Provider
      value={{
        message,
        signIn,
        signOut,
      }}
    >
      {children}
    </SiweContext.Provider>
  );
};

export const useSiweProvider = () => useContext(SiweContext);
