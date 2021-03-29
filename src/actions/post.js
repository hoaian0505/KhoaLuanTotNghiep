import axios from 'axios';
const normalize = require('normalize-text').normalizeWhitespaces;
import {getField} from './get';
var x='';
  
  export const saveDataCompany = (obj) => async dispatch => { 
    await axios.post('/company',obj)
  }
  
  export const saveDataField = (dataField,dataCompany) => async dispatch => {
    let dataTemp = dataCompany;
    //dataTemp[0]={dataCompany};
    await axios.post('/field',dataField)
    .then(res => {
      if (res.data.success){
        dispatch(getField());
        //console.log('ID == ',res.data)
        //dataTemp[1] = {id:res.data.id};
        dataTemp.fieldId = res.data.id;
        dispatch(saveDataCompany(dataTemp));
      }
    })
  }

  