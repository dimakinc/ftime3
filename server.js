import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

// Функция для создания новых ключей
async function createKeys(keys, instructions) {
  try {
    const results = [];
    
    for (const key of keys) {
      const shortId = generateShortId(); // Функция для генерации ID
      
      const { data, error } = await supabase
        .from('keys')
        .insert([
          {
            short_id: shortId,
            key: key,
            instructions: instructions
          }
        ])
      
      if (error) throw error;
      results.push(shortId);
    }
    
    return { shortIds: results };
  } catch (error) {
    console.error('Error creating keys:', error);
    throw error;
  }
}

// Функция для получения данных ключа
async function getKeyData(shortId) {
  try {
    const { data, error } = await supabase
      .from('keys')
      .select('*')
      .eq('short_id', shortId)
      .single();
    
    if (error) throw error;
    if (!data) throw new Error('Key not found');
    
    return {
      key: data.key,
      instructions: data.instructions
    };
  } catch (error) {
    console.error('Error getting key data:', error);
    throw error;
  }
}

// Вспомогательная функция для генерации короткого ID
function generateShortId() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export { createKeys, getKeyData };
