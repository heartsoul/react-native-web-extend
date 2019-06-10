/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule BackHandler
 */

import { TouchableOpacity } from 'react-native';
import { DeviceEventEmitter } from '../DeviceEventEmitter';

const DEVICE_BACK_EVENT = 'hardwareBackPress';

// eslint-disable-next-line no-underscore-dangle
const _backPressSubscriptions = new Set();

// eslint-disable-next-line import/prefer-default-export
export function pushHistory(path) {
  if (!path) {
    // eslint-disable-next-line no-param-reassign
    path = 'index';
  }
  const state = {
    title: 'title',
    url: `#${path}`,
  };
  window.history.pushState(state, '', `#${path}`);
}
function extends3rd() {
  const oldtouchableHandlePress = TouchableOpacity.prototype.touchableHandlePress;
  TouchableOpacity.prototype.touchableHandlePress = (event) => {
    event.preventDefault();
    // eslint-disable-next-line no-unused-expressions
    oldtouchableHandlePress && oldtouchableHandlePress(event);
  };
  // setAttribute
}
function bindGlobalBack() {
  window.onload = () => {
    pushHistory();
    extends3rd();
  };

  window.addEventListener('popstate', (evt) => {
    evt.preventDefault();
    DeviceEventEmitter.emit(DEVICE_BACK_EVENT, { event: evt });
    // alert("我监听到了浏览器的返回按钮事件啦");
    // 根据自己的需求实现自己的功能
  }, false);
}

DeviceEventEmitter.addListener(DEVICE_BACK_EVENT, () => {
  let invokeDefault = true;
  const subscriptions = Array.from(_backPressSubscriptions.values()).reverse();

  for (let i = 0; i < subscriptions.length; i += 1) {
    if (subscriptions[i]()) {
      invokeDefault = false;
      break;
    }
  }

  if (invokeDefault) {
    // 没有阻止的地方，这里应该直接退出应用了。
    BackHandler.exitApp(); //
  } else {
    pushHistory(); // 增加浏览器浏览历史，达到不能回退的目的
  }
});

bindGlobalBack();
/**
 * Detect hardware button presses for back navigation.
 *
 * Android: Detect hardware back button presses, and programmatically invoke the default back button
 * functionality to exit the app if there are no listeners or if none of the listeners return true.
 *
 * tvOS: Detect presses of the menu button on the TV remote.  (Still to be implemented:
 * programmatically disable menu button handling
 * functionality to exit the app if there are no listeners or if none of the listeners return true.)
 *
 * iOS: Not applicable.
 *
 * The event subscriptions are called in reverse order (i.e. last registered subscription first),
 * and if one subscription returns true then subscriptions registered earlier will not be called.
 *
 * Example:
 *
 * ```javascript
 * BackHandler.addEventListener('hardwareBackPress', function() {
 *  // this.onMainScreen and this.goBack are just examples,
 *  // you need to use your own implementation here
 *  // Typically you would use the navigator here to go to the last state.
 *
 *  if (!this.onMainScreen()) {
 *    this.goBack();
 *    return true;
 *  }
 *  return false;
 * });
 * ```
 */
const BackHandler = {

  exitApp() {
    // DeviceEventManager.invokeDefaultBackPressHandler();
    window.history.back();
  },

  /**
   * Adds an event handler. Supported events:
   *
   * - `hardwareBackPress`: Fires when the Android hardware back button is pressed or when the
   * tvOS menu button is pressed.
   */
  addEventListener(
    eventName,
    handler,
  ) {
    _backPressSubscriptions.add(handler);
    return {
      remove: () => BackHandler.removeEventListener(eventName, handler),
    };
  },

  /**
   * Removes the event handler.
   */
  removeEventListener(
    eventName,
    handler,
  ) {
    _backPressSubscriptions.delete(handler);
  },

};

module.exports = BackHandler;
