const { exec } = require('child_process');

module.exports = {
  pull: (req, res) => {
    exec('git pull', (error, stdout) => {
      if (error) return console.error('Git pull failed.');

      if (stdout.trim() === 'Already up to date.') {
        res.send(stdout);
      } else {
        setTimeout(() => {
          exec('pm2 reload 0')
        }, 3000);
        setTimeout(() => {
          exec('pm2 restart 0')
        }, 4000);
        res.send('Pulling..., Server is rebooting.');
      }
    });
  }
}
