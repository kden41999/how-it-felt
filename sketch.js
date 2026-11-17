let current = null;
let stage;
let gallery;
let blip;
let rainNoise;
let rainFilter;

const EXHIBITS = {
  typing: {
    title: "Exhibit 001 - The Typing Bubble",
    caption: "A message was being written to you. Watch the dots. Click to send another \"?\" while you wait, the way we all did. It will not help.",
    make: () => new TypingBubble()
  },
  battery: {
    title: "Exhibit 002 - One Percent",
    caption: "Your battery is at 1%. Every movement of the cursor drains it faster. Hold perfectly still to make the evening last a little longer.",
    make: () => new OnePercent()
  },
  rain: {
    title: "Exhibit 003 - Rain on Glass",
    caption: "It is raining and there is nowhere you need to be. Drag across the glass to wipe it. The rain will keep coming. That is fine.",
    make: () => new RainOnGlass()
  }
};

function setup() {
  let c = createCanvas(900, 560);
  c.parent("canvasHolder");
  stage = select("#stage");
  gallery = select("#gallery");
  textFont("Helvetica");

  let cards = document.querySelectorAll(".exhibitCard");
  cards.forEach(card => {
    card.addEventListener("click", () => openExhibit(card.dataset.exhibit));
  });
  select("#backBtn").mousePressed(closeExhibit);

  blip = new p5.Oscillator("sine");
  blip.amp(0);
  blip.start();

  rainNoise = new p5.Noise("pink");
  rainFilter = new p5.LowPass();
  rainFilter.freq(900);
  rainNoise.disconnect();
  rainNoise.connect(rainFilter);
  rainNoise.amp(0);
  rainNoise.start();

  noLoop();
}

function openExhibit(key) {
  userStartAudio();
  gallery.style("display", "none");
  stage.style("display", "block");
  select("#stageTitle").html(EXHIBITS[key].title);
  select("#stageCaption").html(EXHIBITS[key].caption);
  if (current) current.stop();
  current = EXHIBITS[key].make();
  current.start();
  loop();
}

function closeExhibit() {
  if (current) current.stop();
  current = null;
  stage.style("display", "none");
  gallery.style("display", "flex");
  noLoop();
}

function draw() {
  if (current) current.draw();
}

function mousePressed() {
  if (current) current.mousePressed();
}

function mouseDragged() {
  if (current) current.mouseDragged();
}

function playBlip(freq) {
  blip.freq(freq);
  blip.amp(0.08, 0.02);
  blip.amp(0, 0.25, 0.05);
}

class Exhibit {
  start() {}
  stop() {}
  draw() {}
  mousePressed() {}
  mouseDragged() {}
}

class TypingBubble extends Exhibit {
  constructor() {
    super();
    this.msgs = [
      { me: true, text: "hey, are you awake?" },
      { me: false, text: "yeah. whats up" },
      { me: true, text: "ok so i have to tell you something" }
    ];
    this.typing = true;
    this.typingFor = 0;
    this.pauses = 0;
    this.waitAfter = 0;
    this.nudges = 0;
    this.done = false;
    this.t = 0;
  }

  bubble(x, y, w, text, me) {
    noStroke();
    fill(me ? color(28, 26, 22) : color(250, 247, 239));
    if (!me) {
      stroke(200, 193, 175);
      strokeWeight(1.5);
    }
    rect(x, y, w, 44, 14);
    noStroke();
    fill(me ? color(244, 240, 230) : color(28, 26, 22));
    textAlign(LEFT, CENTER);
    textSize(17);
    text(text, x + 18, y + 23);
  }

  draw() {
    background(244, 240, 230);
    this.t++;

    textAlign(LEFT, TOP);
    fill(140, 130, 110);
    textSize(13);
    text("THURSDAY, 11:38 PM", 60, 36);

    let y = 90;
    for (let m of this.msgs) {
      let w = textWidth(m.text) + 40;
      this.bubble(m.me ? width - 60 - w : 60, y, w, m.text, m.me);
      y += 62;
    }

    if (this.typing) {
      this.typingFor++;
      let dotsX = 60;
      noStroke();
      fill(250, 247, 239);
      stroke(200, 193, 175);
      strokeWeight(1.5);
      rect(dotsX, y, 92, 44, 14);
      noStroke();
      for (let i = 0; i < 3; i++) {
        let bounce = sin(this.t * 0.12 - i * 0.9) * 4;
        fill(120, 112, 96);
        circle(dotsX + 24 + i * 22, y + 22 + bounce, 9);
      }
      if (this.typingFor % 240 === 0) {
        this.pauses++;
        this.typingFor = 0;
        if (this.pauses % 3 === 2) this.typing = false;
      }
      if (this.pauses >= 6 + this.nudges * 2) {
        this.msgs.push({ me: false, text: "ok" });
        playBlip(660);
        this.typing = false;
        this.done = true;
        this.waitAfter = this.t;
        this.pauses = -9999;
      }
    } else if (!this.done) {
      fill(140, 130, 110);
      textSize(14);
      textAlign(LEFT, TOP);
      text("typing stopped.", 64, y + 14);
      if (this.t % 300 === 0) {
        this.typing = true;
        this.typingFor = 0;
      }
    }

    if (this.done) {
      fill(140, 130, 110);
      textSize(14);
      textAlign(CENTER, TOP);
      text("eleven minutes. the message was \"ok\". this happened to everyone, constantly.", width / 2, height - 110);
      if (this.t - this.waitAfter > 400) {
        this.msgs = this.msgs.slice(0, 3);
        this.typing = true;
        this.done = false;
        this.pauses = 0;
        this.typingFor = 0;
        this.nudges = 0;
      }
    } else {
      fill(179, 64, 42);
      textSize(14);
      textAlign(CENTER, TOP);
      text("click to send another \"?\"", width / 2, height - 110);
    }
  }

