import React from 'react';
import ReactDOM from 'react-dom';
import App from './crawldata';
import Signin from './signin';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch,Redirect } from "react-router-dom";

import configureStore from './configureStore'

const store = configureStore()

const Index = () => (
    <BrowserRouter>
            <Provider store={store}>
                <Route exact path="/" component={Signin} />
                <Route exact path="/app/home" component={App} />
            </Provider>
    </BrowserRouter>
);

ReactDOM.render(<Index />, document.getElementById('root'));