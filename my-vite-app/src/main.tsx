// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import { Provider } from 'react-redux';
// import store from './store/store';  // Ensure this path is correct
// import App from './App';

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <Provider store={store}>
//     <App />
//   </Provider>
// );
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store/store';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </StrictMode>
);
