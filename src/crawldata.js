import React from 'react';
import '../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import Select from 'react-select';
import { BallBeat } from 'react-pure-loaders';
import swal from 'sweetalert';
import './Style.css';
import $ from 'jquery';
import { connect } from 'react-redux';
import {LinhVucSelectOnChange,PageSelectOnChange,Reload} from './actions/actions';
import {getField,getData,getDataByField,getFieldSort,getFieldBySearch} from './actions/get';
import {saveDataField} from './actions/post';
import {DeleteCompanyByField,DeleteFieldByID} from './actions/delete';
import {UpdateCompanyByField,UpdateLike,UpdateComment, editDataField} from './actions/put';
import axios from 'axios';
import Parser from 'html-react-parser';
var Promise = require('bluebird');
//var ObjectID=require('mongodb');
const normalize = require('normalize-text').normalizeWhitespaces;

var x='';
 
class App extends React.Component {

  constructor(props) {
      super(props); 

      this.state = { 
        edit: false,
        show: false,
        addNew: false,
        favList : [],
        optionsTitle: false,
        pageSelected: 1,
        typeSearch: ''
      }
  }

  InfoModalShow(e){
    this.props.getDataByField(e._id);
    this.showModal();
  }
  
  showModal(){
    this.setState({ show: true });
  }
  
