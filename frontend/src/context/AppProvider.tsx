'use client';
import { Loader } from "@/components/Loader";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

interface AppProviderType {
    isLoading: boolean;
    authToken: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string, password_confirmation: string) => Promise<void>;
    logout: () => void;
}

const AppContext = createContext<AppProviderType | undefined>(undefined);

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

export const AppProvider = ({
    children,
}: { children: React.ReactNode }) => {

    const [isLoading, setIsLoading] = useState(true);
    const [authToken, setAuthToken] = useState<string | null>(null);
    const router  = useRouter();

    useEffect(() => {
        const token = Cookies.get('authToken');
        if (token) {
            setAuthToken(token);
        } else {
            router.push('/auth');
        }
        setIsLoading(false);
    });

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await axios.post(`${API_URL}/login`, {
                email,
                password
            });

            if (response.data.status){
                Cookies.set('authToken', response.data.token, { expires: 7 });
                toast.success('Login Successful');
                setAuthToken(response.data.token);
                router.push('/dashboard');
            } else {
                toast.error('Invalid Login Details');
            }
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

    const logout = () => {
        Cookies.remove('authToken');
        setAuthToken(null);
        setIsLoading(false);
        toast.success('User Logged Out');
        router.push('/auth');
    }

    return (
        <AppContext.Provider value={{ login, register, isLoading, authToken, logout }}>
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
