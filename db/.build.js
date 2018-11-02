const fs = require('fs');
const childproc = require('child_process');

if (fs.existsSync('../package.json')) { // true at build-time, false at CF staging time
    childproc.execSync('npm install  && npm run build', { cwd: '..', shell: true, stdio: 'inherit' })
}
