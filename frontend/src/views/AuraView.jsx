import React, { useRef } from 'react';
import Sketch from 'react-p5';

class Particle {
  constructor(p5, type = 'cloud') {
    this.pos = p5.createVector(p5.random(p5.width), p5.random(p5.height));
    this.vel = p5.createVector(0, 0);
    this.acc = p5.createVector(0, 0);
    this.maxSpeed = 3;
    this.baseSpeed = 3;
    this.prevPos = this.pos.copy();
    this.type = type;
    this.lifespan = 255;
    this.age = 0;
    this.size = p5.random(3, 8);
    this.rotation = p5.random(p5.TWO_PI);
  }

  setSpeed(speed) {
    this.maxSpeed = speed;
  }

  follow(vectors, cols, scale, p5) {
    let x = Math.floor(this.pos.x / scale);
    let y = Math.floor(this.pos.y / scale);
    let index = x + y * cols;
    let force = vectors[index];
    if (force) {
      this.applyForce(force);
    }
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
    this.age++;
  }

  show(p5, palette, intensity, turbulence) {
    const alpha = p5.map(this.age, 0, 200, this.lifespan, 0);
    
    switch(this.type) {
      case 'cloud':
        // Sharper cloud particles with strokes
        p5.strokeWeight(1);
        p5.stroke(palette.primary.h, palette.primary.s, palette.primary.b, alpha * 0.6);
        p5.fill(palette.primary.h, palette.primary.s, palette.primary.b, alpha * 0.4);
        p5.circle(this.pos.x, this.pos.y, this.size * 3);
        p5.fill(palette.secondary.h, palette.secondary.s, palette.secondary.b, alpha * 0.6);
        p5.circle(this.pos.x, this.pos.y, this.size * 1.5);
        break;
        
      case 'triangle':
        // Triangles for positive energy
        p5.push();
        p5.translate(this.pos.x, this.pos.y);
        p5.rotate(this.age * 0.05);
        p5.fill(palette.primary.h, palette.primary.s, palette.primary.b, alpha * 0.8);
        p5.strokeWeight(2);
        p5.stroke(palette.primary.h, palette.primary.s, palette.primary.b, alpha);
        p5.triangle(
          0, -this.size * 3,
          -this.size * 2.5, this.size * 2,
          this.size * 2.5, this.size * 2
        );
        p5.pop();
        break;
        
      case 'star':
        // Stars for joy/excitement
        p5.push();
        p5.translate(this.pos.x, this.pos.y);
        p5.rotate(this.age * 0.08);
        p5.fill(palette.accent.h, 100, 100, alpha);
        p5.strokeWeight(2);
        p5.stroke(palette.accent.h, 100, 100, alpha);
        this.drawStar(p5, 0, 0, this.size * 2, this.size * 4, 5);
        p5.pop();
        break;
        
      case 'wave':
        // Wavy lines for calm/flow
        p5.noFill();
        p5.stroke(palette.secondary.h, palette.secondary.s, palette.secondary.b, alpha * 0.7);
        p5.strokeWeight(2.5);
        p5.beginShape();
        for (let i = 0; i < 20; i++) {
          const x = this.pos.x + i * 3;
          const y = this.pos.y + p5.sin(i * 0.5 + this.age * 0.1) * this.size;
          p5.vertex(x, y);
        }
        p5.endShape();
        break;
        
      case 'leaf':
        // Nature particles - leaves
        p5.push();
        p5.translate(this.pos.x, this.pos.y);
        p5.rotate(this.age * 0.05);
        p5.fill(120, 90, 80, alpha);
        p5.strokeWeight(1.5);
        p5.stroke(120, 80, 60, alpha);
        p5.ellipse(0, 0, this.size * 6, this.size * 9);
        p5.strokeWeight(2);
        p5.line(0, 0, 0, this.size * 4);
        p5.pop();
        break;
        
      case 'grid':
        // Tech/work grid lines - sharper
        p5.stroke(palette.accent.h, 100, 100, alpha);
        p5.strokeWeight(3);
        p5.line(this.pos.x - 15, this.pos.y, this.pos.x + 15, this.pos.y);
        p5.line(this.pos.x, this.pos.y - 15, this.pos.x, this.pos.y + 15);
        break;
        
      case 'spark':
        // Geometric tech sparks
        p5.push();
        p5.translate(this.pos.x, this.pos.y);
        p5.rotate(this.age * 0.1);
        p5.strokeWeight(2);
        p5.stroke(palette.accent.h, 100, 100, alpha);
        p5.fill(palette.accent.h, 100, 100, alpha * 0.4);
        p5.square(-this.size * 3, -this.size * 3, this.size * 6);
        p5.fill(palette.accent.h, 100, 100, alpha * 0.7);
        p5.square(-this.size * 1.5, -this.size * 1.5, this.size * 3);
        p5.pop();
        break;
        
      default:
        p5.stroke(palette.primary.h, palette.primary.s, palette.primary.b, alpha);
        p5.strokeWeight(this.size);
        p5.point(this.pos.x, this.pos.y);
    }
    
    this.updatePrev();
  }

