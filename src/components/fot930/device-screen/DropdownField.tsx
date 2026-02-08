import clsx from 'clsx';

interface DropdownFieldProps {
	label: string;
	value: string;
	isSelected?: boolean;
	isActive?: boolean;
	options?: string[];
	selectedIndex?: number;
	isOpen?: boolean;
}

export function DropdownField({
	label,
	value,
	isSelected = false,
	isActive = true,
	options = [],
	selectedIndex = 0,
	isOpen = false
}: DropdownFieldProps) {
	return (
		<div className="grid grid-cols-2 justify-between gap-2">
			<span className="text-fot930-blue font-semibold">{label}</span>
			<div className="relative">
				<div
					className={`flex items-center gap-1 rounded border transition-all ${
						isSelected ? 'text-fot930-blue bg-blue-50' : 'border-transparent'
					}`}
				>
					<span
						className={`font-bold pl-1 grow ${isActive ? 'text-gray-800' : 'text-gray-400'}`}
					>
						{value}
					</span>
					<span
						className={clsx(
							'text-sm px-1',
							isSelected
								? 'bg-fot930-blue  text-white'
								: isActive
									? 'text-fot930-blue'
									: 'text-blue-200'
						)}
					>
						▼
					</span>
				</div>

				{/* Выпадающий список */}
				{isOpen && options.length > 0 && (
					<div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-10 min-w-full">
						{options.map((option, index) => (
							<div
								key={option}
								className={`px-2 py-1 whitespace-nowrap ${
									index === selectedIndex
										? 'bg-fot930-blue text-white font-bold'
										: 'bg-white text-gray-800 hover:bg-gray-100'
								}`}
							>
								{option}
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
