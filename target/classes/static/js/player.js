import { Position } from "./position.js";

export class Player {

    constructor(x, y, mover) {

        this.pos = new Position(x, y);

        this.mover = mover;

        this.speed = 5.0;

        // ステータス
        this.lives = 3;
        this.spellCards = 2;

        // 当たり判定
        this.hitRadius = 4;

        // キー状態
        this.keyShift = false;
        this.keySpace = false;

        // ショット
        this.shootTimer = 0;
        this.SHOOT_INTERVAL = 6;

        // 状態異常
        this.isFrozen = false;
        this.freezeTimer = 0;

        // スペル
        this.isSpellActive = false;
        this.spellActiveTimer = 0;
        this.spellClearRadius = 150;
    }

// ==============================
// 残機を減らす
// ==============================

    takeDamage() {

        this.lives--;

        if (this.lives < 0) {
            this.lives = 0;
        }

        console.log(
            "ダメージ！残機:",
            this.lives
        );

    }

    update() {

        if (this.isFrozen) {

            this.freezeTimer--;

            if (this.freezeTimer <= 0) {
                this.isFrozen = false;
            }

            return;
        }

        const currentSpeed =
            this.keySpace
                ? this.speed * 0.5
                : this.speed;

        this.mover.move(
            this.pos,
            currentSpeed
        );

        // Java版と同じ移動範囲
        if (this.pos.x < 30) {
            this.pos.x = 30;
        }

        if (this.pos.x > 450) {
            this.pos.x = 450;
        }

        if (this.pos.y < 30) {
            this.pos.y = 30;
        }

        if (this.pos.y > 690) {
            this.pos.y = 690;
        }
    }

    draw(ctx) {

        // とりあえず自機を描画
        // 後でJava版の自機デザインに置き換える

        ctx.fillStyle = "white";

        ctx.beginPath();

        ctx.arc(
            this.pos.x,
            this.pos.y,
            8,
            0,
            Math.PI * 2
        );

        ctx.fill();

        // 当たり判定の中心
        ctx.fillStyle = "red";

        ctx.beginPath();

        ctx.arc(
            this.pos.x,
            this.pos.y,
            this.hitRadius,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }

}