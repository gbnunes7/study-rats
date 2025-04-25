"use client";

import ContainerMain from "@/components/ContainerMain";
import FormRegister from "@/components/FormRegister";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

const Register = () => {
	return (
		<ContainerMain>
			<Link href="/" className="absolute top-4 left-4">
				<ChevronLeft className="absolute top-4 left-4 text-white" />
			</Link>
			<FormRegister />
		</ContainerMain>
	);
};

export default Register;
