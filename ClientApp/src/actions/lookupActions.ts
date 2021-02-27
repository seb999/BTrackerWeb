import axios from 'axios';
const apiUrl = '/api/lookup/';    

// -------------Get lookup list ----------------
export const getLookupList = () =>{
  return async (dispatch  :any) =>{
    try{
      const res = await axios.get<any>(apiUrl + "GetLookupList/");
      return dispatch(getLookupSuccess(res.data));
    }
    catch (error) {
      throw (error)
    }
  }
 }
 
 export const getLookupSuccess = (data :any) => {
  return {
    type: "LOOKUP_LIST",
    payload: data
  }
 }