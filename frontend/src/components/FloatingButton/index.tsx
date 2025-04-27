import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

type FloatingButtonProps = {
	onClick: () => void;
};

const FloatingButton: React.FC<FloatingButtonProps> = ({ onClick }) => {
	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				"fixed bottom-6 right-6 z-50 flex items-center justify-center",
				"h-14 w-14 rounded-full bg-[#3e1496] hover:bg-[#3e1999] hover:cursor-pointer",
				"text-white shadow-lg transition-all",
			)}
		>
			<Plus size={28} />
		</button>
	);
};

export default FloatingButton;
