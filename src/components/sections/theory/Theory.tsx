import { useState } from 'react';
import { Show } from '../../../lib/components';
import { InstructionContent } from './InstructionContent';
import { Pagination } from './Pagination';
import { TheoryContent } from './TheoryContent';

export type ContentType = 'theory' | 'instruction';

export function Theory() {
	const [currentContent, setCurrentContent] = useState<ContentType>('theory');

	function handleContentChange(content: ContentType) {
		document
			.getElementById('main-scroll')
			?.scrollTo({ top: 0, behavior: 'instant' });
		setCurrentContent(content);
	}

	return (
		<div className="flex flex-col gap-5 pb-6">
			<Pagination
				currentContent={currentContent}
				setCurrentContent={handleContentChange}
			/>

			<Show when={currentContent === 'theory'}>
				<TheoryContent />
			</Show>

			<Show when={currentContent === 'instruction'}>
				<InstructionContent />
			</Show>

			<Pagination
				currentContent={currentContent}
				setCurrentContent={handleContentChange}
			/>
		</div>
	);
}
