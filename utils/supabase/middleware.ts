import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
	const response = NextResponse.next({
		request: {
			headers: request.headers,
		},
	});

	const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
		cookies: {
			get(name) {
				return request.cookies.get(name)?.value;
			},
			set(name, value, options) {
				response.cookies.set(name, value, options);
			},
			remove(name, options) {
				response.cookies.set(name, "", options);
			},
		},
	});

	await supabase.auth.getSession();

	return response;
}

export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
