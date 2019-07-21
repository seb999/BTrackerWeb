import axios from 'axios';
const apiUrl = '/api/Account/';    

export const registerUserAsyn = (user: any) => {
  return async (dispatch : any) => {
     let loginViewModel = {Email : user.userLogin, Password : user.password, ConfirmPassword: user.password}
 
     try {
      const res = await axios.post<any>(apiUrl + "RegisterFromClient/", loginViewModel);
      return dispatch(registerUserSuccess(res.data));
    }
    catch (error) {
      throw (error);
    }
  };
 }
 
 export const registerUserSuccess = (data: any) => {
  return {
    type: "REGISTER_USER",
    payload: data
  }
 }

export const logUser = (user: any) => {
 return async (dispatch : any) => {
    let loginViewModel = {Email : user.userLogin, Password : user.userPassword, RememberMe : user.rememberMe, Result:false, UserId:""}

    try {
     const res = await axios.post<any>(apiUrl + "LoginFromClient/", loginViewModel);
     return dispatch(logUserSuccess(res.data));
   }
   catch (error) {
     throw (error);
   }
 };
}

export const logUserSuccess = (data: any) => {
 return {
   type: "LOG_USER",
   payload: data
 }
}

export const logoutUser = () => {
 return async (dispatch : any) => {
    try {
     const res = await axios.get<any>(apiUrl + "Logout/");
     return dispatch(logoutuserSuccess(res.data));
   }
   catch (error) {
     throw (error);
   }
 };
}

export const logoutuserSuccess = (data: any) => {
 return {
   type: "LOGOUT_USER",
   payload: {}
 }
}