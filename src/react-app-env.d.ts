/// <reference types="react-scripts" />

declare module 'react-router-dom' {
    const Switch: any;
    const Route: any;
    const BrowserRouter: any;
    const withRouter: any;
    const Redirect: any;
    const useHistory: any;
    export {
        Switch,
        Route,
        BrowserRouter,
        withRouter,
        Redirect,
        useHistory
    }
}

declare module 'react-document-title' {
    const DocumentTitle: any;
    export default DocumentTitle;
}

declare module '*.module.less' {
    const classes: { readonly [key: string]: string };
    export default classes;
}

declare module '*.less' {
    const classes: { readonly [key: string]: string };
    export default classes;
}