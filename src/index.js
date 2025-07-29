import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppContainer from './components/App/AppContainer';
import 'mapbox-gl/dist/mapbox-gl.css';
import 'swiper/css';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AppContainer />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);