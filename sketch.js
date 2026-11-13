let swimmers = [];
let card;
let cardText;
let hum;
let audioStarted = false;

const seedLetters = [
  "I hope the ocean is still alive when you read this.",
  "We had flying cars in our dreams. Did you get them?",
  "Tell the stars we said hello.",
  "I wrote this between two lectures. The coffee was terrible. I was happy.",
  "If money is gone, good. If music is gone, bring it back.",
  "Someone in 2026 loved someone who never knew. This is how I tell you.",
  "The sky here is still blue. I hope yours is too.",
  "We were scared of the future. You are the future. Be kind to us.",
  "My grandmother said letters outlive their writers. Prove her right.",
  "I am sending you the sound of rain on a tent. Keep it safe.",
  "Do people still swim? The water was cold and we went in anyway.",
  "Forgive us for the noise. Some of us were listening."
];

const warmWords = ["love", "hope", "warm", "happy", "hello", "kind", "dream", "stars", "sun", "light"];

function setup() {
  createCanvas(windowWidth, windowHeight);
  card = select("#letterCard");
  cardText = select("#cardText");
  textFont("Helvetica");

  for (let i = 0; i < seedLetters.length; i++) {
    swimmers.push(new Creature(random(80, width - 120), random(120, height - 140), seedLetters[i]));
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
  swimmers.push(new Creature(width * 0.32, height - 120, msg));
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
  drawOcean();

  let hovered = null;
  for (let s of swimmers) {
    s.move();
    s.show();
    if (s.isHover()) hovered = s;
  }

  if (hovered) {
    hovered.glowUp();
    let f = map(hovered.size, 10, 46, 220, 440);
    hum.freq(f, 0.1);
    hum.amp(0.06, 0.1);
    cursor(HAND);
  } else {
    hum.amp(0, 0.2);
    cursor(ARROW);
  }
}

function drawOcean() {
  for (let y = 0; y < height; y++) {
    let t = y / height;
    stroke(6 + 4 * t, 14 + 8 * t, 34 + 18 * t);
    line(0, y, width, y);
  }
  noStroke();
}

function mousePressed() {
  if (!audioStarted) {
    userStartAudio();
    audioStarted = true;
  }
  for (let s of swimmers) {
    if (s.isHover()) {
      card.style("display", "block");
      cardText.html(s.letter);
      s.flash();
      return;
    }
  }
  card.style("display", "none");
}

class Creature {
  constructor(x, y, letter) {
    this.x = x;
    this.y = y;
    this.letter = letter;
    this.seed = random(1000);
    this.size = map(constrain(letter.length, 10, 140), 10, 140, 10, 46);
    let w = warmth(letter);
    this.col = lerpColor(color(90, 190, 255), color(255, 190, 120), w);
    this.glow = 1;
    this.flashTimer = 0;
  }

  move() {
    let n = noise(this.seed + frameCount * 0.002);
    this.x += map(n, 0, 1, -0.6, 0.6);
    this.y += sin(frameCount * 0.01 + this.seed) * 0.35 - 0.12;
    if (this.y < -60) {
      this.y = height + 60;
      this.x = random(80, width - 80);
    }
    if (this.x < -80) this.x = width + 80;
    if (this.x > width + 80) this.x = -80;
  }

  isHover() {
    return dist(mouseX, mouseY, this.x, this.y) < this.size + 18;
  }

  glowUp() {
    this.glow = min(this.glow + 0.12, 2.6);
  }

  flash() {
    this.flashTimer = 30;
  }

  show() {
    this.glow = max(this.glow - 0.02, 1);
    let g = this.glow;
    if (this.flashTimer > 0) {
      g += this.flashTimer / 30;
      this.flashTimer--;
    }
    let r = red(this.col), gr = green(this.col), b = blue(this.col);

    for (let i = 6; i > 0; i--) {
      let rr = this.size + i * this.size * 0.55;
      fill(r, gr, b, 14 * g * (i / 6) * 2);
      ellipse(this.x, this.y, rr * 2);
    }

    stroke(r, gr, b, 90 * g);
    strokeWeight(2);
    noFill();
    beginShape();
    for (let k = 0; k < 20; k++) {
      let tx = this.x - this.size - k * 4;
      let ty = this.y + sin(frameCount * 0.08 + k * 0.5 + this.seed) * this.size * 0.3;
      vertex(tx, ty);
    }
    endShape();
    noStroke();

    fill(r, gr, b, 220);
    ellipse(this.x, this.y, this.size * 2);
    fill(255, 255, 255, 200);
    ellipse(this.x, this.y, this.size * 0.9);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
