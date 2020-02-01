document.write('<canvas class="fireworks"></canvas><script src="https://cdn.bootcss.com/animejs/2.2.0/anime.min.js"></script><script src="../jss/fireworks.js"></script>')
var fileName = location.href.split('/').pop().split('.')[0]
window.parent.setWindow(fileName,$('title').html(),$('#height').html(),$('#width').html());
