import type { TCoordinate } from './types.js'

class SpaceShooter {
    gameWrapper: Element
    canvasWidth = 450
    canvasHeight = 900
    canvas: HTMLCanvasElement
    context: CanvasRenderingContext2D

    // key
    keyPressed = false

    // ship
    ship: HTMLImageElement
    shipPosition: TCoordinate
    shipSize = 50
    shipMoveSize = 0

    constructor(gameWrapper: Element) {
        this.gameWrapper = gameWrapper
        this.canvas = document.createElement('canvas')
        this.context = this.canvas.getContext('2d')!

        this.ship = new Image()
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

        this.ship.src = './image/space-ship-level-1.png'

        this.ship.addEventListener('load', () => {
            this.drawAnimation()
        })
    }

    drawAnimation() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)

        this.drawBorder()
        this.drawShip()

        requestAnimationFrame(() => this.drawAnimation())
    }

    drawBorder() {
        this.context.save()
        this.context.strokeStyle = '#000'
        this.context.strokeRect(0, 0, this.canvas.width, this.canvas.height)
        this.context.restore()
    }

    drawShip() {
        this.movingShip()
        this.context.save()
        this.context.drawImage(this.ship, this.shipPosition.x, this.shipPosition.y, this.shipSize, this.shipSize)

        this.context.restore()
    }

    addShipController() {
        window.addEventListener('keydown', (e: KeyboardEvent) => {
            if (this.keyPressed) return
            this.keyPressed = true

            if (e.key === 'ArrowLeft') this.shipMoveSize = -10
            if (e.key === 'ArrowRight') this.shipMoveSize = 10
        })

        window.addEventListener('keyup', (e: KeyboardEvent) => {
            this.keyPressed = false

            this.shipMoveSize = 0
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

    fixShipCoordinate(position: number, max: number) {
        return position < 0 ? 0 : position >= max ? max : position
    }
}

const gameWrapper = document.querySelector('#game-wrapper')

if (gameWrapper) {
    const game = new SpaceShooter(gameWrapper)
    game.init()
}
