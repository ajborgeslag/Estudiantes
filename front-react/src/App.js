import React from "react";

import Routes from "./pages/routes";
import { HashRouter } from 'react-router-dom';

const App = () => {
    return <HashRouter><Routes /></HashRouter>;
};

export default App;