  hideModal(){
    this.setState({ show: false });
  }
  showAddNew(){
    this.setState({ addNew: true });
    let x = this.refs.dropdownmenu;
    x.style.display = 'none';
  }
  hideAddNew(){
    this.setState({ addNew: false });
  }
  removeFav(ele){
    let favListPrev = JSON.parse(localStorage.getItem("LIST_KEY"));
    if (favListPrev.length){
      let posRemove = favListPrev.indexOf(ele._id);
      if (posRemove > -1) {
        favListPrev.splice(posRemove, 1);
        this.setState({favList : favListPrev })
        localStorage.setItem('LIST_KEY', JSON.stringify(favListPrev))
        this.getTitleFav();
      }
    }
  }
  addToFav(ele){
    let favListPrev = JSON.parse(localStorage.getItem("LIST_KEY"));
    let addFav = true;
    if (favListPrev.length){
      favListPrev.map(e => {
        if (e == ele._id){
          addFav = false;
          return;
        }
      })
    }
    if (addFav){
      let favList = this.state.favList.concat(ele._id);
      this.setState({favList : favList })
      localStorage.setItem('LIST_KEY', JSON.stringify(favList))
      this.setState({optionsTitle : false});
      this.getTitleFav();
    }
    // let favList = this.state.favList.concat(row._id);
    // this.setState({favList : favList })
    // localStorage.setItem('LIST_KEY', JSON.stringify(favList))
    // console.log('LENGTH FAV ==',favList.length);
  }
  UpdateTrueFalse(){
      document.getElementById('LinhVucInput').style.visibility='visible';
  }
  Like(e){
    var userName = localStorage.getItem("USER_NAME");
    if (e.like != undefined){
      let checked = true;
      let newLike = [];
      e.like.map(async (ele,i) => {
        if (ele == userName){
          e.like.splice(i,1);
          checked = false;
          return;
        }
      })
      if (checked){
        newLike = e.like.concat(userName);
        this.props.UpdateLike(e._id,newLike);
      }
      else{
        newLike = e.like;
        this.props.UpdateLike(e._id,newLike);
      }
    }
    else {
      this.props.UpdateLike(e._id,[userName]);
    }
  }
  LogOut(){
    //localStorage.setItem('loggedIn',false);
    this.props.history.push("/logout");
    window.location.reload(true);
    //this.props.history.push("/");
  }
  async getTitleFav(){
    let favListPrev = JSON.parse(localStorage.getItem("LIST_KEY"));
    if (favListPrev.length){
      let favListTitle = [];
      await Promise.map(favListPrev, async function(e,i) {
        await axios.get('/field/'+e)
        .then(res => {
          if (res.data.success){
            favListTitle = favListTitle.concat(res.data.result[0].title);
          }
        })
          .catch(error => console.log(error));
      })
      localStorage.setItem('LIST_KEY_NAME', JSON.stringify(favListTitle))
      this.setState({optionsTitle : true});  
    }
  }
  FavSelectOnChange(e){
    document.getElementById('dropDownLinhVuc').value=e.value;
    this.props.getDataByField(e.value);
    this.showModal();
  }
  Search(){
    let inputSearch = document.getElementById('inputBrowser').value;
    let str=inputSearch;
    let data = { 
      type : this.state.typeSearch,
      category : document.getElementsByClassName("selectSearch")[0].value,
      data : str,
      price: document.getElementsByClassName('selectOptionSearch')[0].value,
      dt: document.getElementsByClassName('selectOptionSearch')[1].value
    }
    this.props.getFieldBySearch(data); 
  }
  liSearchClicked(){
    if (document.getElementsByClassName('SelectLI')[0].style.backgroundColor=='rgb(121, 121, 121)'){
      document.getElementsByClassName('SelectLI')[0].style.backgroundColor='#fff';
      document.getElementsByClassName('SelectLI')[0].style.color='#797979';
      this.setState({typeSearch : ''})
    }else{
      this.setState({typeSearch : 'mua-ban'})
      document.getElementsByClassName('SelectLI')[0].style.backgroundColor='#797979';
      document.getElementsByClassName('SelectLI')[0].style.color='#fff';
      document.getElementsByClassName('SelectLI')[1].style.backgroundColor='#fff';
      document.getElementsByClassName('SelectLI')[1].style.color='#797979';  
    }
  }
  liSearchClicked2(){
    if (document.getElementsByClassName('SelectLI')[1].style.backgroundColor=='rgb(121, 121, 121)'){
      document.getElementsByClassName('SelectLI')[1].style.backgroundColor='#fff';
      document.getElementsByClassName('SelectLI')[1].style.color='#797979';
      this.setState({typeSearch : ''})
    }else{
      this.setState({typeSearch : 'cho-thue'})
      document.getElementsByClassName('SelectLI')[1].style.backgroundColor='#797979';
      document.getElementsByClassName('SelectLI')[1].style.color='#fff';
      document.getElementsByClassName('SelectLI')[0].style.backgroundColor='#fff';
      document.getElementsByClassName('SelectLI')[0].style.color='#797979';
    }
  }
  ToggleDropdownMenu(){
      var x = this.refs.dropdownmenu;
      if (x.style.display === 'none') {
        x.style.display = 'block';
      } else {
        x.style.display = 'none';
      }
    }
  addDataToField(){
    let self = this;
    let title = document.getElementById('input-title').value;
    let IMG = document.getElementById('input-IMG').value;
    let road = document.getElementById('input-road').value;
    let floor = document.getElementById('input-floor').value;
    let bed = document.getElementById('input-bed').value;
    let park = document.getElementById('input-park').value;
    let dientich = document.getElementById('input-dt').value;
    let kichthuoc = document.getElementById('input-kt').value;
    let direct = document.getElementById('input-direct').value;
    let value = document.getElementById('input-value').value;
    let address = document.getElementById('input-address').value;
    let infor = document.getElementById('input-data').value;
    //let _Tempid = new ObjectID().toString();
    let userName = localStorage.getItem("USER_NAME");
    let data = `<div class="characteristics"><span class="road-width" title="???????ng tr?????c nh?? ${road}">${road}</span><span class="floors" title="${floor}">${floor}</span><span class="bedroom" title="${bed}">${bed}</span><span class="parking" title="ch??? ????? ?? t??">${park}</span></div><div class="square-direct"><div class="ct_dt"><label>Di???n t??ch:</label> ${dientich}<sup>2</sup></div><div class="ct_kt"><label>KT:</label> ${kichthuoc}</div><div class="ct_direct"><label>H?????ng:</label> ${direct}</div><div class="clear"></div></div><div class="price-dis"><div class="ct_price"><label>Gi??:</label> ${value}</div><div class="ct_dis">${address}</div><div class="clear"></div></div>`;
    let dataField = {
      title: title,
      img: IMG,
      NoiDung:data,
      user: userName,
    }
    let square=`${dientich}<sup>2</sup>`;
    let dataCompany = {
      DiaChi: address,
      NoiDung: infor,
      Price:value,
      Square:square
    }
    this.props.saveDataField(dataField,dataCompany);
    setTimeout(
      function(){ 
        self.setState({ addNew: false });
       }
     ,2000);
  }
  PageSelectOnChange(e){
    this.setState({ pageSelected: e.target.value });
  }
  SortIcon(type){
    this.props.getFieldSort(type);
    document.getElementById('dropDownPage').value='1';
    this.setState({ pageSelected: 1 });
  }
  UnSortIcon(){
    this.props.getField();
    document.getElementById('dropDownPage').value='1';
    this.setState({ pageSelected: 1 });
  }
  getSession(){
    var temp = false;
    axios.get('/islogged')
    .then(res => temp=Boolean(res.data))
    .then(() => 
      {if (temp==false){
        this.LogOut();
      }})
    .catch(error => console.log(error));
  }
  componentDidMount() {
      this.getSession();
      const {getField,appData,getData,getFieldSort} = this.props;
      //const loggedIn=Boolean(localStorage.getItem('loggedIn') == 'true');
      getField();
      getData();
      document.getElementById('btnLogOut').onclick=this.LogOut.bind(this);
      document.getElementById('btnUpdateAsk').onclick=this.UpdateTrueFalse.bind(this);
      document.getElementById('btnSortLike').onclick=this.SortIcon.bind(this,'like');
      document.getElementById('btnSortComments').onclick=this.SortIcon.bind(this,'comments');
      document.getElementById('btnUnSort').onclick=this.UnSortIcon.bind(this);
      //document.getElementById('addToFavIcon').onclick=this.addToFav.bind(this);

      let favList = JSON.parse(localStorage.getItem("LIST_KEY"));
      if (favList.length){
        this.setState({optionsTitle : true });
      }
      let selectFocus = false;
      let divFocus = false;
      $('.Search').focusin(function() {
        //console.log('qwe');
        $('.selectOptionSearch').show();
        divFocus=true;
      })
      $('.selectOptionSearch').focusin(function() {
        selectFocus = true;
      })
      $('.selectOptionSearch').focusout(function() {
        selectFocus = false;
      })
      $('.Search').focusout(function() {
        divFocus=false;
        setTimeout(
          function(){ 
            if ((selectFocus == false) && (divFocus == false)){
              $('.selectOptionSearch').fadeOut(500);  
              selectFocus = false;
            }
          }
        ,400);
      })
  }

