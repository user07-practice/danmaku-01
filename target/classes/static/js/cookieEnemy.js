
export class CookieEnemy {

    constructor(x, y, speed) {

        this.x = x;
        this.y = y;
        this.speed = speed;

        this.radius = 12;

    }

    update() {

        // 下方向へ移動
        this.y += this.speed;

    }

    draw(ctx) {

        // クッキー本体
        ctx.fillStyle = "#D2A06A";

        ctx.beginPath();

        ctx.arc(
            this.x,
            this.y,
            this.radius,
            0,
            Math.PI * 2
        );

        ctx.fill();

        // チョコチップ
        ctx.fillStyle = "#5C321E";

        const chips = [
            [-5, -4],
            [5, -3],
            [-3, 5],
            [5, 6]
        ];

        for (const chip of chips) {

            ctx.beginPath();

            ctx.arc(
                this.x + chip[0],
                this.y + chip[1],
                2,
                0,
                Math.PI * 2
            );

            ctx.fill();

        }

    }

}
