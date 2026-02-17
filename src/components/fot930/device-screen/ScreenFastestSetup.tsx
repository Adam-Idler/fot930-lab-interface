import type { DeviceState, Wavelength } from '../../../types/fot930';
import { DropdownField } from './DropdownField';

interface ScreenFastestSetupProps {
	state: DeviceState;
}

export function ScreenFastestSetup({ state }: ScreenFastestSetupProps) {
	const { fastestSettings } = state.preparation;
	const wavelengths: Wavelength[] = [1310, 1550, 1625];
	const lengthUnits = [
		{ value: 'ft', label: 'фт' },
		{ value: 'mi', label: 'ми' },
		{ value: 'm', label: 'м' },
		{ value: 'km', label: 'км' }
	];

	const isPortSelected = state.fastestSetupSectionIndex === 0;
	const isLengthUnitSelected = state.fastestSetupSectionIndex === 1;
	const isWavelengthsSelected = state.fastestSetupSectionIndex === 2;

	const portOptions = ['Одномодовый', 'Многомодовый'];
	const lengthUnitOptions = lengthUnits.map((u) => u.label);

	return (
		<div className="flex flex-col w-full h-full text-xs">
			<div className="text-lg font-bold mb-3 text-fot930-blue">
				Настройка FasTest (В роли мастера)
			</div>

			<div className="grid grid-cols-2 gap-4 flex-1">
				{/* Левая колонка */}
				<div className="space-y-2">
					<DropdownField
						label="Порт FasTest"
						value={
							fastestSettings.portType === 'SM' ? 'Одномодовый' : 'Многомодовый'
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
						label="Единица длины"
						value={lengthUnits.find((option) => option.value === fastestSettings.lengthUnit)?.label || lengthUnitOptions[0]}
						isSelected={isLengthUnitSelected}
						isActive={true}
						options={lengthUnitOptions}
						selectedIndex={state.dropdownIndex}
						isOpen={state.openDropdown === 'LENGTH_UNIT'}
					/>

					<DropdownField
						label="Автосохранение в"
						value="Master"
						isSelected={false}
						isActive={false}
						options={[]}
						isOpen={false}
					/>

					<DropdownField
						label="Режим/длина волны"
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
						className={`p-2 -ml-2 -mt-2.5 rounded border-2 transition-all ${
							isWavelengthsSelected
								? 'border-blue-500 bg-blue-50'
								: 'border-transparent'
						}`}
					>
						<div className="font-semibold mb-1">Длины волн потерь</div>
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
										<span className="text-gray-800">{wl}нм</span>
									</div>
								);
							})}
						</div>
					</div>

					<div>
						<div className="font-semibold mb-1 text-gray-400">
							Длины волн ORL
						</div>
						<div className="space-y-1 text-gray-400">
							{wavelengths.map((wl) => (
								<div key={wl} className="flex items-center gap-2">
									<span className="text-sm">{wl === 1625 ? '☑' : '☐'}</span>
									<span>{wl}нм</span>
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
