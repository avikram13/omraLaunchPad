import { combineReducers } from 'redux';
import ColorReducer from './ScreenReducer';
import NavReducer from './NavReducer';

const AppReducer = combineReducers({
  appScreen: ColorReducer,
  nav: NavReducer,
});

export default AppReducer;