  mousePressed() {
    if (this.done) return;
    this.nudges++;
    this.msgs.push({ me: true, text: "?" });
    playBlip(440);
    if (this.msgs.length > 6) this.msgs.splice(3, 1);
  }
}

class OnePercent extends Exhibit {
  constructor() {
    super();
    this.level = 100;
    this.survived = 0;
    this.dead = false;
    this.deathT = 0;
    this.lastMX = 0;
    this.lastMY = 0;
  }

  start() {
    this.lastMX = mouseX;
    this.lastMY = mouseY;
  }

  draw() {
    background(28, 30, 38);

    if (!this.dead) {
      let moved = dist(mouseX, mouseY, this.lastMX, this.lastMY);
      this.lastMX = mouseX;
      this.lastMY = mouseY;
      let drain = 0.012 + min(moved * 0.004, 0.35);
      this.level -= drain;
      this.survived += 1 / 60;
      if (this.level <= 0) {
        this.level = 0;
        this.dead = true;
        playBlip(160);
      }
    } else {
      this.deathT++;
    }

    let flicker = this.level < 25 ? random(0.85, 1) : 1;
    let pct = ceil(this.level / 100 * 1);
    if (this.level > 0 && pct === 0) pct = 1;

    noFill();
    stroke(230 * flicker);
    strokeWeight(3);
    rect(width / 2 - 160, 150, 320, 90, 12);
    rect(width / 2 + 160, 175, 14, 40, 5);
    noStroke();
    fill(this.level < 25 ? color(200, 70, 50) : color(220, 210, 180));
    rect(width / 2 - 150, 160, max(300 * this.level / 100, 0), 70, 8);

    fill(240 * flicker);
    textAlign(CENTER, CENTER);
    textSize(64);
    text("1%", width / 2, 300);
    textSize(16);
    fill(150 * flicker);
    text("survived: " + nf(this.survived, 2, 1) + " seconds", width / 2, 360);
    textSize(14);
    fill(179, 64, 42);
    text("do not move.", width / 2, 420);

    if (this.dead) {
      fill(28, 30, 38, min(this.deathT * 2, 235));
      rect(0, 0, width, height);
      if (this.deathT > 90) {
        fill(200, 195, 180);
        textAlign(CENTER, CENTER);
        textSize(22);
        text("11:47 pm", width / 2, height / 2 - 30);
        textSize(16);
        fill(140, 135, 120);
        text("the screen went dark. you never saw the reply.", width / 2, height / 2 + 16);
        text("you lasted " + nf(this.survived, 2, 1) + " seconds. click to try again.", width / 2, height / 2 + 52);
      }
    }
  }

  mousePressed() {
    if (this.dead && this.deathT > 90) {
      this.level = 100;
      this.survived = 0;
      this.dead = false;
      this.deathT = 0;
    }
  }
}

class RainOnGlass extends Exhibit {
  constructor() {
    super();
    this.drops = [];
    for (let i = 0; i < 160; i++) {
      this.drops.push({ x: random(width), y: random(height), s: random(6, 10), len: random(10, 26) });
    }
    this.lights = [];
    for (let i = 0; i < 26; i++) {
      this.lights.push({
        x: random(width), y: random(height * 0.35, height * 0.85),
        r: random(14, 46),
        c: random([color(255, 190, 110), color(140, 180, 230), color(230, 120, 90), color(200, 200, 170)])
      });
    }
    this.wipes = [];
  }

  start() {
    rainNoise.amp(0.12, 0.5);
  }

  stop() {
    rainNoise.amp(0, 0.3);
  }

  draw() {
    background(24, 33, 46);
    for (let l of this.lights) {
      noStroke();
      let c = l.c;
      fill(red(c), green(c), blue(c), 95);
      circle(l.x, l.y, l.r * 2);
      fill(red(c), green(c), blue(c), 55);
      circle(l.x, l.y, l.r * 3.4);
    }

    fill(38, 52, 72, 150);
    rect(0, 0, width, height);

    for (let w of this.wipes) {
      fill(190, 210, 235, 22);
      circle(w.x, w.y, w.r * 2.2);
      fill(210, 228, 248, 16);
      circle(w.x, w.y, w.r * 1.4);
    }

    stroke(205, 222, 245, 200);
    for (let d of this.drops) {
      d.y += d.s;
      if (d.y > height) {
        d.y = -20;
        d.x = random(width);
      }
      let wiped = false;
      for (let w of this.wipes) {
        if (dist(d.x, d.y, w.x, w.y) < w.r) {
          wiped = true;
          break;
        }
      }
      if (!wiped) {
        strokeWeight(2);
        line(d.x, d.y, d.x - 2, d.y - d.len);
      }
    }
    noStroke();

    for (let w of this.wipes) {
      noFill();
      stroke(225, 238, 252, 60);
      strokeWeight(1.5);
      circle(w.x, w.y, w.r * 2);
      noStroke();
    }

    fill(215, 222, 235);
    textAlign(CENTER, TOP);
    textSize(14);
    text("tuesday. nothing else was happening. drag to wipe the glass.", width / 2, height - 50);
  }

  mouseDragged() {
    this.wipes.push({ x: mouseX, y: mouseY, r: 46 });
    if (this.wipes.length > 90) this.wipes.shift();
  }
}
