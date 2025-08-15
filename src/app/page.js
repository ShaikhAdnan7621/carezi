import Link from "next/link";

export default function Home() {
	return (
		<div className="flex flex-col gap-8 items-center sm:items-start w-full">
			<div className="flex flex-col gap-2">
				<h1 className="text-2xl font-bold">Carezi</h1>
				<p className="text-sm text-gray-500">
					Welcome to Carezi, your go-to platform for healthcare professionals and facilities. Here, you can find the best professionals and facilities to meet your healthcare needs.
				</p>
			</div>
			<div className="flex flex-col gap-2">
				<Link href={'/auth/login'}>Login</Link>
			</div>
		</div>
	);
}
