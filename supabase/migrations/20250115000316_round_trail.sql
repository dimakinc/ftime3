/*
  # Create keys table for storing activation keys and instructions

  1. New Tables
    - `keys`
      - `id` (uuid, primary key)
      - `short_id` (text, unique) - for URL access
      - `key_value` (text) - the actual key
      - `instructions` (text) - activation instructions
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `keys` table
    - Add policies for public read access by short_id
    - Add policies for authenticated users to create keys
*/

CREATE TABLE IF NOT EXISTS keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  short_id text UNIQUE NOT NULL,
  key_value text NOT NULL,
  instructions text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE keys ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  -- Create read policy if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'keys' 
    AND policyname = 'Anyone can read keys by short_id'
  ) THEN
    CREATE POLICY "Anyone can read keys by short_id"
      ON keys
      FOR SELECT
      TO public
      USING (true);
  END IF;

  -- Create insert policy if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'keys' 
    AND policyname = 'Authenticated users can create keys'
  ) THEN
    CREATE POLICY "Authenticated users can create keys"
      ON keys
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;
END $$;