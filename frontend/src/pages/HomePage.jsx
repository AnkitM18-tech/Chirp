import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import Chat from "../components/Chat";
import { useChatStore } from "../stores/useChatStore";

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="bg-base-200">
      <div className="flex items-center justify-center px-4 py-20">
        <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full overflow-hidden rounded-lg">
            <Sidebar />
            {!selectedUser ? <NoChatSelected /> : <Chat />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
