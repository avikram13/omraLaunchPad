import React from 'react';
import {
  Alert,
  Linking,
  LayoutAnimation,
  Image,
  Platform,
  ScrollView,
  Text,
  TextInput,
  Button,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback,
  InteractionManager,
  Dimensions,
  View,
} from 'react-native';

import PropTypes from 'prop-types';
import { BarCodeScanner, Permissions, WebBrowser,Constants, Location } from 'expo';
import { MonoText, HercText } from '../components/StyledText';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import TimeFormatter from 'minutes-seconds-milliseconds';
import Moment from 'moment';
import Api from '../api/Api';
import InlineImage from '../components/InlineImage.js';
import { RadioButtons } from 'react-native-radio-buttons';

export default class LinksScreen extends React.Component {
  static navigationOptions = {
    title: 'Review',
  };

  getSize() {
      return {
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height
      }
  }

  state = {
      refreshData: 1,
      getWorkOrder: '',
      message: '',
      isLoggedIn: false,
      workeOrederFetched: false,
      hasCameraPermission: null,
      lastScannedUrl: null,
      workOrderStatus: 'In Progress',
      isOtherSelected: false,
      OtherReasonText: '',
  }

  componentWillMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }
  }

  _getLocationAsync = async () => {
   let { status } = await Permissions.askAsync(Permissions.LOCATION);
   if (status !== 'granted') {
     this.setState({
       errorMessage: 'Permission to access location was denied',
     });
   }

   let location = await Location.getCurrentPositionAsync({});
   this.setState({ location });
  };

  constructor(props) {
      super(props);
  //    this._fetchWorkOrder = this._fetchWorkOrder.bind(this);
  this._updateReview = this._updateReview.bind(this);
  }

  refreshData(){
    if(this.state.refreshData > 100){
      this.state.refreshData = 0;
    }
    this.setState({refreshData: this.state.refreshData++});

    this.updateAllFlag();
  }


  updateAllFlag(){
    let initVal = {
        refreshData: 0,
    } /*true or false*/
    if(initVal.refreshData !== this.state.refreshData){
      this.state.refreshData = 1;
      this.state.getWorkOrder = '';
      this.state.message= '';
      this.state.isLoggedIn= false;
      //this.state.workeOrederFetched= false;
      this.state.hasCameraPermission= null;
      //this.state.lastScannedUrl= null;
    }
    return (<View></View>);
  }

  _updateReview = (_reason,_reviewNotes) => {

    if(this.props.screenProps.flags.userType == 'outageEngineer'){

      let text = 'Waiting..';

      if (this.state.location) {
        text = JSON.stringify(this.state.location);
      }

      console.log('location',text);

      let workorderNo = (this.props.screenProps.scannedUrlData.scannedUrl.split(':')[1]).replace(/\s/g, '');
      let updatedUrl = 'https://outage-management-service.run.aws-usw02-pr.ice.predix.io/workorder/' + workorderNo + '/review';

      _reviewNotes = '{"reveiw":'+_reviewNotes +',"location":'+text+'}';
      // var data = {
      //   "createdBy": 'Andrew Johnson',
      //   "reviewNotes": _reviewNotes
      // }

      var data = {
        "createdBy": 'Andrew Johnson',
        "reason":_reason,
        "notes":_reviewNotes
      }

      return fetch(updatedUrl, {
        method: "PUT",
        headers: { 'Accept': 'application/json','Content-Type': 'application/json',},
        body:  JSON.stringify(data)
      })
      .then(function(response){
        console.log(response);
        return response.json();
      });
    }
  }


  _reviewPositive(){

    this._updateReview('Happy and satisfied','{"review":"Happy and satisfied"}');
  }

  _reviewNeutral(){
    this._updateReview('Neutral','{"review":"Neutral"}');
  }

  _reviewNegative(){
    this._updateReview('Sad and not satisfied','{"review":"Sad and not satisfied"}');
  }

  _reviewOther(){
    this.setState({ isOtherSelected: true});
    this.state.isOtherSelected = true;
    //this._updateReview('Other','{"review":"Other"}');
  }

  _handleOtherSend(){
    this.setState({ isOtherSelected: false});
    this.state.isOtherSelected = false;
    this._updateReview('Other','{"review":"Other","notes":"'+this.state.OtherReasonText+'""}');
  }

  clearPauseRemarks(){
    this.setState({ OtherReasonText: ''});
    this.state.OtherReasonText = '';
  }

  _renderManagerWorkOrder(){

    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView>
          <View>
            <View>
              <Text style={styles.textright}>
                <InlineImage
                  style={styles.image}
                  source={require('../assets/images/Users-Checked-User-icon.png')}
                />
                <Text style={styles.homeScreenTitleTexts}>Andrew Johnson
                </Text>
              </Text>
            </View>
            <Text style={styles.homeScreenTitleTexts}>
                Outage Number: <Text style={styles.homeScreenTexts}>{this.props.screenProps.scannedUrlData.outageDesc}</Text>
            </Text>
            <Text style={styles.homeScreenWOTitleTexts}>
                Workorder Number: <Text style={styles.homeScreenTexts}>{this.props.screenProps.scannedUrlData.workDetails}</Text>
            </Text>
            <View>
              <Text style={styles.homeScreenWSTexts}>
                Current Status: <Text style={styles.homeScreenTexts}>{this.props.screenProps.scannedUrlData.workOrderStatus}</Text>
              </Text>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }

  _renderWorkOrder(){
    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView>
          <View>
            <View>
              <Text style={styles.textright}>
                <InlineImage
                  style={styles.image}
                  source={require('../assets/images/Users-Checked-User-icon.png')}
                />
                <Text style={styles.homeScreenTitleTexts}>Andrew Johnson
                </Text>
              </Text>
            </View>
            <Text style={styles.homeScreenTitleTexts}>
                Outage Number: <Text style={styles.homeScreenTexts}>{this.props.screenProps.scannedUrlData.outageDesc}</Text>
            </Text>
            <Text style={styles.homeScreenWOTitleTexts}>
                Workorder Number: <Text style={styles.homeScreenTexts}>{this.props.screenProps.scannedUrlData.workDetails}</Text>
            </Text>
            <View>
              <Text style={styles.homeScreenWSTexts}>
                Current Status: <Text style={styles.homeScreenTexts}>{this.props.screenProps.scannedUrlData.workOrderStatus}</Text>
              </Text>
            </View>
            <View>
              <View style={{margin:10}}>
                <Text>
                  Kindly share your feedback and recommendations:
                </Text>
              </View>
              <View style={{flex: 1,flexDirection: 'row'}}>
                <View style={styles.reviewIconBtn}>
                  <View style={{flex: 1,flexDirection: 'row'}}>
                    <TouchableOpacity onPress={this._reviewPositive.bind(this)}>
                      <InlineImage
                        style={styles.reviewImage}
                        source={require('../assets/images/Positive-icon.png')}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this._reviewPositive.bind(this)}>
                      <View style={{marginTop:15, marginRight:10}}>
                        <Text style={styles.reviewTexts}>Happy and satisfied
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.reviewIconBtn}>
                  <View style={{flex: 1,flexDirection: 'row',marginLeft:15}}>
                    <TouchableOpacity onPress={this._reviewNeutral.bind(this)}>
                      <InlineImage
                        style={styles.reviewImage}
                        source={require('../assets/images/Neutral-icon.jpeg')}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this._reviewNeutral.bind(this)}>
                      <View style={{marginTop:15}}>
                        <Text style={styles.reviewTexts}>Neutral
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View style={{flex: 1,flexDirection: 'row'}}>
                <View style={styles.reviewIconBtn}>
                  <View style={{flex: 1,flexDirection: 'row'}}>
                    <TouchableOpacity onPress={this._reviewNegative.bind(this)}>
                      <InlineImage
                        style={styles.reviewImage}
                        source={require('../assets/images/Negative-icon.png')}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this._reviewNegative.bind(this)}>
                      <View style={{marginTop:15, marginRight:10}}>
                        <Text style={styles.reviewTexts}>Sad and not satisfied
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.reviewIconBtn}>
                  <View style={{flex: 1,flexDirection: 'row',marginLeft:15}}>
                    <TouchableOpacity onPress={this._reviewOther.bind(this)}>
                      <InlineImage
                        style={styles.reviewImage}
                        source={require('../assets/images/other_icon.png')}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this._reviewOther.bind(this)}>
                      <View style={{marginTop:15}}>
                        <Text style={styles.reviewTexts}>Other
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View>
                {!!(this.state.isOtherSelected) && (
                  <View>
                    <KeyboardAwareScrollView >
                      <View>
                        <View style={{marginTop: 20}}>
                          <TextInput
                            style={styles.pauseReasonTextStyle}
                            placeholder='Reason'
                            multiline={true}
                            numberOfLines={4}
                            onChangeText={(OtherReasonText) => this.setState({OtherReasonText})}
                            value={this.state.OtherReasonText}
                            autoFocus={true}
                            onFocus={this.clearOtherRemarks}
                          />
                        </View>
                        <View >
                          <View style={styles.PauseContinueBtn}>
                            <Button
                              title="Send"
                              color='white'
                              onPress={this._handleOtherSend.bind(this)}
                            />
                          </View>
                        </View>
                      </View>
                    </KeyboardAwareScrollView>
                  </View>
                )}
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }

  render() {
    // If dimensions is defined, render the real view otherwise the dummy view

    console.log('this.props.screenProps.scannedUrlData',this.props.screenProps.scannedUrlData);
    //this.setState({workOrderStatus: 'In Progress'});
    //this.props.screenProps.scannedUrlData.workOrderFetchedFlag
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View>
            <View>
              <Image
                style={{width: this.getSize().width, height: 85, marginTop:-30}}
                source={require('../assets/images/blueLogo.png')}
              />
              <View style={styles.topBarInfoContainer}>
              {!!this.props.screenProps.flags.userLogInFlag && (
                <View>
                  {!!(this.props.screenProps.flags.userType == 'outageEngineer') && (
                    <View>
                      {!!this.props.screenProps.scannedUrlData.workOrderFetchedFlag && (
                        <View>
                          {this._renderWorkOrder()}
                        </View>
                      )}
                      {!this.props.screenProps.scannedUrlData.workOrderFetchedFlag && (
                        <View>
                          <Text
                            style={{flex: 0,fontSize: 27, marginLeft: 30}}>
                              You need to scan the workorder in WorkOrder tab
                          </Text>
                        </View>
                      )}
                    </View>
                  )}
                  {!!(this.props.screenProps.flags.userType == 'outageManager') && (
                    <View>
                      {!!this.props.screenProps.scannedUrlData.workOrderFetchedFlag && (
                        <View>
                          {this._renderWorkOrder()}
                        </View>
                      )}
                      {!this.props.screenProps.scannedUrlData.workOrderFetchedFlag && (
                        <View>
                          <Text
                            style={{flex: 0,fontSize: 27, marginLeft: 30}}>
                              You need to scan the workorder in WorkOrder tab
                          </Text>
                        </View>
                      )}
                    </View>
                  )}
                </View>
              )}
              {!this.props.screenProps.flags.userLogInFlag && (
                <KeyboardAwareScrollView>
                  {this.updateAllFlag()}
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
          </View>
        </ScrollView>
        <View style={styles.tabBarInfoContainer}>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  pauseReasonTextStyle:{
    borderWidth: 2,
    height: 60,
    marginLeft: 5,
    marginRight: 5,
  },
  scanBtn:{
    margin: 5,
    marginTop: -15,
    backgroundColor: '#00AAFF',
    width: (Dimensions.get('window').width - 10),
    borderRadius: 5,
  },
  PauseContinueBtn:{
    margin: 5,
    backgroundColor: '#00AAFF',
    width: ((Dimensions.get('window').width/2)-10),
    borderRadius: 5,
  },
  PauseCancleBtn:{
    margin: 5,
    backgroundColor: '#00AAFF',
    width: ((Dimensions.get('window').width/2)-10),
    borderRadius: 5,
  },
  reviewIconBtn:{
    margin: 5,
    alignSelf:'flex-start',
    width: ((Dimensions.get('window').width/2)-10),
    height: 40,
  },
  continueBtn:{
    backgroundColor: '#00AAFF',
    alignSelf: 'center',
    width: Dimensions.get('window').width/3,
    borderRadius: 5,
  },
  blockageBtn:{
    backgroundColor: 'red',
    alignSelf: 'center',
    width: Dimensions.get('window').width/3,
    borderRadius: 5,
  },
  DoneBtn:{
    marginTop: 20,
    backgroundColor: '#00AAFF',
    alignSelf: 'center',
    width: Dimensions.get('window').width/2,
    borderRadius: 5,
  },
  pauseTimerImage:{
    justifyContent : 'space-between',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  homeScreenPlayImage:{
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 0,
    marginTop:0,
    top:40,
  },
  homeScreenPTimeImage:{
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 40,
    marginTop:-30,
    top:50,
  },
  homeScreenWTimeImage:{
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 40,
    marginTop:-30,
    top:-30,
    right: 30,
  },
  blockedImage:{
    width: 120,
    height: 120,
    alignSelf:'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  PlayImage:{
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  Pauseimage:{
    backgroundColor: 'white',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 10,
    height: 10,
  },
  reviewImage: {
    width: 40,
    height: 40,
    marginLeft:10,
  },
  textright: {
    alignSelf: 'flex-end',
    marginRight: 10,
  },
  homeScreenTexts:{
    fontSize: 14,
    fontWeight: 'normal'
  },
  homeScreenWOTitleTexts:{
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 20,
    marginLeft: 5,
  },
  homeScreenTitleTexts:{
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft:5,
  },
  reviewTexts:{
    color:'blue',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft:5,
  },
  homeScreenWSTexts:{
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'center',
  },
  homeScreenWSTitleTexts:{
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    alignSelf: 'center',
  },
  timerWrapperInner:{
    borderWidth: 0.5,
    alignSelf: 'center'
  },
  mainTimer:{
    fontSize: 60,
    fontWeight: '100',
    alignSelf: 'flex-end',
  },
  startBtn:{
    color: 'green',
  },
  stopBtn: {
    color: 'red',
  },
  buttonWrapper:{
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 15,
    paddingBottom: 30,
  },
  timerButton:{
      height: 80,
      width: 80,
      borderRadius: 40,
      backgroundColor: '#fff',
      justifyContent: 'center',
      alignItems: 'center',
  },
  header: {
    borderBottomWidth: 0.5,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#fff',
  },
  title: {
    alignSelf: 'center',
    fontWeight: '600',
  },
  top:{
    flex:1,
  },
  bottom: {
    flex:2,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  getWorkOrderBtnView: {
    backgroundColor: '#00AAFF',
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
  homeScreenBTimeTexts:{
    color: '#808080',
    left: -50,
    alignSelf: 'center',
  },
  homeScreenITimeTexts:{
    color: '#808080',
    marginTop: 15,
    left: -65,
    alignSelf: 'center',
  },
  homeScreenWTimeTexts:{
    color: '#808080',
    marginLeft: 30,
  },
  homeScreenIdleTimerTexts:{
    fontSize: 44,
    fontWeight: 'bold',
    marginBottom:20,
    alignSelf: 'center',
  },
  homeScreenITimerTexts:{
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 30,
    marginBottom:20,
  },
  homeScreenWTimerTexts:{
    fontSize: 44,
    fontWeight: 'bold',
    marginLeft: 30,
    marginBottom:20,
  },
  topBarInfoContainer: {
    position: 'absolute',
    top: 63,
    left: 0,
    right: 0,
    paddingTop:10,
    paddingBottom:20,
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
    backgroundColor: '#ffff',
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
  container_view: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 15,
    flexDirection: 'row',
  },
  url: {
    flex: 1,
  },
  urlText: {
    color: '#fff',
    fontSize: 20,
  },
  cancelButton: {
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 18,
  },
});
