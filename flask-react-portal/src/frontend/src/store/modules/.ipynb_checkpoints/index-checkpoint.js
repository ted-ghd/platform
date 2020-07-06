import { combineReducers } from 'redux';
import login from './login';
import counter from './counter';

export default combineReducers({
  login, counter
});