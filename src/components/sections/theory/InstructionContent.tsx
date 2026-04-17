import { useState } from 'react';
import { publicUrl } from '../../../lib/utils';

function PdfViewer() {
	const [isLoaded, setIsLoaded] = useState(false);

	return (
		<div className="mb-8 relative" style={{ height: '80vh' }}>
			{!isLoaded && (
				<div className="absolute inset-0 bg-gray-200 animate-pulse rounded-sm z-10" />
			)}
			<iframe
				src={publicUrl('/instruction_EXFO_FOT-930.pdf')}
				title="Инструкция к FOT-930"
				className="w-full h-full border-0"
				onLoad={() => setIsLoaded(true)}
			/>
		</div>
	);
}

export function InstructionContent() {
	return (
		<div>
			<PdfViewer />
		</div>
	);
}
