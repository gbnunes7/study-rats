import MenuHamburger from "../MenuHamburger";

interface ChildrenProps {
	children: React.ReactNode;
}

const ContainerMain: React.FC<ChildrenProps> = ({ children }) => {
	return (
		<div className="flex-grow flex flex-col items-center px-4 py-8 bg-black">
			<div className="flex flex-col items-start mb-4 w-full">
				<MenuHamburger />
			</div>
			{children}
		</div>
	);
};

export default ContainerMain;
