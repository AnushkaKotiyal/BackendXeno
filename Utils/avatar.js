
function getRandomAvatar() {
  const randomSeed = Math.random().toString(36).substring(2, 10);
  return `https://api.multiavatar.com/${randomSeed}.svg`;
}

module.exports = getRandomAvatar;
