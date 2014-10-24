$('.start').on('click', function() {
	gameController.start();
	$(this).hide();
	});

$(document).on('keydown',(gameController.gameKeyDown));
$(document).on('keyup', (gameController.gameKeyUp));


