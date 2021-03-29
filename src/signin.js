import React from 'react';
import { connect } from 'react-redux';
import {getUser,Login,SignUp} from './actions/get';
import './Style.css';
import axios from 'axios';

class Signin extends React.Component {
    constructor(props) {
        super(props); 

        this.state = { show: false }
    }
    
    async checkUserPassword(){
        const {appData,Login} = this.props;
        var user = document.getElementById('inputUser').value;
        var password = document.getElementById('inputPassword').value;
        let data = {user,password};
        await Login(data);
        //console.log('USER == ',appData.User);
        // else
        // {
        //   alert('This user isnt verified, please verified it!!');
        // }
    }

    RegisterUser(){
      this.setState({modalIsOpen: true});
    }

    showModal(){
      this.setState({ show: true });
    }
    
    hideModal(){
      this.setState({ show: false });
    }

    LoggedIn(e = ''){
      const {appData} = this.props;
      localStorage.setItem('LIST_KEY', '[]');
      localStorage.setItem('LIST_KEY_NAME', '[]');
      if (e == ''){
        localStorage.setItem('USER_NAME',appData.User.user);
      }else{
        localStorage.setItem('USER_NAME',e);  
      }
      let uri = '/login?user='+appData.User.user;
      this.props.history.push(uri);
      window.location.reload(true);
    }

    Register(){
      const {appData,SignUp} = this.props;
      let self = this;
      var user = document.getElementById('inputUser2').value;
      var password = document.getElementById('inputPassword2').value;
      var email = document.getElementById('inputEmail').value;
      let data = {user,password,email};
      axios.post('/user/signup',data)
      .then(res => {
        if (res.data.success) {
         alert('A verification email has been sent to ' + email + '.'); 
          setTimeout(
           function(){ 
              self.setState({ show: false });
            }
          ,1000);
        }
        else {
          alert(res.data.msg);
        }
      })
      //console.log('USER == ',appData.User);
      // else
      // {
      //   alert('This user isnt verified, please verified it!!');
      // }
  }
  
    getSession(){
      let temp = false;
      let user = '';
      axios.get('/islogged')
      .then(res => {
        temp=Boolean(res.data.Loggedin);
        user=res.data.user;
      })
      .then(() => 
        {if (temp==true){
          this.LoggedIn(user);
        }})
      .catch(error => console.log(error));
    }

    componentDidMount() {
        const {appData} = this.props;
        localStorage.setItem('USER_NAME','');
        this.getSession();
        //getUser();
    }

    componentDidUpdate(nextProps, nextState) {
      const {appData} = this.props;
      //console.log('asdasdasdasd :: ',appData.User);
      if (appData.User != [])
      {
        //console.log('asdasdasdasd :: ',appData.User);
        if (appData.User.isVerified){
          this.LoggedIn();
        }
        // localStorage.setItem('loggedIn',true);
        //this.props.history.push("/app/home");
      }
    }

    render() {
        return (
          <div className="container-fluid">
            <header className="Tittle">SIGN IN</header>
            <form className="form-horizontal">
              <div className="form-group">
                <label className="col-sm-2 control-label"> User name</label>
                <div className="col-sm-10">
                  <input type="text" className="form-control"  id="inputUser" placeholder="User Name" required autoFocus />
                </div>
              </div>
              <div className="form-group">
                <label className="col-sm-2 control-label"> Password</label>
                <div className="col-sm-10">
                  <input type="password" className="form-control" id="inputPassword" placeholder="Password" required />
                </div>
              </div> 
              {/* <div className="form-group">
                <div className="col-sm-offset-2 col-sm-10">
                  <button type="submit" className="btn btn-default" onClick={this.checkUserPassword.bind(this)}>Sign in</button>
                </div>
              </div>   */}
            </form>
            <SignUpModal 
            show={this.state.show} 
            handleClose={this.hideModal.bind(this)} 
            children={this.props}
            Register={this.Register.bind(this)}>
            </SignUpModal>
            <div className="col-sm-offset-2 col-sm-10" style={{paddingLeft:5+'px'}}>
              <button className="btn btn-default" onClick={this.checkUserPassword.bind(this)}>Sign In</button>
              <button style={{marginLeft:30+'px'}} className="btn btn-default" onClick={this.showModal.bind(this)}>Sign Up</button>
            </div>
            {/* <div className="modal" id="RegisterUserModal" role="dialog" aria-labelledby="RegisterUserModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
              <div className="modal-dialog">
                <p>asdadsadasdasd</p>
              </div>
            </div> */}
          </div>
        )
    }
}

const SignUpModal = ({ handleClose, show, children,Register }) => {
  const showHideClassName = show ? 'modal display-block' : 'modal display-none';

  return (
    <div className={showHideClassName}>
      <section className='modal-main'>
        <div className="modal-header">
          <p>ĐĂNG KÝ THÀNH VIÊN</p>
        </div>
        <div className="modal-body">
          <form>
              <div className="form-group">
                <label className="col-sm-3 control-label"> User name</label>
                <div className="col-sm-9">
                  <input type="text" className="form-control"  id="inputUser2" placeholder="Place user name here" required autoFocus />
                </div>
              </div>
              <div className="form-group">
                <label className="col-sm-3 control-label"> Email</label>
                <div className="col-sm-9">
                  <input type="email" className="form-control"  id="inputEmail" placeholder="Place email here" required autoFocus />
                </div>
              </div>
              <div className="form-group">
                <label className="col-sm-3 control-label"> Password</label>
                <div className="col-sm-9">
                  <input type="password" className="form-control"  id="inputPassword2" placeholder="Place password here" required autoFocus />
                </div>
              </div>
          </form>
        </div>
        <div className="modal-footer">
          <button className="btn btn-default" onClick={Register}>Register</button>
          <button className="btn btn-default" onClick={handleClose}>Close</button>
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
      getUser: () => dispatch(getUser()),
      Login: (e) => dispatch(Login(e)),
      SignUp: (e) => dispatch(SignUp(e))
    }
  }

export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(Signin)