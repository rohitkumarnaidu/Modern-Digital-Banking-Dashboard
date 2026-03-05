/**
 * useForm Hook
 * Reusable form state and validation management
 */

import { useState } from "react";

const toValidationResult = (validationRules, field, value) => {
  const validator = validationRules[field];
  return validator ? validator(value) : { valid: true, error: "" };
};

const markAllFieldsTouched = (values) =>
  Object.keys(values).reduce((acc, key) => {
    acc[key] = true;
    return acc;
  }, {});

export const useForm = (initialValues = {}, validationRules = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setValues((prev) => ({ ...prev, [name]: newValue }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    const validation = toValidationResult(validationRules, name, values[name]);
    if (!validation.valid) {
      setErrors((prev) => ({ ...prev, [name]: validation.error }));
    }
  };

  const validate = () => {
    const newErrors = {};

    Object.keys(validationRules).forEach((field) => {
      const validation = toValidationResult(validationRules, field, values[field]);
      if (!validation.valid) {
        newErrors[field] = validation.error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (onSubmit) => async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTouched(markAllFieldsTouched(values));

    const isValid = validate();
    if (isValid) {
      try {
        await onSubmit(values);
      } catch (error) {
        console.error("Form submission error:", error);
      }
    }

    setIsSubmitting(false);
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  };

  const setFieldValue = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const setFieldError = (name, error) => {
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setFieldValue,
    setFieldError,
    setValues,
    setIsSubmitting,
  };
};
