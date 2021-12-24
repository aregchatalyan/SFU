import React, { Component } from 'react';
import AudioVisualiser from './AudioVisualiser';

class AudioAnalyser extends Component {
    constructor(props) {
        super(props);
        this.state = { audioData: new Uint8Array(0) };
        this.tick = this.tick.bind(this);
      }

    componentDidMount() {
        this.audioContext = new (window.AudioContext ||
            window.webkitAudioContext)();
          this.analyser = this.audioContext.createAnalyser();
          this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
          this.source = this.audioContext.createMediaStreamSource(this.props.audio);
          this.source.connect(this.analyser);
          this.rafId = requestAnimationFrame(this.tick);
      }

      tick() {
        this.analyser.getByteTimeDomainData(this.dataArray);
        this.setState({ audioData: this.dataArray });
        this.rafId = requestAnimationFrame(this.tick);
      }

      componentWillUnmount() {
        cancelAnimationFrame(this.rafId);
        this.analyser.disconnect();
        this.source.disconnect();
      }

      render() {
        return <AudioVisualiser style={{position: 'absolute', top: 0, zIndex: 999, width: '40%', right: 0, height: '100vh'}} audioData={this.state.audioData} />;
      }
}

export default AudioAnalyser;