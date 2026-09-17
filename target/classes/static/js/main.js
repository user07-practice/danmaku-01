console.log("main.js が読み込まれました");

import { Mover } from "./mover.js";
import { Player } from "./player.js";
import { CookieEnemy } from "./cookieEnemy.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const mover = new Mover();

const player = new Player(
    240,
    600,
    mover
);
const playerBullets = [];

const enemyBullets = [];

const cookieEnemies = [];

let frame = 0;

let isGameOver = false;

// ==============================
// 残機表示
// ==============================

function updateLivesDisplay() {

    const livesDisplay =
        document.getElementById("livesDisplay");

    livesDisplay.textContent =
        "❤️".repeat(player.lives);

}

// ==============================
// フェーズ管理
// ==============================

const STAGE_TIME = 20 * 60; // 20秒（60FPS想定）

let stageFrame = 0;

let stagePhase = "雑魚敵";

const CLEAR_WAIT_TIME = 5 * 60; // 5秒（60FPS）

let clearWaitFrame = 0;

// ==============================
// スペルカード
// ==============================

function activateSpell() {

    if (player.spellCards <= 0) {
        console.log("スペルカードがありません");
        return;
    }

    // スペルカードを1枚消費
    player.spellCards--;

    // 敵弾を全消去
    enemyBullets.length = 0;

    console.log("スペルカード発動！");
    console.log("残りスペルカード:", player.spellCards);

}

// ==============================
// キーボード
// ==============================

window.addEventListener("keydown", (e) => {

    console.log("押されたキー:", e.code);

    if (e.code === "KeyP") {
        console.log("Pキー専用テスト成功");
    }

    if (e.code === "KeyR" && isGameOver) {

        location.reload();

    }

    if (e.code === "Enter" && isDialogueActive) {

        if (!e.repeat) {

            nextDialogue();

        }

        return;

    }

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

            // 押した瞬間に1回だけ発動
            if (!e.repeat) {
                activateSpell();
            }

            // 低速移動
            player.keySpace = true;

            e.preventDefault();

            break;

        case "KeyP":
            player.keyShift = true;

            // すぐに弾が発射されるようにする
            player.shootTimer = player.SHOOT_INTERVAL - 1;

            console.log("Pキーが押されました");
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

        case "KeyP":
            player.keyShift = false;
            break;

    }

});


// ==============================
// ゲーム更新
// ==============================

