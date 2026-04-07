const fs = require('fs');

async function listHeroes() {
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
    
    const res = await fetch(`${url}/rest/v1/portfolio_images?select=url,category,site_section&site_section=eq.Portfolio`, {
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`
      }
    });

    if (!res.ok) return;

    const data = await res.json();
    const categories = ['Weddings', 'Graduations', 'Events', 'Birthdays', 'Parties', 'Funerals'];
    
    categories.forEach(cat => {
      const match = data.find(img => img.category === cat);
      if (match) {
        console.log(`### ${cat} ###`);
        console.log(match.url);
      }
    });
  } catch(e) {}
}

listHeroes();
