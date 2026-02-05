import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware((context, next) => {
    const session = context.cookies.get("user_session");
    context.locals.user = session ? session.json() : null;
    return next();
});