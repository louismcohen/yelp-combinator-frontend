import { motion } from 'motion/react';
import { GridLoader } from 'react-spinners';
import { memo } from 'react';

const LoadingOverlay = () => {
	return (
		<motion.div
			exit={{ opacity: 0 }}
			transition={{ duration: 0.3 }}
			className="fixed inset-0 flex flex-col gap-2 justify-center items-center bg-gray-900/70 z-50 backdrop-blur-sm"
			style={{
				background:
					'radial-gradient(circle, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.5) 100%)',
			}}
		>
			<div
				className="absolute top-0 left-0 h-full w-full opacity-20"
				style={{
					backgroundColor: 'hsla(185, 58%, 56%, 1)',
					backgroundImage:
						"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 0 0' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\"), radial-gradient(circle at 68% 1%, hsla(253, 66%, 75%, 1) 7%, transparent 61%), radial-gradient(circle at 1% 48%, hsla(226, 66%, 63%, 1) 13%, transparent 54%), radial-gradient(circle at 58% 29%, hsla(359, 63%, 67%, 1) 19%, transparent 81%), radial-gradient(circle at 83% 79%, hsla(181, 88%, 59%, 1) 15%, transparent 61%), radial-gradient(circle at 85% 56%, hsla(293, 91%, 54%, 1) 0%, transparent 78%), radial-gradient(circle at 20% 43%, hsla(293, 89%, 59%, 1) 8%, transparent 55%), radial-gradient(circle at 63% 14%, hsla(197, 99%, 92%, 1) 9%, transparent 69%), radial-gradient(circle at 51% 27%, hsla(251, 96%, 90%, 1) 4%, transparent 50%), radial-gradient(circle at 26% 50%, hsla(270, 63%, 55%, 1) 20%, transparent 71%), radial-gradient(circle at 65% 83%, hsla(278, 99%, 97%, 1) 2%, transparent 90%)",
					backgroundBlendMode:
						'overlay, normal, normal, normal, normal, normal, normal, normal, normal, normal, normal',
				}}
			/>
			{/* <CircleLoader color="#fff" size={48} /> */}
			<div className="py-6 px-8 flex flex-col gap-2 items-center justify-center rounded-lg bg-gray-900/70 shadow-xl border border-gray-900/20">
				<GridLoader color="#f9fafb" size={12} />
				<p className="text-gray-50 text-lg">Loading businesses...</p>
			</div>
		</motion.div>
	);
};

export default memo(LoadingOverlay);
