/**
 * Validation Utilities
 * Reusable validation functions
 */

import { VALIDATION } from "../constants";

/**
 * Validate email format
 */
export const validateEmail = (email) => {
  if (!email) return { valid: false, error: "" };
  
  if (!VALIDATION.EMAIL_REGEX.test(email)) {
    return {
      valid: false,
      error: "Please enter a valid email address format (e.g., user@example.com)",
    };
  }
  
  return { valid: true, error: "" };
};

/**
 * Validate phone number
 */
export const validatePhone = (phone) => {
  if (!phone) return { valid: false, error: "" };
  
  const phoneStr = phone.toString();
  
  if (!/^\d+$/.test(phoneStr)) {
    return {
      valid: false,
      error: "Phone number must contain only digits",
    };
  }
  
  if (phoneStr.length < VALIDATION.PHONE_LENGTH) {
    return {
      valid: false,
      error: `Phone number must be exactly ${VALIDATION.PHONE_LENGTH} digits`,
    };
  }
  
  if (phoneStr.length > VALIDATION.PHONE_LENGTH) {
    return {
      valid: false,
      error: `Phone number cannot exceed ${VALIDATION.PHONE_LENGTH} digits`,
    };
  }
  
  return { valid: true, error: "" };
};

/**
 * Validate email or phone identifier
 */
export const validateIdentifier = (identifier) => {
  if (!identifier) return { valid: false, error: "" };
  
  const isEmail = identifier.includes("@");
  const isPhone = /^\d+$/.test(identifier);
  
  if (isEmail) {
    return validateEmail(identifier);
  } else if (isPhone) {
    return validatePhone(identifier);
  } else {
    return {
      valid: false,
      error: "Enter a valid email address or 10-digit phone number",
    };
  }
};

/**
 * Validate password
 */
export const validatePassword = (password) => {
  if (!password) return { valid: false, error: "" };
  
  if (password.length < VALIDATION.MIN_PASSWORD_LENGTH) {
    return {
      valid: false,
      error: `Password must be at least ${VALIDATION.MIN_PASSWORD_LENGTH} characters`,
    };
  }
  
  if (password.length > VALIDATION.MAX_PASSWORD_LENGTH) {
    return {
      valid: false,
      error: `Password cannot exceed ${VALIDATION.MAX_PASSWORD_LENGTH} characters`,
    };
  }
  
  return { valid: true, error: "" };
};

/**
 * Validate PIN
 */
export const validatePin = (pin) => {
  if (!pin) return { valid: false, error: "" };
  
  const pinStr = pin.toString();
  
  if (!/^\d+$/.test(pinStr)) {
    return {
      valid: false,
      error: "PIN must contain only digits",
    };
  }
  
  if (pinStr.length < VALIDATION.MIN_PIN_LENGTH) {
    return {
      valid: false,
      error: `PIN must be at least ${VALIDATION.MIN_PIN_LENGTH} digits`,
    };
  }
  
  if (pinStr.length > VALIDATION.MAX_PIN_LENGTH) {
    return {
      valid: false,
      error: `PIN cannot exceed ${VALIDATION.MAX_PIN_LENGTH} digits`,
    };
  }
  
  return { valid: true, error: "" };
};

/**
 * Validate amount
 */
export const validateAmount = (amount) => {
  if (!amount) return { valid: false, error: "Amount is required" };
  
  const numAmount = parseFloat(amount);
  
  if (isNaN(numAmount)) {
    return {
      valid: false,
      error: "Amount must be a valid number",
    };
  }
  
  if (numAmount < VALIDATION.MIN_AMOUNT) {
    return {
      valid: false,
      error: `Amount must be at least ₹${VALIDATION.MIN_AMOUNT}`,
    };
  }
  
  if (numAmount > VALIDATION.MAX_AMOUNT) {
    return {
      valid: false,
      error: `Amount cannot exceed ₹${VALIDATION.MAX_AMOUNT}`,
    };
  }
  
  return { valid: true, error: "" };
};

/**
 * Validate required field
 */
export const validateRequired = (value, fieldName = "Field") => {
  if (!value || (typeof value === "string" && value.trim() === "")) {
    return {
      valid: false,
      error: `${fieldName} is required`,
    };
  }
  
  return { valid: true, error: "" };
};
