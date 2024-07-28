import { Camera } from "./Camera.js";
import { Comet } from "./Comet.js";
import { Planet } from "./Planet.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const cWidth = canvas.width;
const cHeight = canvas.height;

// ============================================ GLOBAL VARIABLE  START ============================================ //

// let cameraX = 0;
// let cameraY = 0;
// let cameraMovementSpeed = 10;

let camera = new Camera(ctx, cWidth, cHeight);

let followComet = -1;

let debug = true;
let showTrajectory = true;
let borderWall = false;

let pressedKey = null;

let isMouseDown = false;
let isMouseLeftDown = false;
let mouseDownX, mouseDownY;
let curMouseX, curMouseY;

let planets = [];
let comets = [];

// planets.push(new Planet(200, 200, 50, -1, "black"));
// planets.push(new Planet(500, 200, 50, -1, "black"));

let cometSpawnRadius = 5;

let currentSpawning = 0; // 0 - planet , 1 - comet
const PLANET = 0;
const COMET = 1;
const TOTAL_SPAWNABLE = 2; // planet , comet

// let planets = [[100, 100, 50, 100, false], [500, 100, 50, 200, false]];
// Format : {x, y, radius, mass, fixed? }

// let comets = []; // [10, 10, 50, 100 ]
// Format : {x, y, radius, mass }

// ============================================ GLOBAL VARIABLE  END ============================================ //

// ============================================ INPUT START ============================================ //

// canvas.addEventListener("click", (e) => {
//     isMouseLeftDown = e.button === 0;
//     comets.push(new Comet(e.x, e.y, 5, 20, "red", 0, -0.5));
// });

// canvas.addEventListener("contextmenu", (e) => {
//     isMouseDown = false;
// });

canvas.addEventListener("mousedown", (e) => {
    isMouseDown = true;
    isMouseLeftDown = e.button === 0;
    mouseDownX = e.x;
    mouseDownY = e.y;
    curMouseX = e.x;
    curMouseY = e.y;

    console.log(mouseDownX + ", " + mouseDownY + " : " + curMouseX + " , " + curMouseY);
});

canvas.addEventListener("mouseup", (e) => {
    isMouseDown = false;
    curMouseX = e.x;
    curMouseY = e.y;

    // console.log(mouseDownX + ", " + mouseDownY + " : " + curMouseX + " , " + curMouseY);

    if (currentSpawning == COMET) {
        let mouseDX = mouseDownX - curMouseX;
        let mouseDY = mouseDownY - curMouseY;
        let v = Comet.getVelocityFromMouseCord(camera.lengthToCanvasUnit(mouseDX), camera.lengthToCanvasUnit(mouseDY));
        comets.push(new Comet(camera.getCameraCordX(mouseDownX), camera.getCameraCordY(mouseDownY), cometSpawnRadius, -1, "red", v[0], v[1]));
    } else if (currentSpawning == PLANET) {
        let radius = Math.sqrt(squareDistance(curMouseX, curMouseY, mouseDownX, mouseDownY));
        planets.push(new Planet(camera.getCameraCordX(mouseDownX), camera.getCameraCordY(mouseDownY), camera.lengthToCanvasUnit(radius), -1, "black"));
    }
});

canvas.addEventListener("mousemove", (e) => {
    curMouseX = e.x;
    curMouseY = e.y;
});

addEventListener("keydown", (e) => {
    // console.log("keydown ", e.key);
    pressedKey = e.key;

    if (pressedKey == "ArrowUp") camera.setZoom(camera.getZoom() + 0.2)
    else if (pressedKey == "ArrowDown") camera.setZoom(camera.getZoom() - 0.2);
    else if (pressedKey == "ArrowRight") cometSpawnRadius = Math.min(cometSpawnRadius + 1, 100);
    else if (pressedKey == "ArrowLeft") cometSpawnRadius = Math.max(cometSpawnRadius - 1, 1);

    if (pressedKey == "w" || pressedKey == "W") camera.shiftCameraUp();
    else if (pressedKey == "s" || pressedKey == "S") camera.shiftCameraDown();
    else if (pressedKey == "a" || pressedKey == "A") camera.shiftCameraLeft();
    else if (pressedKey == "d" || pressedKey == "D") camera.shiftCameraRight();
    else if (pressedKey == "r" || pressedKey == "R") camera.resetCamera();
    else if (pressedKey == "q" || pressedKey == "Q") debug = !debug;
    else if (pressedKey == "b" || pressedKey == "B") borderWall = !borderWall;
    else if (pressedKey == "c" || pressedKey == "C") currentSpawning = (currentSpawning + 1) % TOTAL_SPAWNABLE;

    if (pressedKey == "f" || pressedKey == "F") {
        if(comets.length > 0)
        {
            let cometIndex = camera.objectFollowingIndex;
            let nextCometIndex = (cometIndex + 1) % comets.length;
            camera.objectFollowing = comets[nextCometIndex];
            camera.objectFollowingIndex = nextCometIndex;
        }
    } else if (pressedKey == "]" && camera.objectFollowing != null) {
        let theta = camera.objectFollowing.getVelocityAngle();
        camera.objectFollowing.changeVelocity(0.2);
        camera.objectFollowing.static = false;
    } else if (pressedKey == "[" && camera.objectFollowing != null) {
        let theta = camera.objectFollowing.getVelocityAngle();
        camera.objectFollowing.changeVelocity(-0.2);
        camera.objectFollowing.static = false;
    } else {
        // camera.unfollowObject();
    }

    // console.log(followComet);
});

