// Every public airport as an ellipse on a 2:1 world map
// Each airport has: iata, icao, name, city, country, lat, lon, size

let airports = [];

async function setup() {
  // wait for the airports to load before carrying on
  // airports = await loadJSON("../json_data/all_public_airports.json");
  airports = await loadJSON("../json_data/all_public_airports.json");

  // canvas is twice as wide as it is tall (360° of lon by 180° of lat)
  let h = min(windowHeight, windowWidth / 2);
  createCanvas(h * 2, h);
  //noLoop();
}

function draw() {
  background(0);
  fill(255, 255, 255, 150);
  stroke(255)
  for (let airport of airports) {
    
    let x = map(airport.lng, -180, 180, 0, width);
    let y = map(airport.lat, 90, -90, 0, height);
   
    stroke(255) 
    point( x,y)
  
   
    
    
    //ellipse(x, y, 3, 3);
  }

  fill(255);
  text(airports.length + " airports", 20, 30);
}
