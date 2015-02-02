
      width = a.width;
      halfwidth = width / 2;
      height = halfwidth;
      halfheight = height / 2;

      fps = 30;
      now = then = Date.now();
      smoothFactor = 1000;
      smooth = now / smoothFactor;
      interval = 1000 / fps;
      delta = 0;

      distance = 0;
      speed = 100;

      colors = [
        {
          background: '#e5ddac', // 229 221 172
          far: '#efe9cd',
          sky: '#ffffff',
          entity: '#61001d', // 97 0 29
          other: '#8d494d'
        }
      ];

      // Date.now -> +new Date
      // for (e in c) c[e[0]+e[2]+(e[6]||'')] = c[e];
      // with(c) {}

      onclick = function() {
        speed += 10;
      };

      // I'm going to draw a lot of rectangles.
      function drawRect(color, x, y, w, h){
        c.fillStyle=color;
        c.fillRect(x, y, w, h);
      }

      bg = c.createLinearGradient(0, 0, 0, height);
      bg.addColorStop(0, colors[0].background);
      bg.addColorStop(0.45, colors[0].far);
      bg.addColorStop(0.5, colors[0].sky);
      bg.addColorStop(0.51, colors[0].background);
      bg.addColorStop(1, colors[0].far);

      // Draws the level background.
      function drawBackground() {
        drawRect(bg, 0, 0, width, height);
      }

      function drawSky(t) {
        c.fillStyle=colors[0].sky;
        for (var i = 0; i < width / 10; i++) {
          // Sky weather.
          c.fillRect(Math.random() * width - 1, Math.random() * halfheight - 1, 1, 1);

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
        drawRect(colors[0].far, 0, halfheight, width, 2);
        drawRect(colors[0].sky, 0, halfheight, width, 1);

        // Depth effect.
        c.globalAlpha = 0.9;
        distance += speed * (dt / 36e5);
        for (var i = 0; i < 70; i++) {
          if ((9 * Math.sin((90 - i) / 57.3) / Math.sin(i / 57.3) + distance * 1000) % 18 > 9) {
            drawRect(colors[0].far, 0, halfheight * (1 + i / 70), width, halfheight / 70);
          }
        }
      }

      function drawRails(t, dt) {
        c.fillStyle=colors[0].other;

        // Tracks
        c.beginPath();
        c.moveTo((halfwidth - 45) - 5, height);
        c.lineTo(halfwidth - 2, halfheight + 1);
        c.lineTo(halfwidth - 45, height);
        c.moveTo(halfwidth + 45, height);
        c.lineTo(halfwidth + 2, halfheight + 1);
        c.lineTo((halfwidth + 45) + 5, height);
        c.fill();

        // Depth effect.
        distance += speed * (dt / 36e5);
        for (var i = 0; i < 50; i++) {
          if ((9 * Math.sin((90 - i) / 57.3) / Math.sin(i / 57.3) + distance * 1000) % 4 > 3) {
            drawRect(colors[0].other, halfwidth - (65 * (i + 1) / 55), halfheight * (1 + i / 50), (65 * (i + 1) / 55) * 2, halfheight / 50);
          }
        }
      }

      function loop() {
        requestAnimationFrame(loop);

        now = Date.now();
        delta = now - then;

        if (delta > interval) {
          then = now - (delta % interval);
          smooth = then / smoothFactor;

          drawBackground(smooth);
          drawSky(smooth);
          drawGround(smooth, delta);
          drawRails(smooth, delta);
        }
      }

      loop();
    