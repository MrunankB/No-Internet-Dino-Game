var PLAY = 1;
var END = 0;
var gameState = PLAY;
var Hello_data;
var dieSound;
var jumpSound;


var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var coinImage;
var coin;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var gameOver, restart;

localStorage["HighestScore"] = 0;

function preload(){
  trex_running =   loadAnimation("trex_1.png","trex_2.png","trex_3.png");
  trex_collided = loadAnimation("trex_collided-1.png");
  
  groundImage = loadImage("ground.png");
  
  cloudImage = loadImage("cloud 1.2 trex.png");
  
  obstacle1 = loadImage("obstacle1-1.png");
  obstacle2 = loadImage("obstacle2-1.png");
  obstacle3 = loadImage("obstacle3-1.png");
  obstacle4 = loadImage("obstacle1-1.png");
  obstacle5 = loadImage("obstacle2-1.png");
  obstacle6 = loadImage("obstacle3-1.png");
  
  dieSound = loadSound("Sword_1.mp3");
  jumpSound = loadSound("Sword_2.mp3")
  
  gameOverImg = loadImage("game Over image 1.1.png");
  restartImg = loadImage("Reload_Colourful.png");
  
  coinImage = loadImage("Coin flipper.gif");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  console.log(gameState);
  
  //Hello_data = [0,"hbgxfdfgudfggvvdfhgyjergruvg", 76768766876688867868786787867678445785676867686786];
  //console.log(Hello_data)
  trex = createSprite(50,180,20,50);
  
  //console.log(Hello_data[1]);
  //onsole.log(Hello_data.length-9);
  
  //console.log("nice "+"to "+"meet "+"you maam                                                                                          "+
              //"how're you"+"?"+"nice "+"to "+"meet "+"you maam "+"how're you"+"?")
  
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.2;
  trex.debug = true;
  trex.setCollider("rectangle", 0, 0, 400, 400);
  
  ground = createSprite(200,windowHeight-100,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
 // ground.scale = 0.3;
  ground.depth = trex.depth-4;
  
  gameOver = createSprite(windowWidth/2,windowHeight/2-100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(windowWidth/2,windowHeight/2-60);
  restart.addImage(restartImg);
  restart.scale = 0.1;
  
  gameOver.scale = 0.2;
  
  //trex.debug = true;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,windowHeight-80,400,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  
  
  score = 0;
}

function draw() {
  //trex.debug = true;
  background("LightBlue");
  
  textSize(29);
  textFont("papyrus");
  stroke("black");
  fill("orange")
  text("Score: "+ score,windowWidth/2-20,windowHeight/2+30);
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
  
    if(touches.length>0 && trex.collide(invisibleGround)||  keyDown("space") && trex.collide(invisibleGround)) {
      trex.velocityY = -20;
      touches = [];
      console.log(touches);
      dieSound.play();           
    }
  
    trex.velocityY = trex.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
    spawnCoins();
  
    if(obstaclesGroup.isTouching(trex)){
      jumpSound.play(); 
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    gameOver.scale = 1;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 100 === 0) {
    var cloud = createSprite(1000,Math.round(random(80,120)),40,10);
    
    cloud.addImage(cloudImage);
    cloud.scale = 0.2;
    
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 1000;
    
    //adjust the depth
    cloud.depth = gameOver.depth-4;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(1000,windowHeight-110,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    
    
    
    //generate random obstacles
    var rand = Math.round(random(1,5));
    console.log(rand);
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
        //obstacle.scale = 1.5;
        //obstacle.scale = 0.2;      
              break;
      case 2: obstacle.addImage(obstacle2);
        //obstacle.scale = 1.5;
              break;
      //case 3: obstacle.addImage(obstacle3);
       // obstacle.scale = 0.2;
              //break;
      case 3: obstacle.addImage(obstacle4);
        //obstacle.scale = 1.5;
              break;
      case 4: obstacle.addImage(obstacle5);
        //obstacle.scale = 1.5;
              break;
      case 5: obstacle.addImage(obstacle1);
        obstacle.scale = 0.2;
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  console.log(localStorage["HighestScore"]);
  
  score = 0;
  
}

function spawnCoins()
{
  if(frameCount/100 === 0)
  {
    coin = createSprite(100, windowHeight/2-100);
  coin.addImage(coinImage);
  coin.scale = 0.1;
  }
  
  
}