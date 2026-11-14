import { createContext } from 'react';
import type { User, Astronaut } from '@/types';

export interface AuthContextType {
    user: User | null;
    activeAstronautId: string;
    activeAstronaut: Astronaut | null;
    allAstronauts: Astronaut[];
    isLoadingAstronauts: boolean;
    astronautsError: string | null;
    login: (username: string, password: string) => Promise<boolean>;
    loginAsRole: (role: 'astronaut' | 'medical_team') => Promise<void>;
    logout: () => void;
    setActiveAstronautId: (id: string) => void;
    refreshAstronauts: () => Promise<void>;
    retryLoadAstronauts: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

