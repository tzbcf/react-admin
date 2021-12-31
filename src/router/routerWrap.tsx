/**
 * 路由页面组件包装
 */
// eslint-disable-next-line no-use-before-define
import React, { useMemo, Suspense } from 'react';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';
import queryString from 'query-string';
import ToLoad from 'src/components/common/toLoad';


const RouteWrapper: React.FC = (props: any) => {
    let { Com, route, restProps, message: mes } = props;

    /** useMemo 缓存query，避免每次生成新的query */
    const queryMemo = useMemo(() => {
        const queryReg = /\?\S*/g;
        const matchQuery = (reg: RegExp) => {
            const queryParams = restProps.location.search.match(reg);

            return queryParams ? queryParams[0] : '{}';
        };

        return queryString.parse(matchQuery(queryReg));
    }, [ restProps.location.search ]);
    const mergeQueryToProps = () => {
        const queryReg = /\?\S*/g;
        const removeQueryInRouter = (rstProps: any, reg: RegExp) => {
            const { params } = rstProps.match;

            Object.keys(params).forEach((key) => {
                params[key] = params[key] && params[key].replace(reg, '');
            });
            rstProps.match.params = { ...params };
        };

        restProps = removeQueryInRouter(restProps, queryReg);
        const merge = {
            ...restProps,
            query: queryMemo,
        };

        return merge;
    };

    return (
        <DocumentTitle title={mes[route.title] || ''}>
            <Suspense fallback={<ToLoad />}>
                <Com {...mergeQueryToProps()} />
            </Suspense>
        </DocumentTitle>
    );
};

export default connect((state: any) => ({
    message: state.langSwitch.message,
}))(RouteWrapper);
