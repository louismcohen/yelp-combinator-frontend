import yelpLogo from "../assets/yelp_logo_dark_bg.png";

export const YelpLogo = ({ alias }: { alias: string }) => (
	<div className="shrink-0">
		<a
			href={`https://www.yelp.com/biz/${alias}`}
			target="_blank"
			rel="noopener noreferrer"
			title="Go to Yelp page"
		>
			<img className="h-[24px]" src={yelpLogo} alt="Yelp Logo" />
		</a>
	</div>
);
