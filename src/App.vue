<script setup>
import { ref } from "vue";
import { createClient } from '@supabase/supabase-js'

const supabase = createClient('https://dafkxnmzcmldjahtrvjh.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhZmt4bm16Y21sZGphaHRydmpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU1NDE2OTAsImV4cCI6MjA1MTExNzY5MH0.S2eM7LLMw32WfJgULkU8eKeo5Kov4rukerJYX7XunmI')

async function signInWithDiscord() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'discord',
  })
}

let user = ref(undefined)

supabase.auth.getUser().then(r => {
  user.value = r.data.user
  console.log(user.value)
})

let ip = ref(undefined)
fetch('https://api.ipify.org?format=json').then(res => res.json()).then(r => {
  ip.value = r.ip
})

let save = ref(undefined)

async function insertf() {
  save.value = 1
  let password = document.getElementById('password')?.value
  let repeatPassword = document.getElementById('repeat-password')?.value
  let username = document.getElementById("username")?.value

  if (password !== repeatPassword) {
    alert("Пароли не сходятся")
    save.value = undefined
    return
  }

  await supabase.from('minecraft')
      .upsert({ id: user.value.id, username: username, ip: ip.value, password: password })
      .select()
  save.value = 2
  setTimeout(() => save.value = undefined, 6000)
}

</script>

<template>
  <div class="flex items-center justify-center h-screen bg-neutral-900 text-white">
    <div v-if="user === undefined">
      <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
      </svg>
    </div>
    <div v-else-if="user === null">
      <button @click="signInWithDiscord">Войти через Discord</button>
    </div>
    <div v-else class="flex flex-col gap-1">
      <label for="username">Ник</label>
      <input class="rounded-xl bg-neutral-700 p-2 text-white" id="username" placeholder="Введите ваш ник" value="steve" min="3" max="32"/>
      <label for="username">Ник</label>
      <input class="rounded-xl bg-neutral-700 p-2 text-white" id="password" placeholder="Введите ваш ник" value="steve" min="3" max="32"/>
      <label for="username">Ник</label>
      <input class="rounded-xl bg-neutral-700 p-2 text-white" id="repeat-password" placeholder="Введите ваш ник" value="steve" min="3" max="32"/>
      <button v-if="save === undefined" class="rounded-xl p-2 bg-neutral-700" @click="insertf">Сохранить</button>
      <div v-else-if="save === 1" class="rounded-xl p-2 bg-neutral-700 flex items-center justify-center">
        <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg>
      </div>
      <div v-else-if="save === 2">
        Ваш ник сохранен, используйте его для входа на сервер
      </div>
    </div>
  </div>

</template>