import ContainerMain from "@/components/ContainerMain";
import GroupCard from "@/components/GroupCard";
import MenuHamburger from "@/components/MenuHamburger";
import Image from "next/image";

const Group = () => {
	const groups = [
		{
			id: 1,
			name: "Calculus Study Group",
			members: 12,
			description:
				"Advanced calculus topics and problem solving. We focus on derivatives, integrals, and applications of calculus in real-world scenarios. Our group is perfect for students taking Calculus I, II, or III courses.",
			subject: "Mathematics",
		},
		{
			id: 2,
			name: "Calculus Study Group",
			members: 12,
			description:
				"Advanced calculus topics and problem solving. We focus on derivatives, integrals, and applications of calculus in real-world scenarios. Our group is perfect for students taking Calculus I, II, or III courses.",
			subject: "Mathematics",
		},
		{
			id: 3,
			name: "Calculus Study Group",
			members: 12,
			description:
				"Advanced calculus topics and problem solving. We focus on derivatives, integrals, and applications of calculus in real-world scenarios. Our group is perfect for students taking Calculus I, II, or III courses.",
			subject: "Mathematics",
		},
	];
	return (
		<ContainerMain>
			<div className="absolute top-4 left-4">
				<MenuHamburger />
			</div>
			<div className="flex flex-col items-center justify-center h-full">
				<Image src="/images/logo.png" alt="logo" width={700} height={200} />

				{groups.length > 0 ? (
					<>
						<h2 className="text-white text-2xl font-bold">Your Groups</h2>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
							{groups.map((group) => (
								<GroupCard
									key={group.id}
									id={String(group.id)}
									name={group.name}
									subject={group.subject}
									description={group.description}
									members={group.members}
								/>
							))}
						</div>
					</>
				) : (
					<>
						<p className="text-white text-center">
							You are not participating in any active groups. Create or join a
							one to get started..
						</p>
						<div className="flex gap-3 mt-6">
							<button
								type="button"
								className="bg-[#3e1496] font-semibold text-white rounded-full px-5 py-3.5 text-sm min-w-40"
							>
								Create group
							</button>
							<button
								type="button"
								className="bg-[#3e1496] font-semibold text-white rounded-full px-5 py-3.5 text-sm min-w-40"
							>
								Join group
							</button>
						</div>
					</>
				)}
			</div>
		</ContainerMain>
	);
};

export default Group;
