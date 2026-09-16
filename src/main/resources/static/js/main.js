import { Mover } from "./mover.js";
import { Player } from "./player.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const mover = new Mover();

const player = new Player(
    240,
    600,
    mover
);


// ==============================
// キーボード
// ==============================

window.addEventListener("keydown", (e) => {

    switch (e.code) {

        case "KeyW":
            mover.keyW = true;
            break;

        case "KeyA":
            mover.keyA = true;
            break;

        case "KeyS":
            mover.keyS = true;
            break;

        case "KeyD":
            mover.keyD = true;
            break;

        case "Space":
            player.keySpace = true;
            e.preventDefault();
            break;

    }

});


window.addEventListener("keyup", (e) => {

    switch (e.code) {

        case "KeyW":
            mover.keyW = false;
            break;

        case "KeyA":
            mover.keyA = false;
            break;

        case "KeyS":
            mover.keyS = false;
            break;

        case "KeyD":
            mover.keyD = false;
            break;

        case "Space":
            player.keySpace = false;
            break;

    }

});


// ==============================
// ゲーム更新
// ==============================

function update() {

    player.update();

}


// ==============================
// 描画
// ==============================

function draw() {

    ctx.fillStyle = "black";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    player.draw(ctx);

}


// ==============================
// ゲームループ
// ==============================

function gameLoop() {

    update();

    draw();

    requestAnimationFrame(gameLoop);

}

gameLoop();