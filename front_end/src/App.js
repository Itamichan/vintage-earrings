import React from 'react';
import {Provider} from "react-redux";
import {createStore} from "redux";
import rootReducer from "./reducers";
import Layout from "./Components/Layout/Layout";
import './App.scss';

const store = createStore(rootReducer);

function App() {
    return (
        <div className="app, text-header-important">
            <Provider store={store}>
                <Layout/>
            </Provider>
        </div>
    );
}

export default App;
