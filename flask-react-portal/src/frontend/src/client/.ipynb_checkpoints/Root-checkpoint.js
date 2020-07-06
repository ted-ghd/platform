import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import App from 'shared/App';
import { Provider } from 'react-redux';
import store from 'store';

const Root = () => (
    <BrowserRouter>
        <Provider store={store}>
            <App/>
        </Provider>
    </BrowserRouter>
);

export default Root;