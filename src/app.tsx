import "@app/styles/vendor.scss";
import "@app/styles/app.scss";

import * as React from "react";
import * as ReactDOM from "react-dom";
import {setConfig} from "react-hot-loader";
import {hot} from "react-hot-loader/root";
import RootContainer from "@app/components/RootContainer";

setConfig({
    ignoreSFC: true,
    pureRender: true
});

const HotRootContainer = hot(RootContainer);

const renderApp = () => ReactDOM.render(<HotRootContainer/>, document.getElementById("app"));

if ((process.env.NODE_ENV !== "production") && module.hot) {
    module.hot.accept("./components/RootContainer", renderApp);
}

renderApp();
