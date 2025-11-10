import { useState } from 'react';
import { Show } from '../../../lib/components';
import { InstructionContent } from './InstructionContent';
import { Pagination } from './Pagination';
import { TheoryContent } from './TheoryContent';

export type ContentType = 'theory' | 'instruction';

export function Theory() {
	const [currentContent, setCurrentContent] = useState<ContentType>('theory');

	return (
		<div className="flex flex-col gap-5">
			<Pagination
				currentContent={currentContent}
				setCurrentContent={setCurrentContent}
			/>

			<Show when={currentContent === 'theory'}>
				<TheoryContent />
			</Show>

			<Show when={currentContent === 'instruction'}>
				<InstructionContent />
			</Show>

			<Pagination
				currentContent={currentContent}
				setCurrentContent={setCurrentContent}
			/>
		</div>
	);
}
