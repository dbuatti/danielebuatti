ALTER TABLE job_decisions
  ADD COLUMN IF NOT EXISTS gut_feeling text,
  ADD COLUMN IF NOT EXISTS time_of_day text,
  ADD COLUMN IF NOT EXISTS current_load text DEFAULT 'normal';