  componentDidUpdate(nextProps, nextState) {
    
  }


  render() {
    const {appData,LinhVucSelectOnChange} = this.props;

    let favList = JSON.parse(localStorage.getItem("LIST_KEY"));
    let favListName = JSON.parse(localStorage.getItem("LIST_KEY_NAME"));
    let optionsSelect = [];
    let userName = localStorage.getItem("USER_NAME");
    let page=[];
    if (appData.pages > 0){
      for (var j = 1; j <= appData.pages;j++){
        page[j]=j;
      }
    }
    
    if (this.state.optionsTitle){
      favList.map(async (e,i) => {
        //await this.getTitleFav(e);
        optionsSelect[i]={value : e,label : favListName[i]}
      })  
    }
  
      return (
        <div className="App container-fluid"> 
          <header className="Tittle">
              TH??NG TIN B???T ?????NG S???N
              <div className="iconLogOut"><i className="fa fa-bars" onClick={this.ToggleDropdownMenu.bind(this)}></i>
              <div className="dropdown-content-menu" ref="dropdownmenu" style={{display:'none'}}>
                <a id="imgUser"><img className="image-user" src="/img/user2.jpg"/><img className="image-user" src="/img/user3.jpg"/>{userName}</a>
                <a href="#addNew" id="btnAddNew" onClick={this.showAddNew.bind(this)}>????ng Tin</a>
                <a href="#logOut" id="btnLogOut">????ng Xu???t</a>
              </div>
              </div>
          </header>
          <div className="Search">
              <ul className="ulSearch">
                <li className="SelectLI" onClick={this.liSearchClicked.bind(this)}>NH?? ?????T B??N</li>
                <li className="SelectLI" onClick={this.liSearchClicked2.bind(this)}>NH?? ?????T CHO THU??</li>
              </ul>
              <div className="divSearch">
                  <div>
                    <select className="selectSearch">
                      <option value="tat-ca">T???t c???</option>
                      <option value="nha">Nh?? ri??ng</option>
                      <option value="biet-thu">Nh?? bi???t th???, li???n k???</option>
                      <option value="can-ho">C??n h??? chung c??</option>
                      <option value="van-phong">V??n ph??ng</option>
                      <option value="dat-nen">?????t n???n d??? ??n</option>
                      <option value="mat-bang">M???t b???ng</option>
                      <option value="cac-loai-khac">B???t ?????ng s???n kh??c</option>
                    </select>
                  </div>
                  <div  className="divButtonSearch">
                    <input id="inputBrowser" placeholder="T??m ki???m ?????a ??i???m, khu v???c..." />
                    <button className="buttonSearch" id="buttonSearch" onClick={this.Search.bind(this)}>T??m ki???m</button>
                    <div>
                      <select className="selectOptionSearch">
                        <option value="allprice">M???c gi??</option>
                        <option value="price1">0 - 500 tri???u</option>
                        <option value="price2">500 - 800 tri???u</option>
                        <option value="price3">800 tri???u - 1 t???</option>
                        <option value="price4">1 - 2 t???</option>
                        <option value="price5">2 - 3 t???</option>
                        <option value="price6">3 - 5 t???</option>
                        <option value="price7">5 t??? ~</option>
                      </select>
                      <select className="selectOptionSearch">
                        <option value="alldt">Di???n t??ch</option>
                        <option value="dt1">0 - 30 m2</option>
                        <option value="dt2">30 - 50 m2</option>
                        <option value="dt3">50 - 100 m2</option>
                        <option value="dt4">100 - 150 m2</option>
                        <option value="dt5">150 - 200 m2</option>
                        <option value="dt6">200 m2 ~</option>
                      </select>
                    </div>
                  </div>
                </div>
          </div>
          <br></br>
          <div className="cung1hang">
              <Select id="dropDownLinhVuc" placeholder={"Your Favorite List ("+ favList.length +")"}
                value={appData.selectedOptions}
                onChange={this.FavSelectOnChange.bind(this)}
                options={optionsSelect}
                >
              </Select>
                <div style={{marginTop:3+'px'}}>
                  <i className="fa fa-trash icon" id="btnDel"></i>
                  <i className="fa fa-pencil icon" id="btnUpdateAsk"></i>
                </div>
          </div>
          <br></br>
          <div className="divSort">
            <div className="dropdown">
              <button className="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown"><i className="fa fa-sort-amount-desc" style={{fontSize:20+'px'}} title="L???c"></i>
              <span className="caret"></span></button>
              <ul className="dropdown-menu">
                <li><a href="#" id="btnSortLike">Theo l?????t th??ch</a></li>
                <li><a href="#" id="btnSortComments">Theo l?????t b??nh lu???n</a></li>
                <li><a href="#" id="btnUnSort">M???i nh???t</a></li>
              </ul>
            </div>
          </div>
          
          <br></br>
          <div className="center">
          {appData.fields.map((e,i)=> {
            if ((i < 20*this.state.pageSelected) &&(i >= 20*this.state.pageSelected-20)){
              return <InfoClass
              {...this.props}
              e={e}
              InfoModalShow={this.InfoModalShow.bind(this)}
              addToFav={this.addToFav.bind(this)}
              removeFav={this.removeFav.bind(this)}
              Like={this.Like.bind(this)}
              stt={i}
              />;
            }
            else {
              return;
            }
          })}
          <InfoModal
            show={this.state.show} 
            handleClose={this.hideModal.bind(this)} 
            children={this.props.appData.items}>
          </InfoModal>
          <AddNewOne
            {...this.props}
            handleClose={this.hideAddNew.bind(this)}
            addDataToField={this.addDataToField.bind(this)}
            show={this.state.addNew}
            edit={this.state.edit}>
          </AddNewOne>
          </div>
          <div className="Center">
              <select className="SelectBox" id="dropDownPage" onChange={this.PageSelectOnChange.bind(this)}>
                {page.map((page) => <option key={page} value={page}>Trang {page}</option>)}
              </select>
          </div>
      </div>
      );
  }
}

