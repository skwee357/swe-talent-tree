import React from "react";
import {Helmet} from "react-helmet";
import {Route, Router, Switch} from "react-router";
import history from "@app/utils/history";
import ApplicationContainer from "@app/components/ApplicationContainer";

const TITLE_TEMPLATE = "%s | SwE Talent Tree"

export default function RootContainer() {
    return (
        <>
            <Helmet titleTemplate={TITLE_TEMPLATE}/>
            <Router history={history}>
                <Switch>
                    <Route component={ApplicationContainer}/>
                </Switch>
            </Router>
        </>
    )
}
