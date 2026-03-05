import axios from "axios";

const {
  VITE_CURRENCY_API_URL,
  VITE_CURRENCY_FROM,
  VITE_CURRENCY_TO,
  VITE_CURRENCY_RATE_CACHE_TTL_MS,
} = import.meta.env;

const parsedRateTtl = Number(VITE_CURRENCY_RATE_CACHE_TTL_MS);

const isCurrencyConfigValid =
  !VITE_CURRENCY_API_URL ||
  !VITE_CURRENCY_FROM ||
  !VITE_CURRENCY_TO ||
  !Number.isFinite(parsedRateTtl) ||
  parsedRateTtl <= 0;

const CURRENCY_API_URL = VITE_CURRENCY_API_URL;
const FROM_CURRENCY = VITE_CURRENCY_FROM;
const TO_CURRENCY = VITE_CURRENCY_TO;
const RATE_CACHE_TTL_MS = parsedRateTtl;

let cachedRate = null;
let cachedRateExpiresAt = 0;
let hasLoggedConfigError = false;

const isConfigReady = () => {
  if (!isCurrencyConfigValid) {
    return true;
  }

  if (!hasLoggedConfigError) {
    console.error(
      "Invalid currency env configuration. Check VITE_CURRENCY_API_URL, VITE_CURRENCY_FROM, VITE_CURRENCY_TO, and VITE_CURRENCY_RATE_CACHE_TTL_MS."
    );
    hasLoggedConfigError = true;
  }
  return false;
};

const getUsdInrRate = async () => {
  if (!isConfigReady()) {
    return null;
  }

  const now = Date.now();
  if (cachedRate && cachedRateExpiresAt > now) {
    return cachedRate;
  }

  const res = await axios.get(CURRENCY_API_URL, {
    params: {
      from: FROM_CURRENCY,
      to: TO_CURRENCY,
    },
  });

  const rate = res.data?.rates?.[TO_CURRENCY];
  if (!rate) {
    return null;
  }

  cachedRate = rate;
  cachedRateExpiresAt = now + RATE_CACHE_TTL_MS;
  return rate;
};

export const convertUsdToInr = async (amount) => {
  const rate = await getUsdInrRate();
  if (!rate) {
    return null;
  }

  return (Number(amount) * rate).toFixed(2);
};
