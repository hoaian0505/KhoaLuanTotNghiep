import axios from 'axios';
import {getField} from './get';

export const DeleteCompanyByField = (e) => async (dispatch,getState) => {
      var TempUrl='/company/field/'+e;
      axios.delete(TempUrl)
        .catch(error => console.log(error));
  }
  
  export const  DeleteFieldByID =(obj) => async dispatch => {
    var TempUrl='/field/id/'+obj;
    axios.delete(TempUrl)
    .then(() => {
        dispatch({
          type:'DELETE_FIELD_BY_ID',
          payload: {
            selectedField:'',
            selectedOptions:[],
            items:[],
          }
        })
    })
    .then(() => dispatch(DeleteCompanyByField(obj)))
    .then(() => dispatch(getField()))
    .catch(error => console.log(error));
  }