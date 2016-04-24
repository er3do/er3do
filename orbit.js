// This is where stuff in our game will happen:
var scene = new THREE.Scene();

var renderer = new THREE.WebGLRenderer();
// This is what sees the stuff:
var container = document.getElementById('container');
var aspect_ratio = container.offsetWidth / container.offsetHeight;
var above_cam = new THREE.PerspectiveCamera(45, aspect_ratio, 1, 1e6);
above_cam.position.z = 1500;
scene.add(above_cam);

var earth_cam = new THREE.PerspectiveCamera(45, aspect_ratio, 1, 1e6);

var camera = above_cam;

// This will draw what the camera sees onto the screen:
renderer.setSize(container.offsetWidth, container.offsetHeight);
container.appendChild(renderer.domElement);

// ******** START CODING ON THE NEXT LINE ********
document.body.style.backgroundColor = 'black';

var surface = new THREE.MeshPhongMaterial({color: 0xFFD700});
var star = new THREE.SphereGeometry(50, 28, 21);
var sun = new THREE.Mesh(star, surface);
scene.add(sun);

var ambient = new THREE.AmbientLight(0xffffff);
scene.add(ambient);

var sunlight = new THREE.PointLight(0xffffff, 10, 1000);
sun.add(sunlight);
var planets = [];
var nrOfPlanets = 1;
var asteroidsIds = []
asteroids.forEach(function (asteroid) {
  console.log(asteroid)
  var surface = new THREE.MeshPhongMaterial({color: asteroid.color || 0x222222});
  var radius = asteroid.radius || getRandomInt(5, 30);
  var planet = new THREE.SphereGeometry(radius, 10, 10);
  var planet = new THREE.Mesh(planet, surface);

  asteroidsIds.push(planet.id)

  planets.push(planet);
  scene.add(planet);
});

console.log(asteroidsIds)

var surfaceMars = new THREE.MeshPhongMaterial({color: 0xFF1111});
var marsGeo = new THREE.SphereGeometry(20, 20, 15);
var mars = new THREE.Mesh(marsGeo, surfaceMars);
//    mars.position.set(500 * Math.cos(1 / nrOfPlanets * 1 * 3.14 * 2), 500 * Math.sin(1 / nrOfPlanets * 1 * 3.14 * 2), 0);
scene.add(mars);

var surfacePhobos = new THREE.MeshPhongMaterial({color: 0xffffff});
var phobos = new THREE.SphereGeometry(10, 30, 25);
var phobos = new THREE.Mesh(phobos, surfacePhobos);

var phobos_orbit = new THREE.Object3D();
phobos_orbit.add(phobos);
phobos.position.set(0, 50, 0);

var surfaceDeimos = new THREE.MeshPhongMaterial({color: 0xffffff});
var deimos = new THREE.SphereGeometry(20, 30, 25);
var deimos = new THREE.Mesh(deimos, surfaceDeimos);

var deimos_orbit = new THREE.Object3D();
deimos_orbit.add(deimos);
deimos.position.set(0, -50, 0);

mars.add(phobos_orbit);
mars.add(deimos_orbit);

var surface = new THREE.MeshPhongMaterial({color: 0x0000cd});
var planet = new THREE.SphereGeometry(20, 20, 15);
var earth = new THREE.Mesh(planet, surface);
earth.position.set(250, 0, 0);
scene.add(earth);

var surface = new THREE.MeshPhongMaterial({color: 0xDDDDDD});
var planet = new THREE.SphereGeometry(15, 30, 25);
var moon = new THREE.Mesh(planet, surface);

var moon_orbit = new THREE.Object3D();
earth.add(moon_orbit);
moon_orbit.add(moon);
moon.position.set(0, 100, 0);
earth_cam.rotation.set(Math.PI / 2, 0, 0);
moon_orbit.add(earth_cam);

var time = 0,
  speed = 1,
  pause = false;
