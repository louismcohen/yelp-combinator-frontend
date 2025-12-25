interface InfoSectionProps {
	title: string;
	icon: React.ReactNode;
	children?: React.ReactNode;
}

export const InfoSection = ({ title, icon, children }: InfoSectionProps) => {
	return (
		<div className="flex flex-row justify-between items-start w-full gap-8 md:gap-12 text-neutral-700">
			<div className="flex flex-row justify-start items-center gap-2">
				{icon}
				<p className="text-sm font-bold uppercase">{title}</p>
			</div>

			{children}
		</div>
	);
};
