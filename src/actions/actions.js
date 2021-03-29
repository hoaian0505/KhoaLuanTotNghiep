// actions.js
import {getDataByField,getDataByFieldAndPage,getPageByField} from './get';

export const LinhVucSelectOnChange = (event) => async dispatch => {
  console.log('EVENT CLICKED == ',event);
  dispatch({
    type: 'FIELD_SELECTED',
    payload: {selectedOptions : event} 
  });
  if (event != null){
    if (event.length !=0){
      if (event.length==1)
      {
        dispatch({
          type:'SELECTED_ONE',
          payload: {
            listSelectedField:[],
            selectedField: event[0].value,
            selectedPage:'Toan Bo Database',
            items:[],
            isLoaded:true,
          }
        });
        var Temp=event[0].value;
        dispatch(getDataByField(Temp));
        dispatch(getPageByField(Temp));
      }
      else
      {
        var Temp1=[];
        event.map((field,i) => Temp1[i]=field.value);
        dispatch({
          type:'SELECTED_MANY',
          payload: {
            listSelectedField:Temp1,
            pages:[],
            items:[],
            isLoaded:true,
            selectedField:'',
          }
        });
        Temp1.map((fieldGotten) => dispatch(getDataByField(fieldGotten)));
      }
    }
    else
    {
      console.log('Khong co linh vuc nao dc chon ca');
      dispatch(Reload());
      dispatch({
        type:'NONE_SELECTED',
        payload: {
          listSelectedField:[],
          pages:[],
          items:[],
          selectedField:'',
        }
      });
    }
  }
  else
  {
    console.log('Khong co linh vuc nao dc chon ca');
    dispatch(Reload());
    dispatch({
      type:'NONE_SELECTED',
      payload: {
        listSelectedField:[],
        pages:[],
        items:[],
        selectedField:'',
      }
    });
  }
}

export const PageSelectOnChange = (event) => async (dispatch,getState) => {
  const {selectedField} = getState().appData;
  dispatch({
    type:'PAGE_SELECT_ON_CHANGE',
    payload: {
      selectedPage: event.target.value,
      items:[],
      isLoaded:true,
    }
  });
  var Temp=event.target.value;
  var LinhVuc=selectedField;
  dispatch(getDataByFieldAndPage(LinhVuc,Temp));
}

export const Reload = () => async dispatch => {
  dispatch({
    type:'RELOAD',
    payload:{
      isLoaded:false
    }
  })
}