
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_PINATA_JWT: string;
  readonly VITE_GATEWAY_URL: string;
  readonly VITE_API_Key: string;
  readonly VITE_API_Secret: string;
  readonly VITE_FILETO_IPFH: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  ethereum?: {
    isMetaMask?: boolean;
    request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    on: (event: string, callback: (...args: unknown[]) => void) => void;
    removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
    removeAllListeners: (event: string) => void;
  };
}
