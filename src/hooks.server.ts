import type { Handle } from '@sveltejs/kit'
import { database } from '$lib/database'

export const handle: Handle = async ({ event, resolve }) => {
  // get cookies from browser
  const session = event.cookies.get('session')
  //console.log(session)

  if (event.request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS, DELETE",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }


  if (!session) {
    // if there is no session load page as normal
    const response = await resolve(event)
    response.headers.append("Access-Control-Allow-Origin", `*`);
    return response;
  }

  // find the user based on the session
  const user = await database.user.findUnique({
    where: { userAuthToken: session },
    select: { username: true, role: true, id: true },
  })

  // if `user` exists set `events.local`
  if (user) {
    event.locals.user = {
      id: user.id,
      name: user.username,
      role: user.role.name,
    }
  }

  // load page as normal
  const response = await resolve(event)
  response.headers.append("Access-Control-Allow-Origin", `*`);
  return response;
}