const InfoModal = ({ handleClose, show, children }) => {
  const showHideClassName = show ? 'modal  display-block' : 'modal display-none';
  let data;
  if (children.length){
    data = children[0];
    $('#DiaChi').text(data.DiaChi);
    $('#NoiDung').text(data.NoiDung);
    $('#Price').text(data.Price);
    return (
      <div className={showHideClassName}>
        <section className='modal-main info-modal' style={{width:60+'%'}} >
          <div className="modal-header">
            <p>TH??NG TIN CHI TI???T</p>
          </div>
          <div className="modal-body">
            <form>
                <div className="form-group">
                  <label className="col-sm-3 control-label"> ?????a ch???</label>
                  <div className="col-sm-9">
                    <p id="DiaChi"/>
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-sm-3 control-label"> Th??ng tin</label>
                  <div className="col-sm-9">
                    <p id="NoiDung"/>
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-sm-3 control-label"> Gi??</label>
                  <div className="col-sm-9">
                    <p  id="Price"/>
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-sm-3 control-label"> Di???n t??ch</label>
                  <div className="col-sm-9">
                    <p  id="Square">{Parser(data.Square)}</p>
                  </div>
                </div>

                {/* <div className="form-group">
                  <label className="col-sm-3 control-label"> Th??ng Tin Th??m</label>
                  <div className="col-sm-9">
                    {Parser(data.NoiDung2)}
                  </div>
                </div> */}
 
            </form>
            <button className="btn btn-default btn-close" onClick={handleClose}>Close</button>
          </div>
          <div className="modal-footer">
            
          </div>
        </section>
      </div>
    );
  }
  else{
    return (<div></div>);
  }
};

class InfoClass extends React.Component{
  constructor(props) {
    super(props);
    
    this.state = {
      showComments : false,
      edit: false,
      dataEdit: {}
    }
  }
  showComments(){
    this.setState({showComments: true});
  }
  hideComments(){
    this.setState({showComments:false})
  }

