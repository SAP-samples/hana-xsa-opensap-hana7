const fs = require('fs');
const childproc = require('child_process');

if (fs.existsSync('../package.json')) { 	
    childproc.execSync('npm install', { cwd: '..', shell: true, stdio: 'inherit' })
}