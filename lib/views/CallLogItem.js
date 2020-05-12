import SendBirdCall from 'sendbird-calls';
import outgoingVideo from '../assets/icon-call-video-outgoing-filled.svg';
import incomingVideo from '../assets/icon-call-video-incoming-filled.svg';
import outgoingVoice from '../assets/icon-call-voice-outgoing-filled.svg';
import incomingVoice from '../assets/icon-call-voice-incoming-filled.svg';

import { createListItem, createDiv, createImg, createLabel } from "../utils/domUtil";
import { sheet, classes } from "../css/styles";

export class CallLogItem {
  constructor({ callLogInfo, className }) {
    const wrapper = createListItem({ id: callLogInfo.callId, className: className });
    let callType = null;
    if(callLogInfo.isVideoCall){
      if(callLogInfo.userRole === 'dc_caller'){
        callType = outgoingVideo;
      }
      else{
        callType = incomingVideo;
      }
    }
    else{
      if(callLogInfo.userRole === 'dc_caller'){
        callType = outgoingVoice;
      }
      else{
        callType = incomingVoice;
      }
    }

    let profileImage = null;
    let displayName = "";
    if(callLogInfo.userRole === 'dc_caller'){
      profileImage = callLogInfo.callee.profileUrl;
      displayName = callLogInfo.callee.userId;
    }
    else{
      profileImage = callLogInfo.caller.profileUrl;
      displayName = callLogInfo.caller.userId;
    }

    const icoCallType = createImg({ className: `${classes['callLogItemType']}`, src: callType });
    const callTypeDiv = createDiv({ className: `${classes['callLogTypeDiv']}` });
    callTypeDiv.appendChild(icoCallType);

    const profileImg = createImg({ className: `${classes['callLogProfileImg']}`, src: profileImage });
    const profileDiv = createDiv({ className: `${classes['callLogProfileDiv']}` });
    profileDiv.appendChild(profileImg);

    //duration
    let callDurationTime = '';
    callLogInfo.duration = 3603;
    if(callLogInfo.duration > 0){
      let hour = parseInt(callLogInfo.duration / 3600);
      let min = parseInt((callLogInfo.duration - (hour * 3600)) / 60);
      let sec = callLogInfo.duration - (hour * 3600) - (min * 60);
      if( hour > 0 ){
        callDurationTime = hour + 'h ';
      }
      if( min > 0 ){
        callDurationTime += (min + 'm ');
      }
      callDurationTime += (sec + 's');
    }
    else {
      callDurationTime = '0s';
    }

    const displayNameLabel = createLabel({ className: `${classes['callLogDisplayName']} ${classes['fontNormal']} ${classes['fontHeavy']}`, innerText: displayName });
    const callDuration = createLabel({ className: `${classes['callLogDuration']} ${classes['fontSmall']}`, innerText: callDurationTime });
    const callEndReason = createLabel({ className: `${classes['callLogDuration']} ${classes['fontSmall']}`, innerText: callLogInfo.endResult });


    const callLogInfoDiv = createDiv({ className: `${classes['callLogInfoDiv']}` });
    callLogInfoDiv.appendChild(displayNameLabel);
    callLogInfoDiv.appendChild(callDuration);
    callLogInfoDiv.appendChild(callEndReason);


    let callStartTime = new Date(callLogInfo.startedAt);
    let callStartTimeLabel = callStartTime.getFullYear() + '/' +
                             callStartTime.toLocaleString(['en-US'], {month: '2-digit'}) + '/' +
                             callStartTime.toLocaleString(['en-US'], {day: '2-digit'}) + ' ' +
                             this.formatAMPM(callStartTime);

    const callLogStartTime = createLabel({ className: `${classes['callLogStartTime']} ${classes['fontSmall']}`, innerText: callStartTimeLabel});
    const callActionBtnWrap = createDiv({ className: `${classes['callLogActionBtnWrap']}` });
    const btnCallVideo = createDiv({ className: `${classes['callLogVideoActionBtn']}`});
    const btnCallVoice = createDiv({ className: `${classes['callLogVoiceActionBtn']}`});
    callActionBtnWrap.appendChild(btnCallVoice);
    callActionBtnWrap.appendChild(btnCallVideo);
    
    
    const callLogActionDiv = createDiv({ className: `${classes['callLogActionDiv']}` });
    callLogActionDiv.appendChild(callLogStartTime);
    callLogActionDiv.appendChild(callActionBtnWrap);
    

    wrapper.appendChild(callTypeDiv);
    wrapper.appendChild(profileDiv);
    wrapper.appendChild(callLogInfoDiv);
    wrapper.appendChild(callLogActionDiv);

    this.element = wrapper;
    this.btnCallVideo = btnCallVideo;
    this.btnCallVoice = btnCallVoice;
    this.destPeerID = displayName;
  }

  formatAMPM(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    let strTime = hours + ':' + minutes + ampm;
    return strTime;
  }

  /**
   * @param {(event: any, args: any) => void} eventhandler
   */
  set onclick(eventhandler) {
    this.btnCallVideo.onclick = (event) => {
      eventhandler(event, {peerId: this.destPeerID, isVideoCall: true, callOption: null});
    };
    this.btnCallVoice.onclick = (event) => {
      eventhandler(event, {peerId: this.destPeerID, isVideoCall: true, callOption: null});
    };
  }
}