  showEdit(){
    this.setState({ edit: true });
    this.refs.dropdown.style.display = 'none';
    let dataEdit={};
    if (this.refs.fieldData.querySelector('span.road-width') != null){
      dataEdit.road = this.refs.fieldData.querySelector('span.road-width').innerText;
      dataEdit.road = dataEdit.road.trim();
    }
    if (this.refs.fieldData.querySelector('span.floors') != null){
      dataEdit.floor = this.refs.fieldData.querySelector('span.floors').innerText;
      dataEdit.floor = dataEdit.floor.trim();
    }
    if (this.refs.fieldData.querySelector('span.bedroom') != null){
      dataEdit.bed = this.refs.fieldData.querySelector('span.bedroom').innerText;
      dataEdit.bed = dataEdit.bed.trim();
    }
    if (this.refs.fieldData.querySelector('span.parking') != null){
      dataEdit.parking = this.refs.fieldData.querySelector('span.parking').innerText;
      dataEdit.parking = dataEdit.parking.trim();
    }
    if (this.refs.fieldData.querySelector('div.ct_dt') != null){
      dataEdit.dt = this.refs.fieldData.querySelector('div.ct_dt').childNodes[1].data;
      dataEdit.dt = dataEdit.dt.trim();
    }
    if (this.refs.fieldData.querySelector('div.ct_kt') != null){
      dataEdit.kt = this.refs.fieldData.querySelector('div.ct_kt').childNodes[1].data;
      dataEdit.kt = dataEdit.kt.trim();
    }
    if (this.refs.fieldData.querySelector('div.ct_direct') != null){
      dataEdit.direct = this.refs.fieldData.querySelector('div.ct_direct').childNodes[1].data;
      dataEdit.direct = dataEdit.direct.trim();
    }
    if (this.refs.fieldData.querySelector('div.ct_price') != null){
      dataEdit.price = this.refs.fieldData.querySelector('div.ct_price').childNodes[1].data;
      dataEdit.price = dataEdit.price.trim();
    }
    if (this.refs.fieldData.querySelector('div.ct_dis') != null){
      dataEdit.dis = this.refs.fieldData.querySelector('div.ct_dis').innerText;
      dataEdit.dis = dataEdit.dis.trim();
    }
    this.setState({ dataEdit: dataEdit });
    //console.log('DATA == ',road,'/',floor,'/',bed,'/',parking,'/',dt,'/',kt,'/',direct,'/',price,'/',dis);
  }
  hideEdit(){
    this.setState({ edit: false });
  }
  addComments(value){
    let oldListCom=[];
    //let value = document.getElementsByClassName('comments').value;
    if (this.props.e.comments != undefined){
      oldListCom = this.props.e.comments;
    }
    var userName = localStorage.getItem("USER_NAME");
    let listCom =  oldListCom.concat({userName:userName,comment:value})
    //console.log('LIST COMMENT : ',listCom);
    this.props.UpdateComment(this.props.e._id,listCom);
    document.getElementsByClassName('comments').value='';
  }
  handleErrorIMG(){
    //console.log('THIS == ',this.props);
  }
  ToggleDropdown(){
  //  console.log('QWE ==',document.getElementById('myDropdown').style.display);
    //console.log('QEE == ',this.refs.dropdown);
    var x = this.refs.dropdown;
    //console.log('QWE ==',x);
    if (x.style.display === 'none') {
      x.style.display = 'inline-block';
    } else {
      x.style.display = 'none';
    }
  }
  DeleteField(e){
    console.log('EE == ',e._id);
    this.refs.dropdown.style.display = 'none';
    swal({
      title: "B???n c?? ch???c ch???n mu???n xo?? tin t???c b???t ?????ng s???n n??y kh??ng?",
      text: "",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        swal("B???n ???? xo?? tin t???c th??nh c??ng!", {
          icon: "success",
        });
        this.props.DeleteFieldByID(e._id);
      } else {
      }
    });
  }
  componentDidUpdate(nextProps, nextState) {

  }
  componentDidMount(){

  }
  render(){
    let numLike = 0;
    var userName = localStorage.getItem("USER_NAME");
    let liked = false;
    let comment = false;
    if (this.props.e.like != undefined){
       numLike = this.props.e.like.length;
       this.props.e.like.map(async (ele) => {
         if (ele==userName){
          liked=true;
          return;
         }
       })
    }
    if (this.props.e.comments != undefined){
      comment = true;
    }
    //document.getElementsByTagName("a").removeAttribute("href");
    //console.log('ELEMENT == ',document.getElementsByTagName("a").length);
    if (document.getElementsByTagName("a").length > 0){
      for (var i = 0; i < document.getElementsByTagName("a").length; i++) {
        document.getElementsByTagName("a")[i].removeAttribute("href");
        document.getElementsByTagName("a")[i].removeAttribute("title");
      } 
      // document.getElementsByTagName("a").length.map(e => {
        
      // })
    }
    let img = this.props.e.img;
    if (img == '' || img == 'https://alonhadat.com.vn/files/properties/default.jpg'){
      img='/img/house.jpg';
    }
    return (
      <div className="data-info">
        <div>
          <p onClick={this.props.InfoModalShow.bind(this,this.props.e)} className="data-title" style={{display:'inline-block',paddingRight:10+'%'}}>{this.props.e.title}</p>
          <i className="fa fa-angle-down IconShow" aria-hidden="true" onClick={this.ToggleDropdown.bind(this)}></i>
          <div className="dropdown-content" ref="dropdown" style={{display:'none'}}>
            <a href="#edit" onClick={this.showEdit.bind(this)}>S???a</a>
            <a href="#delete" onClick={this.DeleteField.bind(this,this.props.e)}>Xo??</a>
          </div>
          <div className="data-user">????ng b???i: {this.props.e.user}</div>
        </div>
        <div className="data-item2">
          <img src={img} onError={(e)=>{e.target.onerror = null; e.target.src="/img/forRent.jpg"}}></img>
          <div ref="fieldData" className="field-data">{Parser(this.props.e.NoiDung)}</div>
        </div>
        <div className="data-react">
          <i className={liked ? "fa fa-thumbs-o-up  corlorRed" : "fa fa-thumbs-o-up"}  onClick={this.props.Like.bind(this,this.props.e)}>({numLike})  Th??ch</i>
          <i className="fa fa-comment-o" onClick={this.showComments.bind(this)}>  B??nh lu???n</i>
          <img className="iconAddFav" src="/img/addfav.png" onClick={this.props.addToFav.bind(this,this.props.e)}></img>
          <img className="iconRemoveFav" src="/img/removefav.png" onClick={this.props.removeFav.bind(this,this.props.e)}></img>
        </div>
        <div className={this.state.showComments ? "data-comment" : "data-comment hide"}>
          {comment ? this.props.e.comments.map(e => {
            return <div className="data-comment-2"><img className="image-user" src="/img/user.jpg"/><p className="user-comment">{e.userName}</p>{e.comment}</div>;
          }):null}
          <input className="comments" type="text" placeholder="Vi???t b??nh lu???n ??? ????y ...." 
            onKeyPress={event => {
                if (event.key === 'Enter') {
                  //console.log('this value == ',event.target.value);
                  this.addComments(event.target.value);
                }
              }}>
          </input>
        </div>
        <EditOne
            props={this.props}
            handleClose={this.hideEdit.bind(this)}
            //saveEditField={this.saveEditField.bind(this)}
            data={this.props.e}
            data1={this.state.dataEdit}
            edit={this.state.edit}
            stt={this.props.stt}>
          </EditOne>
      </div>
    )
  }
}

