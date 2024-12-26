const DebugOverlay = ({
	title,
	message,
}: {
	title?: string;
	message: string | null;
}) => {
	if (!message) return null;

	const isDevMode = import.meta.env.MODE === 'development';

	if (!isDevMode) return null;

	return (
		<div className="absolute top-0 h-screen w-screen flex justify-center items-center p-4">
			<div className="bg-red-500/80 backdrop-blur-md px-6 py-3 flex flex-col justify-center items-center gap-0 text-gray-50 text-lg rounded-lg shadow-lg border border-red-600/25 ">
				<p className="text-lg font-bold uppercase">{title}</p>
				<p className="text-md">{message}</p>
			</div>
		</div>
	);
};

export default DebugOverlay;
