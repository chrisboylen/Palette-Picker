// document.querySelector('#save-palette-input').addEventListener('focus blur', function (e) {
//   $(this).parents('.float-container').classList.toggle('is-focused', (e.type === 'focus' || this.value.length > 0))
//   // document.querySelector('.float-container').classList.toggle('active');
// }).trigger('blur');

// document.querySelector('#save-palette-input').addEventListener('blur', () => {
//   document.querySelector('.float-container').classList.remove('active');
// });

// $(document).ready(getColors);


const generateRandomPalette = () => {
  const randomColor = () => "#" + (Math.random().toString(16) + "000000").slice(2, 8).toLocaleUpperCase();
  
  for (let i = 0; i < 5; i++) {
    const newColor = randomColor();

    if (!$(`.color_${i + 1}`).hasClass('saved')) {
      $(`.color_${i + 1}`).css('background-color', newColor);
      $(`.color_${i + 1}`).children('h3').text(newColor);
    }
  }
};

$('.generate-btn').on('click', generateRandomPalette)