const isStrongPassword = (password) => {
    // Define the regex pattern for strong password
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  
    // Test the password against the regex
    return regex.test(password);
  };
  
  export { isStrongPassword };
  