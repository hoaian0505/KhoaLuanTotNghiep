import axios from 'axios';
const normalize = require('normalize-text').normalizeWhitespaces;
import {getField,getFieldSort} from './get';
var x='';

export const UpdateCompanyByField = () => async (dispatch,getState) => {
    const {selectedField} = getState().appData;
      var TempUrl='/company/'+selectedField;
      x=normalize(document.getElementById('LinhVucInput').value);
      if ((x!="") && (selectedField!='')){
        axios.put(TempUrl,{Field : x})
        .then(res => dispatch(UpdateFieldByField()))
        .then(() => document.getElementById('LinhVucInput').style.visibility='hidden')
        .catch(error => console.log(error));
      }
      else{
        alert('Vui lòng nhập đủ thông tin');
      }
  }
  
  export const UpdateLike = (_id,likelist) => async (dispatch,getState) => {
    let {sort} = getState().appData;
    var TempUrl='/field/'+_id;
    axios.put(TempUrl,{like : likelist})
    .then((res) => {
        if (res.data.success){
          if (sort=='like'){
            dispatch(getFieldSort())
          }else{
            dispatch(getField())
          }
        }
    })
    .catch(error => console.log(error));
  }

  export const UpdateComment = (_id,commentlist) => async (dispatch,getState) => {
    let {sort} = getState().appData;
    var TempUrl='/field/'+_id;
    axios.put(TempUrl,{comments : commentlist})
    .then((res) => {
        if (res.data.success){
          if (sort=='like'){
            dispatch(getFieldSort())
          }else{
            dispatch(getField())
          }
        }
    })
    .catch(error => console.log(error));
  }

  export const editDataField = (id,dataField,dataCompany) => async dispatch => {
    let dataTemp = dataCompany;
    // console.log('DATA FIELD == ',dataField);
    var TempUrl='/field/'+id;
    //dataTemp[0]={dataCompany};
    await axios.put(TempUrl,dataField)
    .then(res => {
      if (res.data.success){
        dispatch(getField());
        //console.log('DATA == ',res.data.result)
        //dataTemp[1] = {id:res.data.id};
        dataTemp.fieldId = res.data.id;
        dispatch(editDataCompany(id,dataTemp));
      }
    })
  }

  export const editDataCompany = (id,obj) => async dispatch => { 
    let TempUrl='/company/'+id;
    await axios.put(TempUrl,obj)
  }
