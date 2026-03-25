const fs = require('fs');

async function testUpdate() {
  try {
    const env = fs.readFileSync('.env.local', 'utf8');
    const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
    const keyMatch = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);
    
    const url = urlMatch[1].trim();
    const key = keyMatch[1].trim();
    
    // First fetch an item
    let res = await fetch(`${url}/rest/v1/portfolio_images?select=*&limit=1`, {
      headers: { 'apikey': key, 'Authorization': `Bearer ${key}` }
    });
    
    let data = await res.json();
    if (!data.length) { console.log("No data"); return; }
    
    const item = data[0];
    console.log("Found item ID:", item.id);
    
    // Try updating it
    res = await fetch(`${url}/rest/v1/portfolio_images?id=eq.${item.id}`, {
      method: 'PATCH',
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({ title: item.title + " (Edited)" })
    });
    
    if (!res.ok) {
        console.log("Update failed:", res.status, res.statusText);
        console.log("Body:", await res.text());
    } else {
        const updatedData = await res.json();
        console.log("Updated data:", updatedData);
    }
    
    // Revert the title
    await fetch(`${url}/rest/v1/portfolio_images?id=eq.${item.id}`, {
      method: 'PATCH',
      headers: { 'apikey': key, 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: item.title })
    });
    
  } catch(e) {
    console.error(e);
  }
}

testUpdate();
