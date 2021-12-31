/**
 * FileName : useFetchState.ts
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-09-10 11:33:48
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */


import { useCallback, useEffect, useRef, useState } from 'react';
type SetStateAction<S> = S | ((prevState: S) => S);
type Dispatch<A> = (value: A) => void;

const useFetchState = <T = any>(props:T): [T, Dispatch<SetStateAction<T>>] => {
    const focus = useRef<boolean>();
    const [ state, setState ] = useState(props);

    useEffect(() => {
        focus.current = true;
        return () => {focus.current = false;};
    }, []);
    const setFetchState = useCallback((params: any) => {
        focus.current && setState(params);
    }, []);

    return [ state, setFetchState ];
};

export default useFetchState;
