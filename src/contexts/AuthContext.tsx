import * as React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export interface Usuario {
  id: string;
  email: string | null;
  nome_completo: string | null;
  tipo_usuario: 'cliente' | 'socio' | 'gestor' | 'dependente' | null;
  status: 'ativa' | 'cancelada' | 'suspensa' | 'expirada' | null;
  plano: string | null;
  celular: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  usuario: Usuario | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUsuario = async (userId: string): Promise<Usuario | null> => {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, email, nome_completo, tipo_usuario, status, plano, celular')
      .eq('id', userId)
      .single();

    if (error || !data) {
      return null;
    }

    return data as Usuario;
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer Supabase call with setTimeout to prevent deadlock
          setTimeout(() => {
            fetchUsuario(session.user.id).then((usuarioData) => {
              setUsuario(usuarioData);
              setLoading(false);
            });
          }, 0);
        } else {
          setUsuario(null);
          setLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUsuario(session.user.id).then((usuarioData) => {
          setUsuario(usuarioData);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: error as Error };
    }

    // Check if user exists in usuarios table
    if (data.user) {
      const usuarioData = await fetchUsuario(data.user.id);
      
      if (!usuarioData) {
        // User not authorized - sign out and return error
        await supabase.auth.signOut();
        return { 
          error: new Error('Usuário não autorizado. Entre em contato com o administrador.') 
        };
      }
      
      setUsuario(usuarioData);
    }
    
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, usuario, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
