import { useChat } from "./ChatContext";
function Profile() {
    const {user} = useChat();
    
        function getColorFromName(name) {
    const colors = [
      "bg-rose-600", "bg-pink-600", "bg-fuchsia-600", "bg-purple-600", "bg-violet-600",
      "bg-indigo-600", "bg-blue-600", "bg-sky-600", "bg-cyan-600", "bg-teal-600",
      "bg-emerald-600", "bg-green-600", "bg-lime-600", "bg-yellow-600", "bg-amber-600",
      "bg-orange-600", "bg-red-600",
    ];
      let hash = 0;
      for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
      }
      return colors[Math.abs(hash) % colors.length];
    }
  return (
    <>
     <span className={`font-medium text-lg ${getColorFromName(user.username)} size-7 text-center flex items-center justify-center  rounded-full`}>{user.username.charAt(0).toUpperCase()}</span>
    </>
  )
    
}
export default Profile;

