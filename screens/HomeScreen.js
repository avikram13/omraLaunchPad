import React from 'react';
import {
  Alert,
  Linking,
  LayoutAnimation,
  Image,
  Platform,
  ScrollView,
  Text,
  Button,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  InteractionManager,
  Dimensions,
  View,
} from 'react-native';

import { BarCodeScanner, Permissions, WebBrowser } from 'expo';

import { MonoText, HercText } from '../components/StyledText';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import TimeFormatter from 'minutes-seconds-milliseconds';

import Moment from 'moment';

import Api from '../api/Api';

import InlineImage from '../components/InlineImage.js'

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Work Order',
  };


getWorkOrderData () {
  return (  {
    outageNumber: 'testOutage123',
    outageUuid: 'f166c51a-4543-11e8-842f-0ed5f89f718b',
    workOrderNumber: 'teatWorkOrder123',
    workOrderUuid: '14b4df70-4544-11e8-842f-0ed5f89f718b',
    workOrderStatus: 'Created',
    workOrderSLA: '10:00:00',
    workOrderStartTime: '10:00:00',
    updateTime:'',
    createdBy:'',
    assignedTo: 'Angesh',
    notes: ''
  }
);
}
  state = {
      getWorkOrder: '',
      workOrderDetails: this.getWorkOrderData(),
      workOrderStatus: '',
      message: '',
      isLoggedIn: false,
      workeOrederFetched: true,
      hasCameraPermission: null,
      lastScannedUrl: null,
      isRunning: false,
      mainTimer: null,
      mainTime: null,
      totalIdelTimer: null,
      totalIdelTime: null,
      idelTimer: null,
      idelTime: null,
      totalTimer: null,
      totalTime: null,
      StartTimer: null,
      firstTime: false,
      mainTimerStart: null,
  }

  constructor(props) {
      super(props);
      this._fetchWorkOrder = this._fetchWorkOrder.bind(this);
      //this.navigate = this.props.navigation.navigate;
  }


  _fetchWorkOrder = () => {
    console.log("Angesh ");
    console.log(this.state.lastScannedUrl);
    Api.getItems('https://rallycoding.herokuapp.com/api/music_albums')
   .then((response) => {
     console.log("After Call Angesh ");
     console.log(response);
     response = JSON.stringify(getWorkOrderData());
     this.state.workOrderDetails = response;
     console.log(response);
     this.setState({ workeOrederFetched: true });
   }).catch((error) => {
                console.log(error);
    });
    //this.setState({ getWorkOrder: 'fetch Work Order' });
  }

  _fetchMyWorkOrder = () => {

    console.log(this.state.lastScannedUrl);
    //this.setState({ getWorkOrder: 'fetch Work Order' });
  }

  getSize() {
      return {
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height
      }
  }


  componentDidMount() {
    this._requestCameraPermission();
  }

  _requestCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === 'granted',
    });
  };

  _handleBarCodeRead = result => {
    if (result.data !== this.state.lastScannedUrl) {
      LayoutAnimation.spring();
      this.setState({ lastScannedUrl: result.data });
    }
  };

    _getTime() {
    var currentTime = Moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    console.log(dateTime);
    return dateTime ;
 }

  toHHMMSS (_seconds) {
    var sec_num = parseInt(_seconds, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+':'+minutes+':'+seconds;
  }

  handlePause(){

        let { isRunning , firstTime, mainTimer , startTimer} = this.state;

         if(!this.state.firstTime) { // first time
           // we need to save key for the next time
           this.setState({firstTime: true});
           this.setState({startTimer: new Date()});
         }


        // //      this.setState({ isRunning: !isRunning });
        // if(isRunning){
        //   clearInterval(this.interval);
        //   this.setState({ isRunning: false });
        //
        //   var end = Moment.utc(new Date());
        //   var start = Moment.utc(this.state.mainTimerStart);
        //
        //   var diff = Moment(end).unix() - Moment(start).unix();
        //   this.setState({ mainTime: (diff + this.state.mainTime)});
        //
        //   this.idelInterval = setInterval (() => {
        //
        //     // Main
        //     var end = Moment.utc(new Date());
        //     var start = Moment.utc(this.state.startTimer);
        //
        //     var totalTimeDiff = Moment(end).unix() - Moment(start).unix();
        //     this.setState({ totalTime: totalTimeDiff});
        //     this.setState({ totalTimer: this.toHHMMSS(totalTimeDiff) });
        //
        //      var idelTimeDiff = totalTimeDiff - this.state.mainTime;
        //      this.setState({ totalIdelTimer: idelTimeDiff});
        //      this.setState({ idelTimer: this.toHHMMSS(idelTimeDiff) });
        //
        //   },1000);
        //
        // }
        // else{
          clearInterval(this.idelInterval);
          this.setState({
            mainTimerStart: new Date(),
            isRunning: true
           });

          this.interval = setInterval (() => {

            // Main
            var end = Moment.utc(new Date());
            var start = Moment.utc(this.state.mainTimerStart);
            var startT = Moment.utc(this.state.startTimer);

            var totalTimeDiff = Moment(end).unix() - Moment(startT).unix();
            this.setState({ totalTime: totalTimeDiff});
            this.setState({ totalTimer: this.toHHMMSS(totalTimeDiff) });

            var currentTimediff = Moment(end).unix() - Moment(start).unix();
            currentTimediff = currentTimediff + this.state.mainTime;
            this.setState({ mainTimer: this.toHHMMSS(currentTimediff) });

             var idelTimeDiff = totalTimeDiff - currentTimediff;
             this.setState({ totalIdelTimer: idelTimeDiff});
             this.setState({ idelTimer: this.toHHMMSS(idelTimeDiff) });

          },1000);
        // }
    }

    handlePlay(){

          let { isRunning , firstTime, mainTimer , startTimer} = this.state;

           if(!this.state.firstTime) { // first time
             // we need to save key for the next time
             this.setState({firstTime: true});
             this.setState({startTimer: new Date()});
           }


          // //      this.setState({ isRunning: !isRunning });
          // if(isRunning){
            clearInterval(this.interval);
            this.setState({ isRunning: false });

            var end = Moment.utc(new Date());
            var start = Moment.utc(this.state.mainTimerStart);

            var diff = Moment(end).unix() - Moment(start).unix();
            this.setState({ mainTime: (diff + this.state.mainTime)});

            this.idelInterval = setInterval (() => {

              // Main
              var end = Moment.utc(new Date());
              var start = Moment.utc(this.state.startTimer);

              var totalTimeDiff = Moment(end).unix() - Moment(start).unix();
              this.setState({ totalTime: totalTimeDiff});
              this.setState({ totalTimer: this.toHHMMSS(totalTimeDiff) });

               var idelTimeDiff = totalTimeDiff - this.state.mainTime;
               this.setState({ totalIdelTimer: idelTimeDiff});
               this.setState({ idelTimer: this.toHHMMSS(idelTimeDiff) });

            },1000);

          // }
          // else{
          //   clearInterval(this.idelInterval);
          //   this.setState({
          //     mainTimerStart: new Date(),
          //     isRunning: true
          //    });
          //
          //   this.interval = setInterval (() => {
          //
          //     // Main
          //     var end = Moment.utc(new Date());
          //     var start = Moment.utc(this.state.mainTimerStart);
          //     var startT = Moment.utc(this.state.startTimer);
          //
          //     var totalTimeDiff = Moment(end).unix() - Moment(startT).unix();
          //     this.setState({ totalTime: totalTimeDiff});
          //     this.setState({ totalTimer: this.toHHMMSS(totalTimeDiff) });
          //
          //     var currentTimediff = Moment(end).unix() - Moment(start).unix();
          //     currentTimediff = currentTimediff + this.state.mainTime;
          //     this.setState({ mainTimer: this.toHHMMSS(currentTimediff) });
          //
          //      var idelTimeDiff = totalTimeDiff - currentTimediff;
          //      this.setState({ totalIdelTimer: idelTimeDiff});
          //      this.setState({ idelTimer: this.toHHMMSS(idelTimeDiff) });
          //
          //   },1000);
          // }
      }

  // End Timer

  updateAllFlag(){

    clearInterval(this.interval);
    clearInterval(this.idelInterval);
    console.log("==============> clear all Flags");
    let initVal = {
        getWorkOrder: '',
        workOrderDetails: this.getWorkOrderData(),
        workOrderStatus: '',
        message: '',
        isLoggedIn: false,
        workeOrederFetched: true,
        hasCameraPermission: null,
        lastScannedUrl: null,
        isRunning: false,
        mainTimer: null,
        mainTime: null,
        totalTimer: null,
        totalTime: null,
        StartTimer: null,
        firstTime: false,
        mainTimerStart: null,
    } /*true or false*/
    if(initVal.totalTimer !== this.state.totalTimer){
      this.state.getWorkOrder = '';
      this.state.workOrderDetails = this.getWorkOrderData();
      this.state.workOrderStatus= '';
      this.state.message= '';
      this.state.isLoggedIn= false;
      this.state.workeOrederFetched= true;
      this.state.hasCameraPermission= null;
      this.state.lastScannedUrl= null;
      this.state.isRunning= false;
      this.state.mainTimer= null;
      this.state.mainTime= null;
      this.state.totalTimer= null;
      this.state.totalTime= null;
      this.state.StartTimer= null;
      this.state.firstTime= false;
      this.state.mainTimerStart= null;
      this.state.totalIdelTimer= null;
      this.state.totalIdelTime= null;
      this.state.idelTimer= null;
      this.state.idelTime= null;

    }
    return (<View></View>);
  }

_renderWorkOrder(){
  return (
    <View style={styles.container}>
      <View>
        <View>
          <Text style={styles.textright}>
            <InlineImage
              style={styles.image}
              source={require('../assets/images/Users-Checked-User-icon.png')}
            />
            <Text style={styles.homeScreenTitleTexts}>Angesh Vikram
            </Text>
          </Text>
        </View>
        <Text style={styles.homeScreenTitleTexts}>
            Outage Number: <Text style={styles.homeScreenTexts}>{this.state.workOrderDetails.outageNumber}</Text>
        </Text>
        <Text style={styles.homeScreenWOTitleTexts}>
            Workorder Number: <Text style={styles.homeScreenTexts}>{this.state.workOrderDetails.workOrderNumber}</Text>
        </Text>
        <Text style={styles.homeScreenWSTitleTexts}>
            Work started at {Moment(this.state.startTimer).format('H:mm:ss').toString()} on ({Moment(this.state.startTimer).format('DD/MM/YYYY').toString()})
        </Text>
        {!!this.state.isRunning && (
          <View>
            <View>
              <Text style={styles.homeScreenWTimeTexts}>
                Wrench Time
              </Text>
              <View style={styles.pauseTimerImage}>
                <Text style={styles.homeScreenWTimerTexts}>
                  <Text >{this.state.mainTimer || '00:00:00'}</Text>
                </Text>
                <View style={styles.homeScreenWTimeImage}>
                  <TouchableOpacity onPress={this.handlePlay.bind(this)}>
                    <InlineImage
                      style={styles.Pauseimage}
                      source={require('../assets/images/pause.png')}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View>
              <Text style={styles.homeScreenWTimeTexts}>
                Idle Time
              </Text>
              <Text style={styles.homeScreenITimerTexts}>
                <Text >{this.state.idelTimer || '00:00:00'}</Text>
              </Text>
            </View>
            <View>
              <View style={styles.blockageBtn}>
                <Button
                  title="! BLOCKED"
                  color='white'
                  onPress={this._fetchMyWorkOrder}
                />
              </View>
              <View style={styles.DoneBtn}>
                <Button
                  title="Done"
                  color='white'
                  onPress={this._fetchMyWorkOrder}
                />
              </View>
            </View>
          </View>
        )}
        {!this.state.isRunning && (
          <View>
            <View>
              <Text style={styles.homeScreenITimeTexts}>
                Idel Timer
              </Text>
                <Text style={styles.homeScreenIdleTimerTexts}>
                  <Text >{this.state.idelTimer || '00:00:00'}</Text>
                </Text>
                <View style={styles.homeScreenPlayImage}>
                  <TouchableOpacity onPress={this.handlePause.bind(this)}>
                    <InlineImage
                      style={styles.PlayImage}
                      source={require('../assets/images/play.png')}
                    />
                  </TouchableOpacity>
                </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

  render() {
    // If dimensions is defined, render the real view otherwise the dummy view
    //this.setState({ isLoggedIn: this.props.screenProps.flags.userLogInFlag});
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View>
            <View>
              <Image
                style={{width: this.getSize().width, height: 85, marginTop:-30}}
                source={require('../assets/images/headerWhiteBg.png')}
              />
              <View style={styles.topBarInfoContainer}>
              {!!this.props.screenProps.flags.userLogInFlag && (
                <View>
                  {!this.state.workeOrederFetched && (
                    <View>
                      <KeyboardAwareScrollView>
                        <View>
                          <View style={styles.getWorkOrderBtnView}>
                            <Button
                              style={styles.getWorkOrderBtn}
                              title="scan WorkOrder"
                              color='white'
                              onPress={this._fetchMyWorkOrder}
                              fontWeight='bold'
                            />
                          </View>
                          <View style={styles.container_view}>
                            {this.state.hasCameraPermission === null
                              ? <Text>Requesting for camera permission</Text>
                              : this.state.hasCameraPermission === false
                              ? <Text style={{ color: '#fff' }}>
                                  Camera permission is not granted
                                </Text>
                              : <BarCodeScanner
                                  onBarCodeRead={this._handleBarCodeRead}
                                  style={{
                                    height: (Dimensions.get('window').height/2),
                                    width: Dimensions.get('window').width,
                                  }}
                                />
                            }
                            {this._maybeRenderUrl()}
                            <StatusBar hidden />
                          </View>
                        </View>
                      </KeyboardAwareScrollView>
                    </View>
                  )}
                  {!!this.state.workeOrederFetched && (
                    <View>
                      {this._renderWorkOrder()}
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


  _Hi = () =>{
    console.log('in Hi');
  }

  _handlePressUrl = () => {
    Alert.alert(
      'Open this WorkOrder?',
      this.state.lastScannedUrl,
      [
        {
          text: 'Yes',
          onPress: this._fetchWorkOrder,
        },
        { text: 'No', onPress: () => {console.log('Hello Angesh');this._Hi} },
      ],
      { cancellable: false }
    );
  };

  _handlePressCancel = () => {
    this.setState({ lastScannedUrl: null });
  };

  _maybeRenderUrl = () => {
    console.log("Angesh Check");
    if (!this.state.lastScannedUrl) {
      return;
    }

    return (
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.url} onPress={this._handlePressUrl}>
          <Text numberOfLines={1} style={styles.urlText}>
            {this.state.lastScannedUrl}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={this._handlePressCancel}>
          <Text style={styles.cancelButtonText}>
            Cancel
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  blockageBtn:{
    marginTop: 20,
    backgroundColor: 'red',
    alignSelf: 'center',
    color: 'white',
    width: Dimensions.get('window').width/3,
    borderRadius: 5,
  },
  DoneBtn:{
    marginTop: 20,
    backgroundColor: 'green',
    alignSelf: 'center',
    color: 'white',
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
    top:120,
  },
  homeScreenWTimeImage:{
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 40,
    marginTop:-30,
    top:-30,
    right: 30,
  },
  PlayImage:{
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  Pauseimage:{
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 10,
    height: 10,
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
  homeScreenWSTitleTexts:{
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 20,
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
  homeScreenITimeTexts:{
    color: '#808080',
    marginTop: 20,
    left: -65,
    alignSelf: 'center',
  },
  homeScreenWTimeTexts:{
    color: '#808080',
    marginLeft: 30,
    marginTop: 20,
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
