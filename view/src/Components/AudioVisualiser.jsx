import React, { PureComponent } from 'react';

class AudioVisualiser extends PureComponent {
  constructor(props) {
    super(props);
    //this.canvas = React.createRef();
    //this.visualiser = React.createRef();
    this.highLine = React.createRef();
    this.anotherLine1 = React.createRef();
    this.anotherLine2 = React.createRef();

  }
  
  componentDidUpdate() {
    this.draw();
  }

  draw() {
    const { audioData } = this.props;
    for (const item of audioData) {
        if(item < 130){
            this.highLine.current.style.height = 5 + 'px';
            this.anotherLine1.current.style.height = 5 + 'px';     
            this.anotherLine2.current.style.height = 5 + 'px';  
        }
        else{
            this.highLine.current.style.height = (item / 7.5) + 'px';
            this.anotherLine1.current.style.height = (item / 15.5) + 'px';     
            this.anotherLine2.current.style.height = (item / 15.5) + 'px';         
        }
    }
  }

  render() {
    return (
            <div className="IisKdb u5mc1b BbJhmb YE1TS HX2H7">
                <div className="p21yBf iitYmd m-0" ref={this.anotherLine1}></div>
                <div className="p21yBf iitYmd" ref={this.highLine}></div>
                <div className="p21yBf iitYmd" ref={this.anotherLine2}></div>
            </div>
    )
  }
}

export default AudioVisualiser;



// draw() {
//     const { audioData } = this.props;
//     const canvas = this.canvas.current;
//     const height = canvas.height;
//     const width = canvas.width;
//     const context = canvas.getContext('2d');
//     let x = 0;
//     const sliceWidth = (width * 1.0) / audioData.length;

//     context.lineWidth = 2;
//     context.strokeStyle = '#000000';
//     context.clearRect(0, 0, width, height);

//     context.beginPath();
//     context.moveTo(0, height / 2);
//     for (const item of audioData) {
//       const y = (item / 255.0) * height;
//       context.lineTo(x, y);
//       x += sliceWidth;
//     }
//     context.lineTo(x, height / 2);
//     context.stroke();
//   }

//   render() {
//     return <canvas width="300" height="300" ref={this.canvas} />;
//   }