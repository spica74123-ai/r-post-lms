const Jimp = require('jimp');

async function processImage() {
  const imagePath = 'c:\\Users\\noomi\\.gemini\\antigravity\\brain\\80801b8c-ebf7-4f7d-8bf1-a4579c427e2b\\media__1774123598652.png';
  console.log("Reading image...");
  const img = await Jimp.read(imagePath);
  
  const w = img.bitmap.width;
  const h = img.bitmap.height;
  const cx = w / 2;
  const cy = h / 2;
  
  // The emblem seems to touch the absolute edges, so maxRadius is exactly w/2.
  // We'll shave off 1.5% to ensure no black rim exists.
  const radius = Math.min(w, h) / 2 * 0.985; 

  console.log(`Processing image of size ${w}x${h} with crop radius ${radius}...`);
  
  img.scan(0, 0, w, h, function(x, y, idx) {
    const dx = x - cx;
    const dy = y - cy;
    const dist = Math.sqrt(dx*dx + dy*dy);
    
    // Antialiasing pseudo logic:
    if (dist > radius) {
      // make it transparent completely
      this.bitmap.data[idx + 3] = 0; 
    } else if (dist > radius - 2) {
      // Soft edge for the outer 2 pixels
      const alpha = Math.floor(255 * (radius - dist) / 2);
      this.bitmap.data[idx + 3] = Math.max(0, Math.min(255, alpha));
    }
  });

  await img.writeAsync('public/logo.png');
  console.log("Saved public/logo.png");
  
  // Create an icon.png for Next.js App Router to automatically generate Favicons
  await img.resize(256, 256).writeAsync('src/app/icon.png');
  console.log("Saved src/app/icon.png");
}

processImage().then(() => console.log('Done!')).catch(console.error);
