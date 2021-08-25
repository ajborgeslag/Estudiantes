import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import HomePage from "./home";
import ListGroup from "./list_group";
import ListStudent from "./list_student";

const Routes = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/inicio">
                    <HomePage />
                </Route>
                <Route exact path="/grupos">
                    <ListGroup />
                </Route>
                <Route exact path="/estudiantes">
                    <ListStudent />
                </Route>
            </Switch>
        </BrowserRouter>
    );
};

export default Routes;