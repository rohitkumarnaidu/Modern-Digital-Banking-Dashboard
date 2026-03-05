import axios from "axios";

const CURRENCY_API_URL = "https://api.frankfurter.app/latest";
const FROM_CURRENCY = "USD";
const TO_CURRENCY = "INR";
const RATE_CACHE_TTL_MS = 5 * 60 * 1000;

let cachedRate = null;
let cachedRateExpiresAt = 0;

const getUsdInrRate = async () => {
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

