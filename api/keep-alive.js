const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async (req, res) => {
  try {
    await supabase.from('keep_alive').select('id').limit(1);
    res.status(200).send('Supabase pinged');
  } catch (err) {
    console.error('Ping failed:', err.message);
    res.status(500).send('Ping failed');
  }
};
