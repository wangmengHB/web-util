import Hls from 'hls.js';

export default class Resource {
  url = '';
  node = null;
  duration = 0;
  index = 0;

  constructor(url, index, emitter) {
    this.url = url;
    this.index = index;

    const node = document.createElement('video');
    node.preload = 'metadata';
    node.crossOrigin = 'Anonymous';
    node.autoplay = false;

    node.addEventListener('loadedmetadata', () => {
      console.log('metadataloaded');
      console.log(node.duration);
      this.duration = node.duration;
      emitter.emit('durationchange', this.duration, this.index);     
    });

    node.addEventListener('error', e => {
      console.log('error', e);
      emitter.emit('error', e);
    });

    node.addEventListener('canplay', () => {
      emitter.emit('canplay', this.index);
    });

    node.addEventListener('stalled', () => {
      console.log('stalled');
      
    });

    if (url.indexOf('.m3u8') > -1 && Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(node);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        this.duration = node.duration;
      });
      
    } else {
      node.src = url;
    }

    this.node = node; 
    this.node.load(); 
  }
}