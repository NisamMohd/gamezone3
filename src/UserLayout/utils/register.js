
const inputFieldValidation = (userData,cpasswd) => {
    const name = userData.name.trim();
    const email = userData.email.trim().toLowerCase();
    const password = userData.password;
    const confirmPasswd = cpasswd;

    if (!name)
        return { valid: false, message: "Name is required." };

    if (!email)
        return { valid: false, message: "Email is required." };

    if (!password)
        return { valid: false, message: "Password is required." };

    if (!confirmPasswd)
        return { valid: false, message: "Confirm password is required." };

    return {valid:true, message: "success"}

}

export const formValidation = (userData,cpasswd) => {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const inputCheck = inputFieldValidation(userData,cpasswd)
    
        if(!inputCheck.valid){
            return inputCheck
        }

        if(!emailRegex.test(userData.email)){
            return {valid : false, message : "invalid email syntax"}
        }

        if(userData.password.length < 8){
            return {valid : false, message : "passwords must be 8 charecter long"}
        }
        
        if(userData.password !== cpasswd){
            return {valid : false, message : "passwords must be matching"}
        }

        return {valid : true, message : "Validation Successful"}

}