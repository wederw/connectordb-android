'use strict';

global.Buffer = global.Buffer || require('buffer').Buffer;

import React, {Component} from 'react';
import {AppRegistry, Text} from 'react-native';

import {Provider} from 'react-redux'
import {createStore, applyMiddleware, combineReducers} from 'redux'
// dispatching from actions
import thunk from 'redux-thunk'

import {reducers} from './src/reducers/index';

import {getLoggers} from './src/actions/logger';

// App is the main component that sets up the app
import App from './src/app';

// Set up the redux state storage
import * as storage from 'redux-storage'
import createEngine from 'redux-storage-engine-reactnativeasyncstorage';

// Copy paste from https://github.com/michaelcontento/redux-storage
const reducer = storage.reducer(combineReducers(reducers));
const engine = createEngine("connectordb");
const storageMiddleware = storage.createMiddleware(engine);

let store = applyMiddleware(thunk, storageMiddleware)(createStore)(reducer);

storage.createLoader(engine)(store).then((loadedState) => {
    // This should not be shown in production builds
    // console.log(loadedState);
    store.dispatch(getLoggers());
});

class Connectordb extends Component {
    render() {
        return (
            <Provider store={store}>
                <App/>
            </Provider>
        );

    }
}

AppRegistry.registerComponent('connectordb_android', () => Connectordb);
