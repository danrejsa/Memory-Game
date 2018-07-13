/*
 * Create a list that holds all of your cards
 */

let symbols = ['diamond', 'diamond', 'bolt',  'cube', 'cube', 'leaf', 'leaf', 'bicycle', 'bicycle', 'bomb', 'bomb', 'plane', 'plane', 'open show',  'anchor','anchor', ],
opened = [],
match = 0,
Clicks = 0,
$Playground = $('.Playground'),
$scorePanel = $('#score-panel'),
$moveNum = $('.Clicks'),
$ratingStars = $('.fa-angellist'),
$restart = $('.restart'),
delay = 400,
currentseconds,
second = 0,
$seconds = $('.seconds'),
totalbox = symbols.length / 2,
rank3stars = 10,
rank2stars = 16,
rank1stars = 20;
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
function initGame() {
	var boxes = shuffle(symbols);
	$Playground.empty();
	match = 0;
	Clicks = 0;
	$moveNum.text('0');
	$ratingStars.removeClass('fa-thumbs-down').addClass('fa-star');
	for (var i = 0; i < boxes.length; i++) {
		$Playground.append($('<li class="box"><i class="fa fa-' + boxes[i] + '"></i></li>'))
	}
	addboxListener();

	resetseconds(currentseconds);
	second = 0;
	$seconds.text(`${second}`)
	initTime();
};

// Set Rating and final Score
function setRating(moves) {
	var rating = 3;
	if (moves > rank3stars && moves < rank2stars) {
		$ratingStars.eq(2).removeClass('fa-angellist').addClass('fa-thumbs-down');
		rating = 2;
	} else if (moves > rank2stars && moves < rank1stars) {
		$ratingStars.eq(1).removeClass('fa-angellist').addClass('fa-thumbs-down');
		rating = 1;
	} else if (moves > rank1stars) {
		$ratingStars.eq(0).removeClass('fa-angellist').addClass('fa-thumbs-down');
		rating = 0;
	}
	return { score: rating };
};


// End Game
function endGame(Clicks, score) {
	swal({
		allowEscapeKey: false,
		allowOutsideClick: false,
		title: 'Congratulations',
		text: 'With ' + Clicks + ' Clicks and ' + score + ' Stars in ' + second + ' Seconds.',
		type: 'success',
		confirmButtonColor: '#02ccba',
		confirmButtonText: 'Play again!'
	}).then(function (isConfirm) {
		if (isConfirm) {
			initGame();
		}
	})
}

// Restart Game
$restart.bind('click', function () {
	swal({
		allowEscapeKey: false,
		allowOutsideClick: false,
		title: 'Game Over',		
		type: 'warning',
		showCancelButton: false,
		confirmButtonColor: '#02ccba',
		cancelButtonColor: '#f95c3c',
		confirmButtonText: 'Try Again',
	}).then(function (isConfirm) {
		if (isConfirm) {
			initGame();
		}
	})
});

var addboxListener = function () {

	// box flip
	$Playground.find('.box').bind('click', function () {
		var $this = $(this)

		if ($this.hasClass('show') || $this.hasClass('match')) { return true; }

		var box = $this.context.innerHTML;
		$this.addClass('open show');
		opened.push(box);

		// Compare with opened box
		if (opened.length > 1) {
			if (box === opened[0]) {
				$Playground.find('.open').addClass('match animated infinite rubberBand');
				setTimeout(function () {
					$Playground.find('.match').removeClass('open show animated infinite rubberBand');
				}, delay);
				match++;
			} else {
				$Playground.find('.open').addClass('notmatch animated infinite wobble');
				setTimeout(function () {
					$Playground.find('.open').removeClass('animated infinite wobble');
				}, delay / 1.5);
				setTimeout(function () {
					$Playground.find('.open').removeClass('open show notmatch animated infinite wobble');
				}, delay);
			}
			opened = [];
			Clicks++;
			setRating(Clicks);
			$moveNum.html(Clicks);
		}

		// End Game if match all boxes
		if (totalbox === match) {
			setRating(Clicks);
			var score = setRating(Clicks).score;
			setTimeout(function () {
				endGame(Clicks, score);
			}, 500);
		}
	});
};


function initTime() {
	currentseconds = setInterval(function () {
		$seconds.text(`${second}`)
		second = second + 1
	}, 1000);
}

function resetseconds(seconds) {
	if (seconds) {
		clearInterval(seconds);
	}
}

initGame();