import type { Handle } from '@sveltejs/kit'
import { database } from '$lib/database'

export const handle: Handle = async ({ event, resolve }) => {
  // get cookies from browser
  const session = event.cookies.get('session')
  //console.log(session)


  if (!session) {
    // if there is no session load page as normal
    return await resolve(event)
  }

  // find the user based on the session
  const user = await database.user.findUnique({
    where: { userAuthToken: session },
    select: { username: true, role: true, id: true },
  })

  // if `user` exists set `events.local`
  if (user) {
    event.locals.user = {
      id:   user.id,
      name: user.username,
      role: user.role.name,
    }
  }

  // load page as normal
  return await resolve(event)
}
