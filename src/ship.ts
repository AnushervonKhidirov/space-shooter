import type { TCoordinate } from './types'

class Ship {
    canvas: HTMLCanvasElement
    context: CanvasRenderingContext2D

    keyPressed: { [key: string]: boolean }

    // ship
    ship: HTMLImageElement
    shipPosition: TCoordinate
    shootingInterval: any
    shipSize = 50
    shipSpeed = 5
    shipMoveSize = 0
    shouldMove = false

    // bullets
    bulletSpeed = 10
    bullets: TCoordinate[]
    shouldChangeBulletSide: boolean

    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
        this.canvas = canvas
        this.context = context

        this.keyPressed = {}

        this.ship = new Image()
        this.ship.src = './image/space-ship-level-1.png'

        this.shipPosition = {
            x: (this.canvas.width - this.shipSize) / 2,
            y: this.canvas.height - this.shipSize * 2,
        }

        this.bullets = []
        this.shouldChangeBulletSide = false
    }

    init() {
        this.addShipController()
    }

    drawShip() {
        this.context.drawImage(this.ship, this.shipPosition.x, this.shipPosition.y, this.shipSize, this.shipSize)
        if (this.bullets.length > 0) this.sooting()
        if (this.shouldMove) this.movingShip()
    }

    addShipController() {
        window.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.code === 'ArrowLeft' && !this.keyPressed['ArrowLeft']) this.moveLeft()
            if (e.code === 'ArrowRight' && !this.keyPressed['ArrowRight']) this.moveRight()
            if (e.code === 'Space' && !this.keyPressed['Space']) this.shoot()

            this.keyPressed[e.code] = true
        })

        window.addEventListener('keyup', (e: KeyboardEvent) => {
            this.keyPressed[e.code] = false

            if (!this.keyPressed['ArrowLeft'] && !this.keyPressed['ArrowRight']) {
                this.shouldMove = false
                this.shipMoveSize = 0
            }
            if (!this.keyPressed['Space']) clearInterval(this.shootingInterval)
        })
    }

    moveLeft() {
        this.shouldMove = true
        this.shipMoveSize = -this.shipSpeed
    }

    moveRight() {
        this.shouldMove = true
        this.shipMoveSize = this.shipSpeed
    }

    movingShip() {
        const newXPos = this.shipPosition.x + this.shipMoveSize
        const yPosition = this.fixShipCoordinate(newXPos, this.canvas.width - this.shipSize)

        this.shipPosition = {
            x: yPosition,
            y: this.shipPosition.y,
        }
    }

    shoot() {
        this.shootingInterval = setInterval(() => {
            const bulletPosition = {
                x: this.shipPosition.x + (this.shipSize - 3) * Number(this.shouldChangeBulletSide),
                y: this.shipPosition.y,
            }
            this.bullets.push(bulletPosition)
            this.shouldChangeBulletSide = !this.shouldChangeBulletSide
        }, 50)
    }

    sooting() {
        this.bullets = this.bullets.map(bullet => ({
            ...bullet,
            y: bullet.y - this.bulletSpeed,
        }))

        this.bullets.forEach((bullet, index) => {
            if (bullet.y < 0) {
                this.bullets.splice(index, index + 1)
            }
        })

        this.renderBullet()
    }

    renderBullet() {
        this.bullets.forEach(bullet => {
            this.context.save()
            this.context.fillStyle = '#ff8400'
            this.context.fillRect(bullet.x, bullet.y, this.shipSize / 15, this.shipSize / 2.5)
            this.context.restore()
        })
    }

    fixShipCoordinate(position: number, max: number) {
        return position < 0 ? 0 : position >= max ? max : position
    }
}

export default Ship
