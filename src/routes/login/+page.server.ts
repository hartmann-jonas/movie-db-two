import { fail, redirect } from '@sveltejs/kit'
import bcrypt from 'bcrypt'
import type { Action, Actions, PageServerLoad } from './$types'

import { database } from '$lib/database'

export let ssr = false;

export const load: PageServerLoad = async ({ locals }) => {
  // redirect user if logged in
  if (locals.user) {
    throw redirect(302, '/')
  }
}

interface TokenValidateResponse {
  'error-codes': string[];
  success: boolean;
  action: string;
  cdata: string;
}

async function validateToken(token: string, secret: string) {
  const response = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        response: token,
        secret: secret,
      }),
    },
  );

  const data: TokenValidateResponse = await response.json();

  return {
    // Return the status
    success: data.success,

    // Return the first error if it exists
    error: data['error-codes']?.length ? data['error-codes'][0] : null,
  };
}

export const actions: Actions = {

  default: async ({ cookies, request }) => {
    const data = await request.formData()
    console.log(data)
    const username = data.get('username')
    const password = data.get('password')

    // token from the cloudflare captcha
    const token = data.get('cf-turnstile-response') as string
    const SECRET_KEY = process.env.TURNSTILE_SECRET_KEY as string
    console.log(SECRET_KEY)
    const { success, error } = await validateToken(token, SECRET_KEY)
    console.log("Cloudflare Turnstile: " + success)
    if (!success) {
      return fail(400, { captcha: true, error })
    }


    if (
      typeof username !== 'string' ||
      typeof password !== 'string' ||
      !username ||
      !password
    ) {
      return fail(400, { invalid: true })
    }

    const user = await database.user.findUnique({ where: { username } })

    if (!user) {
      return fail(400, { credentials: true })
    }

    const userPassword = await bcrypt.compare(password, user.passwordHash)

    if (!userPassword) {
      return fail(400, { credentials: true })
    }

    // generate new auth token just in case
    const authenticatedUser = await database.user.update({
      where: { username: user.username },
      data: { userAuthToken: crypto.randomUUID() },
    })

    cookies.set('session', authenticatedUser.userAuthToken, {
      // send cookie for every page
      path: '/',
      // server side only cookie so you can't use `document.cookie`
      httpOnly: true,
      // only requests from same site can send cookies
      // https://developer.mozilla.org/en-US/docs/Glossary/CSRF
      sameSite: 'strict',
      // only sent over HTTPS in production
      secure: process.env.NODE_ENV === 'production',
      // set cookie to expire after a month
      maxAge: 60 * 60 * 24 * 30,
    })

    console.log('Logging in')
    // redirect the user
    throw redirect(302, '/profile')
  }
}