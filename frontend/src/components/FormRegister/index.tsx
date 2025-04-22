"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { Camera, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ErrorMessage from "../ErrorMessage";

export const registerSchema = z
	.object({
		name: z.string().min(1, "Name is required"),
		email: z
			.string()
			.email("Invalid email address")
			.min(1, "Email is required"),
		subjects: z
			.array(z.string())
			.min(1, "At least one subject is required")
			.max(5, "A maximum of 5 subjects is allowed"),
		bio: z.string().max(200, "Bio must be less than 200 characters"),
		password: z.string().min(8, "Password must be at least 8 characters long"),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export type RegisterForm = z.infer<typeof registerSchema>;

const FormRegister = () => {
	const [profileImage, setProfileImage] = useState<string | null>(null);

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				setProfileImage(e.target?.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const {
		register,
		formState: { errors },
		handleSubmit,
		setValue,
	} = useForm<RegisterForm>({
		resolver: zodResolver(registerSchema),
		mode: "onChange",
		defaultValues: {
			name: "",
			email: "",
			subjects: [],
			bio: "",
			password: "",
		},
	});

	return (
		<form className="w-full flex flex-col gap-4">
			<div className="flex flex-col items-center space-y-2">
				<div className="relative">
					<Avatar className="w-24 h-24">
						<AvatarImage src={profileImage || ""} />
						<AvatarFallback className="bg-muted">
							<User className="w-12 h-12 text-muted-foreground" />
						</AvatarFallback>
					</Avatar>
					<div className="absolute bottom-0 right-0">
						<label htmlFor="profile-image" className="cursor-pointer">
							<div className="rounded-full bg-primary p-2 text-white shadow-sm">
								<Camera className="h-4 w-4" />
							</div>
							<input
								id="profile-image"
								type="file"
								accept="image/*"
								className="hidden"
								onChange={handleImageUpload}
							/>
						</label>
					</div>
				</div>
			</div>
			<div className="flex flex-col gap-2">
				<label htmlFor="name" className="text-sm text-white font-medium">
					Name
				</label>
				<input
					type="name"
					id="name"
					{...register("name")}
					className={`border ${
						errors.name ? "border-red-500" : "border-gray-300"
					} rounded-md p-2 focus:outline-none text-white focus:border-[#3e1496]`}
				/>
				{errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
				<label htmlFor="email" className="text-sm text-white font-medium">
					Email
				</label>
				<input
					type="email"
					id="email"
					{...register("email")}
					className={`border ${
						errors.email ? "border-red-500" : "border-gray-300"
					} rounded-md p-2 focus:outline-none text-white focus:border-[#3e1496]`}
				/>
				{errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
				<label htmlFor="bio" className="text-sm text-white font-medium">
					Bio
				</label>
				<textarea
					rows={3}
					id="bio"
					{...register("bio")}
					className={`border ${
						errors.bio ? "border-red-500" : "border-gray-300"
					} rounded-md p-2 focus:outline-none text-white focus:border-[#3e1496]`}
				/>
				{errors.bio && <ErrorMessage>{errors.bio.message}</ErrorMessage>}
				<label htmlFor="subjects" className="text-sm text-white font-medium">
					Interests
				</label>
				<select
					id="subjects"
					multiple
					onChange={(e) => {
						const values = Array.from(
							e.target.selectedOptions,
							(option) => option.value,
						);
						setValue("subjects", values);
					}}
					className={`border ${
						errors.subjects ? "border-red-500" : "border-gray-300"
					} rounded-md p-2 focus:outline-none text-white focus:border-[#3e1496]`}
				>
					<option value="JAVASCRIPT">JavaScript</option>
					<option value="PYTHON">Python</option>
					<option value="JAVA">Java</option>
					<option value="C_SHARP">C#</option>
					<option value="RUBY">Ruby</option>
					<option value="PHP">PHP</option>
					<option value="GO">Go</option>
					<option value="HTML">HTML</option>
					<option value="CSS">CSS</option>
					<option value="PROGRAMMING_LOGIC">Programming Logic</option>
					<option value="DATA_STRUCTURES">Data Structures</option>
					<option value="ALGORITHMS">Algorithms</option>
				</select>
				{errors.subjects && (
					<ErrorMessage>{errors.subjects.message}</ErrorMessage>
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
					} rounded-md p-2 focus:outline-none text-white focus:border-[#3e1496]`}
				/>
				{errors.password && (
					<ErrorMessage>{errors.password.message}</ErrorMessage>
				)}
				<label
					htmlFor="confirmPassword"
					className="text-sm text-white font-medium"
				>
					Confirm Password
				</label>
				<input
					type="confirmPassword"
					id="confirmPassword"
					{...register("confirmPassword")}
					className={`border ${
						errors.confirmPassword ? "border-red-500" : "border-gray-300"
					} rounded-md p-2 focus:outline-none text-white focus:border-[#3e1496]`}
				/>
				{errors.confirmPassword && (
					<ErrorMessage>{errors.confirmPassword.message}</ErrorMessage>
				)}
			</div>
			<button
				type="submit"
				className="bg-[#3e1496] text-white rounded-full p-2 mt-4 font-semibold"
			>
				Register
			</button>
		</form>
	);
};

export default FormRegister;
