/**
 * Format Utilities
 * Common formatting functions
 */

/**
 * Format currency (Indian Rupees)
 */
export const formatCurrency = (amount, showSymbol = true) => {
  if (amount === null || amount === undefined) return showSymbol ? "₹0.00" : "0.00";
  
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount)) return showSymbol ? "₹0.00" : "0.00";
  
  const formatted = numAmount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  
  return showSymbol ? `₹${formatted}` : formatted;
};

/**
 * Format date
 */
export const formatDate = (date, format = "short") => {
  if (!date) return "";
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  
  const options = {
    short: { year: "numeric", month: "short", day: "numeric" },
    long: { year: "numeric", month: "long", day: "numeric" },
    full: { 
      year: "numeric", 
      month: "long", 
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    },
  };
  
  return d.toLocaleDateString("en-IN", options[format] || options.short);
};

/**
 * Format time
 */
export const formatTime = (date) => {
  if (!date) return "";
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  
  return d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Format phone number
 */
export const formatPhone = (phone) => {
  if (!phone) return "";
  
  const cleaned = phone.toString().replace(/\D/g, "");
  
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  
  return phone;
};

/**
 * Mask phone number
 */
export const maskPhone = (phone) => {
  if (!phone) return "";
  
  const cleaned = phone.toString().replace(/\D/g, "");
  
  if (cleaned.length === 10) {
    return `******${cleaned.slice(-4)}`;
  }
  
  return phone;
};

/**
 * Mask email
 */
export const maskEmail = (email) => {
  if (!email) return "";
  
  const [username, domain] = email.split("@");
  if (!domain) return email;
  
  const maskedUsername = username.length > 2
    ? `${username[0]}${"*".repeat(username.length - 2)}${username[username.length - 1]}`
    : username;
  
  return `${maskedUsername}@${domain}`;
};

/**
 * Mask account number
 */
export const maskAccountNumber = (accountNumber) => {
  if (!accountNumber) return "";
  
  const str = accountNumber.toString();
  if (str.length <= 4) return str;
  
  return `${"*".repeat(str.length - 4)}${str.slice(-4)}`;
};

/**
 * Format account number
 */
export const formatAccountNumber = (accountNumber) => {
  if (!accountNumber) return "";
  
  const str = accountNumber.toString().replace(/\s/g, "");
  return str.match(/.{1,4}/g)?.join(" ") || str;
};

/**
 * Capitalize first letter
 */
export const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Truncate text
 */
export const truncate = (str, maxLength = 50) => {
  if (!str) return "";
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength)}...`;
};

/**
 * Format file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Format percentage
 */
export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined) return "0%";
  
  const num = parseFloat(value);
  if (isNaN(num)) return "0%";
  
  return `${num.toFixed(decimals)}%`;
};
