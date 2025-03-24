import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return  ( <div className="flex min-h-screen">
        {/* Left Side - Image with Bottom Heading & Description Overlay */}
        <div className="hidden lg:flex w-1/2 h-screen relative items-center justify-center">
          <img
            src="https://images.unsplash.com/photo-1617195737496-bc30194e3a19"
            alt="Sign In"
            className="w-full h-full object-cover"
          />
          {/* Overlay Text Container */}
          <div className="absolute bottom-10 text-center text-white px-6">
            <h1 className="text-4xl font-extrabold drop-shadow-lg">
              Welcome to AI Mock Interview 👨🏻‍🏫
            </h1>
            <p className="text-lg mt-2 font-medium drop-shadow-md">
              Prepare for your dream job with AI-powered mock interviews.
            </p>
          </div>
        </div>
  
        {/* Right Side - Clerk SignIn Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-10 bg-gray-50">
          <SignUp
            appearance={{
              elements: {
                card: "shadow-none border-none bg-transparent",
                formButtonPrimary: "bg-blue-600 hover:bg-blue-700",
                headerTitle: "text-4xl font-bold",
              },
            }}
          />
        </div>
      </div>
    );
}