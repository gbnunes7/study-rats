"use client";
import CheckInCard from "@/components/CheckInCard";
import ContainerMain from "@/components/ContainerMain";
import FloatingButton from "@/components/FloatingButton";
import MenuHamburger from "@/components/MenuHamburger";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "lucide-react";

const GroupSelected = () => {
	const { id } = useParams();
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

	const group = groups.find((group) => group.id === Number(id));

	const checkinsGroup = [
		{
			title: "Check-in 1",
			groupId: 1,
			image: "/placeholder.svg",
			avatar: "/placeholder.svg",
			name: "John Doe",
			timeStamp: "2 hours ago",
			date: "2023-10-01",
			description: "This is a description of the check-in.",
			commits: 5,
			studyTime: "2 hours",
		},
		{
			title: "Check-in 2",
			groupId: 3,
			image: "/placeholder.svg",
			avatar: "/placeholder.svg",
			name: "Jane Smith",
			timeStamp: "1 hour ago",
			date: "2023-10-02",
			description: "This is another description of the check-in.",
			commits: 3,
			studyTime: "1 hour",
		},
		{
			title: "Check-in 3",
			groupId: 2,
			image: "/placeholder.svg",
			avatar: "/placeholder.svg",
			name: "Alice Johnson",
			timeStamp: "30 minutes ago",
			date: "2023-10-03",
			description: "This is yet another description of the check-in.",
			commits: 8,
			studyTime: "3 hours",
		},
	];

	const checkins = checkinsGroup.filter(
		(checkin) => checkin.groupId === Number(id),
	);

	const checkInLeaderLength = 9;

	const name = "John Doe";
	const avatar = "images/logo.png";

	const myCheckInsLength = 2;

	const daysLeft = 9;

	return (
		<ContainerMain>
			<h1 className="text-2xl font-bold mb-4 text-white pl-2 ">
				{group?.name}
			</h1>
			<div className="rounded-xl  justify-center gap-8 shadow-sm p-4 flex flex-row items-center cursor-pointer mb-4 bg-gray-800 text-white border-0 w-full">
				<div className="flex flex-row items-center">
					<Avatar className="h-9 w-9">
						<AvatarImage src={avatar || "/placeholder.svg"} alt={name} />
						<AvatarFallback>{name[0]}</AvatarFallback>
					</Avatar>
					<div className="flex flex-col ml-2">
						<span className="text-sm text-white">{checkInLeaderLength}</span>
						<span className="text-sm text-white">Leader</span>
					</div>
				</div>
				<div className="flex flex-row items-center">
					<Avatar className="h-9 w-9">
						<AvatarImage src={avatar || "/placeholder.svg"} alt={name} />
						<AvatarFallback>{name[0]}</AvatarFallback>
					</Avatar>
					<div className="flex flex-col ml-2">
						<span className="text-sm text-white">{myCheckInsLength}</span>
						<span className="text-sm text-white">You</span>
					</div>
				</div>
				<div className="flex flex-row items-center">
					<Calendar className="h-9 w-9 text-white" />
					<div className="flex flex-col ml-2">
						<span className="text-sm text-white">{daysLeft}</span>
						<span className="text-sm text-white">Days Left</span>
					</div>
				</div>
			</div>

			{checkins.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
					{checkins.map((checkin) => (
						<CheckInCard
							date={checkin.date}
							description={checkin.description}
							name={checkin.name}
							timeStamp={checkin.timeStamp}
							title={checkin.title}
							avatar={checkin.avatar}
							commits={checkin.commits}
							image={checkin.image}
							key={checkin.title}
						/>
					))}
				</div>
			) : (
				<div className="flex items-center justify-center h-full">
					<p className="text-gray-500">No check-ins available.</p>
				</div>
			)}
			<FloatingButton onClick={() => console.log("oiu")} />
		</ContainerMain>
	);
};

export default GroupSelected;
