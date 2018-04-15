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

// import Environment from '../../Environment';

export default class Login extends React.Component {

    state = {
        username: '',
        password: '',
        isLoggingIn: false,
        message: ''
    }

    _userLogin = () => {

        this.setState({ isLoggingIn: true, message: '' });

        var params = {
            username: this.state.username,
            password: this.state.password,
            grant_type: 'password'
        };

        var formBody = [];
        for (var property in params) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(params[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");

        var proceed = false;
        this.setState({ isLoggingIn: false });
      //   fetch("https://"+Environment.CLIENT_API+"/oauth/token", {
      //           method: "POST",
      //           headers: {
      //               'Content-Type': 'application/x-www-form-urlencoded'
      //           },
      //           body: formBody
      //       })
      //       .then((response) => response.json())
      //       .then((response) => {
      //           if (response.status==200) proceed = true;
      //           else this.setState({ message: response.message });
      //       })
      //       .then(() => {
      //           this.setState({ isLoggingIn: false })
      //           if (proceed) this.props.onLoginPress();
      //       })
      //       .catch(err => {
			// 	this.setState({ message: err.message });
			// 	this.setState({ isLoggingIn: false })
			// });
    }

    clearUsername = () => {
        this._username.setNativeProps({ text: '' });
        this.setState({ message: '' });
    }

    clearPassword = () => {
        this._password.setNativeProps({ text: '' });
        this.setState({ message: '' });
    }



    render() {
      console.log(this.state.isLoggingIn);
        return (
            <ScrollView style={styles.loginScrollViewText} >
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
				{!!this.state.message && (
					<Text
						style={{fontSize: 14, color: 'red', padding: 5}}>
						{this.state.message}
					</Text>
				)}
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
	      </ScrollView>
        )
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
    fontWeight: 'bold',
    paddingTop: 80
  }
});
