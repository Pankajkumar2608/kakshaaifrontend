export const checkValidateData =(email, password, username, fullname) => {
    const isEmailValid = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email);
    const isPasswordValid = /^[a-zA-Z0-9!@#$%^&*]{8,16}$/.test(password);
    const isUsernameValid = /^[a-zA-Z0-9]+([a-zA-Z0-9](_|-| )[a-zA-Z0-9])*[a-zA-Z0-9]+$/.test(username);
    const isFullnameValid = /^[a-z,',-]+(\s)[a-z,',-]+$/i.test(fullname)

    if (!isEmailValid) return "Email is not correct!";
    if (!isPasswordValid) return "Use Good Password";
    if(!isUsernameValid) return "Not a valid username";
    if(!isFullnameValid) return "Enter your Full name";

    return null;
};
