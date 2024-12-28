import { motion } from 'motion/react';
import { GridLoader } from 'react-spinners';

const LoadingOverlay = () => {
	return (
		<motion.div
			exit={{ opacity: 0 }}
			transition={{ duration: 0.3 }}
			className="fixed inset-0 flex flex-col gap-2 justify-center items-center bg-gray-900/70 z-50 backdrop-blur"
			style={{
				background:
					'radial-gradient(circle, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.7) 100%)',
			}}
		>
			{/* <CircleLoader color="#fff" size={48} /> */}
			<div className="py-6 px-8 flex flex-col gap-2 items-center justify-center rounded-lg bg-gray-900/70 shadow-xl border border-gray-900/10">
				<GridLoader color="#fff" size={12} />
				<p className="text-gray-50 text-lg">Loading businesses</p>
			</div>
		</motion.div>
	);
};

export default LoadingOverlay;
