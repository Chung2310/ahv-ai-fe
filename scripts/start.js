const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Basic .env parser
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim();
        process.env[key] = value;
      }
    });
  }
}

loadEnv();

const port = process.env.PORT || 3000;
const command = process.argv[2] || 'dev';

console.log(`> Starting AHV AI in ${command} mode on port ${port}...`);

const next = spawn('npx', ['next', command, '-p', port], { 
  stdio: 'inherit', 
  shell: true 
});

next.on('close', (code) => {
  process.exit(code);
});
