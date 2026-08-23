import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }

  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return res.status(500).json({
        success: false,
        error: 'Supabase environment variables are missing',
      });
    }

    const supabase = createClient(
      supabaseUrl,
      serviceRoleKey
    );

    /*
     * Small read-only queries.
     *
     * We deliberately select only `id` and limit
     * the result to 1 row. No data is modified.
     */

    const queries = await Promise.all([
      supabase
        .from('bookings')
        .select('id')
        .limit(1),

      supabase
        .from('hero_media')
        .select('id')
        .limit(1),

      supabase
        .from('team_members')
        .select('id')
        .limit(1),
    ]);

    const errors = queries
      .map((result, index) => {
        if (result.error) {
          return {
            query: index + 1,
            error: result.error.message,
          };
        }

        return null;
      })
      .filter(Boolean);

    if (errors.length > 0) {
      console.error('Supabase keep-alive errors:', errors);

      return res.status(500).json({
        success: false,
        message: 'One or more Supabase queries failed',
        errors,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Supabase keep-alive successful',
      queriesExecuted: 3,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Keep-alive error:', error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}