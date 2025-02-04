import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import md5 from 'https://esm.sh/md5'

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const supabase = createClient(supabaseUrl, supabaseKey);

Deno.serve(async (req, info) => {
  const authHeader = req.headers.get('Authorization');
  let reqBody;
  try {
    reqBody = await req.json();
  } catch {
    reqBody = { username: undefined }
  }

  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Authorization header is missing' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 403,
    });
  }

  const { data } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))
  if (!data.user) {
    return new Response(JSON.stringify({ error: 'User not found' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 403,
    });
  }

  const minecraftUser = await supabase.from('minecraft').select('*').eq('id', data.user.id).single()
  if (!minecraftUser.data) {
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }

  const username = reqBody.username ?? minecraftUser.data.username

  if (!(/^[\wа-яА-ЯЁё]{3,16}$/i).test(username)) {
    return new Response(JSON.stringify({ error: 'Invalid username' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }

  const randomMD5 = md5(crypto.randomUUID())
  const time = Temporal.Now.instant().add(Temporal.Duration.from({ minutes: 10 }))

  const rows = await supabase.from('minecraft').upsert({
    id: data.user.id,
    ip: info.remoteAddr.hostname,
    username: username,
    password: randomMD5,
    password_expire: time
  }).select()

  if (!rows.data) {
    return new Response(JSON.stringify({ error: 'Internal error: ' + rows.error.message, }), {
      headers: { 'Content-Type': 'application/json' },
      status: 501,
    });
  }
  return new Response(
    JSON.stringify(rows.data),
    { headers: { "Content-Type": "application/json" } },
  )
})
