import { Notifications } from 'expo';
import React from 'react';
import { StackNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import registerForPushNotificationsAsync from '../api/registerForPushNotificationsAsync';

import { updateFocus, getCurrentRouteKey } from 'react-navigation-is-focused-hoc'

const RootStackNavigator = StackNavigator(
  {
    Main: {
      screen: MainTabNavigator,
    },
  },
  {
    navigationOptions: () => ({
      headerTitleStyle: {
        fontWeight: 'normal',
      },
    }),
  }
);

export default class RootNavigator extends React.Component {

  constructor(props)  {
          super(props);
      }

  render() {
    return <RootStackNavigator screenProps={{ rootNavigation: this.props.navigation }}
      onNavigationStateChange={(prevState, currentState) => {
          // If you want to ignore the state changed from `DrawerNavigator`, use this:
          /*
            if (/^Drawer(Open|Close|Toggle)$/.test(getCurrentRouteKey(currentState)) === false) {
              updateFocus(currentState)
              return
            }
          */
          updateFocus(currentState)
      }}
    />;
  }
}
