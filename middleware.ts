import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { auth } from "./auth";

const publicPages = ["/", "/page/(.*)"];

const intlMiddleware = createMiddleware(routing);

export default auth((req) => {
  const publicPathnameRegex = RegExp(
    `^(/(${routing.locales.join("|")}))?(${publicPages
      .flatMap((p) => (p === "/" ? ["", "/"] : p))
      .join("|")})/?$`,
    "i"
  );
  const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname);

  if (isPublicPage) {
    // return NextResponse.next()
    return intlMiddleware(req);
  } else {
    if (!req.auth && req.nextUrl.pathname === "/dashboard") {
      const newUrl = new URL(`/login`, req.nextUrl.origin);
      return Response.redirect(newUrl);
    } else {
      return intlMiddleware(req);
    }
  }
});

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
