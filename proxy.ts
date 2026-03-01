import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** 로그인 없이 접근 가능한 경로 */
const PUBLIC_PATHS = ["/login", "/register"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoggedIn = request.cookies.has("isLoggedIn");
  const isPublic = PUBLIC_PATHS.includes(pathname);

  // 미인증 상태로 보호된 경로 접근 → 로그인 페이지로 즉시 리다이렉트
  if (!isLoggedIn && !isPublic) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 이미 로그인된 상태로 인증 페이지 접근 → 홈으로 리다이렉트
  if (isLoggedIn && isPublic) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // 정적 파일, 이미지, API 라우트는 제외
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
