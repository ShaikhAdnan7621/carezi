import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/pageComponents/layout/header";
import { Toaster } from "sonner";
import Navbar from "@/components/pageComponents/layout/Navbar";

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
});

export const metadata = {
	title: "Carezi - Healthcare Professional Network",
	description: "A comprehensive professional network platform for medical and healthcare professionals.",
};


export default function RootLayout({ children }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${inter.className} bg-green-50 antialiased`}>
				<Navbar />

				<main className="lg:max-w-[80%] px-4 mx-auto">
					{children}
				</main>
				<Toaster richColors position="top-center" />
			</body>
		</html>
	);
}
