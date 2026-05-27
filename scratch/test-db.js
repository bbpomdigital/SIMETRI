const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://fexmeikmwcnfnvdxnpig.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZleG1laWttd2NuZm52ZHhucGlnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODg0MDcwMiwiZXhwIjoyMDk0NDE2NzAyfQ.EN2zQcZ8qxlBX6w1K_Uzrhc-i6TKu3uf0CFwGrThYxA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log("Checking users table...");
  
  // 1. List existing users
  const { data: users, error: errUsers } = await supabase.from('users').select('*');
  if (errUsers) {
    console.error("Users table error:", errUsers);
    return;
  }
  
  console.log("Current users in database:", users);

  // 2. Check if user 'pandu' already exists
  const existingUser = users.find(u => u.username === 'pandu');
  if (existingUser) {
    console.log("User 'pandu' already exists!");
  } else {
    console.log("Inserting user 'pandu' with password '123'...");
    
    // Insert pandu user
    const { data: newUser, error: errInsert } = await supabase
      .from('users')
      .insert([{
        username: 'pandu',
        password: '123'
      }])
      .select();

    if (errInsert) {
      console.error("Error inserting user:", errInsert);
    } else {
      console.log("Successfully created user 'pandu'!", newUser);
    }
  }
}

test();
