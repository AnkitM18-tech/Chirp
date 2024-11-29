import { Link } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header className="top-0 z-40 border-b bg-base-100 border-base-300 fixed-w-full backdrop-blur-lg bg-base-100/80">
      <div className="container h-16 px-4 mx-auto">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              <div className="flex items-center justify-center rounded-lg size-9 bg-primary/10">
                <MessageSquare className="size-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">Chirp</h1>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/settings"
              className={`btn btn-sm gap-2 transition-colors`}
            >
              <Settings className="size-5" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {authUser && (
              <>
                <Link to="/profile" className={`btn btn-sm gap-2`}>
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button className="flex items-center gap-2" onClick={logout}>
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
