create extension if not exists pgcrypto;

drop view if exists public.catalog_app_details;
drop view if exists public.catalog_app_cards;

drop table if exists public.app_version_compatibility;
drop table if exists public.app_versions;
drop table if exists public.apps;
drop table if exists public.products;
drop table if exists public.publishers;
drop table if exists public.catalog_audit_events;

create table if not exists public.catalog_apps (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  publisher text not null,
  publisher_url text,
  short_description text not null,
  long_description text,
  status text not null default 'published' check (status in ('published', 'archived')),
  versions jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint catalog_apps_versions_is_array check (jsonb_typeof(versions) = 'array')
);

create or replace function public.set_catalog_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_catalog_apps_updated_at on public.catalog_apps;
create trigger set_catalog_apps_updated_at
before update on public.catalog_apps
for each row execute function public.set_catalog_updated_at();

alter table public.catalog_apps enable row level security;

drop policy if exists "Public can read published catalog apps" on public.catalog_apps;
create policy "Public can read published catalog apps"
on public.catalog_apps for select
to anon, authenticated
using (status = 'published');

grant usage on schema public to anon, authenticated;
grant select on public.catalog_apps to anon, authenticated;

insert into public.catalog_apps (slug, name, publisher, publisher_url, short_description, long_description, status, versions, created_at)
values
  (
    'mechanical-results-exporter',
    'Mechanical Results Exporter',
    'Ansys Applications',
    'https://www.ansys.com',
    'Export simulation results into structured CSV and JSON packages.',
    'Mechanical Results Exporter helps engineering teams package simulation results for downstream analysis, reporting, and automated QA workflows.',
    'published',
    jsonb_build_array(
      jsonb_build_object(
        'id', gen_random_uuid(),
        'version', '1.1.0',
        'releaseNotes', 'Adds batch export controls and clearer job completion messages.',
        'pricingType', 'free',
        'priceText', 'Free',
        'downloadType', 'external_url',
        'downloadUrl', 'https://example.com/downloads/mechanical-results-exporter/1.1.0',
        'compatibility', jsonb_build_array(
          jsonb_build_object('productName', 'Ansys Mechanical', 'compatibilityText', 'Compatible with Ansys Mechanical 2025 R1 and newer.'),
          jsonb_build_object('productName', 'Synopsys Developer Portal', 'compatibilityText', 'Supports portal-hosted download workflow.')
        ),
        'createdAt', '2026-03-15T12:00:00Z'
      ),
      jsonb_build_object(
        'id', gen_random_uuid(),
        'version', '1.0.0',
        'releaseNotes', 'Initial release with CSV export support and a simple JSON manifest.',
        'pricingType', 'free',
        'priceText', 'Free',
        'downloadType', 'external_url',
        'downloadUrl', 'https://example.com/downloads/mechanical-results-exporter/1.0.0',
        'compatibility', jsonb_build_array(
          jsonb_build_object('productName', 'Ansys Mechanical', 'compatibilityText', 'Compatible with Ansys Mechanical 2024 R2 and newer.')
        ),
        'createdAt', '2026-01-10T12:00:00Z'
      )
    ),
    '2026-01-10T12:00:00Z'
  ),
  (
    'fluent-batch-runner',
    'Fluent Batch Runner',
    'Synopsys Partner Labs',
    'https://www.synopsys.com',
    'Queue and monitor repeatable Fluent jobs from a lightweight command workflow.',
    'Fluent Batch Runner standardizes repeated CFD jobs with versioned run settings, simple status reporting, and reproducible command output.',
    'published',
    jsonb_build_array(
      jsonb_build_object(
        'id', gen_random_uuid(),
        'version', '2.0.0',
        'releaseNotes', 'Adds queue status output, reusable run profiles, and compatibility with current Fluent workloads.',
        'pricingType', 'paid',
        'priceText', 'Paid partner app',
        'downloadType', 'external_url',
        'downloadUrl', 'https://partner.example.com/fluent-batch-runner/2.0.0',
        'compatibility', jsonb_build_array(
          jsonb_build_object('productName', 'Ansys Fluent', 'compatibilityText', 'Compatible with Ansys Fluent 2025 R1 and newer.')
        ),
        'createdAt', '2026-02-01T12:00:00Z'
      )
    ),
    '2026-02-01T12:00:00Z'
  ),
  (
    'thermal-compliance-toolkit',
    'Thermal Compliance Toolkit',
    'ThermalWorks',
    'https://example.com/thermalworks',
    'Prepare thermal compliance evidence for internal and partner reviews.',
    'Thermal Compliance Toolkit gives reviewers a consistent text-based checklist for thermal assumptions, model metadata, and approval notes.',
    'published',
    jsonb_build_array(
      jsonb_build_object(
        'id', gen_random_uuid(),
        'version', '0.9.0',
        'releaseNotes', 'Preview release for structured thermal compliance notes and evidence exports.',
        'pricingType', 'contact_sales',
        'priceText', 'Contact sales',
        'downloadType', 'request_access',
        'downloadUrl', null,
        'compatibility', jsonb_build_array(
          jsonb_build_object('productName', 'Ansys Mechanical', 'compatibilityText', 'Compatible with text-based thermal review packages.'),
          jsonb_build_object('productName', 'Ansys Electronics Desktop', 'compatibilityText', 'Supports electronics thermal evidence summaries.')
        ),
        'createdAt', '2026-02-20T12:00:00Z'
      )
    ),
    '2026-02-20T12:00:00Z'
  )
on conflict (slug) do update set
  name = excluded.name,
  publisher = excluded.publisher,
  publisher_url = excluded.publisher_url,
  short_description = excluded.short_description,
  long_description = excluded.long_description,
  status = excluded.status,
  versions = excluded.versions;