  drawStar(p5, x, y, radius1, radius2, npoints) {
    let angle = p5.TWO_PI / npoints;
    let halfAngle = angle / 2.0;
    p5.beginShape();
    for (let a = 0; a < p5.TWO_PI; a += angle) {
      let sx = x + p5.cos(a) * radius2;
      let sy = y + p5.sin(a) * radius2;
      p5.vertex(sx, sy);
      sx = x + p5.cos(a + halfAngle) * radius1;
      sy = y + p5.sin(a + halfAngle) * radius1;
      p5.vertex(sx, sy);
    }
    p5.endShape(p5.CLOSE);
  }

  updatePrev() {
    this.prevPos.x = this.pos.x;
    this.prevPos.y = this.pos.y;
  }

  edges(p5) {
    if (this.pos.x > p5.width) {
      this.pos.x = 0;
      this.updatePrev();
    }
    if (this.pos.x < 0) {
      this.pos.x = p5.width;
      this.updatePrev();
    }
    if (this.pos.y > p5.height) {
      this.pos.y = 0;
      this.updatePrev();
    }
    if (this.pos.y < 0) {
      this.pos.y = p5.height;
      this.updatePrev();
    }
  }

  isDead() {
    return this.age > 200;
  }
}

function AuraVisualization({ sentiment, emotion, keywords }) {
  const particlesRef = useRef([]);
  const flowFieldRef = useRef([]);
  const colsRef = useRef(0);
  const rowsRef = useRef(0);
  const scale = 25;
  const zoffRef = useRef(0);
  
  const paletteRef = useRef({
    primary: { h: 200, s: 60, b: 70 },
    secondary: { h: 220, s: 40, b: 80 },
    accent: { h: 180, s: 70, b: 90 }
  });
  
  const turbulenceRef = useRef(0.002);
  const intensityRef = useRef(1);
  const particleSpeedRef = useRef(2);

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef);
    p5.colorMode(p5.HSB, 360, 100, 100, 100);
    
    colsRef.current = Math.floor(p5.width / scale);
    rowsRef.current = Math.floor(p5.height / scale);
    
    flowFieldRef.current = new Array(colsRef.current * rowsRef.current);
    
    // Create initial mixed particles
    particlesRef.current = [];
    for (let i = 0; i < 150; i++) {
      particlesRef.current.push(new Particle(p5, 'cloud'));
    }
    for (let i = 0; i < 50; i++) {
      particlesRef.current.push(new Particle(p5, 'wave'));
    }
  };

  const draw = (p5) => {
    // Less transparent background for sharper particles
    p5.background(0, 0, 5, 25);
    
    // Update weather system based on emotion
    updateWeatherSystem(sentiment, emotion, keywords, p5);
    
    // Generate turbulent flow field
    let yoff = 0;
    for (let y = 0; y < rowsRef.current; y++) {
      let xoff = 0;
      for (let x = 0; x < colsRef.current; x++) {
        let index = x + y * colsRef.current;
        
        // Multi-layered Perlin noise for complex turbulence
        let angle = p5.noise(xoff, yoff, zoffRef.current) * p5.TWO_PI * 4;
        angle += p5.noise(xoff * 2, yoff * 2, zoffRef.current * 0.5) * turbulenceRef.current * 100;
        
        let v = p5.createVector(p5.cos(angle), p5.sin(angle));
        v.setMag(intensityRef.current);
        flowFieldRef.current[index] = v;
        xoff += 0.08;
      }
      yoff += 0.08;
    }
    zoffRef.current += turbulenceRef.current;
    
    // Spawn symbolic particles based on keywords
    spawnKeywordParticles(keywords, p5);
    
    // Update and display particles
    for (let i = particlesRef.current.length - 1; i >= 0; i--) {
      const particle = particlesRef.current[i];
      particle.setSpeed(particleSpeedRef.current);
      particle.follow(flowFieldRef.current, colsRef.current, scale, p5);
      particle.update();
      particle.edges(p5);
      particle.show(p5, paletteRef.current, intensityRef.current, turbulenceRef.current);
      
      // Remove dead particles
      if (particle.isDead()) {
        particlesRef.current.splice(i, 1);
      }
    }
    
    // Maintain particle count
    while (particlesRef.current.length < 300) {
      particlesRef.current.push(new Particle(p5, 'cloud'));
    }
    
    // Emotional flashes/swirls for intensity spikes
    if (intensityRef.current > 2) {
      drawIntensityFlash(p5);
    }
  };

  const updateWeatherSystem = (sent, emot, kw, p5) => {
    // Sentiment affects color palette and speed
    if (sent < -0.3) {
      // Stormy: dark blues, purples, high turbulence, SLOW and heavy
      paletteRef.current.primary = { h: 240, s: 80, b: 40 };
      paletteRef.current.secondary = { h: 270, s: 70, b: 50 };
      paletteRef.current.accent = { h: 200, s: 60, b: 60 };
      turbulenceRef.current = p5.lerp(turbulenceRef.current, 0.008, 0.05);
      intensityRef.current = p5.lerp(intensityRef.current, 2.5, 0.05);
      particleSpeedRef.current = p5.lerp(particleSpeedRef.current, 0.8, 0.05);
      
      // Spawn triangles for stormy weather
      if (p5.frameCount % 20 === 0) {
        for (let i = 0; i < 3; i++) {
          particlesRef.current.push(new Particle(p5, 'triangle'));
        }
      }
    } else if (sent > 0.3) {
      // Sunset: warm glowing gradients, FAST and flowing
      paletteRef.current.primary = { h: 30, s: 80, b: 90 };
      paletteRef.current.secondary = { h: 350, s: 70, b: 85 };
      paletteRef.current.accent = { h: 50, s: 90, b: 95 };
      turbulenceRef.current = p5.lerp(turbulenceRef.current, 0.003, 0.1);
      intensityRef.current = p5.lerp(intensityRef.current, 1.5, 0.1);
      particleSpeedRef.current = p5.lerp(particleSpeedRef.current, 3.5, 0.1);
      
      // Spawn stars for positive vibes
      if (p5.frameCount % 15 === 0) {
        for (let i = 0; i < 3; i++) {
          particlesRef.current.push(new Particle(p5, 'star'));
        }
      }
    } else {
      // Neutral: soft clouds, gentle motion, CALM and slow
      paletteRef.current.primary = { h: 200, s: 50, b: 70 };
      paletteRef.current.secondary = { h: 180, s: 40, b: 80 };
      paletteRef.current.accent = { h: 160, s: 60, b: 75 };
      turbulenceRef.current = p5.lerp(turbulenceRef.current, 0.002, 0.1);
      intensityRef.current = p5.lerp(intensityRef.current, 1, 0.1);
      particleSpeedRef.current = p5.lerp(particleSpeedRef.current, 0.8, 0.1);
      
      // Spawn waves for calm
      if (p5.frameCount % 25 === 0) {
        particlesRef.current.push(new Particle(p5, 'wave'));
      }
    }
    
    // Emotion affects intensity and speed dramatically
    switch(emot) {
      case 'anger':
        paletteRef.current.accent = { h: 0, s: 100, b: 90 };
        turbulenceRef.current = 0.01;
        intensityRef.current = 3;
        particleSpeedRef.current = 5.0;
        // Spawn sharp triangles
        if (p5.frameCount % 10 === 0) {
          for (let i = 0; i < 5; i++) {
            particlesRef.current.push(new Particle(p5, 'triangle'));
          }
        }
        break;
      case 'joy':
        paletteRef.current.primary = { h: 60, s: 90, b: 95 };
        particleSpeedRef.current = 4.0;
        // Spawn lots of stars
        if (p5.frameCount % 8 === 0) {
          for (let i = 0; i < 4; i++) {
            particlesRef.current.push(new Particle(p5, 'star'));
          }
        }
        break;
      case 'sadness':
        particleSpeedRef.current = 0.4;
        turbulenceRef.current = 0.001;
        break;
      case 'fear':
        paletteRef.current.primary = { h: 280, s: 70, b: 50 };
        turbulenceRef.current = 0.007;
        particleSpeedRef.current = 2.5;
        break;
      case 'surprise':
        intensityRef.current = 2.5;
        particleSpeedRef.current = 5.0;
        // Explosive stars
        if (p5.frameCount % 5 === 0) {
          for (let i = 0; i < 6; i++) {
            particlesRef.current.push(new Particle(p5, 'star'));
          }
        }
        break;
      default:
        // For 'calm' or any unknown emotions, we use neutral settings
        particleSpeedRef.current = 1.5;
        turbulenceRef.current = 0.002;
        intensityRef.current = 1.0;
        break;
    }
  };

  const spawnKeywordParticles = (kw, p5) => {
    if (!kw || kw.length === 0) return;
    
    // Spawn MORE frequently
    if (p5.frameCount % 10 !== 0) return;
    
    kw.forEach(keyword => {
      const word = keyword.toLowerCase();
      let type = null;
      
      if (word.includes('work') || word.includes('job') || word.includes('office') || 
          word.includes('task') || word.includes('project') || word.includes('meeting')) {
        type = 'grid';
      } else if (word.includes('nature') || word.includes('tree') || word.includes('plant') ||
                 word.includes('forest') || word.includes('leaf') || word.includes('green')) {
        type = 'leaf';
      } else if (word.includes('tech') || word.includes('code') || word.includes('digital') ||
                 word.includes('computer') || word.includes('app') || word.includes('software')) {
        type = 'spark';
      }
      
      // Spawn multiple particles per keyword
      if (type) {
        for (let i = 0; i < 5; i++) {
          particlesRef.current.push(new Particle(p5, type));
        }
      }
    });
  };

  const drawIntensityFlash = (p5) => {
    // Emotional flash effect
    p5.push();
    p5.noStroke();
    const alpha = p5.map(p5.sin(p5.frameCount * 0.1), -1, 1, 5, 20);
    p5.fill(paletteRef.current.accent.h, 80, 100, alpha);
    p5.circle(p5.width / 2, p5.height / 2, p5.width * 0.8);
    p5.pop();
  };

  const windowResized = (p5) => {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
    colsRef.current = Math.floor(p5.width / scale);
    rowsRef.current = Math.floor(p5.height / scale);
    flowFieldRef.current = new Array(colsRef.current * rowsRef.current);
  };

  return <Sketch setup={setup} draw={draw} windowResized={windowResized} />;
}

export default AuraVisualization;