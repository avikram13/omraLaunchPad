import React from 'react';
import { Platform, StatusBar, StyleSheet, View, AppRegistry } from 'react-native';
import { AppLoading, Asset, Font } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import RootNavigation from './navigation/RootNavigation';
import MainTabNavigator from './navigation/MainTabNavigator';

flags = {
  userLogInFlag:false,
  userType:'',

};
scannedUrlData = {
  scannedUrl:'',
  response:'',
  workDetails:'',
  outageDesc:'',
  workOrderStatus:''
}

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  };
  constructor(props) {
        super(props);
        this.updateFlag  = this.updateFlag.bind(this);
        this.getFlagValue  = this.getFlagValue.bind(this);
        this.updateScannedUrlData  = this.updateScannedUrlData.bind(this);
        this.getScannedUrlData  = this.getScannedUrlData.bind(this);
        this.updateScannedUrlWorkOrderStatus = this.updateScannedUrlWorkOrderStatus.bind(this);
        this.flags = {userLogInFlag:false,userType:''};
        this.scannedUrlData = {scannedUrl:'',response:'',workDetails:'',outageDesc:'',workOrderStatus:''};

    }

  updateFlag(_flagVal,_flagType){
    console.log('updateFlag: ' + _flagVal);
    this.setState({userLogInFlag:_flagVal,userType:_flagType});
    this.flags.userLogInFlag = _flagVal;
    this.flags.userType = _flagType;
    console.log('We pass argument from Child to Parent: ' + this.flags.userLogInFlag);
  }

  getFlagValue(){
    console.log('getFlagValue: ' + this.flags.userLogInFlag);
    return this.flags;
  }

  updateScannedUrlData(_ScannedUrl,_response,_workDetails,_outageDesc){
    console.log('_ScannedUrl: ' + _ScannedUrl);
    this.setState({scannedUrl:_ScannedUrl});
    this.setState({_response:_response});
    this.setState({workDetails:_workDetails});
    this.setState({outageDesc:_outageDesc});
    this.scannedUrlData.scannedUrl = _ScannedUrl;
    this.scannedUrlData.response = _response;
    this.scannedUrlData.workDetails = _workDetails;
    this.scannedUrlData.outageDesc = _outageDesc;
    console.log('We pass argument from Child to Parent: ' + this.scannedUrlData.scannedUrl);
  }

  updateScannedUrlWorkOrderStatus(_workOrderStatus){
    console.log('_workOrderStatus: ' + _workOrderStatus);
    this.setState({workOrderStatus:_workOrderStatus});
    this.scannedUrlData.workOrderStatus = _workOrderStatus;
    console.log('We pass argument from Child to Parent: ' + this.scannedUrlData.scannedUrl);
  }

  getScannedUrlData(){
    console.log('getScannedUrlData: ' + this.scannedUrlData.scannedUrl);
    return this.scannedUrlData;
  }


  render() {
    console.log('Angesh');

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
            getFlagValue = {this.getFlagValue.bind(this)}
            scannedUrlData = {this.scannedUrlData}
            updateScannedUrlData = {this.updateScannedUrlData.bind(this)}
            updateScannedUrlWorkOrderStatus = {this.updateScannedUrlWorkOrderStatus.bind(this)}
            getScannedUrlData = {this.getScannedUrlData.bind(this)}
             />
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
