
      var width = a.width;
      var halfWidth = width / 2;
      var height = a.height;
      var halfHeight = height / 2;

      var trackWidth = width / 9;
      var railWidth = trackWidth / 5;

      var entitySize = halfWidth / 9;
      // -1 = left, 1 = right.
      var trainPosition = -1;

      // 0 = false, -1 = left, 1 = right.
      var peopleAtBottom = 0;

      var now;
      var then = 0;
      var interval = 1e3 / 30;
      var delta = 0;

      var distance = 0;
      var speed = 20;

      var score = 0;
      // -1 = spare lives, 1 = kill.
      var scoreMethod = -1;
      var firstEncounter = 1;

      var colorBackground = '#eda'; // '#e5ddac'
      var colorFar = '#eec'; // '#efe9cd'
      var colorSky = '#fff';
      var colorEntity = '#602'; // '#61001d'
      var colorOther = '#944'; // '#8d494d'

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
      // bg.addColorStop(0.45, colorFar);
      bg.addColorStop(0.5, colorSky);
      bg.addColorStop(0.52, colorBackground);
      // bg.addColorStop(1, colorFar);

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
        // Bitwise OR to round the value.
        n = entitySize | 0;
        for (i = n; i--;) {
          drawRect(colorSky);
          // Sky weather (particles).
          //drawRect(colorSky, Math.random() * width, Math.random() * halfHeight, 1, 1);

          // Clouds.
          c.globalAlpha = 0.3;
          c.beginPath();
          c.arc(i * 20,  Math.sin(i + then / 1e3) * 5, Math.sin(i % 3) * trackWidth, 0, 9);
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
        n = 70;
        for (i = n; i--;) {
          if ((distance * 1e3 + 9 * Math.sin((90 - i) / 57) / Math.sin(i / 57)) % 18 > 9) {
            drawRect(colorFar, 0, halfHeight * (1 + i / n), width, halfHeight / n);
          }
        }
      }

      function drawSide(position) {
        var startX = halfWidth + position * halfWidth / 2;
        var horizonX = halfWidth + position * halfWidth / 9;
        // Calculate line equation.
        var a = halfHeight / (startX - horizonX);
        var b = height - startX * a;

        drawRect(colorOther);

        // Draw persons on the railway.
        n = 50;
        for (i = n; i--;) {
          if ((distance * 1e3 + 9 * Math.sin((55 + position * i) / 19) / Math.sin(i / 19) + position * 2) % 20 > 19) {

            var w = entitySize * ((railWidth / 6 + i) / n);
            var h = w + halfHeight / n;

            var y = halfHeight * (1 + (i / n)) - h / 2;
            var x = (y - b) / a - w / 2;

            //drawRect(colorEntity, x, y, w, h);
            c.beginPath();
            //c.arc(x, y, w, 0, 9);
            c.arc(x, y, w, 0, 9);
            c.fill();

            if (i == n - 1 && y > halfHeight - halfHeight / 9) {
              peopleAtBottom = position;
            }
          }
        }

        // Draw tracks.
        c.beginPath();

        position = -1;
        c.moveTo(startX + position * trackWidth + position * railWidth, height);
        c.lineTo(horizonX + position * (railWidth / 4), halfHeight + 1);
        c.lineTo(startX + position * trackWidth, height);

        position = 1;
        c.moveTo(startX + position * trackWidth + position * railWidth, height);
        c.lineTo(horizonX + position * (railWidth / 4), halfHeight + 1);
        c.lineTo(startX + position * trackWidth, height);

        c.fill();

        // Debug rail
        // c.moveTo(startX - 2, height);
        // c.lineTo(horizonX, halfHeight);
        // c.lineTo(startX + 2, height);
        // c.fill();

        // Moving planks: Depth effect.
        n = 70;
        for (i = n; i--;) {
          if ((distance * 1e3 + 9 * Math.sin((90 - i) / 57) / Math.sin(i / 57)) % 4 > 3) {

            var w = (trackWidth + railWidth * 2) * 2 * ((railWidth / 6 + i) / n);
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
        drawRect(colorEntity);
        c.beginPath();
        c.arc(halfWidth + trainPosition * (halfWidth / 2), height, entitySize, 0, 9);
        c.fill();
      }

      function drawScore(size, x, y) {
        c.globalAlpha = 1;
        c.font = size + 'vw mono';
        drawRect(colorSky);
        c.fillText(score, x, y);
      }

      function drawShock() {
        c.globalAlpha = 0.8;
        drawRect(colorEntity, 0, 0, width, height);
      }

      function gameOver() {
        // Makes the game stop.
        interval = 1e9;
        drawShock();
        drawScore(20, halfWidth * (7 / 9), halfHeight);
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
          drawScore(5, 9, 50);

          // Bottom screen cleaning code.
          // drawRect(colorOther, 0, height, width, a.height);

          // Success, score points.
          if (trainPosition == scoreMethod * peopleAtBottom) {
            firstEncounter = peopleAtBottom = 0;
            score += 10;
            speed++;

            // If kill, draw shock.
            if (scoreMethod > 0) {
              drawShock();
            }
          }
          // Failure, game over.
          // trainPosition == -scoreMethod * peopleAtBottom && ((firstEncounter && (firstEncounter = scoreMethod = -scoreMethod)) || gameOver());
          if (trainPosition == -scoreMethod * peopleAtBottom) {
            if (firstEncounter > 0) {
              firstEncounter = scoreMethod = -scoreMethod;
            }
            else {
              gameOver();
            }
          }
        }
      }, 1);
    