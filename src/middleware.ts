import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  const session = context.cookies.get("user_session");
  
  if (session) {
    try {
      context.locals.user = JSON.parse(session.value);
    } catch {
      context.locals.user = null;
    }
  }

  return next();
});