
      'use strict';

      var width = a.width;
      var halfWidth = width / 2;
      var height = halfWidth;
      var halfHeight = height / 2;

      var trackInnerWidth = width / 9;
      var railWidth = trackInnerWidth / 5;
      var trackOuterWidth = trackInnerWidth + railWidth * 2;

      var trainWidth = 20;
      var trainPosition = -1;

      var fps = 30;
      var now = Date.now();
      var then = 0;
      var smoothFactor = 1000;
      var smooth = now / smoothFactor;
      var interval = 1000 / fps;
      var delta = 0;

      var distance = 0;
      var speed = 50;

      var score = 0;

      var palette = 0;
      var colors = [
        {
          background: '#e5ddac', // 229 221 172
          far: '#efe9cd',
          sky: '#ffffff',
          entity: '#61001d', // 97 0 29
          other: '#8d494d'
        },
        {
          background: '#CF7081',
          far: '#EFB4BF',
          sky: '#F7DEE7',
          entity: '#58182E',
          other: '#93272C'
        },
        {
          background: '#C4E8F9',
          far: '#FFFBE1',
          sky: '#40456A',
          entity: '#EC73BA',
          other: '#BFB1C3'
        },
        {
          background: '#1A2651',
          far: '#101830',
          sky: '#020202',
          entity: '#B4FAE2',
          other: '#81B3B1'
        },
        {
          background: '#A0A0A0',
          far: '#C0C0C0',
          sky: '#E0E0E0',
          entity: '#202020',
          other: '#404040'
        }
      ];

      // Date.now -> +new Date
      // for (e in c) c[e[0]+e[2]+(e[6]||'')] = c[e];
      // with(c) {}

      onclick = function() {
        speed += 10;
        score += 10;
        palette = palette > 3 ? 0 : palette + 1;
        trainPosition = -trainPosition;
        createBackground();
      };

      // I'm going to draw a lot of rectangles.
      function drawRect(color, x, y, w, h){
        c.fillStyle=color;
        c.fillRect(x, y, w, h);
      }

      var bg = null;
      function createBackground() {

        bg = c.createLinearGradient(0, 0, 0, height);
        bg.addColorStop(0, colors[palette].background);
        bg.addColorStop(0.45, colors[palette].far);
        bg.addColorStop(0.5, colors[palette].sky);
        bg.addColorStop(0.51, colors[palette].background);
        bg.addColorStop(1, colors[palette].far);
      }
      createBackground();

      // Draws the level background.
      function drawBackground() {
        drawRect(bg, 0, 0, width, height);
      }

      function drawSky(t) {
        c.fillStyle=colors[palette].sky;
        for (var i = 0; i < width / 10; i++) {
          // Sky weather.
          c.fillRect(Math.random() * width - 1, Math.random() * halfHeight - 1, 1, 1);

          // Clouds.
          c.globalAlpha = 0.2;
          c.beginPath();
          c.arc(i * 12,  Math.cos(i + t) * 5 - 5, 30 + Math.sin((i % 3)) * 5, 0, Math.PI);
          c.fill();
          c.globalAlpha = 1;
        }
      }

      function drawGround(t, dt) {
        // Horizon.
        drawRect(colors[palette].far, 0, halfHeight, width, 2);
        drawRect(colors[palette].sky, 0, halfHeight, width, 1);

        // Depth effect.
        c.globalAlpha = 0.9;
        // TODO Improve the effect.
        for (var i = 0; i < 70; i++) {
          if ((9 * Math.sin((90 - i) / 57.3) / Math.sin(i / 57.3) + distance * 1000) % 18 > 9) {
            var y = halfHeight * (1 + i / 70);
            drawRect(colors[palette].far, 0, y, width, halfHeight / 70);
          }
        }
      }

      function drawTrack(startX, horizonX) {
        c.fillStyle = colors[palette].other;

        // Tracks
        c.beginPath();
        c.moveTo((startX - trackInnerWidth) - railWidth, height);
        c.lineTo(horizonX - (railWidth / 2), halfHeight + 1);
        c.lineTo(startX - trackInnerWidth, height);
        c.moveTo(startX + trackInnerWidth, height);
        c.lineTo(horizonX + (railWidth / 2), halfHeight + 1);
        c.lineTo((startX + trackInnerWidth) + railWidth, height);
        c.fill();

        // Depth effect.
        // TODO Improve the effect.
        for (var i = 0; i < 50; i++) {
          if ((9 * Math.sin((90 - i) / 57.3) / Math.sin(i / 57.3) + distance * 1000) % 4 > 3) {
            var x = horizonX; // horizonX - (trackOuterWidth * (i + railWidth / 2) / trackInnerWidth) - i * (horizonX / startX);// - (trackOuterWidth * (i + 1) / trackInnerWidth);
            //var x = startX - (trackOuterWidth / trackInnerWidth) * (i + 1);
            var y = halfHeight * (1 + i / 50);
            var w = 50; //(trackOuterWidth * (i + 1) / trackInnerWidth) * 2;
            var h = 2; //halfHeight / 50;
            // drawRect(colors[palette].other, x, y, w, h);
          }
        }
      }

      function drawRails(t, dt) {
        drawTrack(halfWidth - halfWidth / 2, halfWidth - halfWidth / 9);
        drawTrack(halfWidth + halfWidth / 2, halfWidth + halfWidth / 9);
      }

      function drawTrain() {
        c.fillStyle = colors[palette].entity;
        c.beginPath();
        c.arc(halfWidth - trainPosition * (halfWidth / 2), height, trainWidth, Math.PI, Math.PI * 2);
        c.fill();
      }

      function drawScore() {
        c.globalAlpha = 1;
        c.font = 'bold 30px mono';
        c.fillStyle = colors[palette].sky;
        c.fillText(score, 10, 50);
      }

      function loop() {
        requestAnimationFrame(loop);

        now = Date.now();
        delta = now - then;

        if (delta > interval) {
          then = now - (delta % interval);
          smooth = then / smoothFactor;

          distance += speed * (delta / 36e5);

          drawBackground(smooth);
          drawSky(smooth);
          drawGround(smooth, delta);
          drawRails(smooth, delta);
          drawTrain();
          drawScore();
        }
      }

      loop();
    