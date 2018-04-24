import { Notifications } from 'expo';
import React from 'react';
import { StackNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import registerForPushNotificationsAsync from '../api/registerForPushNotificationsAsync';

import { updateFocus, getCurrentRouteKey } from 'react-navigation-is-focused-hoc';

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
    console.log(this.props);
    return <RootStackNavigator
      screenProps={this.props}
      onNavigationStateChange={(prevState, currentState) => {
          updateFocus(currentState)
      }}
    />;
  }
}