function update() {

    if (isGameOver) {
        return;
    }

    frame++;

    player.update();

    stageFrame++;

    if (stagePhase === "会話中") {

        return;

    }

// =========================
// フェーズ管理
// =========================

// 雑魚敵フェーズ終了
    if (
        stagePhase === "雑魚敵" &&
        stageFrame >= STAGE_TIME
    ) {

        stagePhase = "弾消滅待機";

        console.log("雑魚敵フェーズ終了！");
        console.log("新規敵生成停止！");
    }

// 弾消滅待機フェーズ
    if (stagePhase === "弾消滅待機") {

        // 敵弾がほぼ無くなったか確認
        if (enemyBullets.length <= 5) {

            clearWaitFrame++;

            console.log(
                "弾消滅待機中:",
                clearWaitFrame,
                "/",
                CLEAR_WAIT_TIME
            );

            // 5秒経過
            if (clearWaitFrame >= CLEAR_WAIT_TIME) {

                stagePhase = "会話中";

                console.log("ボス会話フェーズ開始！");

                startDialogue();

            }

        } else {

            // 弾が多い場合は待機時間をリセット
            clearWaitFrame = 0;

        }

        // ==============================
// 会話システム
// ==============================

        const dialogues = [

            {
                speaker: "？？？",
                text: "よくここまで来たわね。"
            },

            {
                speaker: "プレイヤー",
                text: "あなたがこの異変の原因なの？"
            },

            {
                speaker: "？？？",
                text: "ふふっ、そう簡単には教えられないわ。"
            },

            {
                speaker: "プレイヤー",
                text: "なら、力ずくで聞くまでよ！"
            }

        ];

        let dialogueIndex = 0;
        let isDialogueActive = false;

        function startDialogue() {

            isDialogueActive = true;

            dialogueIndex = 0;

            document.getElementById(
                "dialogue-container"
            ).style.display = "block";

            showDialogue();

        }

        function showDialogue() {

            const dialogue = dialogues[dialogueIndex];

            document.getElementById(
                "dialogue-name"
            ).textContent = dialogue.speaker;

            document.getElementById(
                "dialogue-text"
            ).textContent = dialogue.text;

        }

        function nextDialogue() {

            if (!isDialogueActive) {
                return;
            }

            dialogueIndex++;

            if (dialogueIndex >= dialogues.length) {

                endDialogue();

                return;

            }

            showDialogue();

        }

        function endDialogue() {

            isDialogueActive = false;

            document.getElementById(
                "dialogue-container"
            ).style.display = "none";

            stagePhase = "ボス戦";

            console.log("会話終了！");
            console.log("ボス戦開始！");

        }

    }

    // =========================
    // 自機ショット
    // =========================

    if (player.keyShift) {

        player.shootTimer++;

        if (player.shootTimer >= player.SHOOT_INTERVAL) {

            player.shootTimer = 0;

            // 左
            playerBullets.push({
                x: player.pos.x - 15,
                y: player.pos.y - 10,
                speed: 12.0
            });

            // 右
            playerBullets.push({
                x: player.pos.x + 15,
                y: player.pos.y - 10,
                speed: 12.0
            });
        }

    } else {

        player.shootTimer = 0;
    }

    // =========================
// 自機弾を移動
// =========================

    for (
        let i = playerBullets.length - 1;
        i >= 0;
        i--
    ) {

        const bullet = playerBullets[i];

        bullet.y -= bullet.speed;

        if (bullet.y < -20) {
            playerBullets.splice(i, 1);
        }
    }
    // =========================
// クッキー生成（20秒間）
// =========================

    if (
        stagePhase === "雑魚敵" &&
        stageFrame < STAGE_TIME &&
        frame % 45 === 0
    ) {

        const x = 30 + Math.random() * 420;

        const y = -20;

        const speed = 2.0 + Math.random() * 2.0;

        cookieEnemies.push(
            new CookieEnemy(x, y, speed)
        );

    }

    // =========================
// クッキー更新
// =========================


    for (
        let i = cookieEnemies.length - 1;
        i >= 0;
        i--
    ) {

        const enemy = cookieEnemies[i];

        enemy.update();

        // =========================
        // 自機との当たり判定
        // =========================

        const dx = enemy.x - player.pos.x;
        const dy = enemy.y - player.pos.y;

        const distance = Math.sqrt(
            dx * dx + dy * dy
        );

        const hitDistance =
            enemy.radius + player.hitRadius;

        console.log(
            "距離:", distance,
            "判定距離:", hitDistance
        );

        if (distance < hitDistance) {

            console.log("★★★ 当たり判定成功 ★★★");

            player.takeDamage();

            updateLivesDisplay();

            if (player.lives <= 0) {

                isGameOver = true;

                console.log("GAME OVER");

            }

            // 残機をコンソールに表示
            console.log(
                "クッキーに接触！残機:",
                player.lives
            );

            // 接触したクッキーを削除
            cookieEnemies.splice(i, 1);

            continue;
        }

        // 画面外に出たら削除
        if (enemy.y > canvas.height + 30) {

            cookieEnemies.splice(i, 1);

        }

    }

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

    // =========================
// 自機弾を描画
// =========================

    for (const bullet of playerBullets) {

        ctx.fillStyle = "yellow";

        ctx.beginPath();

        ctx.moveTo(
            bullet.x,
            bullet.y - 8
        );

        ctx.lineTo(
            bullet.x - 5,
            bullet.y
        );

        ctx.lineTo(
            bullet.x,
            bullet.y + 8
        );

        ctx.lineTo(
            bullet.x + 5,
            bullet.y
        );

        ctx.closePath();

        ctx.fill();

        // 白い中心
        ctx.fillStyle = "white";

        ctx.beginPath();

        ctx.arc(
            bullet.x,
            bullet.y,
            2,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }

    player.draw(ctx);

    // =========================
// クッキー描画
// =========================

    for (const enemy of cookieEnemies) {

        enemy.draw(ctx);

    }
    if (isGameOver) {

        ctx.fillStyle = "white";

        ctx.font = "48px sans-serif";

        ctx.textAlign = "center";

        ctx.fillText(
            "GAME OVER",
            canvas.width / 2,
            canvas.height / 2
        );

        ctx.font = "20px sans-serif";

        ctx.fillText(
            "Press R to Restart",
            canvas.width / 2,
            canvas.height / 2 + 50
        );

    }
}


// ==============================
// ゲームループ
// ==============================

function gameLoop() {

    update();

    draw();

    requestAnimationFrame(gameLoop);

}

updateLivesDisplay();

gameLoop();