addEventListener("keyup", (e) => {
    // console.log("keyup ", e.key);
    pressedKey = null;
});

// ============================================ INPUT END ============================================ //

// ============================================ UTILITY START ============================================ //

function squareDistance(x1, y1, x2, y2) {
    let dist = Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2);
    return dist;
}

function pointIsInCircle(x, y, r, px, py) {
    let dist = squareDistance(x, y, px, py);

    if (dist <= r * r) return true;
    else return false;
}

function isCirclesColliding(x1, y1, r1, x2, y2, r2) {
    let dist = squareDistance(x1, y1, x2, y2);
    if (dist <= (r1 + r2) * (r1 + r2)) return true;
    else return false;
}

// ============================================ UTILITY START ============================================ //

// ============================================ UPDATE START ============================================ //

function updateComets(cometList, planetList) {
    for (let i = 0; i < cometList.length; i++) {
        let comet = cometList[i];
        if (comet.static == true) continue;

        let forceX = 0;
        let forceY = 0;

        planetList.forEach((planet) => {
            let dist = squareDistance(comet.x, comet.y, planet.x, planet.y);
            if (dist > 0) {
                let force = (comet.m * planet.m) / (dist * 150);

                let dx = planet.x - comet.x;
                let dy = planet.y - comet.y;
                let angle = Math.atan2(dy, dx);

                forceX += force * Math.cos(angle);
                forceY += force * Math.sin(angle);
            }
        });

        comet.vx += forceX / comet.m;
        comet.vy += forceY / comet.m;

        let newX = comet.x + comet.vx;
        let newY = comet.y + comet.vy;

        let isColliding = false;
        planetList.forEach((planet) => {
            if (isCirclesColliding(planet.x, planet.y, planet.r, newX, newY, comet.r)) {
                isColliding = true;
            }
        });

        if (isColliding == true) {
            comet.vx = -comet.vx;
            comet.vy = -comet.vy;
            comet.static = true;
        } else {
            comet.x = newX;
            comet.y = newY;
        }

        if (borderWall) {
            if (comet.x <= 0) comet.x = cWidth;
            else if (comet.x >= cWidth) comet.x = 0;

            if (comet.y <= 0) comet.y = cHeight;
            else if (comet.y >= cHeight) comet.y = 0;
        }
    }
}

// ============================================ UPDATE END ============================================ //

// ============================================ DRAW START ============================================ //

// function drawCircle(x, y, radius, fill) {
//     ctx.beginPath();
//     ctx.arc(cameraX + x, cameraY + y, radius, 0, 2 * Math.PI, true);
//     if (fill) ctx.fill();
//     else ctx.stroke();
// }

// function drawCircleOnCanvas(x, y, radius, fill) {
//     ctx.beginPath();
//     ctx.arc(x, y, radius, 0, 2 * Math.PI, true);
//     if (fill) ctx.fill();
//     else ctx.stroke();
// }

// function drawLine(x1, y1, x2, y2, fill) {
//     ctx.moveTo(cameraX + x1, cameraY + y1);
//     ctx.lineTo(cameraX + x2, cameraY + y2);
//     ctx.stroke();
// }

// function drawLineOnCanvas(x1, y1, x2, y2, fill) {
//     ctx.moveTo(x1, y1);
//     ctx.lineTo(x2, y2);
//     ctx.stroke();
// }

// function cameraFollowComet() {
//     if (followComet >= 0 && followComet < comets.length) {
//         camera.setCameraX(-comets[followComet].x + cWidth / 2);
//         camera.setCameraY(-comets[followComet].y + cHeight / 2);
//     }
// }

