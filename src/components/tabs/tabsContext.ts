import {
	createContext,
	type Dispatch,
	type SetStateAction,
	useContext
} from 'react';
import { noop } from '../../lib/utils';
import type { Section } from '../../types';

type TabsContextProps = {
	activeTab: Section;
	setActiveTab: Dispatch<SetStateAction<Section>>;
};

export const TabsContext = createContext<TabsContextProps>({
	activeTab: 'theory',
	setActiveTab: noop
});

export function useTabs() {
	return useContext(TabsContext);
}
