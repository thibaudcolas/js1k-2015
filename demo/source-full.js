
      var width = a.width;
      var halfWidth = width / 2;
      var height = a.height;
      var halfHeight = height / 2;

      var trackInnerWidth = width / 10;
      var railWidth = trackInnerWidth / 5;

      var trainWidth = width / 20;
      // -1 = left, 1 = right.
      var trainPosition = -1;

      var peopleWidth = trainWidth / 2;
      // 0 = false, -1 = left, 1 = right.
      var peopleAtBottom = 0;

      var now;
      var then = 0;
      var interval = 999 / 30;
      var delta = 0;

      var distance = 0;
      var speed = 20;

      var score = 0;
      // -1 = spare lives, 1 = kill.
      var scoreMethod = -1;
      var firstEncounter = true;

      var colorBackground = '#e5ddac'; // 229 221 172
      var colorFar = '#efe9cd';
      var colorSky = '#fff';
      var colorEntity = '#61001d'; // 97 0 29
      var colorOther = '#8d494d';

      // for (e in c) c[e[0]+e[2]+(e[6]||'')] = c[e];
      // with(c) {}
      // function signatures

      a.ontouchstart = onclick = onkeydown = function() {
        // Can be reset here, check is done when people approach.
        peopleAtBottom = 0;
        trainPosition = -trainPosition;
      };

      bg = c.createLinearGradient(0, 0, 0, height);
      bg.addColorStop(0, colorBackground);
      bg.addColorStop(0.45, colorFar);
      bg.addColorStop(0.5, colorSky);
      bg.addColorStop(0.52, colorBackground);
      bg.addColorStop(1, colorFar);

      // I'm going to draw a lot of rectangles.
      function drawRect(color, x, y, w, h) {
        c.fillStyle = color;
        c.fillRect(x, y, w, h);
      }

      // Draws the level background.
      function drawBackground() {
        drawRect(bg, 0, 0, width, height);
      }

      function drawSky() {
        //for (i = width / 10; i--;) {
        for (var i = 0; i < width / 10; i++) {
          // Sky weather (particles).
          drawRect(colorSky, Math.random() * width, Math.random() * halfHeight, 1, 1);

          // Clouds.
          c.globalAlpha = 0.3;
          c.beginPath();
          c.arc(i * 12,  Math.sin(i + then / 999) * 5 - 5, 30 + Math.sin((i % 3)) * 5, 0, 9);
          c.fill();
          c.globalAlpha = 1;
        }
      }

      function drawGround() {
        // Horizon.
        //drawRect(colorFar, 0, halfHeight, width, 2);
        //drawRect(colorSky, 0, halfHeight, width, 1);

        // Depth effect.
        //c.globalAlpha = 0.9;
        var n = 70;
        for (i = n; i--;) {
          if ((9 * Math.sin((90 - i) / 57.3) / Math.sin(i / 57.3) + distance * 1000) % 18 > 9) {
            var y = halfHeight * (1 + i / n);
            drawRect(colorFar, 0, y, width, halfHeight / n);
          }
        }
      }

      function drawSide(position) {
        var startX = halfWidth + position * halfWidth / 2;
        var horizonX = halfWidth + position * halfWidth / 9;
        // Calculate line equation.
        var a = halfHeight / (startX - horizonX);
        var b = height - startX * a;

        c.fillStyle = colorOther;

        // Draw persons on the railway.
        var n = 50;
        for (i = n; i--;) {
          if ((9 * Math.sin((55 + position * i) / 19) / Math.sin(i / 19) + distance * 1000 + position * 2) % 20 > 19) {

            var w = peopleWidth * 2 * ((railWidth / 6 + i) / n);
            var h = w + halfHeight / n;

            var y = halfHeight * (1 + (i / n)) - h / 2;
            var x = (y - b) / a - w / 2;

            //drawRect(colorEntity, x, y, w, h);
            c.beginPath();
            //c.arc(x, y, w, 0, 9);
            c.arc(x, y, w, 0, 9);
            c.fill();

            if (i == n - 1 && y > halfHeight - halfHeight / 10) {
              peopleAtBottom = position;
            }
          }
        }

        // Draw tracks.
        c.beginPath();

        position = -1;
        c.moveTo(startX + position * trackInnerWidth + position * railWidth, height);
        c.lineTo(horizonX + position * (railWidth / 4), halfHeight + 1);
        c.lineTo(startX + position * trackInnerWidth, height);

        position = 1;
        c.moveTo(startX + position * trackInnerWidth + position * railWidth, height);
        c.lineTo(horizonX + position * (railWidth / 4), halfHeight + 1);
        c.lineTo(startX + position * trackInnerWidth, height);

        c.fill();

        // Debug rail
        // c.moveTo(startX - 2, height);
        // c.lineTo(horizonX, halfHeight);
        // c.lineTo(startX + 2, height);
        // c.fill();

        // Moving planks: Depth effect.
        var n = 70;
        for (i = n; i--;) {
          if ((9 * Math.sin((90 - i) / 57.3) / Math.sin(i / 57.3) + distance * 1000) % 4 > 3) {

            var w = (trackInnerWidth + railWidth * 2) * 2 * ((railWidth / 6 + i) / n);
            var h = halfHeight / n;

            var y = halfHeight * (1 + (i / n)) - h / 2;
            var x = (y - b) / a - w / 2;

            drawRect(colorOther, x, y, w, h);

            // Debug rail
            // c.beginPath();
            // c.moveTo(horizonX, halfHeight);
            // c.lineTo(x, y);
            // c.lineTo(startX, height);
            // c.stroke();
          }
        }
      }

      function drawTrain() {
        c.globalAlpha = 1;
        c.fillStyle = colorEntity;
        c.beginPath();
        c.arc(halfWidth + trainPosition * (halfWidth / 2), height, trainWidth, 0, 9);
        c.fill();
      }

      function drawScore(size, x, y) {
        c.globalAlpha = 1;
        c.font = size + 'vw mono';
        c.fillStyle = colorSky;
        c.fillText(score, x, y);
      }

      function drawShock() {
        c.globalAlpha = 0.8;
        c.fillStyle = colorEntity;
        c.fillRect(0, 0, width, height);
      }

      function gameOver() {
        // Makes the game stop.
        interval = 1e9;
        drawShock();
        drawScore(20, halfWidth * (8 / 10), halfHeight);
      }

      setInterval(function() {
        now = +new Date;
        delta = now - then;

        if (delta > interval) {
          then = now - (delta % interval);

          distance += speed * (delta / 36e5);

          drawBackground();
          drawSky();
          drawGround();
          drawSide(-1);
          drawSide(1);
          drawTrain();
          drawScore(5, 10, 50);

          // Bottom screen cleaning code.
          // drawRect(colorOther, 0, height, width, a.height);

          // Success, score points.
          if (trainPosition == scoreMethod * peopleAtBottom) {
            firstEncounter = false;
            peopleAtBottom = 0;
            score += 10;
            speed += 1;

            // If kill, draw shock.
            if (scoreMethod > 0) {
              drawShock();
            }
          }
          // Failure, game over.
          if (trainPosition == -scoreMethod * peopleAtBottom) {
            if (firstEncounter) {
              firstEncounter = false;
              scoreMethod = -scoreMethod;
            }
            else {
              gameOver();
            }
          }
        }
      }, 1);
    