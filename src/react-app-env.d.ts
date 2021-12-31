/* eslint-disable init-declarations */
// / <reference types="react-scripts" />

declare module 'react-router-dom' {
    const Switch: any;
    const Route: any;
    const BrowserRouter: any;
    const withRouter: any;
    const Redirect: any;
    const useHistory: any;
    const Link: any;

    export {
        Switch,
        Route,
        BrowserRouter,
        withRouter,
        Redirect,
        useHistory,
        Link,
    };
}

declare module 'redux-persist/lib/storage/session' {
    const storageSession: any;

    export {
        storageSession,
    };
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

declare module '*.bmp' {
    const src: string;

    export default src;
}

declare module '*.gif' {
    const src: string;

    export default src;
}

declare module '*.jpg' {
    const src: string;

    export default src;
}

declare module '*.jpeg' {
    const src: string;

    export default src;
}

declare module '*.png' {
    const src: string;

    export default src;
}

declare module '*.webp' {
    const src: string;

    export default src;
}

declare module '*.svg' {
    import * as React from 'react';

    export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;

    const src: string;

    export default src;
}

declare module 'crypto-js' {
    const Base64: any;
    const MD5: any;

    export {
        Base64,
        MD5,
    };
}

declare module 'react-keepalive-router' {
    export const KeepaliveRouterSwitch: any;
    export const KeepaliveRoute: any;
    export const useCacheDispatch: any;
}
