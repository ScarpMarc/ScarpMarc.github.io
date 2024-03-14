class ArrayList extends Array {
  constructor() {
    super(...[]);
  }
  size() {
    return this.length;
  }
  add(x) {
    this.push(x);
  }
  get(i) {
    return this[i];
  }
  remove(i) {
    this.splice(i, 1);
  }
}

let phase = 0;
let noise_max = 0; //.2;
let offset_z = 0;
let angle_increment = 60;
let shape_amt = 15;
let glob_ang = 0;
let increment_z = 0;
let scalefact = 1.0;
let a;
let x;
let y;
let xoff;
let yoff;
let r;
let coli = 0;
let colj = 0;
let colk = 0;
let dirCI = true;
let dirCJ = true;
let dirCK = true;
let refresh = true;
let initialRefresh = 5;
let coords;
let cascadiaCode;
let cascadiaCodeItalic;
let visibleText=true;
let isMobileDevice = false;
let btn;

function mouseClicked() {
  refresh = true;
}

function keyTyped() {
  if (key === ' ') {
    visibleText = !visibleText;
  } 
}

function initShape() {
  coords.add(new p5.Vector(0, 0));
  for (a = 0; a < TWO_PI; a += radians(angle_increment)) {
    coords.add(new p5.Vector(0, 0));
  }
  coords.add(new p5.Vector(0, 0));
}

function openGithub(){
  window.open("https://github.com/ScarpMarc");
}

function setup() {
  //fullscreen(true);
  let details = navigator.userAgent;

  /* Creating a regular expression 
  containing some mobile devices keywords 
  to search it in details string*/
  let regexp = /android|iphone|kindle|ipad/i;

  /* Using test() method to search regexp in details
  it returns boolean value*/
  isMobileDevice = regexp.test(details);

  createCanvas(window.innerWidth, window.innerHeight, WEBGL);
  colorMode(RGB);
  coords = new ArrayList();
  cascadiaCode = loadFont("CascadiaCode-Regular.otf");
  cascadiaCodeItalic = loadFont("CascadiaMono-Italic.otf");
  initShape();

  textFont(cascadiaCode);
  stroke("white");
  strokeWeight(1);
  fill("white");
  //noFill();
  textSize(70);
  textAlign(CENTER);

  background("#1c1c1c");
  
  /*  let a = createA('http://p5js.org/', 'CLICK ME', '_blank');
  a.position(width/1.5, height/2.58);*/

  
  btn = createButton('Click me');
  
  btn.mousePressed(openGithub);  
  // Call randomColor() when
  // the button is pressed.
  //btn.mousePressed(randomColor);

}

function getSingleShape(zmod) {
  let index = 1;

  for (a = 0; a < TWO_PI; a += radians(angle_increment)) {
    xoff = map(cos(a + phase), -1, 1, 0, noise_max);
    yoff = map(sin(a + phase), -1, 1, 0, noise_max);
    r =
      map(
        noise(xoff, yoff, offset_z + increment_z * zmod),
        0,
        1,
        2,
        height / 5
      ) + pow(scalefact, zmod + 1);
    x = r * cos(a);
    y = r * sin(a);
    x += map(mouseX, 0, width, -width / 50, width / 50) * zmod;
    y += map(mouseY, 0, height, -height / 50, height / 50) * zmod;
    coords[index].x = x;
    coords[index].y = y;

    ++index;
  }
  coords[0].x = coords.get(coords.size() - 3).x;
  coords[0].y = coords.get(coords.size() - 3).y;

  coords[coords.size() - 1].x = coords.get(2).x;
  coords[coords.size() - 1].y = coords.get(2).y;

  coords[coords.size() - 1] = coords.get(2);
}
function draw() {
  if (refresh) {
    clear();
    background("#1c1c1c");
    refresh = false;
  }
  
  //translate(width / 2, height / 2);
  increment_z = map(mouseX, 0, width, 0.001, 0.5); // was .001, .1
  scalefact = map(mouseY, 0, height, 1, 1.5); // was 1, 1.8
  for (let i = 0; i < shape_amt; ++i) {
    let tempc1, tempc2;
    tempc1 = color(
      map(cos(glob_ang + phase), -1, 1, 0, 255),
      map(sin(glob_ang + phase), -1, 1, 0, 255),
      map(noise(cos(glob_ang + phase), sin(glob_ang + phase)), -1, 1, 0, 255)
    );
    tempc2 = color(
      map(cos(glob_ang + phase), -1, 1, 0, 255),
      map(noise(sin(glob_ang + phase), cos(glob_ang + phase)), -5, 5, 0, 255),
      map(sin(glob_ang + phase), -1, 1, 0, 255)
    );
    let colour = lerpColor(tempc1, tempc2, map(i, 0, shape_amt + 2, 0, 1));
    getSingleShape(i);
    stroke(colour);
    strokeWeight(10);
    noFill();
    beginShape();
    for (let j = 0; j < coords.size(); ++j) {
      curveVertex(coords.get(j).x, coords.get(j).y);
    }
    endShape();

    /* for (let j = 0; j <coords.size(); ++j)
     {
     text(j, coords.get(j).x, coords.get(j).y);
     }*/
    phase += 0.0001;
    offset_z += 0.0001;
    glob_ang += radians(0.01);
    if (glob_ang > TWO_PI) glob_ang = 0;
  }

  //textFont("Madimi One");
  if(!visibleText) {
    stroke("#1c1c1c");
    fill("#1c1c1c");
  }
  else{
    stroke("#white");
    fill("#white");
  }
  textFont(cascadiaCode);
  strokeWeight(1);
  //noFill();
  if(isMobileDevice){
    textSize(30);
  }else{
    textSize(70);
  }
  
  textAlign(CENTER);
  text("Marco Scarpelli", 0, -height/4);
  
  if(isMobileDevice){
    textSize(15);
  }else{
    textSize(20);
  }
  textAlign(LEFT);  
  
  let s = "I'm Marco. I like simulating things.\n\nYou can access my GitHub page here: ";
  let w = textWidth(s);
  
  text(s, -width/3, -height/6, width*2/3);
  
  if(isMobileDevice){
    btn.position(width/2.4, height/2.28);
  }else{
    btn.position(width/6 + w, height/2.63);
  }

  
  text("You will find:\n- A Finite-element, Navier Stokes simulation of a Pterodactyl in a box;\n- A clustering system for an NBody simulation;\n- Various contributions to Uni-related projects;\n- An exporter for an old video game's mesh files;\n- To be continued...", -width/3, height/32, width*2/3);
  
  //textFont("Madimi One");
  textFont(cascadiaCode);
  stroke("#white");
  strokeWeight(1);
  fill("#white");
  //noFill();
  textSize(15);
  textAlign(CENTER);
  text("Best viewed on a PC!", 0, height/2 - 50);
  text("(Click to reset)", 0, height/2 - 30);
  text("(Spacebar to change text mode)", 0, height/2 - 10);
  
  if (initialRefresh > 0) {
    clear();
    background("#1c1c1c");

    --initialRefresh;
  }
}
