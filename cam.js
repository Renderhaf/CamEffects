var video = document.getElementById('player');
var c = document.getElementById("myCan");
var ctx = c.getContext('2d');
var lastPixelList = []

var gapid = document.getElementById("gap")
var colorpicker = document.getElementById("colorpicker")

var cschange = document.getElementById("cbchange")
var csshadow = document.getElementById("cbshadow")
var csflat = document.getElementById("cbflat")
var cssr = document.getElementById("cbsr")
var cssg = document.getElementById("cbsg")
var cssb = document.getElementById("cbsb")

if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // Not adding `{ audio: true }` since we only want video now
    navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
        video.src = window.URL.createObjectURL(stream);
        video.play()
    });
}

function change(gap){
  var data = ctx.getImageData(0,0,c.width,c.height).data
  var dlen = data.length / 4


  for (i=0;i<dlen;i++){
    r = data[i * 4]
    g = data[i * 4 + 1]
    b = data[i * 4 + 2]

    or = lastPixelList[i * 4]
    og = lastPixelList[i * 4 + 1]
    ob = lastPixelList[i * 4 + 2]

    x = i % c.width
    y = parseInt(i / c.width)


    if (Math.abs(r - or) < gap && Math.abs(g - og) < gap && Math.abs(b - ob) < gap){
      ctx.fillRect(x,y,1,1)
    }
  }

  lastPixelList = data
}

function shadows(gap){
  var data = ctx.getImageData(0,0,c.width,c.height).data
  var dlen = data.length / 4

  for (i=0;i<dlen;i++){
    r = data[i * 4]
    g = data[i * 4 + 1]
    b = data[i * 4 + 2]

    x = i % c.width
    y = parseInt(i / c.width)


    if (r < gap && g < gap && b < gap){
      ctx.fillRect(x,y,1,1)
    }
  }
}

function flatten(gap){
  var data = ctx.getImageData(0,0,c.width,c.height).data
  var dlen = data.length / 4

  for (i=0;i<dlen;i++){
    r = data[i * 4]
    g = data[i * 4 + 1]
    b = data[i * 4 + 2]

    x = i % c.width
    y = parseInt(i / c.width)

    ctx.fillStyle = 'rgb(' + round(r,gap) + "," + round(g,gap) + "," + round(b,gap) + ")";
    ctx.fillRect(x,y,1,1)
  }

  lastPixelList = data
}

function switchColor(gap,color){
  var data = ctx.getImageData(0,0,c.width,c.height).data
  var dlen = data.length / 4

  for (i=0;i<dlen;i++){
    r = data[i * 4]
    g = data[i * 4 + 1]
    b = data[i * 4 + 2]

    x = i % c.width
    y = parseInt(i / c.width)

    if (color == "b"){
      if (b > gap && r < gap - gap / 3 && g < gap - gap / 3){
        ctx.fillStyle = "Blue"
        ctx.fillRect(x,y,1,1)
      }
    }
    if (color == "r"){
      if (r > gap && b < gap - gap / 3 && g < gap - gap / 3){
        ctx.fillStyle = "Red"
        ctx.fillRect(x,y,1,1)
      }
    }
    if (color == "g"){
      if (g > gap && r < gap - gap / 3 && b < gap - gap / 3){
        ctx.fillStyle = "Green"
        ctx.fillRect(x,y,1,1)
      }
    }
  }
}

function GetPixel(x, y) {
  var p = ctx.getImageData(x, y, 1, 1).data;
  return p;
}

function round(num, amount){
  a = num - (num % amount)
  return a;
}

function hexToRgbA(hex){
  var m = hex.match(/^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i);
  return {
      r: parseInt(m[1], 16),
      g: parseInt(m[2], 16),
      b: parseInt(m[3], 16)
  };
}

function tick(){
  ctx.drawImage(video, 0, 0, c.width, c.height);

  if (gapid.value != ""){
    gapvalue = parseInt(gapid.value)
  } else {
    gapvalue = 1
  }

  if (cschange.checked){
    change(gapvalue)
  }
  if (csshadow.checked){
    shadows(gapvalue)
  }
  if (csflat.checked){
    flatten(gapvalue)
  }
  if (cssr.checked){
    switchColor(gapvalue, "r")
  }
  if (cssg.checked){
    switchColor(gapvalue, "g")
  }
  if (cssb.checked){
    switchColor(gapvalue, "b")
  }
}

var a = setInterval(tick,10)
