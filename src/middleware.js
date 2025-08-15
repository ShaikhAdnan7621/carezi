// middleware.js

import { NextResponse } from 'next/server';
import { getUserFromCookies } from './utils/getUserFromCookies'; // Assuming you have this utility

export async function middleware(request) {
	const { pathname } = request.nextUrl;
	const accessToken = request.cookies.get('accessToken')?.value;
	const refreshToken = request.cookies.get('refreshToken')?.value;
	const adminToken = request.cookies.get('adminToken')?.value;

	console.log("\n\n\n-------------------------------------\nMiddle Ware Is Targetted\n-------------------------------------")
	console.log(`🔍 ROUTE: ${pathname} | AUTH  ( ACCESSTOKEN: ${!!accessToken ? '✅' : '❌'} || REFRESHTOKEN: ${!!refreshToken ? '✅' : '❌'} ) | TIME: ${new Date().toISOString()} \n-------------------------------------`);

	const routes = {
		public: ['/'],
		auth: ['/auth/login', '/auth/signup', '/auth/verifyadmin'],
		logout: ['/auth/logout'],
		protected: ['/profile', '/settings', '/connections', '/admin', '/cear', '/professional', '/organizations'],
		api: ['/api'],
		admin: ['/admin/'],
		professional: ['/professional'],
		organizations: ['/organizations'],
		cear: ['/cear'],
	};

	const isProtected = routes.protected.some(route => pathname.startsWith(route));
	const isAuth = routes.auth.some(route => pathname === route);
	const isLogout = routes.logout.some(route => pathname === route);
	const isPublic = routes.public.some(route => pathname === route);
	const isApiRoute = routes.api.some(route => pathname.startsWith(route));
	const isAdminRoute = routes.admin.some(route => pathname.startsWith(route));
	const hasRefreshToken = !!refreshToken;

	console.log(`🔍 PATH: ${pathname} | ROUTE: ${isProtected ? '🔒 Protected' : isAuth ? '🔑 Auth' : isPublic ? '🌐 Public' : '❓ Unknown'}\n-------------------------------------`);


	if (isProtected) {
		if (!accessToken) {
			console.log("Redirecting from protected route, no access token.\n-------------------------------------");
			const url = new URL(`/auth/login?redirect=${encodeURIComponent(pathname)}&refresh=${hasRefreshToken}`, request.url);
			return NextResponse.redirect(url);
		}
		const user = await getUserFromCookies(request);
		if (!user) {
			console.log("Redirecting from protected route, user not found.\n-------------------------------------");
			const url = new URL(`/auth/login?redirect=${encodeURIComponent(pathname)}&refresh=${hasRefreshToken}`, request.url);
			return NextResponse.redirect(url);
		}
		if (isAdminRoute) {
			if (!adminToken) {
				console.log("Redirecting from admin Verification route, no admin token.\n-------------------------------------");
				return NextResponse.redirect(new URL('/auth/verifyadmin', request.url));
			}
			console.log("User is authorized for admin route.\n-------------------------------------");
			return NextResponse.next();
		}
		console.log("User is authorized for protected route.\n-------------------------------------");
		return NextResponse.next();
	}

	if (isAuth) {
		// if this is the admin verification path then 
		if (pathname === '/auth/verifyadmin') {
			if (adminToken) {
				console.log("Redirecting from admin verification route, user already logged in as admin.\n-------------------------------------");
				return NextResponse.redirect(new URL('/admin', request.url));
			}
			console.log("User is on admin verification route. \n-------------------------------------");
			return NextResponse.next();
		}
		if (accessToken) {
			console.log("Redirecting from auth route, user already logged in.\n-------------------------------------");
			return NextResponse.redirect(new URL('/', request.url));
		}
		console.log("User is not logged in, allowed on auth route. \n-------------------------------------");
		return NextResponse.next();
	}

	if (isLogout) {
		console.log("User is on logout route. \n-------------------------------------");
		return NextResponse.next();
	}

	if (isPublic) {
		console.log("User is on public route. \n-------------------------------------");
		return NextResponse.next();
	}
	console.log("Redirecting to 404 page.");
	return NextResponse.redirect(new URL('/404', request.url)); // or a custom handler
}

export const config = {
	matcher: [
		'/',
		'/auth/login',
		'/auth/signup',
		'/auth/logout',
		'/auth/verifyadmin',
		'/profile',
		'/professional/:path*',
		'/organizations/:path*',
		'/admin/:path*',
		'/cear',
		'/cear/:path*',
		'/api'
	],
};
