import type { TCoordinate, TImageForLoad } from './types.js'

class SpaceShooter {
    gameWrapper: Element
    canvasWidth = 450
    canvasHeight = 900
    canvas: HTMLCanvasElement
    context: CanvasRenderingContext2D
    images: TImageForLoad[]

    gameBG = new Image()

    // keys
    keyPressed: { [key: string]: boolean }

    // ship
    ship = new Image()
    shipPosition: TCoordinate
    shootingInterval: any
    shipSize = 50
    shipSpeed = 5
    shipMoveSize = 0

    // bullets
    bulletSpeed = 10
    bullets: TCoordinate[]
    shouldChangeBulletSide: boolean

    constructor(gameWrapper: Element) {
        this.gameWrapper = gameWrapper
        this.canvas = document.createElement('canvas')
        this.context = this.canvas.getContext('2d')!

        this.images = [
            {
                elem: this.gameBG,
                src: './image/game-bg.jpg',
            },
            {
                elem: this.ship,
                src: './image/space-ship-level-1.png',
            },
        ]

        this.keyPressed = {}
        this.bullets = []
        this.shouldChangeBulletSide = false

        this.shipPosition = {
            x: (this.canvasWidth - this.shipSize) / 2,
            y: this.canvasHeight - this.shipSize * 2,
        }
    }

    init() {
        this.addCanvas()
        this.addShipController()
    }

    addCanvas() {
        this.canvas.width = this.canvasWidth
        this.canvas.height = this.canvasHeight
        this.gameWrapper.appendChild(this.canvas)

        this.loadImages(this.images)
    }

    loadImages(images: TImageForLoad[], index: number = 0) {
        if (index >= images.length) return this.drawAnimation()
        
        images[index].elem.src = images[index].src

        images[index].elem.addEventListener('load', () => this.loadImages(images, index + 1))
    }

    drawAnimation() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)

        this.drawBackground()
        this.drawShip()

        requestAnimationFrame(() => this.drawAnimation())
    }

    drawBackground() {
        this.context.drawImage(this.gameBG, 0, 0, this.canvasWidth, this.canvasHeight)
    }

    drawShip() {
        this.movingShip()
        if (this.bullets.length > 0) this.sooting()

        this.context.drawImage(this.ship, this.shipPosition.x, this.shipPosition.y, this.shipSize, this.shipSize)
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

            if (!this.keyPressed['ArrowLeft'] && !this.keyPressed['ArrowRight']) this.shipMoveSize = 0
            if (!this.keyPressed['Space']) clearInterval(this.shootingInterval)
        })
    }

    movingShip() {
        const newXPos = this.shipPosition.x + this.shipMoveSize

        const fixed = this.fixShipCoordinate(newXPos, this.canvasWidth - this.shipSize)

        this.shipPosition = {
            x: fixed,
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
            this.context.fillStyle = '#ffd600'
            this.context.fillRect(bullet.x, bullet.y, this.shipSize / 15, this.shipSize / 2.5)
            this.context.restore()
        })
    }

    moveLeft() {
        this.shipMoveSize = -this.shipSpeed
    }

    moveRight() {
        this.shipMoveSize = this.shipSpeed
    }

    fixShipCoordinate(position: number, max: number) {
        return position < 0 ? 0 : position >= max ? max : position
    }
}

const gameWrapper = document.querySelector('#game-wrapper')

if (gameWrapper) {
    const game = new SpaceShooter(gameWrapper)
    game.init()
}
