-- Transactional authorization checks: no users or business rows survive rollback.
begin;
insert into auth.users(id) values('10000000-0000-4000-8000-000000000001'),('10000000-0000-4000-8000-000000000002');
set local role authenticated;
select set_config('request.jwt.claims','{"sub":"10000000-0000-4000-8000-000000000001","role":"authenticated","is_anonymous":false}',true);
select revision from public.save_business_information('{"version":1,"updatedAt":null,"profile":{"name":"QA","website":"","description":"","audience":"","goals":""},"products":[],"daily":[],"documents":[]}',0);
do $$ begin
 begin
  perform public.save_business_information('{"version":1,"profile":{},"products":[],"daily":[],"documents":[]}',0);
  raise exception 'FAIL: stale revision allowed';
 exception when serialization_failure then null; end;
 begin
  update public.business_information set user_id='10000000-0000-4000-8000-000000000002';
  raise exception 'FAIL: ownership reassignment allowed';
 exception when insufficient_privilege then null; end;
end $$;
select set_config('request.jwt.claims','{"sub":"10000000-0000-4000-8000-000000000002","role":"authenticated","is_anonymous":false}',true);
do $$ declare n integer; begin
 select count(*) into n from public.business_information;
 if n<>0 then raise exception 'FAIL: another user can read private data';end if;
 update public.business_information set revision=99;
 get diagnostics n=row_count;
 if n<>0 then raise exception 'FAIL: another user can update private data';end if;
end $$;
select set_config('request.jwt.claims','{"sub":"10000000-0000-4000-8000-000000000001","role":"authenticated","is_anonymous":true}',true);
do $$ declare n integer; begin
 select count(*) into n from public.business_information;
 if n<>0 then raise exception 'FAIL: anonymous session can read private data';end if;
 begin
  perform public.save_business_information('{"version":1,"profile":{},"products":[],"daily":[],"documents":[]}',1);
  raise exception 'FAIL: anonymous session can save';
 exception when insufficient_privilege then null; end;
end $$;
reset role;
set local role anon;
do $$ begin
 begin
  perform * from public.business_information;
  raise exception 'FAIL: anon has table access';
 exception when insufficient_privilege then null; end;
 begin
  perform public.save_business_information('{}',0);
  raise exception 'FAIL: anon can execute save';
 exception when insufficient_privilege then null; end;
end $$;
reset role;
select 'PASS: own write, revision conflict, ownership reassignment, cross-user isolation, anonymous denial' as result;
rollback;
