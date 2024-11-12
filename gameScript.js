var em = ["😎", "🌹", "⭐", "✌️", "😉", "🤩", "🤗", "🍓", "🍒", "🦁", "🐶", "🍊", "🥭", "🐼", "🫀", "🧸", "🎻", "🌞", "💫", "🙌", "🍅", "🌶️", "🔫", "🍯", "🎇", "🎀", "🍔", "🍕", "🧁", "🪺", "🍬", "🍩", "🍫", "🚀"];

// Shuffling emoji array
var tmp, c, p = em.length;
if (p) while (--p) {
  c = Math.floor(Math.random() * (p + 1));
  tmp = em[c];
  em[c] = em[p];
  em[p] = tmp;
}

// Variables
var pre = "", pID, ppID = 0, turn = 0, t = "transform", flip = "rotateY(180deg)", flipBack = "rotateY(0deg)", time, mode, min, sec, moves, rem, noItems;

// Resizing screen
window.onresize = init;
function init() {
  W = innerWidth;
  H = innerHeight;
  $('body').height(H + "px");
  $('#ol').height(H + "px");
}

// Showing instructions
window.onload = function() {
  $("#ol").html(`
    <center>
      <div id="inst">
        <h3>Gameplay!</h3>
        <p>Gameplay Directions</p>
        <ul>
          <li>Match similar blocks by performing flips to create pairs.</li>
          <li>To initiate a flip, simply click on a block.</li>
          <li>If the clicked blocks do not match, a flip will return them to their original state.</li>
        </ul>
        <p>Click on a mode below to start playing the game.</p>
        <button onclick="start(3, 4)">3 x 4</button>
        <button onclick="start(4, 4)">4 x 4</button>
        <button onclick="start(4, 5)">4 x 5</button>
        <button onclick="start(5, 6)">5 x 6</button>
        <button onclick="start(6, 6)">6 x 6</button>
      </div>
    </center>
  `);
};


// Starting the game
function start(r, l) {
  min = 0; sec = 0; moves = 0;
  $("#time").html("Time: 00:00");
  $("#moves").html("Moves: 0");
  
  // Timer
  time = setInterval(function() {
    sec++;
    if (sec == 60) { min++; sec = 0; }
    $("#time").html(`Time: ${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}`);
  }, 1000);
  
  rem = (r * l) / 2;
  noItems = rem;
  mode = r + "x" + l;
  
  // Generate pairs of emojis and shuffle
  var items = [];
  for (var i = 0; i < noItems; i++) items.push(em[i]);
  for (var i = 0; i < noItems; i++) items.push(em[i]);
  var tmp, c, p = items.length;
  if (p) while (--p) {
    c = Math.floor(Math.random() * (p + 1));
    tmp = items[c];
    items[c] = items[p];
    items[p] = tmp;
  }

  // Create table layout
  $("table").html("");
  var n = 1;
  for (var i = 1; i <= r; i++) {
    $("table").append("<tr>");
    for (var j = 1; j <= l; j++) {
      $("table").append(`<td id='${n}' onclick="change(${n})"><div class='inner'><div class='front'></div><div class='back'><p>${items[n - 1]}</p></div></div></td>`);
      n++;
    }
    $("table").append("</tr>");
  }

  // Hide instruction screen
  $("#ol").css('display', 'none');
}

// Function for flipping blocks
function change(x) {
  let i = `#${x} .inner`;
  let b = `#${x} .inner .back`;
  
  // Prevent extra flips if already matched or same block clicked
  if (turn === 2 || $(i).attr("flip") === "block" || ppID === x) return;
  
  // Flip the card
  $(i).addClass("flipped");
  
  if (turn === 1) {
    turn = 2;
    
    // If blocks don't match, flip them back
    if (pre !== $(b).text()) {
      setTimeout(function() {
        $(pID).removeClass("flipped");
        $(i).removeClass("flipped");
        ppID = 0;
      }, 1000);
    } else {
      // If blocks match, lock them in flipped position
      rem--;
      $(i).attr("flip", "block");
      $(pID).attr("flip", "block");
    }
    
    setTimeout(function() {
      turn = 0;
      moves++;
      $("#moves").html("Moves: " + moves);
    }, 1150);
    
  } else {
    pre = $(b).text();
    ppID = x;
    pID = `#${x} .inner`;
    turn = 1;
  }
  
  // If all pairs matched, show success message
  if (rem === 0) {
    clearInterval(time);
    let finalTime = min === 0 ? `${sec} seconds` : `${min} minute(s) and ${sec} second(s)`;
    setTimeout(function() {
      $("#ol").html(`
        <center>
          <div id="iol">
            <h2 style="font-size:30px; color:#FFD700; animation: bounce 1s infinite;">
              🎉 Congrats! 🎉
            </h2>
            <p style="font-size:23px; padding:10px; color:#FFD700;">
              You completed the ${mode} mode in <strong>${moves} moves</strong>. <br>It took you <strong>${finalTime}</strong> to match all pairs!
            </p>
            <p style="font-size:18px; color: #ffffff">Play Again?</p>
            <button onclick="start(3, 4)">3 x 4</button>
            <button onclick="start(4, 4)">4 x 4</button>
            <button onclick="start(4, 5)">4 x 5</button>
            <button onclick="start(5, 6)">5 x 6</button>
            <button onclick="start(6, 6)">6 x 6</button>
          </div>
        </center>
      `);
      $("#ol").fadeIn(750);
    }, 1500);
  }
  
  
}
