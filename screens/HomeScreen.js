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

import { BarCodeScanner, Permissions, WebBrowser } from 'expo';
import { MonoText, HercText } from '../components/StyledText';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import TimeFormatter from 'minutes-seconds-milliseconds';
import Moment from 'moment';
import Api from '../api/Api';
import InlineImage from '../components/InlineImage.js';
import { RadioButtons } from 'react-native-radio-buttons';

import { VictoryBar, VictoryPie, VictoryChart } from "victory-native";

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
      workOrderStatus: 'Created',
      message: '',
      isLoggedIn: false,
      workeOrederFetched: false,
      hasCameraPermission: null,
      lastScannedUrl: null,
      isRunning: false,
      isPauseselected: false,
      isBlockselected: false,
      isBlocked: false,
      isWorkOrderDone: false,
      mainTimer: null,
      mainTime: null,
      totalIdelTimer: null,
      totalIdelTime: null,
      idelTimer: null,
      idelTime: null,
      blockTimer: null,
      blockTime: null,
      totalTimer: null,
      totalTime: null,
      StartTimer: null,
      firstTime: false,
      mainTimerStart: null,
      blockTimerStart: null,
      idelTimerStart: null,
      pauseReasonText: '',
      pauseReasonTAFlag: false,
      blockedReasonText: '',
      blockedReasonTAFlag: false,
  }

  updateAllFlag(){

    this._requestCameraPermission();
    this.clearAllInterval();

    let initVal = {
        totalTimer: null,
    } /*true or false*/
    if(initVal.totalTimer !== this.state.mainTimerStart){
      this.state.getWorkOrder = '';
      this.state.workOrderDetails = this.getWorkOrderData();
      this.state.workOrderStatus= '';
      this.state.message= '';
      this.state.isLoggedIn= false;
      this.state.workeOrederFetched= false;
      this.state.hasCameraPermission= null;
      this.state.lastScannedUrl= null;
      this.state.isRunning= false;
      this.state.isPauseselected = false;
      this.state.isBlockselected = false;
      this.state.isWorkOrderDone = false;
      this.state.isBlocked= false;
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
      this.state.blockTimer= null;
      this.state.blockTime= null;
      this.state.blockTimerStart= null;
      this.state.idelTimerStart= null;
      this.state.pauseReasonText= '';
      this.state.pauseReasonTAFlag= false;
      this.state.blockedReasonText= '';
      this.state.blockedReasonTAFlag= false;
    }
    return (<View></View>);
  }

  constructor(props) {
      super(props);
      this._fetchWorkOrder = this._fetchWorkOrder.bind(this);
      //this.navigate = this.props.navigation.navigate;
  }

  scanAnotherWorkOrder(){
    this.setState({workeOrederFetched: false});
    this.updateAllFlag();
  }

  _fetchWorkOrder = () => {
    console.log("Angesh ");
    console.log(this.state.lastScannedUrl);
    Api.getItems('https://outage-management-service.run.aws-usw02-pr.ice.predix.io/workorder/1')
   .then((response) => {
     console.log("After Call Angesh ");
     console.log(response);
     response = JSON.stringify(this.getWorkOrderData());
     this.state.workOrderDetails = response;
     console.log(response);
     this.setState({workeOrederFetched: true });
   }).catch((error) => {
                console.log(error);
    });
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
    console.log("I am inside _handleBarCodeRead");
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

  clearAllInterval(){
    clearInterval(this.interval);
    clearInterval(this.idelInterval);
    clearInterval(this.blockInterval);
  }

  handleBlocked(){

    this.clearAllInterval();
    var endM = Moment.utc(new Date());
    var startM = Moment.utc(this.state.mainTimerStart);

    var diffM = Moment(endM).unix() - Moment(startM).unix();
    this.setState({ mainTime: (diffM + this.state.mainTime)});

    this.setState({
        blockTimerStart: new Date(),
        startTimer: new Date(),
        isBlocked: true
    });
    this.setState({isBlockselected: false});
    this.setState({workOrderStatus: 'Blocked'});

    this.blockInterval = setInterval (() => {
      // Main
      var end = Moment.utc(new Date());
      var start = Moment.utc(this.state.blockTimerStart);

      var currentTimediff = Moment(end).unix() - Moment(start).unix();
      currentTimediff = currentTimediff + this.state.blockTime;
      this.setState({ blockTimer: this.toHHMMSS(currentTimediff) });
    },1000);
  }

  handleUnblocked(){

    this.clearAllInterval();
    this.setState({ isBlocked: false });
    this.setState({workOrderStatus: 'In Progress'});

    var end = Moment.utc(new Date());
    var start = Moment.utc(this.state.blockTimerStart);

    var diff = Moment(end).unix() - Moment(start).unix();
    this.setState({ blockTime: (diff + this.state.blockTime)});

    this.setState({
      mainTimerStart: new Date(),
      isRunning: true
    });

    this.interval = setInterval (() => {

      // Main
      var end = Moment.utc(new Date());
      var start = Moment.utc(this.state.mainTimerStart);

      var currentTimediff = Moment(end).unix() - Moment(start).unix();
      currentTimediff = currentTimediff + this.state.mainTime;
      this.setState({ mainTimer: this.toHHMMSS(currentTimediff) });

    },1000);
  }

  handlePause(){

    this.clearAllInterval();
    if(!this.state.firstTime) { // first time
       // we need to save key for the next time
      this.setState({firstTime: true});
      this.setState({startTimer: new Date()});
    }

    this.setState({isPauseselected: false});
    this.setState({workOrderStatus: 'In Progress'});
    this.setState({
      mainTimerStart: new Date(),
      isRunning: true
    });

    var endI = Moment.utc(new Date());
    var startI = Moment.utc(this.state.idelTimerStart);

    var diff = Moment(endI).unix() - Moment(startI).unix();
    if(!isNaN(diff)){
      this.setState({ idelTime: (diff + this.state.idelTime)});
    }

    this.interval = setInterval (() => {

      // Main
      var end = Moment.utc(new Date());
      var start = Moment.utc(this.state.mainTimerStart);

      var currentTimediff = Moment(end).unix() - Moment(start).unix();
      currentTimediff = currentTimediff + this.state.mainTime;
      this.setState({ mainTimer: this.toHHMMSS(currentTimediff) });

    },1000);
        // }
  }

  handlePlay(){
    this.clearAllInterval();

    if(!this.state.firstTime) { // first time
      // we need to save key for the next time
      this.setState({firstTime: true});
      this.setState({startTimer: new Date()});
      this.setState({workOrderStatus: 'Created'});
    }
    else{
      this.setState({workOrderStatus: 'Pause'});
    }

    this.setState({isPauseselected: false});
    this.setState({
      idelTimerStart: new Date(),
      isRunning: false });

    // To set main Timer
    var end = Moment.utc(new Date());
    var start = Moment.utc(this.state.mainTimerStart);

    var diff = Moment(end).unix() - Moment(start).unix();
    this.setState({ mainTime: (diff + this.state.mainTime)});

    this.idelInterval = setInterval (() => {

      // Main
      var endI = Moment.utc(new Date());
      var startI = Moment.utc(this.state.idelTimerStart);

      var currentTimediff = Moment(endI).unix() - Moment(startI).unix();
      currentTimediff = currentTimediff + this.state.idelTime;
      this.setState({ idelTimer: this.toHHMMSS(currentTimediff) });

    },1000);
  }

  // End Timer

  _WorkOrderComplete(){
    this.clearAllInterval();

    this.setState({workOrderStatus: 'Completed'});

    var endM = Moment.utc(new Date());
    var startM = Moment.utc(this.state.mainTimerStart);

    var diffM = Moment(endM).unix() - Moment(startM).unix();
    this.setState({ mainTime: (diffM + this.state.mainTime)});

    this.setState({isWorkOrderDone: true});
  }

  _callBlocked(){
    this.setState({isBlockselected: true});
  }


_callPause(){
  // this.clearAllInterval();
  // var endM = Moment.utc(new Date());
  // var startM = Moment.utc(this.state.mainTimerStart);
  //
  // var diffM = Moment(endM).unix() - Moment(startM).unix();
  // this.setState({ mainTime: (diffM + this.state.mainTime)});
  this.setState({isPauseselected: true});
}

_cancleBlocked(){
  this.clearAllInterval();
  var endM = Moment.utc(new Date());
  var startM = Moment.utc(this.state.mainTimerStart);

  var diffM = Moment(endM).unix() - Moment(startM).unix();
  this.setState({ mainTime: (diffM + this.state.mainTime)});
  this.setState({isBlockselected: false});

  this.handlePause();
}

_canclePause(){
  this.clearAllInterval();
  var endM = Moment.utc(new Date());
  var startM = Moment.utc(this.state.mainTimerStart);

  var diffM = Moment(endM).unix() - Moment(startM).unix();
  this.setState({ mainTime: (diffM + this.state.mainTime)});
  this.setState({isPauseselected: false});

  this.handlePause();
}

clearPauseRemarks(){
}

clearBlockedRemarks(){
}

_renderBlockReason(){

  const options = [
    'Waiting on Supervision',
    'Waiting on Permits',
    'Finding Information',
    'Looking for Tools',
    'Waiting on Equipment',
    'Waiting on Associates',
    'Hunting Parts',
    'Other reasons',
  ];

  function setSelectedOption(selectedOption){
    this.setState({
      selectedOption
    });
  }

  function renderOption(option, selected, onSelect, index){
    if(selected){
      console.log("Angesh ");
    }
    const style = selected ? { fontWeight: 'bold', fontSize: 18} : {};

    return (
      <TouchableOpacity onPress={onSelect} key={index}>
        <Text style={style}>{option}</Text>
      </TouchableOpacity>
    );
  }

  function renderContainer(optionNodes){
    return <View>{optionNodes}</View>;
  }

  return (
    <View style={{marginLeft: 20}}>
      <View>
        <Text style={{fontWeight: 'bold',fontSize: 16, marginBottom: 15}}>
          Kindly select a reason for your break?
        </Text>
      </View>
      <View>
        <RadioButtons
          options={ options }
          onSelection={ setSelectedOption.bind(this) }
          selectedOption={this.state.selectedOption }
          renderOption={ renderOption }
          renderContainer={ renderContainer }
        />
      </View>
    </View>
  );
}

_renderPauseReason(){

  const options = [
    'Bio break',
    'Lunch/Snacks break',
    'Safty event break',
    'Other reasons',
  ];

  function setSelectedOption(selectedOption){
    this.setState({
      selectedOption
    });
  }

  function renderOption(option, selected, onSelect, index){
    const style = selected ? { fontWeight: 'bold', fontSize: 18} : {};

    return (
      <TouchableOpacity onPress={onSelect} key={index}>
        <Text style={style}>{option}</Text>
      </TouchableOpacity>
    );
  }

  function renderContainer(optionNodes){
    return <View>{optionNodes}</View>;
  }

  return (
    <View style={{marginLeft: 20}}>
      <View>
        <Text style={{fontWeight: 'bold',fontSize: 16, marginBottom: 15}}>
          Kindly select a reason for your break?
        </Text>
      </View>
      <View>
        <RadioButtons
          options={ options }
          onSelection={ setSelectedOption.bind(this) }
          selectedOption={this.state.selectedOption }
          renderOption={ renderOption }
          renderContainer={ renderContainer }
        />
      </View>
    </View>
  );
}

_renderWorkOrder(){
  pieData = [];
  pieColorScale = [];
  if(this.state.mainTime > 0){
    pieData.push({x: "Wrench Time", y: this.state.mainTime});
    pieColorScale.push("#228B22");
  }
  if(this.state.idelTime > 0){
    pieData.push({x: "Idle Time", y: this.state.idelTime});
    pieColorScale.push("#F66D3B");
  }
  if(this.state.blockTime > 0 ){
    pieData.push({x: "Blocked Time", y: this.state.blockTime});
    pieColorScale.push("#D73C4C");
  }

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
        <View>
          {!this.state.isBlockselected && (
            <View>
              {!this.state.isPauseselected && (
                <View>
                  <Text style={styles.homeScreenWSTitleTexts}>
                    Work started at {Moment(this.state.startTimer).format('H:mm:ss').toString()} on ({Moment(this.state.startTimer).format('DD/MM/YYYY').toString()})
                  </Text>
                  <Text style={styles.homeScreenWSTexts}>
                    Current Status: <Text style={styles.homeScreenTexts}>{this.state.workOrderStatus}</Text>
                  </Text>
                  {!this.state.isWorkOrderDone && (
                    <View>
                      {!this.state.isBlocked && (
                        <View>
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
                                    <TouchableOpacity onPress={this._callPause.bind(this)}>
                                      <InlineImage
                                        style={styles.Pauseimage}
                                        source={require('../assets/images/pause-button.png')}
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
                                    onPress={this._callBlocked.bind(this)}
                                  />
                                </View>
                                <View style={styles.DoneBtn}>
                                  <Button
                                    title="Done"
                                    color='white'
                                    onPress={this._WorkOrderComplete.bind(this)}
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
                                      source={require('../assets/images/play-button.png')}
                                    />
                                  </TouchableOpacity>
                                </View>
                              </View>
                            </View>
                          )}
                        </View>
                      )}
                      {!!this.state.isBlocked && (
                        <View>
                          <View>
                            <InlineImage
                              style={styles.blockedImage}
                              source={require('../assets/images/blocked.png')}
                            />
                          </View>
                          <View>
                            <Text style={styles.homeScreenBTimeTexts}>
                              Blocked Timer
                            </Text>
                            <Text style={styles.homeScreenIdleTimerTexts}>
                              <Text >{this.state.blockTimer || '00:00:00'}</Text>
                            </Text>
                            <View >
                              <View style={styles.continueBtn}>
                                <Button
                                  title="Resume"
                                  color='white'
                                  onPress={this.handleUnblocked.bind(this)}
                                />
                              </View>
                            </View>
                          </View>
                        </View>
                      )}
                    </View>
                  )}
                  {!!this.state.isWorkOrderDone && (
                    <View>
                      <Text style={{fontWeight:'bold', marginLeft: 5, marginBottom: -10 }}> This WorkOrder is completed with following details:</Text>
                      <View>
                        <VictoryPie
                          height={220}
                          style={{
                            data: {
                              stroke: (data) => data.y > 75 ? "black" : "none"
                            }
                          }}
                          innerRadius={20}
                          data={pieData}
                          colorScale={pieColorScale}
                        />
                      </View>
                      <View >
                        <View style={styles.scanBtn}>
                          <Button
                            title="Scan Another WorkOrder"
                            color='white'
                            onPress={this.scanAnotherWorkOrder.bind(this)}
                          />
                        </View>
                      </View>
                    </View>
                  )}
                </View>
              )}
              {!!this.state.isPauseselected && (
                <View>
                  <View>
                    {this._renderPauseReason()}
                    <View>
                      {!!(this.state.selectedOption == 'Other reasons') && (
                        <View style={{marginTop: 20}}>
                          <TextInput
                            style={styles.pauseReasonTextStyle}
                            placeholder='Reason'
                            multiline={true}
                            numberOfLines={4}
                            onChangeText={(pauseReasonText) => this.setState({pauseReasonText})}
                            value={this.state.pauseReasonText}
                            autoFocus={true}
                            onFocus={this.clearPauseRemarks}
                          />
                        </View>
                      )}
                    </View>
                  </View>
                  <View style={{flex: 1,flexDirection: 'row'}}>
                    <View >
                      <View style={styles.PauseCancleBtn}>
                        <Button
                          title="Cancle"
                          color='white'
                          onPress={this._canclePause.bind(this)}
                        />
                      </View>
                    </View>
                    <View >
                      <View style={styles.PauseContinueBtn}>
                        <Button
                          title="Continue"
                          color='white'
                          onPress={this.handlePlay.bind(this)}
                        />
                      </View>
                    </View>
                  </View>
                </View>
              )}
            </View>
          )}
          {!!this.state.isBlockselected && (
            <View>
              <View>
                {this._renderBlockReason()}
                <View>
                  {!!(this.state.selectedOption == 'Other reasons') && (
                    <View style={{marginTop: 20}}>
                      <TextInput
                        style={styles.pauseReasonTextStyle}
                        placeholder='Reason'
                        multiline={true}
                        numberOfLines={4}
                        onChangeText={(blockedReasonText) => this.setState({blockedReasonText})}
                        value={this.state.blockedReasonText}
                        autoFocus={true}
                        onFocus={this.clearBlockedRemarks}
                      />
                    </View>
                  )}
                </View>
              </View>
              <View style={{flex: 1,flexDirection: 'row'}}>
                <View >
                  <View style={styles.PauseCancleBtn}>
                    <Button
                      title="Cancle"
                      color='white'
                      onPress={this._cancleBlocked.bind(this)}
                    />
                  </View>
                </View>
                <View >
                  <View style={styles.PauseContinueBtn}>
                    <Button
                      title="Continue"
                      color='white'
                      onPress={this.handleBlocked.bind(this)}
                    />
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

  render() {
    // If dimensions is defined, render the real view otherwise the dummy view
    //this.setState({ isLoggedIn: this.props.screenProps.flags.userLogInFlag});
    //this.setState({ isLoggedIn: this.props.screenProps.flags.userLogInFlag});
    console.log(this.props.screenProps.flags.userLogInFlag);
    console.log(this.props.screenProps.flags.userType);
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
                      {!this.state.workeOrederFetched && (
                        <View>
                          <KeyboardAwareScrollView>
                            <View>
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
                              <View style={styles.getWorkOrderBtnView}>
                                <Button
                                  style={styles.getWorkOrderBtn}
                                  title="scan WorkOrder"
                                  color='white'
                                  onPress={this._fetchMyWorkOrder}
                                  fontWeight='bold'
                                />
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
                  {!!(this.props.screenProps.flags.userType == 'outageManager') && (
                    <KeyboardAwareScrollView>
                      {this.updateAllFlag()}
                      <View>
                        <Text
                          style={{flex: 0,fontSize: 27, marginLeft: 30}}>
                            WorkOrder Report:
                        </Text>
                      </View>
                    </KeyboardAwareScrollView>
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
    console.log("lastScannedUrl: =",this.state.lastScannedUrl);
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