const AddNewOne = ({handleClose,addDataToField,show,edit}) => {
  const showHideClassName = show ? 'modal display-block  add-new' : 'modal display-none add-new';
  let data;
  return (
    <div className={showHideClassName}>
      <section className='modal-main add-new-one-modal'>
        <div className="modal-header title">
          <p>????NG TIN NH?? ?????T</p>
        </div>
        <div className="modal-body">
          <form>
              <div className="form-group">
                <label className="col-sm-3 control-label"> Ti??u ?????</label>
                <div className="col-sm-9">
                  <input type="text" className="form-control"  id="input-title" placeholder="Vi???t ti??u ????? v??o ????y" required autoFocus />
                </div>
              </div>
              <div className="form-group">
                <label className="col-sm-3 control-label"> H??nh ???nh</label>
                <div className="col-sm-9">
                  <input type="text" className="form-control"  id="input-IMG" placeholder="????? ???????ng d???n h??nh ???nh" required autoFocus />
                </div>
              </div>
              <label className="control-label"> N???i Dung</label>
              <div className="form-group">
                <label className="col-sm-3 control-label"> ???????ng tr?????c nh??</label>
                <div className="col-sm-2">
                  <input type="text" className="form-control"  id="input-road" placeholder="v?? d???: 20m"/>
                </div>
                <label className="col-sm-3 control-label"> S??? l???u</label>
                <div className="col-sm-2">
                  <input type="text" className="form-control"  id="input-floor" placeholder="v?? d???: 7 l???u"/>
                </div>
              </div>
              <div className="form-group">
                <label className="col-sm-3 control-label"> S??? ph??ng ng???</label>
                <div className="col-sm-2">
                  <input type="text" className="form-control"  id="input-bed" placeholder="v?? d???: 20 ph??ng ng???"/>
                </div>
                <label className="col-sm-3 control-label"> Ch??? ????? xe ?? t??</label>
                <div className="col-sm-2">
                  {/* <input type="text" className="form-control"  id="input-park" placeholder="v?? d???: ch??? ????? xe"/> */}
                  <select name="direct" id="input-park" className="form-control">
                    <option value="C??">C??</option>
                    <option value="Kh??ng">Kh??ng</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="col-sm-3 control-label"> Di???n t??ch</label>
                <div className="col-sm-2">
                  <input type="text" className="form-control"  id="input-dt" placeholder="v?? d???: 20m"/>
                </div>
                <label className="col-sm-3 control-label"> K??ch th?????c</label>
                <div className="col-sm-2">
                  <input type="text" className="form-control"  id="input-kt" placeholder="v?? d???: 20m"/>
                </div>
              </div>
              <div className="form-group">
                <label className="col-sm-3 control-label"> H?????ng</label>
                <div className="col-sm-2">
                  {/* <input type="text" className="form-control"  id="input-direct" placeholder="????ng/T??y/Nam/B???c"/> */}
                  <select name="direct" id="input-direct" className="form-control">
                    <option value="Nam">Nam</option>
                    <option value="T??y">T??y</option>
                    <option value="????ng">????ng</option>
                    <option value="B???c">B???c</option>
                    <option value="T??y Nam">T??y Nam</option>
                    <option value="????ng B???c">????ng B???c</option>
                    <option value="T??y B???c">T??y B???c</option>
                    <option value="????ng Nam">????ng Nam</option>
                  </select>
                </div>
                <label className="col-sm-3 control-label"> Gi??</label>
                <div className="col-sm-2">
                  <input type="text" className="form-control"  id="input-value" placeholder="v?? d???: 4,5 tri???u /??th??ng"/>
                </div>
              </div>
              <div className="form-group">
                <label className="col-sm-3 control-label"> ?????a ch???</label>
                <div className="col-sm-9">
                  <input type="text" className="form-control"  id="input-address" placeholder="?????a ch???"/>
                </div>
              </div>
              <div className="form-group">
                <label className="col-sm-3 control-label"> Th??ng tin chi ti???t</label>
                <div className="col-sm-9">
                  <textarea id="input-data" className="form-control" rows="4" cols="50"></textarea>
                </div>
              </div>
          </form>
          <div className="add-new-footer">
            <button className="btn btn-default" onClick={addDataToField}>????ng tin</button>
            <button className="btn btn-default btn-close-2" onClick={handleClose}>????ng</button>
          </div>
        </div>
        <div className="modal-footer">
        </div>
      </section>
    </div>
  );
};

