import React from 'react';
import { Platform, StatusBar, StyleSheet, View, AppRegistry } from 'react-native';
import { AppLoading, Asset, Font } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import RootNavigation from './navigation/RootNavigation';
import MainTabNavigator from './navigation/MainTabNavigator';

flags = {
  userLogInFlag:false
};

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  };

  constructor(props) {
        super(props);
        this.updateFlag  = this.updateFlag.bind(this);
        this.getFlagValue  = this.getFlagValue.bind(this);
        this.flags = {userLogInFlag:false}
    }

  // componentDidMount() {
  //             //Define some variable in your component
  //             this.flags = {userLogInFlag:false};
  // }

  updateFlag(_flagVal){
    console.log('updateFlag: ' + _flagVal);
    this.setState({userLogInFlag:_flagVal});
    this.flags.userLogInFlag = _flagVal;
    console.log('We pass argument from Child to Parent: ' + this.flags.userLogInFlag);
  }

  getFlagValue(){
    console.log('getFlagValue: ' + this.flags.userLogInFlag);
    return this.flags;
  }


  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
          <AppLoading
            startAsync={this._loadResourcesAsync}
            onError={this._handleLoadingError}
            onFinish={this._handleFinishLoading}
          />
      );
    } else {
      return (
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          <RootNavigation
            flags = {this.flags}
            updateFlag = {this.updateFlag.bind(this)}
            getFlagValue = {this.getFlagValue.bind(this)} />
        </View>
      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/robot-dev.png'),
        require('./assets/images/robot-prod.png'),
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
        'Herculanum-Regular': require('./assets/fonts/Herculanum-Regular.ttf'),
      }),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

AppRegistry.registerComponent('App', () => App);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
