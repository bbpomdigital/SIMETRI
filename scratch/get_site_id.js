const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const content = fs.readFileSync('.env.local', 'utf8');
const lines = content.split('\n');
let url = '';
let key = '';

lines.forEach(l => {
  if (l.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
    url = l.split('=')[1].trim();
  }
  if (l.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
    key = l.split('=')[1].trim();
  }
});

const supabase = createClient(url, key);

async function run() {
  const { data, error } = await supabase.from('websites').select('id, site_name, status');
  if (error) {
    console.error('Error fetching websites:', error);
  } else {
    console.log('WEBSITE_LIST_START');
    console.log(JSON.stringify(data, null, 2));
    console.log('WEBSITE_LIST_END');
  }
}
run();
