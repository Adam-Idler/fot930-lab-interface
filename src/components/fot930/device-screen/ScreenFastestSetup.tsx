import type { DeviceState, Wavelength } from '../../../types/fot930';
import { DropdownField } from './DropdownField';

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

	const portOptions = ['Singlemode', 'Multimode'];
	const lengthUnitOptions = lengthUnits.map((u) => u.label);

	return (
		<div className="flex flex-col w-full h-full text-xs">
			<div className="text-lg font-bold mb-3 text-fot930-blue">
				FasTest Setup (As Master)
			</div>

			<div className="grid grid-cols-2 gap-4 flex-1">
				{/* Левая колонка */}
				<div className="space-y-2">
					<DropdownField
						label="FasTest Port"
						value={
							fastestSettings.portType === 'SM' ? 'Singlemode' : 'Multimode'
						}
						isSelected={isPortSelected}
						isActive={true}
						options={portOptions}
						selectedIndex={state.dropdownIndex}
						isOpen={state.openDropdown === 'PORT'}
					/>

					<DropdownField
						label="DUT Type"
						value="125/9"
						isSelected={false}
						isActive={false}
						options={[]}
						isOpen={false}
					/>

					<DropdownField
						label="Length Unit"
						value={fastestSettings.lengthUnit}
						isSelected={isLengthUnitSelected}
						isActive={true}
						options={lengthUnitOptions}
						selectedIndex={state.dropdownIndex}
						isOpen={state.openDropdown === 'LENGTH_UNIT'}
					/>

					<DropdownField
						label="Auto Save to"
						value="Master"
						isSelected={false}
						isActive={false}
						options={[]}
						isOpen={false}
					/>

					<DropdownField
						label="Mode/wave."
						value="Custom"
						isSelected={false}
						isActive={false}
						options={[]}
						isOpen={false}
					/>
				</div>

				{/* Правая колонка */}
				<div className="space-y-2">
					<div
						className={`p-2 -ml-2 -mt-2 rounded border-2 transition-all ${
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
									<span className="text-sm">{wl === 1625 ? '☑' : '☐'}</span>
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
