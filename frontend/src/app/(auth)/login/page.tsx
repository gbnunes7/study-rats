import FormLogin from "@/components/FormLogin";
import Image from "next/image";

const Login = () => {
	return (
		<div className="flex-grow flex flex-col items-center justify-center px-4 py-8 bg-black">
			<Image src="/images/logo.png" alt="logo" width={300} height={200} />
			<FormLogin />
		</div>
	);
};

export default Login;
