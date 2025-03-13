import clsx from "clsx/lite";
import type { SVGProps } from "react";

export function LayersIcon({ className, ...props }: SVGProps<SVGSVGElement>) {
	return (
		<svg
			width="18"
			height="18"
			viewBox="0 0 18 18"
			xmlns="http://www.w3.org/2000/svg"
			role="graphics-symbol"
			className={clsx("fill-current", className)}
			{...props}
		>
			<g clipPath="url(#clip0_5674_11401)">
				<path d="M16.9609 11.1273L15.2182 10.2109L17.01 9.18818C17.2636 9.04091 17.4273 8.77091 17.4191 8.46818C17.4109 8.16545 17.2555 7.90364 16.9936 7.75636L15.3245 6.83182L16.9773 5.89091C17.2309 5.74364 17.3945 5.47364 17.3864 5.17091C17.3782 4.86818 17.2227 4.60636 16.9609 4.45909L9.09 0.106363C8.84455 -0.0327281 8.54182 -0.0327281 8.29636 0.106363L0.425455 4.46727C0.163636 4.61454 0 4.88454 0 5.17909C0 5.47364 0.155455 5.75182 0.409091 5.89909L2.08636 6.85636L0.441818 7.76454C0.18 7.90364 0.0245455 8.18182 0.0163636 8.47636C0.00818182 8.77091 0.171818 9.04909 0.425455 9.19636L2.15182 10.1782L0.409091 11.1436C0.163636 11.2745 0 11.5527 0 11.8473C0 12.1418 0.155455 12.42 0.409091 12.5673L8.28818 17.0591C8.41091 17.1327 8.55 17.1655 8.69727 17.1655C8.84455 17.1655 8.97546 17.1327 9.10636 17.0591L16.9855 12.5673C17.2473 12.42 17.4027 12.1418 17.3945 11.8391C17.3945 11.5364 17.2227 11.2664 16.9609 11.1273ZM2.51182 8.48454L3.71455 7.81364C3.71455 7.81364 3.73091 7.79727 3.73909 7.78909L8.28818 10.3827C8.41091 10.4564 8.55 10.4891 8.69727 10.4891C8.84455 10.4891 8.97546 10.4564 9.10636 10.3827L13.6882 7.77273C13.6882 7.77273 13.7291 7.81364 13.7536 7.83L14.94 8.48454L8.73 12.0273L2.52 8.48454H2.51182ZM8.69727 1.75091L14.9073 5.19545L13.7373 5.86636L8.69727 8.73818L3.91091 6.00545L2.48727 5.19545L8.69727 1.75091ZM8.69727 15.4064L2.48727 11.8636L3.71455 11.1845C3.71455 11.1845 3.77182 11.1355 3.79636 11.1109L8.31273 13.6882C8.43546 13.7618 8.57455 13.7945 8.72182 13.7945C8.86909 13.7945 9 13.7618 9.13091 13.6882L13.5655 11.16C13.5655 11.16 13.6309 11.2255 13.68 11.25L14.8827 11.88L8.70546 15.4064H8.69727Z" />
			</g>
			<defs>
				<clipPath id="clip0_5674_11401">
					<rect width="18" height="18" />
				</clipPath>
			</defs>
		</svg>
	);
}
