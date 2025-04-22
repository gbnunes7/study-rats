interface ChildrenProps {
	children: React.ReactNode;
}

const ErrorMessage: React.FC<ChildrenProps> = ({ children }) => {
	return <span className="text-red-500 text-sm">{children}</span>;
};

export default ErrorMessage;
