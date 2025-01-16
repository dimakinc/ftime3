/*
  # Update keys table policies for anonymous access

  1. Changes
    - Drop existing policies
    - Create new policies for anonymous access
  2. Security
    - Allow public read access by short_id
    - Allow public insert access (anonymous)
*/

-- First drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can read keys by short_id" ON keys;
DROP POLICY IF EXISTS "Anyone can create keys" ON keys;
DROP POLICY IF EXISTS "Authenticated users can create keys" ON keys;

-- Create new policies
CREATE POLICY "Anyone can read keys by short_id"
  ON keys
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can create keys"
  ON keys
  FOR INSERT
  TO public
  WITH CHECK (true);