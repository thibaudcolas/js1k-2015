
      // THIS IS WHERE YOUR DEMO GOES
      var this_can_be_really_long;
      var j, k;

      a.width = 100
      a.height = 100
      this_can_be_really_long = 'hello world'

      setInterval(function() {
        k = +new Date / 1000
        c.clearRect(0, 0, a.width, a.height)
        for (j=10;j--;)
          c.fillText(this_can_be_really_long,
            10 + Math.sin(k + j) * 5, 10 * j)
      }, 50)

      // END
    