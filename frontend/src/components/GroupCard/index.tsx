import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar } from "lucide-react";
import Link from "next/link";

type GroupCardProps = {
	id: string;
	name: string;
	subject: string;
	description: string;
	members: number;
};

const GroupCard: React.FC<GroupCardProps> = ({
	id,
	name,
	subject,
	description,
	members,
}) => {
	return (
		<Link href={`/groups/${id}`}>
			<Card className="h-full bg-gray-900 border-gray-800 hover:border-gray-700 transition-all duration-300 cursor-pointer gradient-border overflow-hidden">
				<div className={"h-2 bg-gradient-to-r from-purple-500 to-blue-500"} />
				<CardHeader className="pb-2">
					<div className="flex justify-between items-start">
						<h3 className="font-bold text-lg text-white">{name}</h3>
						<Badge variant="outline" className="bg-gray-800 text-white">
							{subject}
						</Badge>
					</div>
				</CardHeader>
				<CardContent>
					<p className="text-gray-400 text-sm mb-4">{description}</p>
					<div className="flex items-center text-gray-400 text-sm">
						<Users className="h-4 w-4 mr-1" />
						<span>{members} members</span>
					</div>
				</CardContent>
			</Card>
		</Link>
	);
};

export default GroupCard;
