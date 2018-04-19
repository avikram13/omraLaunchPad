import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  Button,
  TouchableOpacity,
  InteractionManager,
  Dimensions,
  View,
} from 'react-native';
import { WebBrowser } from 'expo';

import { MonoText, HercText } from '../components/StyledText';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Work Order',
  };

  state = {
      getWorkOrder: '',
      workOrderStatus: '',
      message: '',
      isLoggedIn: false
  }

  constructor(props) {
    console.log('Home Screen =============>');
      super(props);
      this._fetchWorkOrder = this._fetchWorkOrder.bind(this);
      //this.navigate = this.props.navigation.navigate;
  }

// static getDerivedStateFromProps(nextProps, prevState){
//   console.log('Home Screen =============>');
//   return null;
// }

componentDidUpdate(){
  // console.log('Home Screen  componentDidUpdate =============>');
  // console.log('Home Screen  componentDidUpdate =============>');
  // console.log('getFlagValue: ' + this.props.screenProps.getFlagValue());
  // console.log(this.props.screenProps.flags.userLogInFlag);

  // InteractionManager.runAfterInteractions(() => {
  //           this.setState({ isLoggedIn: this.props.screenProps.getFlagValue() });
  // });
}

  // componentWillReceiveProps(nextProps){
  //   console.log('Angesh =============>');
  //   console.log(nextProps.screenProps.flags.userLogInFlag);
  //   if(nextProps.screenProps.flags.userLogInFlag !== this.props.screenProps.flags.userLogInFlag){
  //     this.setState({isLoggedIn:nextProps.screenProps.flags.userLogInFlag});
  //   }
  // }

  _fetchWorkOrder = () => {

    this.setState({ getWorkOrder: 'fetch Work Order' });
  }

  getSize() {
      return {
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height
      }
  }

  render() {
    console.log('Home Screen render =============>');
    // If dimensions is defined, render the real view otherwise the dummy view
    //this.setState({ isLoggedIn: this.props.screenProps.flags.userLogInFlag});
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View>
          <View>
          <Image
            style={{width: this.getSize().width, height: 85, marginTop:-30}}
            source={require('../assets/images/Logo_LaunchPad.png')}
          />
          <View style={styles.welcomeContainer}>
            <HercText style={styles.omraText}>Omra</HercText>
            <HercText style={styles.omraTagText}>(perfection can only be achieved by accurate review system)</HercText>
          </View>
          {!!this.props.screenProps.flags.userLogInFlag && (
          <KeyboardAwareScrollView>
            <View>
              <View style={styles.getWorkOrderBtnView}>
              <Button
                    style={styles.getWorkOrderBtn}
                    onPress={this._fetchWorkOrder}
                    title="scan WorkOrder"
                    color='white'
                    fontWeight='bold'
                />
              </View>
            </View>
            </KeyboardAwareScrollView>
          )}
          {!this.props.screenProps.flags.userLogInFlag && (
          <KeyboardAwareScrollView>
            <View>
            <Text
              style={{flex: 0,fontSize: 27, marginLeft: 30}}>
              You need to log in:
            </Text>
            </View>
            </KeyboardAwareScrollView>
          )}
          </View>
          </View>
        </ScrollView>
        <View style={styles.tabBarInfoContainer}>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  getWorkOrderBtnView: {
    backgroundColor: 'blue',
  },
  getWorkOrderBtn: {
    color: 'blue',
    fontWeight: 'bold'
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  omraText: {
    fontWeight: 'bold',
    color: 'blue',
    fontSize: 80
  },
  omraTagText: {
    color: 'blue',
    fontSize: 10,
    marginTop: -14,
    bottom: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    backgroundColor: '#fbfbfb',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 2,
  },
});
