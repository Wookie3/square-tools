-- Create user_shipments table for Purolator tracking
-- Run this in Supabase SQL Editor to set up the database

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user_shipments table
CREATE TABLE IF NOT EXISTS user_shipments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pin TEXT NOT NULL,
  status TEXT,
  details JSONB,
  last_checked_at TIMESTAMPTZ,
  delivered BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, pin)
);

-- Create index on user_id for queries
CREATE INDEX IF NOT EXISTS idx_user_shipments_user_id ON user_shipments(user_id);

-- Create index on pin for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_shipments_pin ON user_shipments(pin);

-- Create index on delivered status for filtering
CREATE INDEX IF NOT EXISTS idx_user_shipments_delivered ON user_shipments(delivered);

-- Create index on last_checked_at for daily refresh queries
CREATE INDEX IF NOT EXISTS idx_user_shipments_last_checked ON user_shipments(last_checked_at);

-- Add comment to table
COMMENT ON TABLE user_shipments IS 'Stores tracked Purolator shipments and their status';

-- Add comments to columns
COMMENT ON COLUMN user_shipments.id IS 'Primary key (auto-generated UUID)';
COMMENT ON COLUMN user_shipments.user_id IS 'User ID who owns this shipment (references auth.users)';
COMMENT ON COLUMN user_shipments.pin IS 'Purolator tracking PIN';
COMMENT ON COLUMN user_shipments.status IS 'Current status description';
COMMENT ON COLUMN user_shipments.details IS 'Full SOAP response data (JSONB)';
COMMENT ON COLUMN user_shipments.last_checked_at IS 'Last refresh timestamp';
COMMENT ON COLUMN user_shipments.delivered IS 'Delivery status flag';
COMMENT ON COLUMN user_shipments.created_at IS 'Creation timestamp (auto-generated)';
