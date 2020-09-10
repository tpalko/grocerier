'use strict';

import { applyMiddleware, compose, createStore, Store } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import DevTools from '../components/DevTools';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';
import { IInventory } from '../state';
import { History } from 'history';

const isProd = process.env.NODE_ENV === 'production';

export default function configureStore(preloadedState: IInventory, history: History): Store<IInventory> {
    let enhancer: any;
    if (isProd) {
        enhancer = compose(
            applyMiddleware(routerMiddleware(history), thunk)
        );
    } else {
        /* istanbul ignore if */
        if (typeof(window) !== 'undefined' && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
            enhancer = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(
                applyMiddleware(routerMiddleware(history), thunk)
            );
        } else {
            enhancer = compose(
                applyMiddleware(routerMiddleware(history), thunk), DevTools.instrument() as any
            );
        }
    }
    const store: Store<IInventory> = createStore(
        rootReducer,
        preloadedState,
        enhancer
    );

    /* istanbul ignore next */
    if ((module as any).hot) {
        (module as any).hot.accept('../reducers', () => {
            store.replaceReducer(require('../reducers').rootReducer);
        });
    }

    return store;
}
