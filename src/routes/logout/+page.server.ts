import { redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
  // only use this endpoint for the api
  // no need to see the page
  throw redirect(302, '/')
}

export const actions: Actions = {
  default({ cookies }) {
    console.log("logout")
    // TODO: Implement register
    // Check if ustername already exist etc.
    cookies.delete('session');
    console.log(cookies.get("session"))
    throw redirect(302, "/");
  },
}