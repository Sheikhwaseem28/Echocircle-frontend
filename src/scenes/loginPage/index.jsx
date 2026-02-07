import { useState } from "react";
import { Users, Shield, Smartphone, Sparkles, Lock, Mail } from "lucide-react";
import Form from "./Form";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const features = [
    { icon: <Users size={18} />, text: "Private Circles" },
    { icon: <Shield size={18} />, text: "Secure by Design" },
    { icon: <Smartphone size={18} />, text: "Seamless Sync" },
    { icon: <Sparkles size={18} />, text: "Pure Experience" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black text-gray-100">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900/10 via-transparent to-transparent"></div>

      {/* Header - Clean & Minimal */}
      <header className="sticky top-0 z-50 border-b border-gray-800/30 bg-black/70 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-red-600 shadow-lg shadow-red-500/20">
                <span className="text-sm font-bold tracking-wider text-white">
                  EC
                </span>
              </div>
              <h1 className="text-xl font-bold tracking-tight text-white">
                EchoCircle
              </h1>
            </div>

            <div className="hidden items-center gap-6 text-sm sm:flex">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-gray-400">
                  <div className="text-rose-400/80">
                    {feature.icon}
                  </div>
                  <span className="text-sm">{feature.text}</span>
                </div>
              ))}
            </div>

            <button className="rounded-full bg-gradient-to-r from-rose-500 to-red-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-red-500/25 transition-all hover:shadow-xl hover:shadow-red-500/40">
              Explore Features
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Panel - Minimal Hero */}
          <div className="flex flex-col justify-center space-y-10">
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                  Space for
                  <span className="block text-rose-400">meaningful</span>
                  <span className="block">connections</span>
                </h1>
              </div>

              <p className="text-lg text-gray-400 max-w-md leading-relaxed">
                A private, focused space where conversations matter.
                Designed for clarity, built for real connections.
              </p>
            </div>

            {/* Clean Feature List */}
            <div className="space-y-6">
              <div className="space-y-4">
                {[
                  "No algorithms, just people",
                  "End-to-end encrypted",
                  "Distraction-free interface",
                  "Your data stays private",
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-rose-500/10 to-red-500/10">
                      <div className="h-1.5 w-1.5 rounded-full bg-rose-400"></div>
                    </div>
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Feature Preview */}
            <div className="grid grid-cols-2 gap-4 pt-8 sm:hidden">
              {features.slice(0, 2).map((feature, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-gray-800/50 bg-gray-900/30 p-4 backdrop-blur-sm"
                >
                  <div className="mb-2 text-rose-400">{feature.icon}</div>
                  <p className="text-sm font-medium">{feature.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel - Auth Card */}
          <div className="flex items-center justify-center lg:justify-end">
            <div className="w-full max-w-md">
              {/* Floating Auth Card */}
              <div className="relative overflow-hidden rounded-2xl border border-gray-800/50 bg-gradient-to-b from-gray-900/40 to-black/40 backdrop-blur-xl shadow-2xl">
                {/* Decorative Corner Accents */}
                <div className="absolute top-0 left-0 h-32 w-32 -translate-x-16 -translate-y-16 rounded-full bg-gradient-to-r from-rose-500/5 to-red-500/5 blur-xl"></div>
                <div className="absolute bottom-0 right-0 h-32 w-32 translate-x-16 translate-y-16 rounded-full bg-gradient-to-r from-pink-500/5 to-rose-500/5 blur-xl"></div>

                {/* Card Content */}
                <div className="relative z-10">
                  {/* Card Header */}
                  <div className="border-b border-gray-800/50 p-8 pb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-white">
                          {isLogin ? "Welcome back" : "Join us"}
                        </h2>
                        <p className="mt-1 text-sm text-gray-400">
                          {isLogin
                            ? "Sign in to your private space"
                            : "Create your secure account"}
                        </p>
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-rose-500/20 to-red-500/20">
                        <Lock size={18} className="text-rose-400" />
                      </div>
                    </div>
                  </div>

                  {/* Form Component */}
                  <div className="p-8">
                    <Form onModeChange={setIsLogin} />
                  </div>

                  {/* Security Assurance */}
                  <div className="border-t border-gray-800/50 p-6">
                    <div className="flex items-center justify-center gap-3 text-sm text-gray-400">
                      <Shield size={16} className="text-green-400" />
                      <span>All data is encrypted and private</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Simple Assurance Text */}
              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">
                  Your privacy is our priority. No tracking, no ads, no noise.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer - Minimal */}
      <footer className="mt-16 border-t border-gray-800/30 py-8">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <p className="text-sm text-gray-500">
            EchoCircle • Designed for humans • © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;
