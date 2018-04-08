import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';



@IonicPage()
@Component({
  selector: 'page-game',
  templateUrl: 'game.html',
})
export class GamePage {

  @ViewChild('canvas') canvasEl : ElementRef

  private _CANVAS : any
  private ctx : any

  state = "Tunnel"
  animating = false
  point = false
  position = false

  g = -400
  dt = 0.005
  radius = 10
  initVel
  initVelX
  initVelY
  initTheta
  initX
  initY
  initPointX
  initPointY
  width
  height
  current

  lives = 0
  level = 0
  rings = []
  obstacles = []

  
  constructor(platform: Platform, public navCtrl: NavController, public navParams: NavParams) {
    platform.ready().then((readySource) => {
      
      this.width = platform.width()
      this.height = platform.height()
      this.initVel = 1000
      this.initX = this.width/2
      this.initY = this.height*0.8
      this.initTheta = Math.PI
      this.initVelX = this.initVel*Math.cos(this.initTheta)
      this.initVelY = this.initVel*Math.sin(this.initTheta)
      this.initPointX = this.initX + this.initVelX/20
      this.initPointY = this.initY + this.initVelY/20

    })
  }

  ionViewDidLoad() {
    this._CANVAS = this.canvasEl.nativeElement
    this._CANVAS.width = this.width
    this._CANVAS.height	= this.height
    this.ctx = this._CANVAS.getContext('2d')
    this.newLevel()
  }
  
  newLevel(){
    this.lives += 5
    this.level += 1
    this.createRings(2*this.level)
    this.createObstacles(2*this.level)
    this.setStart()
  }

  setStart(){
    this.current = {}
    this.current.posX = this.initX
    this.current.posY = this.initY
    this.current.pointX = this.initPointX
    this.current.pointY = this.initPointY
    this.current.vel = this.initVel
    this.current.velX = this.initVelX
    this.current.velY = this.initVelY
    this.current.theta = this.initTheta

    this.drawCanvas()

  }

  changeState(){
    this.state = this.state === "Tunnel" ? "Solid" : "Tunnel"
  }

  onMousedown(event){
    if(
      !this.animating && 
      this.getDistance(event.clientX, event.clientY, this.current.pointX, this.current.pointY) >= this.radius
    ){
      this.position = true
    }else if(
      !this.animating && 
      this.getDistance(event.clientX, event.clientY, this.current.pointX, this.current.pointY) < this.radius  
    ){
      this.point = true
    }
  }

  onMouseup(){
    this.point = false
    this.position = false
  }
  
  onMousemove(event){
    let posX = this.current.posX
    let posY = this.current.posY
    let pointX = this.current.pointX
    let pointY = this.current.pointY

    if(this.position &&
        event.clientY - this.radius >= this.height*0.7 && 
        event.clientX - this.radius >= 0 &&
        event.clientX + this.radius <= this.width
      ){
      
      let diffX = pointX - posX
      let diffY = pointY - posY
      this.current.posX = event.clientX
      this.current.posY = event.clientY
      this.current.pointX = this.current.posX + diffX
      this.current.pointY = this.current.posY + diffY

    }else if(this.position &&
        event.clientY - this.radius < this.height*0.7 && 
        event.clientX - this.radius >= 0 &&
        event.clientX + this.radius <= this.width
      ){
      let diffX = pointX - posX
      this.current.posX = event.clientX
      this.current.pointX = this.current.posX + diffX
    }
    
    if(this.point && this.getDistance(posX, posY, pointX, pointY) < 100){
      this.current.pointX = event.clientX
      this.current.pointY = event.clientY
      let distance = this.getDistance(posX, posY, this.current.pointX, this.current.pointY)
      this.current.vel = 20*distance
      let diffX = posX - this.current.pointX
      let diffY = posY - this.current.pointY

      let dot = diffX
      let det =  -diffY
      this.current.theta = -Math.atan2(det, dot) - Math.PI

      if(this.getDistance(posX, posY, this.current.pointX, this.current.pointY) >= 100){
        console.log("test")
        this.current.pointX = 100*Math.cos(this.current.theta) + posX
        this.current.pointY = 100*Math.sin(this.current.theta) + posY
      }

      this.current.velX = this.current.vel*Math.cos(this.current.theta)
      this.current.velY = this.current.vel*Math.sin(this.current.theta)


    }else if(this.point && this.getDistance(posX, posY, pointX, pointY) >= 100){
      let diffX = posX - event.clientX
      let diffY = posY - event.clientY

      let dot = diffX
      let det =  -diffY
      this.current.theta = -Math.atan2(det, dot) - Math.PI
      this.current.pointX = 100*Math.cos(this.current.theta) + posX
      this.current.pointY = 100*Math.sin(this.current.theta) + posY
    }
    this.drawCanvas()
  }