function drawMouseTips() {
    if (currentSpawning == COMET) {
        if (isMouseDown) {
            ctx.strokeStyle = "gray";
            camera.drawCircleOnCanvas(mouseDownX, mouseDownY, camera.lenghtToCameraUnit(cometSpawnRadius), false);

            ctx.strokeStyle = "green";
            camera.drawLineOnCanvas(mouseDownX, mouseDownY, curMouseX, curMouseY);
        } else {
            ctx.strokeStyle = "gray";
            camera.drawCircleOnCanvas(curMouseX, curMouseY, camera.lenghtToCameraUnit(cometSpawnRadius), false);
        }
    } else if (currentSpawning == PLANET) {
        if (isMouseDown) {
            ctx.strokeStyle = "black";
            camera.drawLineOnCanvas(mouseDownX, mouseDownY, curMouseX, curMouseY);
            let radius = Math.sqrt(squareDistance(curMouseX, curMouseY, mouseDownX, mouseDownY));
            camera.drawCircleOnCanvas(mouseDownX, mouseDownY, radius, false);
        }
    }
    // console.log(isMouseDown, mouseDownX, mouseDownY, curMouseX, curMouseY);
}

function drawTrajectory(planetList) {
    let mass = Comet.getMass(cometSpawnRadius);
    console.log(mass);

    let curX = camera.getCameraCordX(mouseDownX); // (-camera.x + mouseDownX) * camera.getZoom();
    let curY = camera.getCameraCordY(mouseDownY); // (-camera.y + mouseDownY) * camera.getZoom();

    let mouseDX = mouseDownX - curMouseX;
    let mouseDY = mouseDownY - curMouseY;
    let v = Comet.getVelocityFromMouseCord(camera.lengthToCanvasUnit(mouseDX), camera.lengthToCanvasUnit(mouseDY));
    // let v = Comet.getVelocityFromMouseCord(mouseDownX, mouseDownY, curMouseX, curMouseY);
    let curVX = v[0];
    let curVY = v[1];

    for (let time = 1; time <= 10000; time++) {
        let forceX = 0;
        let forceY = 0;

        planetList.forEach((planet) => {
            let dist = squareDistance(curX, curY, planet.x, planet.y);
            if (dist > 0) {
                let force = (mass * planet.m) / (dist * 150);

                let dx = planet.x - curX;
                let dy = planet.y - curY;
                let angle = Math.atan2(dy, dx);

                forceX += force * Math.cos(angle);
                forceY += force * Math.sin(angle);
            }
        });

        curVX += forceX / mass;
        curVY += forceY / mass;

        let newX = curX + curVX;
        let newY = curY + curVY;

        let isColliding = false;
        planetList.forEach((planet) => {
            if (isCirclesColliding(planet.x, planet.y, planet.r, newX, newY, cometSpawnRadius)) {
                isColliding = true;
            }
        });

        if (isColliding == true) {
            break;
        } else {
            curX = newX;
            curY = newY;
        }

        if (borderWall) {
            if (curX <= 0) curX = cWidth;
            else if (curX >= cWidth) curX = 0;

            if (curY <= 0) curY = cHeight;
            else if (curY >= cHeight) curY = 0;
        }
        
        // if(curX <= -cameraX || curX >= -cameraX + cWidth || curY <= -cameraY || curY >= -cameraY + cHeight) break;

        if(time % 10 == 0)
        {
            ctx.fillStyle = "gray";
            camera.drawCircle(curX, curY, 2, true);
        }
    }
}

function drawPlanets(planetList) {
    planetList.forEach((planet) => {
        ctx.strokeStyle = planet.color;
        camera.drawCircle(planet.x, planet.y, planet.r, false);
    });
}

function drawComets(cometList) {
    cometList.forEach((comet) => {
        ctx.strokeStyle = comet.color;
        if (comet.static) ctx.strokeStyle = "gray";
        camera.drawCircle(comet.x, comet.y, comet.r, false);

        if (debug == true && !comet.static) {
            let normalVelocity = comet.getNormalVelocity();

            // drawLine(comet.x, comet.y, comet.x + unitVelocityX, comet.y);
            // drawLine(comet.x, comet.y, comet.x, comet.y + unitVelocityY);
            camera.drawLine(comet.x, comet.y, comet.x + normalVelocity[0] * 40, comet.y + normalVelocity[1] * 40);
        }
    });
}

function clearScreen() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // ctx.strokeStyle = "black";
    // camera.drawLineOnCanvas(cWidth/2 - 10, cHeight/2, cWidth/2 + 10, cHeight/2);
    // camera.drawLineOnCanvas(cWidth/2, cHeight/2 - 10, cWidth/2, cHeight/2 + 10);
}

function draw() {
    camera.updateCamera();
    updateComets(comets, planets);
    
    clearScreen();
    
    drawPlanets(planets);
    drawComets(comets);
    if (isMouseDown && showTrajectory && currentSpawning == COMET) drawTrajectory(planets);
    drawMouseTips();

    // if(!isMouseDown) comets.push(new Comet(Math.random() * cWidth, Math.random() * cHeight, 1, 1, "red"));
}

setInterval(draw, 1);

// ============================================ DRAW END ============================================ //
