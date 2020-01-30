document.write('<canvas class="fireworks"></canvas><script src="https://unpkg.com/animejs@3.0.1/lib/anime.min.js"></script><script src="../jss/fireworks.js"></script>')
var fileName = location.href.split('/').pop().split('.')[0]
window.parent.setWindow(fileName,$('title').html(),$('#height').html(),$('#width').html());