const EditOne = ({props,handleClose,data,data1,edit,stt}) => {
  var showHideClassName = edit ? 'modal display-block add-new' : 'modal display-none add-new';
  if (edit == true){
    console.log('DATA == ',data);
    if (data.title != undefined){
      document.getElementsByClassName('input-title')[stt].value=data.title;
      document.querySelectorAll('.input-title')[stt].value=data.title;
    }
    if (data.img != undefined){
      document.getElementsByClassName('input-IMG')[stt].value=data.img;
      document.querySelectorAll('.input-IMG')[stt].value=data.img;
    }
  }
  function editDataToField(e){
    //console.log('STT ==',data1);
    let title = document.getElementsByClassName('input-title')[stt].value;
    let IMG = document.getElementsByClassName('input-IMG')[stt].value;
    let road = document.getElementsByClassName('input-road')[stt].value;
    let floor = document.getElementsByClassName('input-floor')[stt].value;
    let bed = document.getElementsByClassName('input-bed')[stt].value;
    let park = document.getElementsByClassName('input-park')[stt].value;
    let dientich = document.getElementsByClassName('input-dt')[stt].value;
    let kichthuoc = document.getElementsByClassName('input-kt')[stt].value;
    let direct = document.getElementsByClassName('input-direct')[stt].value;
    let value = document.getElementsByClassName('input-value')[stt].value;
    let address = document.getElementsByClassName('input-address')[stt].value;
    let infor = document.getElementsByClassName('input-data')[stt].value;
    let userName = localStorage.getItem("USER_NAME");
    let data = `<div class="characteristics"><span class="road-width" title="???????ng tr?????c nh?? ${road}">${road}</span><span class="floors" title="${floor}">${floor}</span><span class="bedroom" title="${bed}">${bed}</span><span class="parking" title="ch??? ????? ?? t??">${park}</span></div><div class="square-direct"><div class="ct_dt"><label>Di???n t??ch:</label> ${dientich}<sup>2</sup></div><div class="ct_kt"><label>KT:</label> ${kichthuoc}</div><div class="ct_direct"><label>H?????ng:</label> ${direct}</div><div class="clear"></div></div><div class="price-dis"><div class="ct_price"><label>Gi??:</label> ${value}</div><div class="ct_dis">${address}</div><div class="clear"></div></div>`;
    let dataField = {
      title: title,
      img: IMG,
      NoiDung:data,
      user: userName
    }
    let square=`${dientich}<sup>2</sup>`;
    let dataCompany = {
      DiaChi: address,
      NoiDung: infor,
      Price:value,
      Square:square
    }
    props.editDataField(e._id,dataField,dataCompany);
    handleClose();
  };
    let TempUrl = '/company/'+data._id;
    axios.get(TempUrl)
    .then(res => {
      document.getElementsByClassName('input-data')[stt].value=res.data.result[0].NoiDung;
      document.querySelectorAll('.input-data')[stt].value=res.data.result[0].NoiDung;
    })
    .catch(error => console.log(error));

    if (data1.title != undefined){
      document.getElementsByClassName('input-title')[stt].value=data1.title;
      document.querySelectorAll('.input-title')[stt].value=data1.title;
    }
    if (data1.img != undefined){
      document.getElementsByClassName('input-IMG')[stt].value=data1.img;
      document.querySelectorAll('.input-IMG')[stt].value=data1.img;
    }
    if (data1.road != undefined){
      document.getElementsByClassName('input-road')[stt].value=data1.road;
      document.querySelectorAll('.input-road')[stt].value=data1.road;
    }
    if (data1.floor != undefined){
      document.getElementsByClassName('input-floor')[stt].value=data1.floor;
      document.querySelectorAll(`.input-floor`)[stt].value=data1.floor;
    }
    if (data1.bed != undefined){
      document.getElementsByClassName('input-bed')[stt].value=data1.bed;
      document.querySelectorAll('.input-bed')[stt].value=data1.bed;
    }
    if (data1.parking != undefined){
      document.getElementsByClassName('input-park')[stt].value=data1.parking;
      document.querySelectorAll('.input-park')[stt].value=data1.parking;
    }
    if (data1.dt != undefined){
      document.getElementsByClassName('input-dt')[stt].value=data1.dt;
      document.querySelectorAll('.input-dt')[stt].value=data1.dt;
    }
    if (data1.kt != undefined){
      document.getElementsByClassName('input-kt')[stt].value=data1.kt;
      document.querySelectorAll('.input-kt')[stt].value=data1.kt;
    }
    if (data1.direct != undefined){
      document.getElementsByClassName('input-direct')[stt].value=data1.direct;
      document.querySelectorAll('.input-direct')[stt].value=data1.direct;
    }
    if (data1.price != undefined){
      document.getElementsByClassName('input-value')[stt].value=data1.price;
      document.querySelectorAll('.input-value')[stt].value=data1.price;
    }
    if (data1.dis != undefined){
      document.getElementsByClassName('input-address')[stt].value=data1.dis;
      document.querySelectorAll('.input-address')[stt].value=data1.dis;
    }

  return (
    <div className={showHideClassName}>
      <section className='modal-main add-new-one-modal'>
        <div className="modal-header title">
          <p>THAY ?????I TIN NH?? ?????T</p>
        </div>
        <div className="modal-body">
          <form>
              <div className="form-group">
                <label className="col-sm-3 control-label"> Ti??u ?????</label>
                <div className="col-sm-9">
                  <input type="text" className="form-control input-title" placeholder="Vi???t ti??u ????? v??o ????y" required autoFocus/>
                </div>
              </div>
              <div className="form-group">
                <label className="col-sm-3 control-label"> H??nh ???nh</label>
                <div className="col-sm-9">
                  <input type="text" className="form-control input-IMG" placeholder="????? ???????ng d???n h??nh ???nh" required autoFocus/>
                </div>
              </div>
              <label className="control-label"> N???i Dung</label>
              <div className="form-group">
                <label className="col-sm-3 control-label"> ???????ng tr?????c nh??</label>
                <div className="col-sm-2">
                  <input type="text" className="form-control input-road" placeholder="v?? d???: 20m"/>
                </div>
                <label className="col-sm-3 control-label"> S??? l???u</label>
                <div className="col-sm-2">
                  <input type="text" className="form-control input-floor" placeholder="v?? d???: 7"/>
                </div>
              </div>
              <div className="form-group">
                <label className="col-sm-3 control-label"> S??? ph??ng ng???</label>
                <div className="col-sm-2">
                  <input type="text" className="form-control input-bed" placeholder="v?? d???: 20"/>
                </div>
                <label className="col-sm-3 control-label"> Ch??? ????? xe ?? t??</label>
                <div className="col-sm-2">
                  {/* <input type="text" className="form-control input-park" placeholder="v?? d???: ch??? ????? xe"/> */}
                  <select name="direct" id="input-park" className="form-control input-park">
                    <option value="C??">C??</option>
                    <option value="Kh??ng">Kh??ng</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="col-sm-3 control-label"> Di???n t??ch</label>
                <div className="col-sm-2">
                  <input type="text" className="form-control input-dt" placeholder="v?? d???: 20m"/>
                </div>
                <label className="col-sm-3 control-label"> K??ch th?????c</label>
                <div className="col-sm-2">
                  <input type="text" className="form-control input-kt" placeholder="v?? d???: 20m"/>
                </div>
              </div>
              <div className="form-group">
                <label className="col-sm-3 control-label"> H?????ng</label>
                <div className="col-sm-2">
                  {/* <input type="text" className="form-control"  id="input-direct" placeholder="????ng/T??y/Nam/B???c"/> */}
                  <select name="direct" className="form-control input-direct">
                    <option value="Nam">Nam</option>
                    <option value="T??y">T??y</option>
                    <option value="????ng">????ng</option>
                    <option value="B???c">B???c</option>
                    <option value="T??y Nam">T??y Nam</option>
                    <option value="????ng B???c">????ng B???c</option>
                    <option value="T??y B???c">T??y B???c</option>
                    <option value="????ng Nam">????ng Nam</option>
                  </select>
                </div>
                <label className="col-sm-3 control-label"> Gi??</label>
                <div className="col-sm-2">
                  <input type="text" className="form-control input-value" placeholder="v?? d???: 4,5 tri???u /??th??ng"/>
                </div>
              </div>
              <div className="form-group">
                <label className="col-sm-3 control-label"> ?????a ch???</label>
                <div className="col-sm-9">
                  <input type="text" className="form-control input-address" placeholder="?????a ch???"/>
                </div>
              </div>
              <div className="form-group">
                <label className="col-sm-3 control-label"> Th??ng tin chi ti???t</label>
                <div className="col-sm-9">
                  <textarea className="form-control input-data" rows="4" cols="50"></textarea>
                </div>
              </div>
          </form>
          <div className="add-new-footer">
            <button className="btn btn-default" onClick={editDataToField.bind(this,data)}>L??u tin</button>
            <button className="btn btn-default btn-close-2" onClick={handleClose}>????ng</button>
          </div>
        </div>
        <div className="modal-footer">
        </div>
      </section>
    </div>
  );
};

