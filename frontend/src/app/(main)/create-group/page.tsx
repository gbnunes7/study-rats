"use client";
import ContainerMain from "@/components/ContainerMain";
import FormCreateGroup from "@/components/FormCreateGroup";

const CreateGroup = () => {
	return (
		<ContainerMain>
			<h1 className="text-2xl font-bold text-white text-start">
				Create a new study group
			</h1>
			<FormCreateGroup />
		</ContainerMain>
	);
};

export default CreateGroup;
