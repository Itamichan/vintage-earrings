import React from 'react';
import {Provider} from "react-redux";

import Layout from "./Components/Layout/Layout";
import {library} from '@fortawesome/fontawesome-svg-core'
import {fab} from '@fortawesome/free-brands-svg-icons'
import {
    faChevronLeft, faEdit, faUserPlus, faEnvelope, faSignInAlt, faInfo, faPlus, faTimes, faCartPlus, faShoppingCart
} from '@fortawesome/free-solid-svg-icons'
import {faTrashAlt} from '@fortawesome/free-regular-svg-icons'
import {store} from "./store";

library.add(fab, faChevronLeft, faEnvelope, faUserPlus, faTimes, faSignInAlt, faEdit, faTrashAlt, faCartPlus, faInfo, faPlus, faShoppingCart);


function App() {
    return (
        <div className="app">
            <Provider store={store}>
                <Layout/>
            </Provider>
        </div>
    );
}

export default App;
