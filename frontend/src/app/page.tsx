import ContainerMain from "@/components/ContainerMain";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
	return (
		<ContainerMain>
			<Image src="/images/logo.png" alt="logo" width={300} height={200} />
			<h2 className="text-xl text-white">
				Welcome to <span className="font-semibold text-white">Study Rats</span>
			</h2>
			<div className="mt-auto flex flex-col gap-2">
				<Link href="/register">
					<button
						type="button"
						className="bg-[#3e1496] px-4 py-2 w-full rounded-full font-medium text-white"
					>
						Create account
					</button>
				</Link>
				<Link href="/login">
					<p className="text-white">
						Already have an account?
						<span className="font-semibold text-[#3e1496] "> Sign in</span>
					</p>
				</Link>
			</div>
		</ContainerMain>
	);
}
