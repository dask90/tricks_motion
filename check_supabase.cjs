const fs = require('fs');

async function check() {
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
    
    const res = await fetch(`${url}/rest/v1/portfolio_images?select=*&order=created_at.desc`, {
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`
      }
    });
    
    if (!res.ok) {
        console.log("Response not OK:", res.status, res.statusText);
        const text = await res.text();
        console.log("Body:", text);
    } else {
        const data = await res.json();
        console.log("Data count:", data.length);
        console.log("First item:", data[0]);
    }
  } catch(e) {
    console.error("Fetch threw:", e);
  }
}

check();
