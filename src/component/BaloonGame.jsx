import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import backgroundImg from '../assets/background.png';
import Pump from './Pump';

import balloonRed from '../assets/RED.png';
import balloonBlue from '../assets/BLUE.png';
import balloonGreen from '../assets/GREEN.png';



import { alphabetImages } from '../assets/AlphabetImage';
const BalloonGame = () => {
  const gameContainer = useRef(null);
  const [gameSize, setGameSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const eventEmitter = useRef(new Phaser.Events.EventEmitter());

  useEffect(() => {
    const updateGameSize = () => {
      setGameSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', updateGameSize);

    const config = {
      type: Phaser.AUTO,
      parent: gameContainer.current,
      width: gameSize.width,
      height: gameSize.height,
      physics: {
        default: 'arcade',
        arcade: { debug: false },
      },
      scene: {
        preload: preload,
        create: create,
        update: update,
      },
    };

    const game = new Phaser.Game(config);

    function preload() {
      // Load background and balloon images
      this.load.image('background', backgroundImg);
      this.load.image('balloonRed', balloonRed);
      this.load.image('balloonBlue', balloonBlue);
      this.load.image('balloonGreen', balloonGreen);
      // Load other balloon colors similarly

      // Load alphabet images
      alphabetImages.forEach((image, index) => {
        this.load.image(`alphabet-${index}`, image);
      });
    }

    let balloons = [];
    let balloonSize = 0.01;
    let alphabetSize = 0.01;
    let alphabetIndex = 0;

    const balloonColors = ['balloonRed', 'balloonBlue', 'balloonGreen']; 

    function create() {
      this.add.image(gameSize.width / 2, gameSize.height / 2, 'background');
      eventEmitter.current.on('inflateBalloon', inflateBalloon, this);
      createNewBalloon.call(this, true);
    }

    function createNewBalloon(inflateImmediately = false) {
      const randomColor = balloonColors[Math.floor(Math.random() * balloonColors.length)];
      const alphabetKey = `alphabet-${alphabetIndex % alphabetImages.length}`;
    
      const newBalloon = this.physics.add
        .sprite(gameSize.width - 200, gameSize.height - 180, randomColor)
        .setScale(balloonSize)
        .setOrigin(0.5, 1)
        .setPosition(gameSize.width - 243,gameSize.height - 210)
        .setInteractive();
      newBalloon.setCollideWorldBounds(true);
      newBalloon.isLaunched = false;
    
     
      const alphabet = this.add.image(newBalloon.x, newBalloon.y, alphabetKey).setScale(balloonSize * 0.5).setOrigin(0.5,1.5);
      newBalloon.alphabet = alphabet;
  
      newBalloon.on('pointerdown', () => burstBalloon(newBalloon), this);
    
      balloons.push(newBalloon);
    
      if (inflateImmediately) {
        inflateBalloon.call(this);
      }
    
      alphabetIndex++;
    }

    function inflateBalloon() {
      const lastBalloon = balloons[balloons.length - 1];
      if (lastBalloon && !lastBalloon.isLaunched) {
        if (balloonSize < 0.3) {
          balloonSize += 0.1;
    
   
      this.tweens.add({
        targets: lastBalloon,
        scale: balloonSize,
        duration: 500,
        ease: 'Power2.easeIn',
      });

     
      this.tweens.add({
        targets: lastBalloon.alphabet,
       scale: balloonSize * 0.5,
       
        duration: 500,
        ease: 'Power2.easeIn',
      });
        } else {
          launchBalloon(lastBalloon);
          balloonSize = 0.1;
          createNewBalloon.call(this);
        }
      }
    }

    function launchBalloon(balloon) {
      balloon.isLaunched = true;
      balloon.setVelocity(-100, Phaser.Math.Between(-50, 50));
    
     
      balloon.alphabet.setPosition(balloon.x, balloon.y);
      balloon.alphabet.setScale(balloon.scale ); 
    }
    

    function burstBalloon(balloon) {
      if (balloon.isLaunched) {
        balloon.setVisible(false);
        balloon.alphabet.setVisible(false);
        balloon.destroy();
        balloon.alphabet.destroy();
        balloons = balloons.filter(b => b !== balloon);
      }
    }

   
function update() {
  balloons.forEach((balloon) => {
    if (balloon.isLaunched && balloon.x <= 100) {
      balloon.setVisible(false);
      balloon.alphabet.setVisible(false);
      balloon.destroy();
   
      balloon.alphabet.destroy();
      balloons = balloons.filter(b => b !== balloon);
    } else if (balloon.isLaunched) {
    
      balloon.alphabet.setPosition(balloon.x, balloon.y);
      balloon.alphabet.setScale(balloon.scale*0.5);
    }
  });
}

    return () => {
      window.removeEventListener('resize', updateGameSize);
      eventEmitter.current.off('inflateBalloon', inflateBalloon, this);
      game.destroy(true);
    };
  }, [gameSize]);

  const handlePumpPress = () => {
    eventEmitter.current.emit('inflateBalloon');
  };

  return (
    <div ref={gameContainer} style={{ width: '100%', height: `${gameSize.height}px`, margin: 0, padding: 0, position: 'relative' }}>
     
       <Pump onPump={handlePumpPress}
         style={{
          position: 'absolute',
          bottom: '50px',
          right: '50px',
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: 'orange',
          borderRadius: '8px',
          border: 'none',
          cursor: 'pointer',
          zIndex: 10,
        }}
       />
    </div>
  );
};

export default BalloonGame;
