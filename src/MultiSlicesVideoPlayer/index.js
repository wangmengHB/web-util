import React, {PureComponent} from 'react';
import PlayList from './PlayList';
import './index.less';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const SEEKER_WIDTH = 20;


const TANMU_SAMPLE = '这是一个静态无限循环弹幕示例';




function computePos(seekTime, duration) {
  if (duration < 1 || duration < seekTime) {
    return 0;
  }
  const left = (seekTime / duration) * (CANVAS_WIDTH - SEEKER_WIDTH);
  return left
}

function computeTime(x, duration) {
  let validPos = x;

  if ( x < SEEKER_WIDTH /2) {
    validPos = SEEKER_WIDTH/2;
  }
  if ( x > CANVAS_WIDTH - SEEKER_WIDTH / 2) {
    validPos = CANVAS_WIDTH - SEEKER_WIDTH / 2;
  }


  const time = ((validPos - SEEKER_WIDTH/2) / (CANVAS_WIDTH - SEEKER_WIDTH  )) * duration;
  return time;
}


export default class MultiSliceVideoPlayer extends PureComponent {
  ctx = null;
  playList = null;
  seeker = null;
  canvas = null;
  currentTime = 0;
  duration = 0;
  seekerDragging = false;
  ready = false;


  componentDidMount() {
    const { slices } = this.props;
    this.ctx = this.canvas.getContext('2d');
    this.playList = new PlayList(slices, {
      'drawing': this.drawCanvas,
      'canplay': () => this.ready = true
    });
  }

  

  handleSeekerDragStart = () => {
    if (!this.ready) {
      alert('video is not ready');
      return;
    }
    this.seekerDragging = true;
    this.playList.pause();
  };

  handleSeekerDragStop = (e) => {
    if (this.seekerDragging) {
      this.playList.play();
    }
    this.seekerDragging = false;
  };

  handleSeekerDragging = e => {
    if (!this.seekerDragging) {
      return;
    }
    e.preventDefault();  
    const zeroX = this.canvas.getClientRects()[0].left;
    const x = e.clientX - zeroX;
    const time = computeTime(x, this.duration);
    this.playList.seekTo(time);
  };

  
  drawCanvas = data => {
    const {node, currentTime, duration } = data;

    if (!node && node.tagName !== 'VIDEO') {
      return;
    }
    
    const calcHeight = Math.round((node.videoWidth / CANVAS_WIDTH) * CANVAS_HEIGHT);
    let renderWidth = CANVAS_WIDTH;
    let renderHeight = CANVAS_HEIGHT;
    let renderXPos = 0;
    let renderYPos = 0;
    if (calcHeight < node.videoHeight) {
      renderWidth = CANVAS_HEIGHT * (node.videoWidth / node.videoHeight);
      renderXPos = (CANVAS_WIDTH - renderWidth) / 2;
    } else if (calcHeight > node.videoHeight) {
      renderHeight = CANVAS_WIDTH / (node.videoWidth / node.videoHeight);
      renderYPos = (CANVAS_HEIGHT - renderHeight) / 2;
    }
    this.ctx.drawImage(node, renderXPos, renderYPos, renderWidth, renderHeight); 


    const left = computePos(currentTime, duration);
    this.seeker.style.left = `${left}px`;

    this.timespan.innerText = `${Math.round(currentTime)} / ${Math.round(duration)}`

    this.currentTime = currentTime;
    this.duration = duration;

  };

  play = () => {
    if (!this.ready) {
      alert('video is not ready');
      return;
    }
    this.playList.play();
  }

  pause = () => {
    if (!this.ready) {
      alert('video is not ready');
      return;
    }
    this.playList.pause();
  }

  

  render() {
    return (
      <div 
        className="multi-slice-player"
        onMouseMove={this.handleSeekerDragging}
        onMouseUp={this.handleSeekerDragStop}
        onMouseLeave={this.handleSeekerDragStop}
        style={{width: CANVAS_WIDTH, height: CANVAS_HEIGHT + 100}}
      > 
        <div className="danmu-ku">
          <div className="danmu-item">{TANMU_SAMPLE}</div>
        </div>
        <canvas 
          ref={ref => this.canvas = ref} 
          width={CANVAS_WIDTH} 
          height={CANVAS_HEIGHT}
          style={{background: 'rgba(1,1,1,0.9)', width: CANVAS_WIDTH, height: CANVAS_HEIGHT}}
          
        />
        <div style={{width: SEEKER_WIDTH, top: CANVAS_HEIGHT - 30}} 
        ref={ref => this.seeker = ref} className="seeker" onMouseDown={this.handleSeekerDragStart}/>
        <div className="control-panel">
          <button onClick={this.play}>播放</button><button onClick={this.pause}>暂停</button>
          <span ref={ref => this.timespan = ref} style={{marginLeft: 50}}/>
        </div>
      </div>
    );
  }

}