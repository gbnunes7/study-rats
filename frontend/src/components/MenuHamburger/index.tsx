"use client";
import { Menu, User, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
	FaHome,
	FaBox,
	FaChartBar,
	FaUser,
	FaPlus,
	FaPlusCircle,
	FaUsers,
} from "react-icons/fa";
import type { IconType } from "react-icons";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const MenuHamburger = () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div>
			<div>
				<button
					type="button"
					onClick={() => setIsOpen((prev) => !prev)}
					className="z-20 p-2 rounded-full hover:bg-white/10 transition-colors duration-200"
					aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
				>
					{isOpen ? (
						<X size={28} className="text-white" />
					) : (
						<Menu size={28} className="text-white" />
					)}
				</button>
			</div>

			{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
			<div
				className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
					isOpen ? "opacity-100 z-10" : "opacity-0 pointer-events-none"
				}`}
				onClick={() => setIsOpen((prev) => !prev)}
			/>

			<div
				className={`fixed top-0 left-0 bg-[#3e1496] h-full w-54 shadow-2xl transform transition-transform duration-300 ease-in-out z-10 ${
					isOpen ? "translate-x-0" : "-translate-x-full"
				}`}
			>
				<MenuList />
			</div>
		</div>
	);
};

export default MenuHamburger;

const MenuItem = ({
	icon: Icon,
	label,
	href,
}: { label: string; href: string; icon: IconType }) => {
	return (
		<li className="flex items-center gap-2 p-4 hover:bg-white/10 rounded-md">
			<Icon size={20} className="text-white" />
			<Link href={href} className="text-white">
				{label}
			</Link>
		</li>
	);
};

const MenuList = () => {
	return (
		<ul className="flex flex-col items-start justify-center h-full gap-4 p-6">
			<AvatarDiv />
			<MenuItem icon={FaUser} label="Perfil" href="/perfil" />
			<MenuItem icon={FaHome} label="Home" href="/groups" />
			<MenuItem icon={FaPlusCircle} label="Create Group" href="/" />
			<MenuItem icon={FaUsers} label="Join Group" href="/" />
			<MenuItem icon={FaBox} label="Groups" href="/groups" />
		</ul>
	);
};

const AvatarDiv = () => {
	const profileImage =
		"https://images.unsplash.com/photo-1677631231234-1234567890?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDF8fHBob3RvfGVufDB8fHx8MTY4MjQxNTY5NQ&ixlib=rb-4.0.3&q=80&w=400";
	const name = "John Doe";
	return (
		<div className="flex items-center gap-2">
			<Avatar className="w-10 h-10">
				<AvatarImage src={profileImage || ""} />
				<AvatarFallback className="bg-muted">
					<User className="w-6 h-6 text-muted-foreground" />
				</AvatarFallback>
			</Avatar>
			<p className="text-white">{name}</p>
		</div>
	);
};
