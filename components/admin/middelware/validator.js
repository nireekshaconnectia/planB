// utils/validator.js

const validator = {
    isEmailValid(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email.trim());
    },
  
    isPasswordValid(password) {
      // Customize as needed (min 8 chars, at least 1 letter and 1 number)
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
      return passwordRegex.test(password);
    },
  
    sanitizeInput(input) {
      // Basic sanitization against SQL/meta characters
      if (typeof input !== 'string') return '';
      return input
        .replace(/['";]/g, '')        // remove quotes and semicolons
        .replace(/--/g, '')           // remove double dashes
        .replace(/[\0\x08\x09\x1a]/g, '') // remove null and control chars
        .trim();
    },
  
    validateLoginForm({ email, password }) {
      const errors = {};
  
      // Email check
      if (!email || !validator.isEmailValid(email)) {
        errors.email = 'Invalid email format.';
      }
  
      // Password check
      if (!password || !validator.isPasswordValid(password)) {
        errors.password = 'Password must be at least 8 characters, include letters and numbers.';
      }
  
      return {
        isValid: Object.keys(errors).length === 0,
        errors,
        sanitized: {
          email: validator.sanitizeInput(email),
          password: validator.sanitizeInput(password)
        }
      };
    }
  };
  
  export default validator;
  