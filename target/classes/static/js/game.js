class Game {

    constructor(canvas) {

        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        // =========================
        // キー入力
        // =========================

        this.keys = {};

        // =========================
        // 自機
        // =========================

        this.player = new Player(240, 600);

        // =========================
        // 自機弾
        // =========================

        this.playerBullets = [];

        // =========================
        // フレーム
        // =========================

        this.frame = 0;

        // =========================
        // キーイベント
        // =========================

        this.setupKeyboard();
    }


    setupKeyboard() {

        window.addEventListener(
            "keydown",
            (event) => {

                this.keys[event.code] = true;

                // SPACE
                if (event.code === "Space") {
                    this.player.keySpace = true;
                    event.preventDefault();
                }

                // P
                if (event.code === "KeyP") {
                    this.player.keyShift = true;
                }

                // SHIFT
                if (
                    event.code === "ShiftLeft" ||
                    event.code === "ShiftRight"
                ) {

                    this.player.useSpellCard();

                    event.preventDefault();
                }
            }
        );


        window.addEventListener(
            "keyup",
            (event) => {

                this.keys[event.code] = false;

                if (event.code === "Space") {
                    this.player.keySpace = false;
                }

                if (event.code === "KeyP") {
                    this.player.keyShift = false;
                }
            }
        );
    }


    // =========================
    // ゲーム更新
    // =========================

    update() {

        this.frame++;

        // 自機
        this.player.update(this);

        // 自機弾
        this.updatePlayerBullets();
    }


    // =========================
    // 自機弾更新
    // =========================

    updatePlayerBullets() {

        for (
            let i = this.playerBullets.length - 1;
            i >= 0;
            i--
        ) {

            const bullet = this.playerBullets[i];

            // Java版 Bullet.java と同じ
            bullet.y -= bullet.speed;

            // 画面外に出たら削除
            if (bullet.y < -20) {

                this.playerBullets.splice(i, 1);
            }
        }
    }


    // =========================
    // 自機弾発射
    // =========================

    shootPlayerBullets() {

        // Java版では6フレームごと
        if (this.frame % 6 !== 0) {
            return;
        }

        const px = this.player.pos.x;
        const py = this.player.pos.y;

        // 左
        this.playerBullets.push({
            x: px - 15,
            y: py - 10,
            speed: 12.0
        });

        // 右
        this.playerBullets.push({
            x: px + 15,
            y: py - 10,
            speed: 12.0
        });
    }


    // =========================
    // 描画
    // =========================

    draw() {

        const g = this.ctx;

        // =========================
        // 背景
        // =========================

        g.fillStyle = "black";

        g.fillRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );


        // =========================
        // 自機弾
        // =========================

        for (const bullet of this.playerBullets) {

            g.fillStyle = "yellow";

            // Java版のダイヤ型弾に近づける
            g.beginPath();

            g.moveTo(
                bullet.x,
                bullet.y - 8
            );

            g.lineTo(
                bullet.x - 5,
                bullet.y
            );

            g.lineTo(
                bullet.x,
                bullet.y + 8
            );

            g.lineTo(
                bullet.x + 5,
                bullet.y
            );

            g.closePath();

            g.fill();

            // 中央の白い部分
            g.fillStyle = "white";

            g.beginPath();

            g.arc(
                bullet.x,
                bullet.y,
                2,
                0,
                Math.PI * 2
            );

            g.fill();
        }


        // =========================
        // 自機
        // =========================

        const px = this.player.pos.x;
        const py = this.player.pos.y;

        const radius = 16;

        g.fillStyle = "blue";

        g.beginPath();

        g.arc(
            px,
            py,
            radius,
            0,
            Math.PI * 2
        );

        g.fill();


        // =========================
        // 当たり判定
        // SPACE中に表示
        // =========================

        if (this.player.keySpace) {

            g.strokeStyle = "white";

            g.lineWidth = 2;

            g.beginPath();

            g.arc(
                px,
                py,
                this.player.hitRadius,
                0,
                Math.PI * 2
            );

            g.stroke();
        }


        // =========================
        // スペルカード
        // =========================

        if (this.player.isSpellActive) {

            const spellX = px;
            const spellY = py - 100;

            const r =
                this.player.spellClearRadius;

            g.strokeStyle = "white";

            g.lineWidth = 2;

            g.beginPath();

            g.arc(
                spellX,
                spellY,
                r,
                0,
                Math.PI * 2
            );

            g.stroke();

            g.fillStyle =
                "rgba(255,255,255,0.2)";

            g.beginPath();

            g.arc(
                spellX,
                spellY,
                r,
                0,
                Math.PI * 2
            );

            g.fill();
        }
    }


    // =========================
    // ゲームループ
    // =========================

    gameLoop() {

        this.update();

        this.draw();

        requestAnimationFrame(
            () => this.gameLoop()
        );
    }


    // =========================
    // ゲーム開始
    // =========================

    start() {

        this.gameLoop();
    }

}
