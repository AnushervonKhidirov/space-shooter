import type { TImageForLoad } from './types.js'

import Ship from './ship.js'

class SpaceShooter {
    gameWrapper: Element
    canvas: HTMLCanvasElement
    context: CanvasRenderingContext2D

    gameBG: HTMLImageElement

    // ship
    ship: Ship

    constructor(gameWrapper: Element) {
        this.gameWrapper = gameWrapper
        this.canvas = document.createElement('canvas')
        this.context = this.canvas.getContext('2d')!

        this.canvas.width = 450
        this.canvas.height = 900

        this.gameBG = new Image()
        this.gameBG.src = './image/game-bg.jpg'

        this.ship = new Ship(this.canvas, this.context)
    }

    init() {
        this.gameWrapper.appendChild(this.canvas)
        this.ship.init()
        
        this.drawAnimation()
    }

    loadImages(images: TImageForLoad[], index: number = 0) {
        if (index >= images.length) return this.drawAnimation()

        images[index].elem.src = images[index].src

        images[index].elem.addEventListener('load', () => this.loadImages(images, index + 1))
    }

    drawAnimation() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)

        this.drawBackground()
        this.ship.drawShip()
        requestAnimationFrame(() => this.drawAnimation())
    }

    drawBackground() {
        this.context.drawImage(this.gameBG, 0, 0, this.canvas.width, this.canvas.height)
    }
}

const gameWrapper = document.querySelector('#game-wrapper')

if (gameWrapper) {
    const game = new SpaceShooter(gameWrapper)
    game.init()
}
