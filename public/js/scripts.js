const generateRandomPalette = () => {
  const randomColor = () => "#" + (Math.random().toString(16) + "000000").slice(2, 8).toLocaleUpperCase();
  
  for (let i = 0; i < 5; i++) {
    const newColor = randomColor();

    if (!$(`.color_${i + 1}`).children('img').hasClass('saved')) {
      $(`.color_${i + 1}`).css('background-color', newColor);
      $(`.color_${i + 1}`).children('h3').text(newColor);
    }
  }
};

function toggleLockColor() {
  const unlocked = './images/unlocked.svg';
  const locked = './images/locked.svg';

  $(this).toggleClass('saved');
  $(this).attr('src', $(this).hasClass('saved') ? locked : unlocked);
}

const getPalettes = async () => {
  const url = '/api/v1/palettes';

  try {
    const response = await fetch(url);
    const palettes = await response.json();
    return palettes;
  } catch (error) {
    console.log(error.message);
  }
};

$('.generate-btn').on('click', generateRandomPalette);
$('.unsaved').on('click', toggleLockColor);