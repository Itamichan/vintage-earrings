import React from 'react';
import {Provider} from "react-redux";
import {createStore} from "redux";
import rootReducer from "./reducers";
import Layout from "./Components/Layout/Layout";
import './App.scss';
import {library} from '@fortawesome/fontawesome-svg-core'
import {fab} from '@fortawesome/free-brands-svg-icons'
import {faChevronLeft, faEdit, faUserPlus, faEnvelope, faSignInAlt, faInfo, faPlus, faWindowClose} from '@fortawesome/free-solid-svg-icons'
import {faTrashAlt} from '@fortawesome/free-regular-svg-icons'

library.add(fab, faChevronLeft, faEnvelope, faUserPlus, faWindowClose, faSignInAlt, faEdit, faTrashAlt,  faInfo, faPlus);

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
