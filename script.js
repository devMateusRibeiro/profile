(function() {
  $('.btn').click(function() {
    $(this).toggleClass('active');
    return $('.box').toggleClass('open');
  });

}).call(this);

function handleClick(platform) {
  if (platform === 'github') {
    window.location.href = 'https://github.com/devMateusRibeiro';
  } else if (platform === 'linkedin') {
    window.location.href = 'https://www.linkedin.com/in/mateus-ribeiro-in/';
  } else if (platform === 'twitter') {
    window.location.href = 'https://twitter.com/ribmateuss';
  } else if (platform === 'instagram') {
    window.location.href = 'https://www.instagram.com/ribmateuss/';
  } else if (platform === 'steam') {
    window.location.href = 'https://steamcommunity.com/id/mateus_ribeiro/';
  }
}
