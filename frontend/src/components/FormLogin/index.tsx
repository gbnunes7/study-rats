"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { z } from "zod";
import ErrorMessage from "../ErrorMessage";

export const loginSchema = z.object({
	email: z.string().email("Invalid email address").min(1, "Email is required"),
	password: z.string().min(8, "Password must be at least 8 characters long"),
});

export type LoginForm = z.infer<typeof loginSchema>;

const FormLogin = () => {
	const {
		register,
		formState: { errors },
		handleSubmit,
	} = useForm<LoginForm>({
		resolver: zodResolver(loginSchema),
		mode: "onChange",
		defaultValues: { email: "", password: "" },
	});

	return (
		<form>
			<div className="flex flex-col gap-2">
				<label htmlFor="email" className="text-sm text-white font-medium">
					Email
				</label>
				<input
					type="email"
					id="email"
					{...register("email")}
					className={`border ${
						errors.email ? "border-red-500" : "border-gray-300"
					} rounded-md p-2 focus:outline-none focus:border-[#3e1496]`}
				/>
				{errors.email && (
					<ErrorMessage>
						
						{errors.email.message}
					</ErrorMessage>
				)}
				<label htmlFor="password" className="text-sm text-white font-medium">
					Password
				</label>
				<input
					type="password"
					id="password"
					{...register("password")}
					className={`border ${
						errors.password ? "border-red-500" : "border-gray-300"
					} rounded-md p-2 focus:outline-none focus:border-[#3e1496]`}
				/>
				{errors.password && (
					<ErrorMessage>{errors.password.message}</ErrorMessage>
				)}
				<button
					type="submit"
					className="bg-[#3e1496] text-white rounded-full p-2 mt-4 font-semibold"
				>
					Sign In
				</button>
			</div>
		</form>
	);
};

export default FormLogin;
