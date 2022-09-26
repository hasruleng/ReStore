import React from 'react';
import ReactDOM from 'react-dom';
import './app/layout/style.css';
import App from './app/layout/App';
import reportWebVitals from './reportWebVitals';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { StoreProvider } from './app/context/StoreContext';
// import { configureStore } from './app/store/configureStore';
import { Provider } from 'react-redux';
import { store } from './app/store/configureStore';
import { fetchProductsAsync } from './features/catalog/catalogSlice';

export const history = createBrowserHistory();
store.dispatch(fetchProductsAsync());//temporary: to see the effectivenes of redux catalogSlice

// const store=configureStore();
console.log(store.getState());

ReactDOM.render(
  <React.StrictMode>
    <Router history={history}>
      <StoreProvider>
        <Provider store={store}>
        <App />
        </Provider>
      </StoreProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();