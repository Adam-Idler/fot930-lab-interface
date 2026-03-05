import clsx from 'clsx';
import type { ReactNode } from 'react';

interface DeviceButtonProps {
	onClick?: () => void;
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
		blue: clsx('bg-fot930-blue', [
			onClick && 'hover:bg-fot930-blue-hover active:bg-fot930-blue-active'
		]),
		'light-blue': clsx('bg-[#7d9ebe]', [
			onClick && 'hover:bg-fot930-blue-hover active:bg-fot930-blue-active'
		]),
		beige: clsx('bg-[#a9aeb3]', [
			onClick && 'hover:bg-[#999da1] active:bg-[#8e9197]'
		])
	};

	return (
		<button
			type="button"
			onClick={onClick}
			className={clsx(
				`px-3 py-2 rounded-md text-white text-sm font-semibold transition ${colors[color]}`,
				[onClick && 'hover:cursor-pointer']
			)}
		>
			{!!icon && <div className="inline-block align-middle">{icon}</div>}

			{label}
		</button>
	);
}
