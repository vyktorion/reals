import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, Check } from 'lucide-react';
import { toast } from 'sonner';

interface AuthPageProps {
  onAuthSuccess: () => void;
}

export function AuthPage({ }: AuthPageProps) {

  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Proprietar',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Basic validation
    if (isSignUp) {
      if (!formData.name || !formData.phone || !formData.role) {
        toast.error('Vă rugăm să completați toate câmpurile obligatorii');
        setLoading(false);
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error('Parolele nu se potrivesc');
        setLoading(false);
        return;
      }
      if (!formData.agreeToTerms) {
        toast.error('Vă rugăm să acceptați termenii și condițiile');
        setLoading(false);
        return;
      }

      // Register user
      try {
        console.log('📡 Making API call to register user');

        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            role: formData.role,
            password: formData.password,
          }),
        });

        console.log('📡 Register response status:', response.status);

        const data = await response.json();
        console.log('📡 Register response data:', data);

        if (!response.ok) {
          throw new Error(data.message);
        }

        toast.success('Cont creat cu succes!', {
          description: 'Bine ați venit în ImoEstate. Puteți începe să explorați proprietăți.'
        });

        // Sign in after successful registration
        const signInResult = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (signInResult?.error) {
          console.error('❌ Sign in error after registration:', signInResult.error);
          toast.error('Cont creat, dar conectarea a eșuat. Încercați să vă conectați manual.');
        } else if (signInResult?.ok) {
          console.log('✅ Sign in successful after registration');
          // Redirect to profile page instead of home
          window.location.href = '/profile';
        } else {
          console.log('⚠️ Sign in result:', signInResult);
          window.location.href = '/profile';
        }
      } catch (error) {
        console.error('❌ Registration error:', error);
        toast.error(error instanceof Error ? error.message : 'A apărut o eroare la înregistrare');
      }
    } else {
      // Sign in with proper error handling
      console.log('🔐 Attempting sign in for:', formData.email);
      console.log('🔐 Sign in credentials:', {
        email: formData.email,
        passwordLength: formData.password.length
      });

      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

    console.log('🔐 Raw sign in result object:', JSON.stringify(result, null, 2));
    console.log('🔐 Sign in result properties:', {
      hasError: !!result?.error,
      hasOk: !!result?.ok,
      hasUrl: !!result?.url,
      resultKeys: result ? Object.keys(result) : []
    });

    if (result?.error) {
      console.error('❌ Authentication failed:', result.error);
      toast.error('Email sau parolă incorectă');
    } else if (result?.ok) {
      console.log('✅ Authentication successful');
      toast.success('Bine ați revenit!', {
        description: 'V-ați conectat cu succes la contul dumneavoastră.'
      });
      // Redirect to profile page instead of home
      window.location.href = '/profile';
    } else {
      console.log('⚠️ Unexpected sign in result:', result);
      // If no error but also no ok, assume success for now
      window.location.href = '/profile';
    }
    }

    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    console.log('🌐 Attempting Google sign in');
    try {
      const result = await signIn('google', { callbackUrl: '/' });
      console.log('🌐 Google sign in result:', result);
    } catch (error) {
      console.error('🌐 Google sign in error:', error);
      toast.error('A apărut o eroare la conectarea cu Google');
    }
  };

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setFormData({
      name: '',
      email: '',
      role: 'Proprietar',
      phone: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
    });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {isSignUp ? 'Join ImoEstate' : 'Welcome Back'}
          </h1>
          <p className="text-muted-foreground">
            {isSignUp
              ? 'Create your account to start finding your dream property'
              : 'Sign in to your account to continue exploring'
            }
          </p>
        </div>

        {/* Auth Toggle */}
        <div className="flex bg-muted rounded-xl p-1 mb-6">
          <button
            onClick={() => setIsSignUp(false)}
            className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-lg transition-all duration-200 ${
              !isSignUp
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsSignUp(true)}
            className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-lg transition-all duration-200 ${
              isSignUp
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <div className="bg-card rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Sign Up Fields */}
            {isSignUp && (
              <>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Nume
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-border bg-background text-foreground placeholder:text-muted-foreground rounded-lg outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Rol
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => handleInputChange('role', e.target.value)}
                      className="w-full pl-4 pr-4 py-3 border border-border bg-background text-foreground rounded-lg outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    >
                      <option value="Proprietar">Proprietar</option>
                      <option value="Agent">Agent</option>
                      <option value="Agenție">Agenție</option>
                      <option value="Dezvoltator">Dezvoltator</option>
                    </select>
                  </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-border bg-background text-foreground placeholder:text-muted-foreground rounded-lg outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-border bg-background text-foreground placeholder:text-muted-foreground rounded-lg outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-border bg-background text-foreground placeholder:text-muted-foreground rounded-lg outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password (Sign Up) */}
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border border-border bg-background text-foreground placeholder:text-muted-foreground rounded-lg outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Remember Me / Forgot Password */}
            {!isSignUp && (
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                  />
                  <span className="ml-2 text-sm text-muted-foreground">Remember me</span>
                </label>
                <button
                  type="button"
                  className="text-sm text-primary hover:text-blue-500 dark:hover:text-blue-300"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Terms & Conditions (Sign Up) */}
            {isSignUp && (
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => handleInputChange('agreeToTerms', !formData.agreeToTerms)}
                  className={`mt-0.5 w-5 h-5 border-2 rounded flex items-center justify-center transition-all ${
                    formData.agreeToTerms
                      ? 'bg-primary border-primary'
                      : 'border-border'
                  }`}
                >
                  {formData.agreeToTerms && <Check className="w-3 h-3 text-primary-foreground" />}
                </button>
                <div className="text-sm text-muted-foreground">
                  I agree to the{' '}
                  <button type="button" className="text-primary hover:underline">
                    Terms of Service
                  </button>{' '}
                  and{' '}
                  <button type="button" className="text-primary hover:underline">
                    Privacy Policy
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-blue-800 dark:hover:bg-blue-700 text-primary-foreground py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {isSignUp ? 'Create Account' : 'Sign In'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Social Login Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-gray-500 dark:text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social Buttons */}
            <div className="mt-4">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full py-3 px-4 border border-border rounded-lg text-foreground bg-card hover:border-primary transition-all duration-200 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  <path fill="none" d="M1 1h22v22H1z"/>
                </svg>
                Google
              </button>
            </div>
          </div>
        </div>

        {/* Toggle Link */}
        <div className="mt-6 text-center">
          <span className="text-muted-foreground">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          </span>{' '}
          <button
            onClick={toggleAuthMode}
            className="text-primary hover:text-blue-500 dark:hover:text-blue-300 font-medium"
          >
            {isSignUp ? 'Sign in' : 'Sign up'}
          </button>
        </div>
      </div>
    </div>
  );
}