/* Documentary video (YouTube). Click-to-play: nothing from YouTube loads until the visitor presses play.
   The section stays hidden until a real 11-character video ID is set in its data-video-id attribute. */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.eh-documentary[data-video-id]').forEach(section => {
    const id = (section.dataset.videoId || '').trim();
    if(!/^[\w-]{11}$/.test(id)) return;

    const player = section.querySelector('.eh-video-player');
    const play = section.querySelector('.eh-video-play');
    const link = section.querySelector('.eh-video-link');
    if(!player || !play) return;

    player.style.backgroundImage = 'url(https://i.ytimg.com/vi/' + id + '/hqdefault.jpg)';
    if(link) link.href = 'https://www.youtube.com/watch?v=' + id;

    play.addEventListener('click', () => {
      const frame = document.createElement('iframe');
      frame.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0';
      frame.title = player.dataset.title || 'Documentary video';
      frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      frame.allowFullscreen = true;
      player.replaceChildren(frame);
    });

    section.hidden = false;
    if(location.hash === '#' + section.id) section.scrollIntoView();
  });
});