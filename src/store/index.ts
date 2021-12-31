import { combineReducers, createStore } from 'redux';
import storageSession from 'redux-persist/lib/storage/session';
import { persistStore, persistReducer } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import { toggleCollapsed } from './common/collapsed'; // 控制左边侧边栏
import { langSwitch } from './common/language'; // 控制语言切换
import { menuTabsDispose } from './common/menuTabs';
import { toggleNews } from './common/news';
import { userInfo } from './common/user';

const mergeReucer = combineReducers({
    toggleCollapsed,
    langSwitch,
    menuTabsDispose,
    toggleNews,
    userInfo,
});

const persistConfig = {
    key: 'root',
    storage: storageSession,
    stateReconciler: autoMergeLevel2,
};

const persistedReducer = persistReducer(persistConfig, mergeReucer as any);

const store: any = createStore(persistedReducer);

const persistor = persistStore(store);

export {
    store,
    persistor,
};
