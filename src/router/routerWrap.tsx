/**
 * 路由页面组件包装
 */
import React, { useMemo, Suspense } from 'react';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';
import queryString from 'query-string';
import ToLoad from 'src/components/common/toLoad';


const RouteWrapper = (props: any) => {
    let { Com, route, restProps, message:mes } = props;

    /** useMemo 缓存query，避免每次生成新的query */
    const queryMemo = useMemo(() => {
        const queryReg = /\?\S*/g;
        const matchQuery = (reg: RegExp) => {
            const queryParams = restProps.location.search.match(reg);
            return queryParams ? queryParams[0] : '{}';
        };
        return queryString.parse(matchQuery(queryReg));
    }, [restProps.location.search]);
    const mergeQueryToProps = () => {
        const queryReg = /\?\S*/g;
        const removeQueryInRouter = (restProps: any, reg: RegExp) => {
            const { params } = restProps.match;
            Object.keys(params).forEach((key) => {
                params[key] = params[key] && params[key].replace(reg, '');
            });
            restProps.match.params = { ...params };
        };

        restProps = removeQueryInRouter(restProps, queryReg);
        const merge = {
            ...restProps,
            query: queryMemo,
        };
        return merge;
    };
    return (
        <DocumentTitle title={mes[route.title]||''}>
            <Suspense fallback={<ToLoad />}>
                <Com {...mergeQueryToProps()} />
            </Suspense>
        </DocumentTitle>
    );
};

export default connect((state: any) => {
    return {
      message: state.langSwitch.message
    }
  })(RouteWrapper);
