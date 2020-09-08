'use strict';

import * as React from 'react';
import { Component, Provider, Store } from 'react-redux';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import createBrowserHistory from 'history/createBrowserHistory';
import configureStore from './store/configureStore';
import DevTools from './components/DevTools';
import Counter from './components/counter';
import Inventory from './components/inventory';
import 'font-awesome/less/font-awesome.less';
import 'ionicons/dist/css/ionicons.css';
import { IInventory } from './state';
import es6Promise = require('es6-promise');
import RedBox from 'redbox-react';

es6Promise.polyfill();

const preloadedState: IInventory = (window as any).__PRELOADED_STATE__;
const history: any = createBrowserHistory();
const store: Store<IInventory> = configureStore(preloadedState, history);
const rootElement: Element = document.getElementById('root');
const devToolsElement: Element = document.getElementById('devTools');

const isDev = process.env.NODE_ENV === 'dev';

let render = () => {
    const App: Component<any> = require('../client/components/inventory').default;
    ReactDOM.render(
        <Provider store={store}>
            <div>
                <AppContainer>
                    <Inventory/>
                </AppContainer>
            </div>
        </Provider>,
        rootElement
    );
    if (isDev && !(window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
        ReactDOM.render(
            <Provider store={store}>
                <DevTools/>
            </Provider>,
            devToolsElement
        );
    }
};

if (isDev) {
    if ((module as any).hot) {
        // Support hot reloading of components and display an overlay for runtime errors
        const renderApp: () => void = render;
        const renderError: (error: Error) => void = (error: Error) => {
            ReactDOM.render(
                <RedBox error={error}/>,
                rootElement
            );
        };

        render = () => {
            try {
                renderApp();
            } catch (error) {
                renderError(error);
            }
        };

        (module as any).hot.accept('../client/components/inventory', () => {
            setTimeout(render);
        });
    }
}

render();
