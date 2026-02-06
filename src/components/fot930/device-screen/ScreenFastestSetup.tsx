import type { DeviceState, Wavelength } from '../../../types/fot930';

interface ScreenFastestSetupProps {
	state: DeviceState;
}

export function ScreenFastestSetup({ state }: ScreenFastestSetupProps) {
	const { fastestSettings } = state.preparation;
	const wavelengths: Wavelength[] = [1310, 1550, 1625];
	const lengthUnits = [
		{ value: 'ft', label: 'ft' },
		{ value: 'mi', label: 'mi' },
		{ value: 'm', label: 'm' },
		{ value: 'km', label: 'km' }
	];

	const isPortSelected = state.fastestSetupSectionIndex === 0;
	const isLengthUnitSelected = state.fastestSetupSectionIndex === 1;
	const isWavelengthsSelected = state.fastestSetupSectionIndex === 2;

	return (
		<div className="flex flex-col w-full h-full p-3 text-xs">
			<div className="text-sm font-bold mb-3 pb-1 border-b border-fot930-blue text-fot930-blue">
				FasTest Setup (As Master)
			</div>

			<div className="grid grid-cols-2 gap-4 flex-1">
				{/* Левая колонка */}
				<div className="space-y-2">
					<div
						className={`p-2 -ml-2 rounded border-2 transition-all ${
							isPortSelected
								? 'border-blue-500 bg-blue-50'
								: 'border-transparent'
						}`}
					>
						<div className="font-semibold mb-1">FasTest Port</div>
						<div className="font-bold text-gray-800">
							{fastestSettings.portType === 'SM' ? 'Single-mode' : 'Multi-mode'}
						</div>
					</div>

					<div>
						<div className="font-semibold mb-1">DUT Type</div>
						<div className="text-gray-400">125/9</div>
					</div>

					<div
						className={`p-2 -ml-2 rounded border-2 transition-all ${
							isLengthUnitSelected
								? 'border-blue-500 bg-blue-50'
								: 'border-transparent'
						}`}
					>
						<div className="font-semibold mb-1">Length Unit</div>
						<div className="space-y-1">
							{lengthUnits.map((unit, index) => {
								const isSelected = fastestSettings.lengthUnit === unit.value;
								const isCursor =
									isLengthUnitSelected &&
									index === state.fastestLengthUnitIndex;

								return (
									<div
										key={unit.value}
										className={`flex items-center gap-2 px-1 rounded ${
											isCursor ? 'bg-blue-100 font-bold' : ''
										}`}
									>
										<span className="text-sm font-normal text-gray-800">
											{isSelected ? '◉' : '○'}
										</span>
										<span className="text-gray-800">{unit.label}</span>
									</div>
								);
							})}
						</div>
					</div>

					<div>
						<div className="font-semibold mb-1">Auto Save to</div>
						<div className="text-gray-400">Master</div>
					</div>

					<div>
						<div className="font-semibold mb-1">Mode/wave.</div>
						<div className="text-gray-400">Custom</div>
					</div>
				</div>

				{/* Правая колонка */}
				<div className="space-y-2">
					<div
						className={`p-2 -ml-2 rounded border-2 transition-all ${
							isWavelengthsSelected
								? 'border-blue-500 bg-blue-50'
								: 'border-transparent'
						}`}
					>
						<div className="font-semibold mb-1">Loss Wavelengths</div>
						<div className="space-y-1">
							{wavelengths.map((wl, index) => {
								const isSelected = fastestSettings.lossWavelengths.includes(wl);
								const isCursor =
									isWavelengthsSelected &&
									index === state.fastestWavelengthIndex;

								return (
									<div
										key={wl}
										className={`flex items-center gap-2 px-1 rounded ${
											isCursor ? 'bg-blue-100 font-bold' : ''
										}`}
									>
										<span className="text-sm font-normal text-gray-800">
											{isSelected ? '☑' : '☐'}
										</span>
										<span className="text-gray-800">{wl}nm</span>
									</div>
								);
							})}
						</div>
					</div>

					<div>
						<div className="font-semibold mb-1 text-gray-400">
							ORL Wavelengths
						</div>
						<div className="space-y-1 text-gray-400">
							{wavelengths.map((wl) => (
								<div key={wl} className="flex items-center gap-2">
									<span className="text-sm">
										{fastestSettings.orlWavelengths.includes(wl) ? '☑' : '☐'}
									</span>
									<span>{wl}nm</span>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>

			<div className="text-[10px] text-gray-500 text-center mt-2 border-t border-gray-200 pt-1">
				Enter: Change | ESC: Save and Exit
			</div>
		</div>
	);
}
