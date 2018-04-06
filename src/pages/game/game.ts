import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-game',
  templateUrl: 'game.html',
})
export class GamePage {

  @ViewChild('canvas') canvasEl : ElementRef

  private _CANVAS  : any
  private ctx : any

  state = "tunnel"
  animating = false

  g = -400
  dt = 0.005
  radius = 10
  vStart = 1000
  theta = -Math.PI/6
  initX = window.innerWidth/2
  initY = window.innerHeight*0.7
  
  current = {
    posX: this.initX,
    posY: this.initY,
    velX: this.vStart*Math.cos(this.theta),
    velY: this.vStart*Math.sin(this.theta)
  }

  lives = 5
  rings = []
  obstacles = []


  constructor(public navCtrl: NavController, public navParams: NavParams) {}
  
  ionViewDidLoad() {
    this._CANVAS 	        = this.canvasEl.nativeElement
    this._CANVAS.width  	= window.innerWidth
    this._CANVAS.height 	= window.innerHeight
    this.ctx = this._CANVAS.getContext('2d')
    this.newGame()
  }

  newGame(){
    this.createRings()
    this.createObstacles()
    this.drawCanvas()
  }

  createObstacles(){
    for(let i = 0; i < 10; i++){
      let valid = false
      let x, y
      let r = 5 + Math.floor(Math.random()*15)
      while(!valid){
        valid = true
        x = r + Math.floor(Math.random()*(window.innerWidth - r))
        y = r + Math.floor(Math.random()*(window.innerHeight*0.6 - r))
        this.rings.forEach(ring => {
          let distance = this.getDistance(ring.x, ring.y, x, y)
          if(distance < 5 + r){
            valid = false
          }
        })
        this.obstacles.forEach(obstacle => {
          let distance = this.getDistance(obstacle.x, obstacle.y, x, y)
          if(distance < obstacle.r + r){
            valid = false
          }
        })
      }
      this.obstacles.push({ r: r, x: x, y: y })
    }
  }

  createRings(){
    for(let i = 0; i < 10; i++){
      let valid = false
      let x, y
      while(!valid){
        valid = true
        x = 5 + Math.floor(Math.random()*(window.innerWidth - 10))
        y = 5 + Math.floor(Math.random()*(window.innerHeight*0.6 - 5))
        this.rings.forEach(ring => {
          let distance = this.getDistance(ring.x, ring.y, x, y)
          if(distance < 10){
            valid = false
          }
        })
      }

      this.rings.push({ x: x, y: y })
    }
  }

  getDistance(x1, y1, x2, y2){
    return Math.sqrt((x2 - x1)*(x2 - x1) + (y2 - y1)*(y2 - y1))
  }

  fire(){
    if(!this.animating){
      this.animating = true
      this.runSimulation()
    }
  }
  
  runSimulation(){
    this.calculateNext()
    this.drawCanvas()

    setTimeout(() => {
      if(this.animating){
        this.runSimulation()
      }else if(!this.animating){
        this.resetCanvas()
      }
    }, 10)
  }

  calculateNext(){
    this.current.velY -= this.dt*this.g
      
    this.current.posX += this.dt*this.current.velX
    this.current.posY += this.dt*this.current.velY

    if(this.state === "tunnel"){
      if(this.current.posX >= window.innerWidth){
        this.current.posX = 0
      }else if(this.current.posX <= 0){
        this.current.posX = window.innerWidth
      }
    }
    if(this.state === "solid"){
      if(this.current.posX + this.radius >= window.innerWidth || this.current.posX - this.radius <= 0){
        this.current.velX = -this.current.velX
      }
    }

    if(this.current.posY - this.radius <= 0){
      this.current.velY = -this.current.velY
    }

    //check if ring is picked up
    this.rings.forEach((ring, i) => {
      let distance = this.getDistance(this.current.posX, this.current.posY, ring.x, ring.y)
      if(distance < 5 + this.radius){
        this.rings.splice(i, 1)
        if(this.rings.length === 0){
          this.victory()
        }
      }
    })

    //check for obstacle collision
    this.obstacles.forEach((obstacle) => {
      let distance = this.getDistance(obstacle.x, obstacle.y, this.current.posX, this.current.posY)
      if(distance <= obstacle.r + this.radius){
        
        let diffX = this.current.posX - obstacle.x
        let diffY = this.current.posY - obstacle.y
        let length1 = Math.sqrt(diffX*diffX + diffY*diffY)
        let normX = diffX/length1
        let normY = diffY/length1
        //fortegn for kvadrant over?

        let a1 = this.current.velX*normX + this.current.velY*normY
        let p = 2.0*(a1)/(1 + 10000000)
        
        this.current.velX = this.current.velX - p*10000000*normX
        this.current.velY = this.current.velY - p*10000000*normY

      }
    })

    if(this.current.posY - this.radius >= window.innerHeight - 150){
      this.animating = false
    }
  }

  victory(){
    alert("victory")
  }

  resetCanvas(){
    this.current.posX = this.initX
    this.current.posY = this.initY
    this.current.velX = this.vStart*Math.cos(this.theta)
    this.current.velY = this.vStart*Math.sin(this.theta)

    this.drawCanvas()
  }

  drawCanvas(){
    //canvas
    this.ctx.beginPath()
    this.ctx.rect(0, 0, window.innerWidth, window.innerHeight)
    this.ctx.fillStyle = "white"
    this.ctx.fill()

    //start zone
    this.ctx.beginPath()
    this.ctx.rect(0, window.innerHeight*0.6, window.innerWidth, window.innerHeight*0.4)
    this.ctx.fillStyle = "orange"
    this.ctx.fill()

    //rings
    this.rings.forEach((ring) => {
      this.ctx.beginPath()
      this.ctx.arc(ring.x, ring.y, 5, 0, 2 * Math.PI)
      this.ctx.fillStyle = "yellow"
      this.ctx.fill()
    })

    //obstacles
    this.obstacles.forEach((obstacle) => {
      this.ctx.beginPath()
      this.ctx.arc(obstacle.x, obstacle.y, obstacle.r, 0, 2 * Math.PI)
      this.ctx.fillStyle = "black"
      this.ctx.fill()
    })

    //ball
    this.ctx.beginPath()
    this.ctx.arc(this.current.posX, this.current.posY, this.radius, 0, 2 * Math.PI)
    this.ctx.lineWidth = 1
    this.ctx.fillStyle = "gray"
    this.ctx.fill()
  }

  solid(){
    this.state = "solid"
  }

  tunnel(){
    this.state = "tunnel"
  }

  exit(){
    this.animating = false
    this.navCtrl.pop()
  }
}
