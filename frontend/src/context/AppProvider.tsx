'use client';
import { Loader } from "@/components/Loader";
import { createContext, useContext, useState } from "react";
import axios from "axios";

interface AppProviderType {
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string, password_confirmation: string) => Promise<void>;
}

const AppContext = createContext<AppProviderType | undefined>(undefined);

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

export const AppProvider = ({
    children,
}: { children: React.ReactNode }) => {

    const [isLoading, setIsLoading] = useState(false);

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await axios.post(`${API_URL}/login`, {
                email,
                password
            });
            console.log(response);
        } catch (error) {

        } finally {
            setIsLoading(false);
        }
    }

    const register = async (name: string, email: string, password: string, password_confirmation: string) => {
        setIsLoading(true);
        try {
            const response = await axios.post(`${API_URL}/register`, {
                name,
                email,
                password,
                password_confirmation
            });
            console.log(response);
        } catch (error) {

        } finally {
            setIsLoading(false);
        }
    }

    return (
        <AppContext.Provider value={{ login, register, isLoading }}>
            {isLoading ? <Loader /> : children}
        </AppContext.Provider>
    );
}

export const myAppHook = () => {

    const context = useContext(AppContext);

    if (!context) {
        throw new Error('Context will be wrapped inside AppProvider');
    }

    return context;
}