function mapStateToProps (state) {
  return {
    appData: state.appData
  }
}

function mapDispatchToProps (dispatch) {
  return {
    saveLink: (e) => dispatch(saveLink(e)),
    DeleteCompanyByField: (e) => dispatch(DeleteCompanyByField(e)),
    DeleteFieldByID: (e) => dispatch(DeleteFieldByID(e)),
    UpdateCompanyByField: (e) => dispatch(UpdateCompanyByField(e)),
    LinhVucSelectOnChange: (e) => dispatch(LinhVucSelectOnChange(e)),
    PageSelectOnChange: (e) => dispatch(PageSelectOnChange(e)),
    saveDataField: (e,e1) => dispatch(saveDataField(e,e1)),
    editDataField: (e,e1,e2) => dispatch(editDataField(e,e1,e2)),
    Reload: () => dispatch(Reload()),
    getField: () => dispatch(getField()),
    getFieldSort: (e) => dispatch(getFieldSort(e)),
    getFieldBySearch: (e) => dispatch(getFieldBySearch(e)),
    getData: () => dispatch(getData()),
    getDataByField: (e) => dispatch(getDataByField(e)),
    UpdateLike: (e,e1) => dispatch(UpdateLike(e,e1)),
    UpdateComment: (e,e1) => dispatch(UpdateComment(e,e1))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
