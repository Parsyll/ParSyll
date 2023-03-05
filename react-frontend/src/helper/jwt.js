

const removeJWTToken = () => {
      window.localStorage.removeItem("jwt-token")
      window.sessionStorage.removeItem("jwt-token")
}

const setJWTToken = (token, rememberMe) => {
    if(rememberMe) {
      window.localStorage.setItem("jwt-token", token)
    } else {
      window.sessionStorage.setItem("jwt-token", token)
    }
}

const getJWTToken = () => {
    let jwtToken = window.localStorage.getItem("jwt-token");

    if(!jwtToken) {
        jwtToken = window.sessionStorage.getItem("jwt-token");
    }
    return jwtToken;
}

export {
    setJWTToken,
    removeJWTToken,
    getJWTToken
}