var dayNo = document.getElementById('day');
var date = new Date();
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);

  if (pause) return;

  time = time + speed;
  var dayIdx = parseInt(time/17.5);
  date.setTime(dayIdx * 1000 * 3600 * 24 + new Date().getTime());
  dayNo.innerText = dayIdx + ' / ' + date.toLocaleDateString('en-US');

  var e_angle = time * 0.001;
  earth.position.set(300 * Math.cos(e_angle), 300 * Math.sin(e_angle), 0);

  var mars_angle = time * 0.001;
  mars.position.set(500 * Math.cos(mars_angle), 500 * Math.sin(mars_angle), 0);

  var m_angle = time * 0.01;
  moon_orbit.rotation.set(0, 0, m_angle);

  var phobos_angle = time * 0.05;
  phobos_orbit.rotation.set(0, 0, phobos_angle);
  deimos_orbit.rotation.set(0, 0, phobos_angle * 4);

  var asteroids_angel = time * 0.001;
  asteroidsIds.forEach(function(id, index){
    var asteroidOnOrbit = scene.getObjectById(id)
    var orbitR = 570 + getRandomWithSave(-30, 40, id);
    var asteroidRadius = asteroidOnOrbit.geometry.parameters.radius;
    var angle = time * 0.1 / asteroidRadius * 30 + 365 / asteroidsIds.length * index; // avg spread elements on orbit
    var x = orbitR * Math.cos(THREE.Math.degToRad(angle));
    var y = orbitR * Math.sin(THREE.Math.degToRad(angle));
    asteroidOnOrbit.position.set(x, y, 0);


    if (!asteroidBars[id]) {
      var sphereBarMaterial = new THREE.MeshBasicMaterial({color: 0x0000FF });
      var sphereBar = new THREE.SphereGeometry(asteroidRadius, 10, 10);
      var sphereBar = new THREE.Mesh(sphereBar, sphereBarMaterial);
      asteroidBars[id] = sphereBar
      scene.add(sphereBar)
    }
    asteroidBars[id].position.set(x + 80, y, 0);


  });
}
var asteroidBars = {}
animate();



var stars = new THREE.Geometry();
while (stars.vertices.length < 1e4) {
  var lat = Math.PI * Math.random() - Math.PI / 2;
  var lon = 2 * Math.PI * Math.random();

  stars.vertices.push(new THREE.Vector3(
    1e5 * Math.cos(lon) * Math.cos(lat),
    1e5 * Math.sin(lon) * Math.cos(lat),
    1e5 * Math.sin(lat)
  ));
}
var star_stuff = new THREE.PointsMaterial({size: 200});
var star_system = new THREE.Points(stars, star_stuff);
scene.add(star_system);

document.addEventListener("keydown", function (event) {
  var code = event.which || event.keyCode;

  if (code == 67) changeCamera(); // C
  if (code == 32) changeCamera(); // Space
  if (code == 80) pause = !pause; // P
  if (code == 49) speed = 1; // 1
  if (code == 50) speed = 2; // 2
  if (code == 51) speed = 10; // 3
  if (code == 52) speed = 20; // 4
  if (code == 53) speed = 50; // 5
//        event.preventDefault();
});

document.addEventListener('mousewheel', function (event) {
  above_cam.position.z += event.wheelDelta;
});

document.addEventListener('click', function (event) {
  if (event.target.id !== 'cheap') return

  asteroids.forEach(function(asteroid, index) {
    var sceneObj = scene.getObjectById(asteroidsIds[index]);
    sceneObj.visible = asteroid.name === 'Vesta'
  })
});


function changeCamera() {
  if (camera == above_cam) camera = earth_cam;
  else camera = above_cam;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomWithSave(min, max, id) {
  return _.memoize(function(id) { return getRandomInt(min, max) }, () => id)()
}


$(function() {
  $('.order-button').click(function(){
    $('.screen').fadeOut(500)
    $('.why-you-need').fadeIn(500)
  });
});
document.addEventListener('click', function (event) {
  if (event.target.className !== 'why-you-need') return;

  document.querySelectorAll()
});
