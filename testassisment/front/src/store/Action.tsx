const Actions = (set:any) => ({
    setProfile: () => {
        const userInfo = localStorage.getItem("registeredUsers");
        if (userInfo && userInfo.length) {
        set({ profile: JSON.parse(userInfo)[0]})
        }
    },
    logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("registeredUsers");
        set({ profile: {} })
    },
})

export default Actions