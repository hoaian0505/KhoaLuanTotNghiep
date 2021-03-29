import axios from 'axios';
import swal from 'sweetalert';

export const getLink = () => async dispatch => {
    await axios.get('/getlink/1')
    .then(res => {
      dispatch({
          type: 'GET_LINK',
          payload: {
            isAdded: true,
            items: res.data,
          }
      });
    })
    .catch(error => console.log(error));
  }
  
  export const getData = () => async dispatch => {
    await axios.get('/company')
    .then(res => {
      dispatch({
        type: 'GET_DATA',
        items: res.data
      })
    })
  }

  export const getField = () => async dispatch => {
    axios.get('/field/allfields')
    .then(res =>  {
      if (res.data.success){
        dispatch({
          type: 'GET_FIELD',
          lists: res.data.result,
          pages: Math.floor(res.data.length / 20) + 1
        })
      }
    })
    .catch(error => console.log(error));
  }

  export const getFieldSort = (type) => async dispatch => {
    let uri = '/fieldsort';
    axios.get(uri,{
      params: {
        type: type
      }
    })
    .then(res =>  {
      if (res.data.success){
        dispatch({
          type: 'GET_FIELD_SORT',
          lists: res.data.result,
          pages: Math.floor(res.data.length / 20) + 1
        })
      }
    })
    .catch(error => console.log(error));
  }
  
  export const getPageByField = (obj) => async dispatch => {
    var TempUrl = '/field/page/'+obj;
    var TempPages=[];
    axios.get(TempUrl)
    .then(res => {
        for(var j=1;j<=Number(res.data);j++)  { TempPages[j]=j;  }
    })
    .then(() => {
      dispatch({
        type: 'GET_PAGE_BY_FIELD',
        payload: {  data: TempPages  }
      })
    })
    .catch(error => console.log(error));
  }
  
  export const  getLastPage = () => async dispatch => {
    var TempPages=[];
    axios.get('/field/pagelast')
    .then(res => {
        for(var j=1;j<=Number(res.data);j++)  { TempPages[j]=j;  }
    })
    .then(() => {
      dispatch({
        type: 'GET_LAST_PAGE',
        payload: {  data: TempPages  }
      })
    })
    .catch(error => console.log(error));
  }
  
  export const  getLastField = () => async dispatch => {
    axios.get('/field/fieldlast')
    .then(res => {
      dispatch({
        type: 'GET_LAST_FIELD',
        payload: {
          selectedField: res.data,     
          selectedOptions: {value:res.data,label:res.data},
          selectedPage: '1',  
        }
      })
    })
    .catch(error => console.log(error));
  }
  
  //Search field
  export const  getFieldBySearch = (e1) => async dispatch => {
    axios.post('/field/search/',e1)
    .then(res => {
      if (res.data.success){
        let list = [];
        let listprice = [];
        let listdt = [];
        res.data.result.map(async (e) => {
          let pos1 =e.NoiDung.indexOf('Giá:</label>');
          let pos2 =e.NoiDung.indexOf('</div>',e.NoiDung.indexOf('Giá:</label>'));
          let pos3 =e.NoiDung.indexOf('Diện tích:</label>');
          let pos4 =e.NoiDung.indexOf('</div>',e.NoiDung.indexOf('Diện tích:</label>'));
          let dt = e.NoiDung.slice(pos3+19,pos4-14).replace(/,| /g,"");
          let price = e.NoiDung.slice(pos1+13,pos2).replace(/,| /g,"");
          dt = dt.replace('.',"");
          dt = parseInt(dt);
          price = price.replace('.',"");
          if (e1.dt != 'alldt'){
            switch (e1.dt)
            {
              case 'dt1':
                if (dt >=0 & dt <=30){
                  listdt.push(e);
                }
                break;
              case 'dt2':
                if (dt >=30 & dt <=50){
                  listdt.push(e);
                }
                break;
              case 'dt3':
                if (dt >=50 & dt <=100){
                  listdt.push(e);
                }
                break;
              case 'dt4':
                if (dt >=100 & dt <=150){
                  listdt.push(e);
                }
                break;
              case 'dt5':
                if (dt >=150 & dt <=200){
                  listdt.push(e);
                }
                break;
              case 'dt6':
                if (dt >=200){
                  listdt.push(e);
                }
                break;
              default:
                break;
            }
          }
          if (e1.price != 'allprice'){
            switch (e1.price)
            {
              case 'price1':
                if (price.indexOf('tỷ')>0){
                }
                else if (price.indexOf('triệu')>0){
                  if (parseFloat(price)<=500){
                    listprice.push(e);
                  }
                } 
                else {
                  listprice.push(e);  
                }
                break;
              case 'price2':
                if (price.indexOf('triệu')>0){
                  if (parseFloat(price)>=500 & parseFloat(price)<=800){
                    listprice.push(e);
                  }
                } 
                break;
              case 'price3':
                if (price.indexOf('tỷ')>0){
                  if (parseFloat(price)<=1){
                    listprice.push(e);
                  }
                }
                else if (price.indexOf('triệu')>0){
                  if (parseFloat(price)>=800){
                    listprice.push(e);
                  }
                }
                break;
              case 'price4':
                if (price.indexOf('tỷ')>0){
                  if (parseFloat(price)>=1 & parseFloat(price)<=2){
                    listprice.push(e);
                  }
                }
                break;
              case 'price5':
                if (price.indexOf('tỷ')>0){
                  if (parseFloat(price)>=2 & parseFloat(price)<=3){
                    listprice.push(e);
                  }
                }
                break;
              case 'price6':
                if (price.indexOf('tỷ')>0){
                  if (parseFloat(price)>=3 & parseFloat(price)<=5){
                    listprice.push(e);
                  }
                }
                break;
              case 'price7':
                if (price.indexOf('tỷ')>0){
                  if (parseFloat(price)>=5){
                    listprice.push(e);
                  }
                }
                break;
              default:
                break;
            }
          }
        })
        if (listdt.length != 0){
          if (listprice.length == 0){
            list = listdt;
          }
        }
        if (listprice.length != 0){
          if (listdt.length == 0){
            list = listprice;
          }
        }
        if (listprice.length != 0 && listdt.length != 0){
          listdt.map(async (j) => {
            if ((listprice.find(ele => ele == j)) != undefined){
              list.push(j);
            };
          })
        }
        if (list.length == 0){
          list = res.data.result;
        }
        dispatch({
          type: 'GET_FIELD_BY_SEARCH',
          lists: list,
          pages: Math.floor(res.data.length / 20) + 1
        })
      }
      else{
        // swal("Hello World");
        swal({
          title: "Không tìm thấy thông tin phù hợp",
          text: "",
          icon: "warning",
        })
      }
    })
    .catch(error => console.log(error));
  }

  export const  getDataByField = (obj) => async dispatch => {
    var TempUrl='/company/'+obj;
    axios.get(TempUrl)
    .then(res => {
      dispatch({
        type: 'GET_DATA_BY_FIELD',
        data: res.data.result
      })
    })
    .catch(error => console.log(error));
  }
  
  export const getDataByFieldAndPage = (obj,temp) => async dispatch => {
    if (temp=='Toan Bo Database'){
      var TempUrl='/company/'+obj;
    }
    else{
      var TempUrl='/company/'+obj+'/'+temp;
    }
    axios.get(TempUrl)
    .then(res => {
      dispatch({
        type: 'GET_DATA_BY_FIELD_AND_PAGE',
        payload: {  data: res.data  }
      })
    })
    .catch(error => console.log(error));
  }

  export const  getUser = () => async dispatch => {
    axios.get('/user/')
    .then(res => {
      dispatch({
        type: 'GET_USER',
        payload: {
          User: res.data.User,     
          Password: res.data.Password, 
        }
      })
    })
    .catch(error => console.log(error));
  }

  export const Login =  (data) => async dispatch => {
    axios.post('/user/signin',data)
    .then(res => {
      if (res.data.success){
        dispatch({
          type: 'GET_USER',
          payload: {
            User: res.data.result 
          }
        })
      }
    })
  }

  export const SignUp =  (data) => async dispatch => {
    
    // axios.post('/user/signup',data)
    // .then(res => {
    //   //console.log('RETRURN == ',res.data);
    // })
  }  