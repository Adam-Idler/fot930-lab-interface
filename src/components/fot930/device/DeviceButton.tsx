import type { ReactNode } from 'react';

interface DeviceButtonProps {
	onClick: () => void;
	label?: string;
	icon?: ReactNode;
	color?: 'blue' | 'beige' | 'light-blue';
}

export function DeviceButton({
	label,
	onClick,
	color = 'blue',
	icon
}: DeviceButtonProps) {
	const colors = {
		blue: 'bg-fot930-blue hover:bg-fot930-blue-hover active:bg-fot930-blue-active',
		'light-blue': 'bg-[#7d9ebe] hover:bg-fot930-blue-hover active:bg-fot930-blue-active',
		beige: 'bg-[#a9aeb3] hover:bg-[#999da1] active:bg-[#8e9197]'
	};

	return (
		<button
			type="button"
			onClick={onClick}
			className={`px-3 py-2 rounded-md text-white text-sm font-semibold transition hover:cursor-pointer ${colors[color]}`}
		>
			{!!icon && <div className="inline-block align-middle">{icon}</div>}

			{label}
		</button>
	);
}
