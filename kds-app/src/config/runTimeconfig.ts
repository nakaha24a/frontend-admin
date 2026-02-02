let config: {
  API_BASE_URL: string;
  WS_URL: string;
  apiBaseUrl: string;
} | null = null;

export const loadConfig = async () => {
  const res = await fetch("/config.json");
  if (!res.ok) {
    throw new Error("config.json を読み込めません");
  }
  config = await res.json();
};

export const getConfig = () => {
  if (!config) {
    throw new Error("config is not loaded");
  }
  return config;
};
