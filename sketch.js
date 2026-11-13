let stars = [];
let comets = [];
let card;
let cardText;
let hum;
let audioStarted = false;

const seedLetters = [
  "I hope the night sky is still dark enough to see me.",
  "We had flying cars in our dreams. Did you get them?",
  "Tell the stars we said hello back.",
  "I wrote this between two lectures. The coffee was terrible. I was happy.",
  "If money is gone, good. If music is gone, bring it back.",
  "Someone in 2026 loved someone who never knew. This is how I tell you.",
  "The sky here is still blue in the day. I hope yours is too.",
  "We were scared of the future. You are the future. Be kind to us.",
  "My grandmother said letters outlive their writers. Prove her right.",
  "I am sending you the sound of rain on a tent. Keep it safe.",
  "Do people still look up? We forgot to, most days.",
  "Forgive us for the noise. Some of us were listening."
];

const warmWords = ["love", "hope", "warm", "happy", "hello", "kind", "dream", "stars", "sun", "light"];

function setup() {
  createCanvas(windowWidth, windowHeight);
  card = select("#letterCard");
  cardText = select("#cardText");
  textFont("Georgia");

  for (let i = 0; i < seedLetters.length; i++) {
    stars.push(new Star(random(90, width - 140), random(90, height * 0.62), seedLetters[i]));
  }

  select("#sendBtn").mousePressed(sendLetter);
  select("#letterInput").elt.addEventListener("keydown", function (e) {
    if (e.key === "Enter") sendLetter();
  });

  hum = new p5.Oscillator("sine");
  hum.amp(0);
  hum.start();
}

function sendLetter() {
  let inp = select("#letterInput");
  let msg = inp.value().trim();
  if (msg.length === 0) return;
  let targetX = random(90, width - 140);
  let targetY = random(90, height * 0.62);
  comets.push(new Comet(targetX, targetY, msg));
  inp.value("");
}

function warmth(text) {
  let t = text.toLowerCase();
  let score = 0;
  for (let w of warmWords) {
    if (t.includes(w)) score++;
  }
  return score / warmWords.length;
}

function draw() {
  drawSky();

  for (let i = 0; i < stars.length; i++) {
    for (let j = i + 1; j < stars.length; j++) {
      let dd = dist(stars[i].x, stars[i].y, stars[j].x, stars[j].y);
      if (dd < 220) {
        stroke(140, 170, 220, map(dd, 0, 220, 34, 6));
        strokeWeight(1);
        line(stars[i].x, stars[i].y, stars[j].x, stars[j].y);
      }
    }
  }
  noStroke();

  let hovered = null;
  for (let s of stars) {
    s.twinkle();
    s.show();
    if (s.isHover()) hovered = s;
  }

  for (let i = comets.length - 1; i >= 0; i--) {
    comets[i].move();
    comets[i].show();
    if (comets[i].done) {
      stars.push(new Star(comets[i].tx, comets[i].ty, comets[i].letter));
      comets.splice(i, 1);
    }
  }

  if (hovered) {
    let f = map(hovered.size, 3, 12, 330, 660);
    hum.freq(f, 0.1);
    hum.amp(0.05, 0.1);
    cursor(HAND);
  } else {
    hum.amp(0, 0.2);
    cursor(ARROW);
  }
}

function drawSky() {
  for (let y = 0; y < height; y++) {
    let t = y / height;
    stroke(8 + 6 * t, 10 + 6 * t, 28 + 14 * t);
    line(0, y, width, y);
  }
  noStroke();
  for (let i = 0; i < 90; i++) {
    let sx = (i * 197.3) % width;
    let sy = (i * 131.7) % (height * 0.75);
    let tw = 120 + 60 * sin(frameCount * 0.03 + i);
    fill(200, 215, 240, tw * 0.5);
    circle(sx, sy, 1.6);
  }
  noFill();
}

function mousePressed() {
  if (!audioStarted) {
    userStartAudio();
    audioStarted = true;
  }
  for (let s of stars) {
    if (s.isHover()) {
      card.style("display", "block");
      cardText.html(s.letter);
      s.flashTimer = 40;
      return;
    }
  }
  card.style("display", "none");
}

class Star {
  constructor(x, y, letter) {
    this.x = x;
    this.y = y;
    this.letter = letter;
    this.seed = random(1000);
    this.size = map(constrain(letter.length, 10, 140), 10, 140, 3.5, 12);
    let w = warmth(letter);
    this.col = lerpColor(color(170, 200, 255), color(255, 214, 140), w);
    this.flashTimer = 0;
    this.born = frameCount;
  }

  twinkle() {}

  isHover() {
    return dist(mouseX, mouseY, this.x, this.y) < this.size + 14;
  }

  show() {
    let hov = this.isHover();
    let tw = 0.75 + 0.25 * sin(frameCount * 0.05 + this.seed * 3);
    let r = red(this.col), g = green(this.col), b = blue(this.col);
    let grow = min((frameCount - this.born) / 60, 1);
    let size = this.size * grow;

    let haloR = size * (hov ? 7 : 4.5);
    for (let i = 4; i > 0; i--) {
      let a = (hov ? 26 : 12) * (i / 4);
      fill(r, g, b, a);
      circle(this.x, this.y, haloR * (i / 4) * 2);
    }

    let spike = size * (hov ? 3.4 : 2.4) * tw;
    stroke(r, g, b, hov ? 200 : 130);
    strokeWeight(1.4);
    line(this.x - spike, this.y, this.x + spike, this.y);
    line(this.x, this.y - spike, this.x, this.y + spike);
    noStroke();

    fill(r, g, b, 235 * tw);
    circle(this.x, this.y, size * 2);
    fill(255, 255, 255, 230);
    circle(this.x, this.y, size * 0.9);

    if (hov) {
      noFill();
      stroke(255, 220, 150, 160);
      strokeWeight(1.5);
      let ring = size * 3 + 6 * sin(frameCount * 0.12);
      circle(this.x, this.y, ring * 2);
      noStroke();
    }

    if (this.flashTimer > 0) {
      fill(255, 240, 200, this.flashTimer * 3);
      circle(this.x, this.y, size * 2 + this.flashTimer);
      this.flashTimer--;
    }
  }
}

class Comet {
  constructor(tx, ty, letter) {
    this.tx = tx;
    this.ty = ty;
    this.letter = letter;
    this.x = tx + width * 0.35;
    this.y = -40;
    this.done = false;
  }

  move() {
    this.x += (this.tx - this.x) * 0.06;
    this.y += (this.ty - this.y) * 0.06;
    if (dist(this.x, this.y, this.tx, this.ty) < 2) this.done = true;
  }

  show() {
    stroke(255, 230, 170, 140);
    strokeWeight(2);
    line(this.x, this.y, this.x + 26, this.y - 18);
    noStroke();
    fill(255, 236, 190);
    circle(this.x, this.y, 8);
    fill(255, 255, 255);
    circle(this.x, this.y, 4);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
