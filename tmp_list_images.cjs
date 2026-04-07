const fs = require('fs');

async function listImages() {
  try {
    const env = fs.readFileSync('.env.local', 'utf8');
    const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
    const keyMatch = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);
    
    if (!urlMatch || !keyMatch) {
      console.error("Missing env vars");
      return;
    }
    
    const url = urlMatch[1].trim();
    const key = keyMatch[1].trim();
    
    const res = await fetch(`${url}/rest/v1/portfolio_images?select=url,category,title,site_section&site_section=eq.Portfolio`, {
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`
      }
    });

    if (!res.ok) {
        console.log("Response not OK:", res.status, res.statusText);
        return;
    }

    const data = await res.json();
    const byCategory = {};
    data.forEach(img => {
      if (!byCategory[img.category]) byCategory[img.category] = [];
      byCategory[img.category].push(img);
    });

    for (const cat in byCategory) {
      console.log(`\n--- ${cat} ---`);
      byCategory[cat].slice(0, 3).forEach(img => {
        console.log(`${img.title}: ${img.url}`);
      });
    }
  } catch(e) {
    console.error("Fetch threw:", e);
  }
}

listImages();