  createObstacles(amount){
    for(let i = 0; i < amount; i++){
      let valid = false
      let x, y
      let r = 5 + Math.floor(Math.random()*15)
      while(!valid){
        valid = true
        x = r + Math.floor(Math.random()*(this.width - 2*r))
        y = r + Math.floor(Math.random()*(this.height*0.7 - 2*r))
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

  createRings(amount){
    for(let i = 0; i < amount; i++){
      let valid = false
      let x, y
      while(!valid){
        valid = true
        x = 5 + Math.floor(Math.random()*(this.width- 2*10))
        y = 5 + Math.floor(Math.random()*(this.height*0.7 - 2*5))
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

    if(this.rings.length <= 0){
      this.animating = false
      this.newLevel()
    }

    if(this.current.posY - this.radius >= this.height - this.radius){
      this.animating = false
      this.lives--

      if(this.lives <= 0){
        this.navCtrl.pop()
      }else{
        this.setStart()
      }
    }

    if(this.animating){
      setTimeout(() => {
        this.runSimulation()
      }, 10)
    }
  }
  
  calculateNext(){
    this.current.velY -= this.dt*this.g
      
    this.current.posX += this.dt*this.current.velX
    this.current.posY += this.dt*this.current.velY

    if(this.state === "Tunnel"){
      if(this.current.posX >= this.width){
        this.current.posX = 0
      }else if(this.current.posX <= 0){
        this.current.posX = this.width
      }
    }
    if(this.state === "Solid"){
      if(this.current.posX + this.radius >= this.width || this.current.posX - this.radius <= 0){
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

        let a1 = this.current.velX*normX + this.current.velY*normY
        let p = 2.0*a1/(1 + 10000000)
        
        this.current.velX = this.current.velX - p*10000000*normX
        this.current.velY = this.current.velY - p*10000000*normY

      }
    })
    
  }

  drawCanvas(){
    //canvas
    
    this.ctx.beginPath()
    this.ctx.rect(0, 0, this.width, this.height)
    this.ctx.fillStyle = "white"
    this.ctx.fill()

    //start zone
    this.ctx.beginPath()
    this.ctx.rect(0, this.height*0.7, this.width, this.height*0.3)
    this.ctx.fillStyle = "orange"
    this.ctx.fill()

    //rings
    this.rings.forEach((ring) => {
      this.ctx.beginPath()
      this.ctx.arc(ring.x, ring.y, 5, 0, 2 * Math.PI)
      this.ctx.fillStyle = "purple"
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
    this.ctx.fillStyle = "gray"
    this.ctx.fill()

    if(!this.animating){       
      this.ctx.beginPath()
      this.ctx.moveTo(this.current.posX, this.current.posY)
      this.ctx.lineTo(this.current.pointX, this.current.pointY)
      this.ctx.stroke()

      this.ctx.beginPath()
      this.ctx.arc(this.current.pointX, this.current.pointY, 5, 0, 2*Math.PI)
      this.ctx.strokeStyle = "black"
      this.ctx.stroke()
    }
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
