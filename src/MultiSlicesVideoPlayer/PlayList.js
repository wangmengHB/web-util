
import EventEmitter from 'eventemitter3';
import Resource from './Resource';


const DRAWING_FREQUENCY = 10; // 画图的频率
const TIME_UPDATE_INTERVAL = 500;  // 两次 timeupdate 事件触发的最大间隔



export default class PlayList {
  eventEmitter = new EventEmitter();
  eventHandlers = [];

  totalDuration = 0;
  totalSlicesLenth = 0; 
  stateList = []; 
  durationList = [];
  list = [];

  // controls
  currentTime = 0;
  currentIndex = 0;
  playing = false;

  timer = null;


  constructor(urlList, eventHandlers) {
    this.totalSlicesLenth = urlList.length;
    this.durationList = Array(urlList.length).fill(0);
    this.stateList = Array(urlList.length).fill(false);
    this.eventHandlers = eventHandlers;
    

    this.eventEmitter.on('canplay', this.sliceCanPlay);
    this.eventEmitter.on('durationchange', this.sliceDurationChange);
    this.eventEmitter.on('error', this.sliceError);
    const list = urlList.map((url, index) => new Resource(url, index, this.eventEmitter));
    this.list = list;
    this.bindVideoNode(list);

  }


  bindVideoNode(list) {
    list.forEach((resource, index) => {
      const { node } = resource;
      node.addEventListener('timeupdate', () => {
        const actualTime = this.durationList.slice(0, index).reduce((pre, next) => pre + next, 0) + node.currentTime;
        if (this.currentIndex === index) {
          this.currentTime = actualTime;
          this.emitData();
        }  
      });

      const pauseIfNotCurrentIndex = () => {
        if (this.currentIndex !== index) {
          node.pause();
        };
      }
  
      node.addEventListener('playing', pauseIfNotCurrentIndex);
      node.addEventListener('seeking', pauseIfNotCurrentIndex);
      node.addEventListener('seeked', pauseIfNotCurrentIndex);
  
      node.addEventListener('ended', () => {
        console.log('ended');
        if (!this.playing) {
          return;
        }
        if (index === this.totalSlicesLenth - 1) {
          this.currentIndex = 0;
          this.currentTime = 0;
          this.list[0].node.currentTime = 0;
          this.pause();      
          return;
        }
        this.switchSlice(index);
      });
  
    });
  }


  switchSlice(index) {
    this.currentIndex = index + 1;
    this.currentTime += 0.001;
    this.pauseAll();
    this.list[this.currentIndex].node.currentTime = 0;
    if (this.playing) {
      this.doVideoElementPlayAction();
    }
  }
  
  seekTo(seconds) {
    if (seconds < 0) {
      seconds = 0;
    }
    if (seconds > this.totalDuration) {
      seconds = this.totalDuration;
    }
    this.pauseAll();
    this.currentTime = seconds;
    let sum = 0;
    for (let i = 0; i < this.totalSlicesLenth; i++) {
      sum += this.durationList[i];
      if (this.currentTime < sum) {
        this.currentIndex = i;
        break;
      }
    }
    let currentNodeTime = this.durationList[this.currentIndex] - sum + this.currentTime;
    if (currentNodeTime > this.durationList[this.currentIndex]) {
      currentNodeTime = this.durationList[this.currentIndex] - 0.001;
    }  
    this.list[this.currentIndex].node.currentTime = currentNodeTime;
    this.emitData();
  }


  play() {
    this.playing = true;
    this.pauseAll();
    this.seekTo(this.currentTime);
    this.doVideoElementPlayAction(); 
  }

  

  pause() {
    this.playing = false;
    this.pauseAll();  
  }

  pauseAll() {
    this.list.forEach((item) => {
      item.node.pause();
    });
  }


  doVideoElementPlayAction() {
    try {
      this.list[this.currentIndex].node.play();
    } catch (error) {
      console.error(error);
    }
  }

  emitData() { 
    if (this.timer) {
      window.clearInterval(this.timer);
      this.timer = null;
    }

    const drawing = () => {
      this.emit('drawing', {
        node: this.list[this.currentIndex].node,
        currentTime: this.currentTime,
        duration: this.totalDuration,
      });
      drawing.count++;
      if (drawing.count * DRAWING_FREQUENCY > TIME_UPDATE_INTERVAL) {
        window.clearInterval(this.timer);
        this.timer = null;
      }
    };
    drawing.count = 0;
    this.timer = setInterval(drawing, DRAWING_FREQUENCY);   
  }


  sliceError = (e, index) => {
    this.emit('error');
  }

  sliceCanPlay = (index) => {
    this.stateList[index] = true;
    if (this.stateList.every(state => state === true)) {
      this.emit('canplay');
    }
  }


  sliceDurationChange = (duration, index) => {
    this.durationList[index] = duration;   
    if (this.durationList.every(duration => duration && duration > 0)) {
      this.totalDuration = this.durationList.reduce((pre, next) => {
        return next + pre;
      }, 0);
      this.emit('durationReady', this.totalDuration);
    }
  }

  emit(eventName, data) {
    if (typeof this.eventHandlers[eventName] === 'function') {
      this.eventHandlers[eventName](data);
    }
  }

  destory() {
    this.list.forEach(res => {
      res.node.pause();
      res.node.src = null;
    })
  }


}



