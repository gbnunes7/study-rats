import { Controller, useForm } from "react-hook-form";
import ErrorMessage from "../ErrorMessage";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "../ui/checkbox";

const createGroupSchema = z.object({
	groupName: z.string().min(1, "Group name is required"),
	groupDescription: z.string().min(1, "Group description is required"),
	groupSubject: z.enum([
		"JAVASCRIPT",
		"PYTHON",
		"JAVA",
		"C_SHARP",
		"RUBY",
		"PHP",
		"GO",
		"HTML",
		"CSS",
		"PROGRAMMING_LOGIC",
		"DATA_STRUCTURES",
		"ALGORITHMS",
	]),
	finalDate: z.date().min(new Date(), "Final date must be in the future"),
	privacy: z.boolean().optional(),
});

type CreateGroupFormData = z.infer<typeof createGroupSchema>;

const FormCreateGroup = () => {
	const {
		register,
		control,
		formState: { errors },
		handleSubmit,
	} = useForm<CreateGroupFormData>({
		resolver: zodResolver(createGroupSchema),
		mode: "onChange",
		defaultValues: {
			groupName: "",
			groupDescription: "",
			privacy: false,
		},
	});

	const formatDateForInput = (date: Date) => {
		return date.toISOString().split("T")[0];
	};

	const today = formatDateForInput(new Date());

	return (
		<form className="flex flex-col gap-4 mt-8">
			<div>
				<label
					htmlFor="groupName"
					className="block mb-2 font-medium text-white"
				>
					Group Name
				</label>
				<Input
					id="groupName"
					placeholder="Enter a name for your study group"
					className={`placeholder:text-white bg-gray-800 border-gray-700 ${
						errors.groupName ? "border-red-500" : ""
					}`}
					{...register("groupName")}
				/>
				{errors.groupName && (
					<ErrorMessage>{errors.groupName.message}</ErrorMessage>
				)}
			</div>
			<div className="flex flex-row items-start gap-4 mt-4">
				<div className="flex flex-col">
					<label htmlFor="groupSubject" className="mb-2 font-medium text-white">
						Subject
					</label>
					<Controller
						name="groupSubject"
						control={control}
						render={({ field }) => (
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<SelectTrigger
									className={`bg-gray-800 border-gray-700 placeholder-white w-64 ${
										errors.groupSubject ? "border-red-500" : ""
									}`}
								>
									<SelectValue placeholder="Select a subject" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="JAVASCRIPT">JavaScript</SelectItem>
									<SelectItem value="PYTHON">Python</SelectItem>
									<SelectItem value="JAVA">Java</SelectItem>
									<SelectItem value="C_SHARP">C#</SelectItem>
									<SelectItem value="RUBY">Ruby</SelectItem>
									<SelectItem value="PHP">PHP</SelectItem>
									<SelectItem value="GO">Go</SelectItem>
									<SelectItem value="HTML">HTML</SelectItem>
									<SelectItem value="CSS">CSS</SelectItem>
									<SelectItem value="PROGRAMMING_LOGIC">
										Programming Logic
									</SelectItem>
									<SelectItem value="DATA_STRUCTURES">
										Data Structures
									</SelectItem>
									<SelectItem value="ALGORITHMS">Algorithms</SelectItem>
								</SelectContent>
							</Select>
						)}
					/>
					{errors.groupSubject && (
						<ErrorMessage>{errors.groupSubject.message}</ErrorMessage>
					)}
				</div>

				<div className="flex items-center mt-8">
					<Checkbox
						id="privacy"
						className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
						{...register("privacy")}
					/>
					<label htmlFor="privacy" className="ml-2 text-sm text-white">
						Private
					</label>
				</div>
			</div>

			<div>
				<label
					htmlFor="groupDescription"
					className="block mb-2 font-medium text-white"
				>
					Description
				</label>
				<Textarea
					id="groupDescription"
					placeholder="Description of the group"
					className={`bg-gray-800 border-gray-700 placeholder:text-white min-h-[120px] ${
						errors.groupDescription ? "border-red-500" : ""
					}`}
					{...register("groupDescription")}
				/>
				{errors.groupDescription && (
					<ErrorMessage>{errors.groupDescription.message}</ErrorMessage>
				)}
			</div>

			<div>
				<label
					htmlFor="finalDate"
					className="block mb-2 font-medium text-white"
				>
					Final Date
				</label>
				<div className="relative">
					<Input
						id="finalDate"
						type="date"
						min={today}
						className={`bg-gray-800 border-gray-700 text-white ${
							errors.finalDate ? "border-red-500" : ""
						}`}
						{...register("finalDate", {
							setValueAs: (value) => (value ? new Date(value) : undefined),
						})}
					/>
					<Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
				</div>
				{errors.finalDate && (
					<ErrorMessage>{errors.finalDate.message}</ErrorMessage>
				)}
			</div>

			<button
				type="submit"
				className="bg-[#3e1496] text-white rounded-full p-2 mt-4 font-semibold"
				onClick={handleSubmit((data) => {
					console.log(data);
				})}
			>
				Create Group
			</button>
		</form>
	);
};

export default FormCreateGroup;
