/// <reference types="react-scripts" />

declare module 'react-router-dom' {
    const Switch: any;
    const Route: any;
    const BrowserRouter: any;
    const withRouter: any;
    const Redirect: any;
    export {
        Switch,
        Route,
        BrowserRouter,
        withRouter,
        Redirect
    }
}

declare module 'react-document-title' {
    const DocumentTitle: any;
    export default DocumentTitle;
}