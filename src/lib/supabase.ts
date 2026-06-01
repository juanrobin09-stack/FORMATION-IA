// ===========================================================================
// FORMATOR AI - Client Supabase (chemin de production, optionnel)
// ===========================================================================
// En V1, la persistance se fait dans le navigateur (src/lib/store.ts).
// Pour activer Supabase :
//   1. Renseignez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY
//   2. Executez le schema SQL ci-dessous dans votre projet Supabase
//   3. Remplacez les implementations de store.ts par des appels Supabase
// ===========================================================================

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  if (!client) client = createClient(url, key);
  return client;
}

export const isSupabaseConfigured = (): boolean =>
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

// ---------------------------------------------------------------------------
// Schema SQL de reference (a executer dans Supabase) :
//
// create table prospects (
//   id uuid primary key default gen_random_uuid(),
//   entreprise text not null,
//   secteur text,
//   nb_salaries int,
//   contact text,
//   telephone text,
//   email text,
//   besoin text,
//   date_rdv date,
//   statut text default 'Prospect',
//   montant numeric,
//   created_at timestamptz default now()
// );
//
// create table knowledge (
//   id uuid primary key default gen_random_uuid(),
//   kind text not null,
//   entreprise text,
//   secteur text,
//   titre text,
//   payload jsonb,
//   created_at timestamptz default now()
// );
//
// create table devis (
//   id uuid primary key default gen_random_uuid(),
//   entreprise text,
//   prix numeric,
//   duree text,
//   nb_participants int,
//   conditions text,
//   date date,
//   created_at timestamptz default now()
// );
// ---------------------------------------------------------------------------
