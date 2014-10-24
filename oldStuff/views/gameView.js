$('.start').on('click', gameController.start)

$(document).on('keydown',(gameController.gameKeyDown));
$(document).on('keyup', (gameController.gameKeyUp));


