import React from 'react';
import { Platform, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { StackNavigator, TabNavigator, TabBarBottom, addNavigationHelpers, AppRegistry } from 'react-navigation';
import { createStore, combineReducers } from 'redux';
import { connect } from 'react-redux';

import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import LoginFlow from './LoginFlow';


export default TabNavigator(
  {
    Login: {
      screen: LoginFlow,
    },
    WorkOrder: {
      screen: HomeScreen,
    },
    Review: {
      screen: LinksScreen,
    },
  },
  {

    navigationOptions: ({ navigation, screenProps}) => ({
      tabBarOnPress: (scene, jumpToIndex) => {
//          console.log('onPress:', scene.scene.index);
          scene.jumpToIndex(scene.scene.index);
        },
      tabBarIcon: ({ focused }) => {
        // console.log('Angesh Vikram');
        // console.log(navigation.state);
        // console.log(focused);
        const { routeName } = navigation.state;
        let iconName;
        switch (routeName) {
          case 'Login':
            // console.log('Login');
            iconName =
              Platform.OS === 'ios' ? `ios-options${focused ? '' : '-outline'}` : 'md-options';
              break;
          case 'WorkOrder':
            // console.log('WorkOrder');
            iconName =
              Platform.OS === 'ios'
                ? `ios-information-circle${focused ? '' : '-outline'}`
                : 'md-information-circle';
            break;
          case 'Review':
            iconName = Platform.OS === 'ios' ? `ios-link${focused ? '' : '-outline'}` : 'md-link';
        }

        return (
          <View >
            <Text > Omra </Text>
          </View>
        );
      },
    }),
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled: false,
    lazy: false,
    backBehavior:     'initialRoute',
    initialRouteName: 'Login',
  }, {
    initialRouteName: 'LoginFlow',
    mode: 'modal'
}
);
