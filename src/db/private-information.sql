-- Applied to the dedicated Agencia IA project only. The generic Decision Engine
-- schema remains a draft until its organization/approval policies are implemented.
create table public.business_information (
 user_id uuid primary key references auth.users(id) on delete cascade,
 payload jsonb not null,
 revision integer not null default 1 check (revision > 0),
 updated_at timestamptz not null default now(),
 constraint business_information_payload check (
  jsonb_typeof(payload) = 'object'
  and payload ?& array['version','profile','products','daily','documents']
  and payload->>'version' = '1'
  and jsonb_typeof(payload->'profile') = 'object'
  and jsonb_typeof(payload->'products') = 'array'
  and jsonb_typeof(payload->'daily') = 'array'
  and jsonb_typeof(payload->'documents') = 'array'
  and octet_length(payload::text) <= 2100000
 )
);
alter table public.business_information enable row level security;
revoke all on public.business_information from anon, authenticated;
grant select, insert, update on public.business_information to authenticated;
create policy "Read own business information" on public.business_information for select to authenticated
 using ((select auth.uid()) = user_id and coalesce((select auth.jwt())->>'is_anonymous','false')='false');
create policy "Insert own business information" on public.business_information for insert to authenticated
 with check ((select auth.uid()) = user_id and coalesce((select auth.jwt())->>'is_anonymous','false')='false');
create policy "Update own business information" on public.business_information for update to authenticated
 using ((select auth.uid()) = user_id and coalesce((select auth.jwt())->>'is_anonymous','false')='false')
 with check ((select auth.uid()) = user_id and coalesce((select auth.jwt())->>'is_anonymous','false')='false');
create function public.save_business_information(new_payload jsonb, expected_revision integer)
returns setof public.business_information
language plpgsql security invoker set search_path = '' as $$
declare affected integer;
begin
 if auth.uid() is null or coalesce(auth.jwt()->>'is_anonymous','false')='true' then
  raise exception 'Sign in required' using errcode='42501';
 end if;
 if expected_revision = 0 then
  insert into public.business_information(user_id,payload,revision)
  values(auth.uid(),new_payload,1) on conflict (user_id) do nothing;
 else
  update public.business_information set payload=new_payload,revision=revision+1,updated_at=now()
  where user_id=auth.uid() and revision=expected_revision;
 end if;
 get diagnostics affected = row_count;
 if affected = 0 then raise exception 'Revision conflict' using errcode='40001'; end if;
 return query select * from public.business_information where user_id=auth.uid();
end;
$$;
revoke all on function public.save_business_information(jsonb,integer) from public, anon;
grant execute on function public.save_business_information(jsonb,integer) to authenticated;
