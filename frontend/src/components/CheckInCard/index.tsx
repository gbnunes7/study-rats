"use client";

import { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

type CheckInCardProps = {
	title: string;
	image?: string;
	avatar?: string;
	name: string;
	timeStamp: string;
	date: string;
	description: string;
	commits?: number;
	studyTime?: string;
};

const CheckInCard: React.FC<CheckInCardProps> = ({
	title,
	image,
	avatar,
	name,
	timeStamp,
	date,
	description,
	commits,
	studyTime,
}) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<Card
				className="p-4 flex flex-row items-center gap-3 cursor-pointer bg-gray-800 text-white hover:bg-gray-700 transition-colors border-0"
				onClick={() => setIsOpen(true)}
			>
				<div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
					<Image
						src={image || "/placeholder.svg"}
						alt={title}
						fill
						className="object-cover"
					/>
				</div>
				<div className="flex-grow">
					<h3 className="font-medium text-lg">{title}</h3>
					<div className="flex items-center gap-2">
						<Avatar className="h-6 w-6">
							<AvatarImage src={avatar || "/placeholder.svg"} alt={name} />
							<AvatarFallback>{name[0]}</AvatarFallback>
						</Avatar>
						<span className="text-sm text-gray-300">{name}</span>
					</div>
				</div>
				<div className="text-sm text-gray-400">{timeStamp}</div>
			</Card>

			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogContent className="w-[90%] h-[90%] p-0 bg-gray-900 border-0 text-white overflow-hidden">
					<div className="relative w-full h-[300px] md:h-[400px]">
						<Image
							src={image || "/placeholder.svg"}
							alt={title}
							fill
							className="object-cover"
							priority
						/>
					</div>

					<div className="p-6">
						<div className="flex items-center justify-between mb-4">
							<div className="flex items-center gap-3">
								<Avatar className="h-10 w-10">
									<AvatarImage src={avatar || "/placeholder.svg"} alt={name} />
									<AvatarFallback>{name[0]}</AvatarFallback>
								</Avatar>
								<div>
									<h3 className="font-medium">{name}</h3>
									<p className="text-sm text-gray-400">{date}</p>
								</div>
							</div>
						</div>

						<h2 className="text-xl font-bold mb-2">{title}</h2>
						<p className="text-gray-300">{description}</p>
						<div className="mt-4 grid grid-cols-2 gap-4">
							<div className="bg-gray-800 p-3 rounded-md">
								<p className="text-sm text-gray-400">Commits</p>
								<p className="text-xl font-bold">{commits || 0}</p>
							</div>
							<div className="bg-gray-800 p-3 rounded-md">
								<p className="text-sm text-gray-400">Study Time</p>
								<p className="text-xl font-bold">{studyTime || "0h"}</p>
							</div>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default CheckInCard;
