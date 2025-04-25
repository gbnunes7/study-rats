import ContainerMain from "@/components/ContainerMain";
import FormLogin from "@/components/FormLogin";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Login = () => {
	return (
		<ContainerMain>
			<Link href="/" className="">
				<ChevronLeft className="absolute top-4 left-4 text-white" />
			</Link>
			<Image src="/images/logo.png" alt="logo" width={300} height={200} />
			<FormLogin />
		</ContainerMain>
	);
};

export default Login;
