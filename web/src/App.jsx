import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const trustElements = [
    { icon: "🔒", text: "Your email is secure & encrypted" },
    { icon: "📧", text: "Only IGNOU updates, no spam ever" },
    { icon: "🚫", text: "Unsubscribe with one click anytime" },
    { icon: "👨‍💻", text: "Built by fellow IGNOU student" },
    { icon: "💰", text: "Completely free forever" },
    { icon: "📖", text: "Open source & transparent" },
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      program: "BCA 2nd Year",
      text: "Never missed an exam notification since subscribing! This service saved my semester.",
      avatar: "PS",
    },
    {
      name: "Amit Kumar",
      program: "MBA 1st Year",
      text: "Finally, someone made something useful for IGNOU students. Highly recommended!",
      avatar: "AK",
    },
    {
      name: "Sneha Patel",
      program: "BA 3rd Year",
      text: "Got my result notification 2 days before checking the website. Super helpful!",
      avatar: "SP",
    },
  ];

  const faqs = [
    {
      question: "Is this service official?",
      answer:
        "No, this is an unofficial service created by a fellow IGNOU student. We monitor official IGNOU channels and send you notifications when important updates are posted.",
    },
    {
      question: "How do you get the information?",
      answer:
        "We regularly check official IGNOU websites, notice boards, and announcements. When something important is posted, we send you an email notification with the details and official links.",
    },
    {
      question: "What kind of notifications will I receive?",
      answer:
        "Exam dates, result announcements, assignment submissions, admission notices, and other important academic updates. Typically 2-3 emails per week during active periods.",
    },
    {
      question: "Can I trust this with my email?",
      answer:
        "Absolutely! Your email is only used for IGNOU notifications. We don't sell, share, or use your email for anything else. You can unsubscribe anytime.",
    },
  ];

  const statistics = [
    { number: "5000+", label: "Active Subscribers", icon: "👥" },
    { number: "50+", label: "Notifications Sent", icon: "📧" },
    { number: "99.9%", label: "Uptime", icon: "⚡" },
    { number: "24/7", label: "Monitoring", icon: "🔍" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSubscribe = (e) => {
    const API_URL = "https://ignou.up.railway.app";
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    // Simulate API call
    axios
      .post(`${API_URL}/api/add-email`, { email })
      .then((res) => {
        console.log(res.data);
        if (res.data) {
          if (res.data.message) {
            setData(res.data);
          } else if (res.data.error) {
            setError(res.data.error);
          } else {
            setError("I dont know what is going on....");
          }
        }
        setData(res.data);
        setEmail("");
        setError("");
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setError(err.response.data.error || "Something went wrong");
        setIsLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-600 rounded-full filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-blue-600 rounded-full filter blur-3xl opacity-10 animate-pulse delay-1000"></div>
        <div className="absolute top-2/3 left-1/2 w-64 h-64 bg-indigo-600 rounded-full filter blur-3xl opacity-10 animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10">
        {/* Header with trust indicators */}
        <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700">
          <div className="max-w-6xl mx-auto px-4 py-3">
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <span className="text-green-400">🔒</span>
                <span>Secure & Encrypted</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-400">👨‍🎓</span>
                <span>Made by IGNOU Student</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-purple-400">💰</span>
                <span>100% Free Service</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-12">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600/20 to-blue-600/20 px-6 py-3 rounded-full border border-purple-500/30 mb-6 animate-bounce">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                I
              </div>
              <span className="font-bold text-purple-300">
                IGNOU Notification Hub
              </span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-500 bg-clip-text text-transparent">
                Never Miss Another
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                IGNOU Update
              </span>
            </h1>

            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed">
              Get instant email notifications for exam schedules, results,
              assignments, and important announcements.
              <span className="text-purple-400 font-medium">
                {" "}
                Trusted by 5000+ students
              </span>{" "}
              across India.
            </p>

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mb-12">
              {statistics.map((stat, index) => (
                <div
                  key={index}
                  className="text-center p-4 bg-gray-800/30 rounded-xl border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 hover:scale-105"
                >
                  <div className="text-2xl mb-2">{stat.icon}</div>
                  <div className="text-2xl font-bold text-purple-400">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Main subscription section */}
          <div className="max-w-lg mx-auto mb-16">
            <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 shadow-2xl">
              {data ? (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                    <svg
                      className="w-10 h-10 text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-green-400">
                    You're All Set! 🎉
                  </h3>
                  <p className="text-gray-300 mb-4">
                    Confirmation sent to{" "}
                    <span className="text-purple-400 font-medium">
                      {data.email}
                    </span>
                  </p>
                  <p className="text-sm text-gray-400 bg-gray-700/50 p-4 rounded-lg">
                    📧 {data.message} Check your inbox (and spam folder) for the
                    confirmation email.
                  </p>
                </div>
              ) : (
                <>
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold mb-2">
                      Start Getting Notifications
                    </h2>
                    <p className="text-gray-400">
                      Join thousands of students who never miss important
                      updates
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        📧 Your Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-4 bg-gray-700/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all duration-200 text-lg"
                        placeholder="your.email@gmail.com"
                        required
                      />
                    </div>

                    {error && (
                      <div className="flex items-center gap-3 p-4 bg-red-900/50 border border-red-700 rounded-xl text-red-200 animate-shake">
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {error}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handleSubscribe}
                      disabled={isLoading}
                      className={`w-full py-4 px-6 rounded-xl font-semibold text-lg flex items-center justify-center transition-all duration-300 ${
                        isLoading
                          ? "bg-purple-700 cursor-not-allowed"
                          : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 hover:scale-105 hover:shadow-lg"
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <svg
                            className="animate-spin w-5 h-5 mr-3"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Setting up your notifications...
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 17h5l-5 5v-5zM8 7l4-4 4 4M12 3v9"
                            />
                          </svg>
                          Get My Notifications Free 🚀
                        </>
                      )}
                    </button>

                    <p className="text-xs text-gray-500 text-center leading-relaxed">
                      🔒 Your email is safe with us. We only send IGNOU-related
                      updates.
                      <br />
                      Unsubscribe anytime with one click.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Trust indicators grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {trustElements.map((item, index) => (
              <div
                key={index}
                className="bg-gray-800/30 p-6 rounded-xl border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center gap-4">
                  <div className="text-2xl">{item.icon}</div>
                  <span className="text-gray-300">{item.text}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Testimonials */}
          <div className="bg-gray-800/30 p-8 rounded-2xl border border-gray-700/50 mb-16">
            <h3 className="text-2xl font-bold text-center mb-8">
              What Students Say 💬
            </h3>
            <div className="relative overflow-hidden h-32">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-500 ${
                    index === activeTestimonial
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-full"
                  }`}
                >
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                        {testimonial.avatar}
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-purple-400">
                          {testimonial.name}
                        </div>
                        <div className="text-sm text-gray-400">
                          {testimonial.program}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-300 italic">"{testimonial.text}"</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === activeTestimonial
                      ? "bg-purple-500"
                      : "bg-gray-600"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Developer section */}
          <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 p-8 rounded-2xl border border-purple-500/30 mb-16">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                  RD
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-bold text-purple-400 mb-1">
                  Raghav Dwivedi
                </h3>
                <p className="text-gray-400 mb-3">
                  IGNOU Student & Developer • Computer Science
                </p>
                <p className="text-gray-300 leading-relaxed mb-4">
                  "I missed my practical exam because I didn't get the
                  notification in time. That's when I decided to build this
                  service to help fellow students. It's completely free and will
                  always remain so. Your success is my motivation! 🎯"
                </p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <a
                    href="mailto:raghavdwd@gmail.com"
                    className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    raghavdwd@gmail.com
                  </a>
                  <a
                    href="https://t.me/raghavdwd"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
                    </svg>
                    @raghavdwd
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">
                Frequently Asked Questions 🤔
              </h3>
              <p className="text-gray-400">
                Everything you need to know about our service
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-gray-800/30 rounded-xl border border-gray-700/50 overflow-hidden"
                >
                  <button
                    onClick={() => setShowFAQ(showFAQ === index ? null : index)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-700/30 transition-colors"
                  >
                    <span className="font-medium">{faq.question}</span>
                    <svg
                      className={`w-5 h-5 transform transition-transform ${
                        showFAQ === index ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {showFAQ === index && (
                    <div className="px-6 pb-6">
                      <p className="text-gray-300 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-gray-500 space-y-2 pt-8 border-t border-gray-800">
            <p className="flex items-center justify-center gap-2">
              <span>⚠️</span>
              <span>
                This is an <strong>unofficial</strong> service created by a
                fellow IGNOU student
              </span>
            </p>
            <p>Not affiliated with Indira Gandhi National Open University</p>
            <p className="text-sm">
              Made with ❤️ for IGNOU students across India
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
