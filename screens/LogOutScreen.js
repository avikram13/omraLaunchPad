import React, { Component } from 'react';
import {
	ScrollView,
	Text,
	View,
	Button
} from 'react-native';

import NavigationStateNotifier from './NavigationStateNotifier'

export default class Secured extends Component {
	constructor(props) {
			super(props);
			this._userLogin = this._userLogin.bind(this);
			//this.navigate = this.props.navigation.navigate;
			this.state = {
				// If you'd like to have an `activeScreen` state flag, you can. But you could do anything else you want really!
				activeScreen: true
				// ...
			}

			NavigationStateNotifier.newListener(
				this,
				() => {
					this.setState({activeScreen: true})
					// anything else that you'd like to do when this screen is navigated to
				},
				() => {
					this.setState({activeScreen: false})
					// anything else that you'd like to do when this screen is navigated off of
				}
			)
	}

	render() {
		return (
			<ScrollView style={{padding: 20}}>
				<Text
					style={{fontSize: 27}}>
					Welcome
				</Text>
				<View style={{margin:20}} />
				<Button
		            onPress={this.props.onLogoutPress}
		            title="Logout"
		        />
		    </ScrollView>
        )
	}
}
