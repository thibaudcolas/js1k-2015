
      'use strict';

      var width = a.width;
      var halfWidth = width / 2;
      var height = Math.min(halfWidth, a.height);
      var halfHeight = height / 2;

      var trackInnerWidth = width / 10;
      var railWidth = trackInnerWidth / 5;
      var trackOuterWidth = trackInnerWidth + railWidth * 2;

      var trainWidth = width / 20;
      // -1 = left, 1 = right.
      var trainPosition = -1;

      var peopleWidth = trainWidth / 2;
      // 0 = false, -1 = left, 1 = right.
      var peopleAtBottom = 0;

      var fps = 30;
      var playing = true;
      var now = Date.now();
      var then = 0;
      var smoothFactor = 1000;
      var smooth = now / smoothFactor;
      var interval = 1000 / fps;
      var delta = 0;

      var distance = 0;
      var speed = 20;

      // var start = Date.now();
      var score = 0;
      // -1 = spare lives, 1 = kill.
      var scoreMethod = -1;
      var firstEncounter = true;

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
      // circles.push([rand(w), rand(h), rand(80), rand(200)]);
      // function signatures

      a.ontouchstart = onclick = onkeydown = function() {
        palette = palette > 3 ? 0 : palette + 1;
        peopleAtBottom = 0;
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
        c.fillStyle = colors[palette].sky;
        for (var i = 0; i < width / 10; i++) {
          // Sky weather.
          c.fillRect(Math.random() * width - 1, Math.random() * halfHeight - 1, 1, 1);

          // Clouds.
          c.globalAlpha = 0.3;
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
        var n = 70;
        for (var i = 0; i < n; i++) {
          if ((9 * Math.sin((90 - i) / 57.3) / Math.sin(i / 57.3) + distance * 1000) % 18 > 9) {
            var y = halfHeight * (1 + i / n);
            drawRect(colors[palette].far, 0, y, width, halfHeight / n);
          }
        }
      }

      function drawTrack(startX, horizonX) {
        c.fillStyle = colors[palette].other;

        // Tracks
        c.beginPath();

        c.moveTo((startX - trackInnerWidth) - railWidth, height);
        c.lineTo(horizonX - (railWidth / 4), halfHeight + 1);
        c.lineTo(startX - trackInnerWidth, height);

        c.moveTo(startX + trackInnerWidth, height);
        c.lineTo(horizonX + (railWidth / 4), halfHeight + 1);
        c.lineTo((startX + trackInnerWidth) + railWidth, height);

        c.fill();

        // Debug rail
        // c.moveTo(startX - 2, height);
        // c.lineTo(horizonX, halfHeight);
        // c.lineTo(startX + 2, height);
        // c.fill();

        // Depth effect.
        var n = 70;
        for (var i = 0; i < n; i++) {
          if ((9 * Math.sin((90 - i) / 57.3) / Math.sin(i / 57.3) + distance * 1000) % 4 > 3) {

            var w = trackOuterWidth * 2 * ((railWidth / 6 + i) / n);
            var h = halfHeight / n;

            // Calculate line equation.
            var a = halfHeight / (startX - horizonX);
            var b = height - startX * a;

            var y = halfHeight * (1 + (i / n));
            var x = (y - b) / a - w / 2;

            drawRect(colors[palette].other, x, y, w, h);

            // Debug rail
            // c.beginPath();
            // c.moveTo(horizonX, halfHeight);
            // c.lineTo(x, y);
            // c.lineTo(startX, height);
            // c.stroke();
          }
        }
      }

      function drawRails(t, dt) {
        drawTrack(halfWidth - halfWidth / 2, halfWidth - halfWidth / 9);
        drawTrack(halfWidth + halfWidth / 2, halfWidth + halfWidth / 9);
      }

      function drawPeople() {
        drawIndividual(1);
        drawIndividual(-1);
      }

      function drawIndividual(position) {
        var startX = halfWidth + position * halfWidth / 2;
        var horizonX = halfWidth + position * halfWidth / 9;

        var n = 50;
        for (var i = 0; i < n; i++) {
          if ((9 * Math.sin((55 + position * i) / 19) / Math.sin(i / 19) + distance * 1000 + position * 2) % 20 > 19) {

            var w = peopleWidth * 2 * ((railWidth / 6 + i) / n);
            var h = w + halfHeight / n;

            // Calculate line equation.
            var a = halfHeight / (startX - horizonX);
            var b = height - startX * a;

            var y = halfHeight * (1 + (i / n)) - h / 2;
            var x = (y - b) / a - w / 2;

            //drawRect(colors[palette].entity, x, y, w, h);
            c.beginPath();
            //c.arc(x, y, w, Math.PI, Math.PI * 3);
            c.arc(x, y, w, Math.PI / 10, Math.PI * 3);
            c.fill();

            if (i === n - 1 && y > halfHeight - halfHeight / 10) {
              peopleAtBottom = position;
            }
          }
        }
      }

      function drawTrain() {
        c.fillStyle = colors[palette].entity;
        c.globalAlpha = 1;
        c.beginPath();
        c.arc(halfWidth + trainPosition * (halfWidth / 2), height, trainWidth, Math.PI, Math.PI * 2);
        c.fill();
      }

      function drawScore() {
        c.globalAlpha = 1;
        c.font = 'bold 5vw mono';
        c.fillStyle = colors[palette].sky;
        c.fillText(score, 10, 50);
      }

      function drawShock() {
        c.globalAlpha = 0.8;
        c.fillStyle = colors[palette].entity;
        c.fillRect(0, 0, width, height);
      }

      function gameOver() {
        playing = false;
        drawShock();
        drawShock();
        drawShock();
        c.globalAlpha = 1;
        c.font = 'bold 20vw mono';
        c.fillStyle = colors[palette].sky;
        c.fillText(score, halfWidth * (8 / 10), halfHeight + 40);
      }

      function loop() {
        requestAnimationFrame(loop);

        now = Date.now();
        delta = now - then;

        if (playing && delta > interval) {
          then = now - (delta % interval);
          smooth = then / smoothFactor;

          distance += speed * (delta / 36e5);

          drawBackground();
          drawSky(smooth);
          drawGround(smooth, delta);
          drawRails(smooth, delta);
          drawPeople();
          drawTrain();
          drawScore();

          drawRect(colors[palette].other, 0, height, width, a.height);

          // Success, score points.
          if (trainPosition === scoreMethod * peopleAtBottom) {
            firstEncounter = false;
            peopleAtBottom = 0;
            score += 10;
            speed += 1;

            // If kill, draw shock.
            if (scoreMethod === 1) {
              drawShock();
            }
          }
          // Failure, game over.
          else if (trainPosition === -scoreMethod * peopleAtBottom) {
            if (firstEncounter) {
              firstEncounter = false;
              scoreMethod = -scoreMethod;
            }
            else {
              // gameOver();
            }
          }
        }
      }

      requestAnimationFrame(loop);
    