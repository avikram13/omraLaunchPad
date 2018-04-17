import React from 'react';
import {
    ScrollView,
    Text,
    TextInput,
    StyleSheet,
    View,
    Dimensions,
    Button,
    Alert,
    ActivityIndicator
} from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { StackNavigator } from 'react-navigation';

import { createStore, combineReducers } from 'redux';
import { connect } from 'react-redux';

import AppNavigator from '../navigation/MainTabNavigator';

// import Environment from '../../Environment';

export default class Login extends React.Component {

    state = {
        username: '',
        password: '',
        isLoggingIn: '',
        message: ''
    }

    constructor(props) {
        super(props);
        this._userLogin = this._userLogin.bind(this);
        //this.navigate = this.props.navigation.navigate;
    }

    _userLogin = () => {

        this.setState({ isLoggingIn: true, message: ('to omra '+this.state.username)});

        console.log(this.state.isLoggingIn);
        var params = {
            username: this.state.username,
            password: this.state.password,
            grant_type: 'password'
        };
        var proceed = false;
        this.setState({ isLoggingIn: true });

        this.props.screenProps.rootNavigation.navigate('WorkOrder');
    }

    clearUsername = () => {
        this._username.setNativeProps({ text: '' });
        this.setState({ message: '' });
    }

    clearPassword = () => {
        this._password.setNativeProps({ text: '' });
        this.setState({ message: '' });
    }

    clearLogOutUsername = () => {
        this.setState({ message: '' });
    }

    clearLogOutPassword = () => {
        this.setState({ message: '' });
    }

    _onLogoutPress = () => {

        this.setState({ isLoggingIn: false, message: 'LoggedIn' });

        this.clearLogOutUsername();
        this.clearLogOutPassword();
    }

    render() {
      const {navigate} = this.props;
        return (
          <ScrollView style={styles.loginScrollViewText} >
          {!this.state.message && (
          <KeyboardAwareScrollView>
          <View style={{ height: 80 }} />
            <Text
              style={styles.loginText}>
              Login:
            </Text>
            <View style={styles.loginInputView}>
              <TextInput
                style={styles.loginUserText}
                ref={component => this._username = component}
                placeholder='Username'
                onChangeText={(username) => this.setState({username})}
                autoFocus={true}
                onFocus={this.clearUsername}
              />
            </View>
            <View style={styles.loginInputView}>
            <TextInput
              style={styles.loginUserText}
              ref={component => this._password = component}
              placeholder='Password'
              onChangeText={(password) => this.setState({password})}
              secureTextEntry={true}
              onFocus={this.clearPassword}
              onSubmitEditing={this._userLogin}
            />
            </View>
            {this.state.isLoggingIn && <ActivityIndicator />}
            <View style={{margin:7}} />
            <View
            style={styles.loginSubmitBtnView}>
              <View style={{width:20}}/>
              <Button
                style={styles.loginSubmitBtn}
                disabled={this.state.isLoggingIn||!this.state.username||!this.state.password}
                onPress={this._userLogin}
                title="Submit"
              />
            </View>
            <View style={{ height: 60 }} />
            </KeyboardAwareScrollView>
            )}
            {!!this.state.message && (
              <View>
              <View style={{flex: 1, flexDirection: 'row'}}>
              <Text
                style={{flex: 0,fontSize: 27}}>
                Welcome
              </Text>
              <Text style={{flex: 1,fontSize: 17,paddingTop:10,marginLeft:5}}>{this.state.message}</Text>
              </View>
              <View style={styles.logOutSubmitBtnView}>
              <Button
                      style={styles.logOutSubmitBtnView}
                      onPress={this._onLogoutPress}
                      title="Logout"
                  />
              </View>
              </View>
            )}
            </ScrollView>
        );
    }
}

const getSize = () =>  {
  console.log('getSize :');
  console.log(Dimensions.get('window').width);
    return {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
    }
}
const styles = StyleSheet.create({
  loginText: {
    fontSize: 25,
    margin: 20,
    fontWeight: 'bold'
  },
  loginSubmitBtnView: {
    flexDirection: 'row-reverse',
  },
  loginSubmitBtn: {
    color: 'blue',
    fontWeight: 'bold'
  },
  logOutSubmitBtnView: {
    flexDirection: 'row-reverse',
  },
  logOutSubmitBtn: {
    color: 'blue',
    fontWeight: 'bold'
  },
  loginUserText: {
    fontSize: 15,
    marginBottom: 0,
    marginLeft: 0,
    fontWeight: 'bold',
    borderBottomColor: 'blue'
  },
  loginInputView: {
    borderBottomColor: 'blue',
    borderBottomWidth: 1,
    marginBottom: 15,
    marginLeft: 20,
    marginRight: 20,
  },
  loginScrollViewText: {
    width: getSize().width,
    padding: 20,
    paddingTop: 80
  }
});
